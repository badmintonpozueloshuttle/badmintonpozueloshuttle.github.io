"""Genera una copia estática de la web en docs/ para GitHub Pages.

Uso (con el servidor de desarrollo en marcha en http://localhost:8080):
    python3 scripts/export_github_pages.py
"""

import json
import re
import shutil
import urllib.request
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from playwright.sync_api import sync_playwright

BASE = "http://localhost:8080"
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs"
FORM_EMAIL = "cde.badmtnpozuelo@gmail.com"
PAGES = {"/": "index.html", "/club": "club.html", "/horarios": "horarios.html", "/contacto": "contacto.html"}

CLEAN_JS = r"""
() => {
  let css = "";
  for (const sheet of document.styleSheets) {
    if (sheet.href && !sheet.href.startsWith(location.origin)) continue;
    try { for (const r of sheet.cssRules) css += r.cssText + "\n"; } catch (e) {}
  }
  const doc = document.documentElement.cloneNode(true);
  doc.querySelectorAll("script, style, link[rel=modulepreload], noscript, iframe").forEach((n) => n.remove());
  doc.querySelectorAll("link[rel=stylesheet]").forEach((n) => {
    if (n.href.startsWith(location.origin)) n.remove();
  });
  doc.querySelectorAll("[data-sonner-toaster], section[aria-label^='Notifications']").forEach((n) => n.remove());
  doc.querySelectorAll("*").forEach((el) => {
    for (const a of [...el.attributes]) {
      if (a.name.startsWith("data-lov") || a.name.startsWith("data-tsd") || a.name === "data-component-path") el.removeAttribute(a.name);
    }
  });
  const slot = doc.querySelector("[data-venues-map]");
  if (slot) {
    [...slot.parentNode.children].forEach((c) => { if (c !== slot && c.tagName === "P") c.remove(); });
    slot.outerHTML = __VENUE_MAP_HTML__;
  }
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "styles.css";
  doc.querySelector("head").appendChild(link);
  return { html: "<!DOCTYPE html>\n" + doc.outerHTML, css };
}
"""

# El mapa embebido de Google sin clave solo admite un punto, así que en la copia
# estática se dibuja un único mapa con las dos pistas: teselas libres de
# OpenStreetMap + la librería Leaflet (sin clave, sin servidor, sin facturas).
VENUES_JS = """() => [...document.querySelectorAll('[data-venue-link]')].map((a) => ({
  href: a.getAttribute('href'),
  name: a.querySelector('[data-venue-name]') ? a.querySelector('[data-venue-name]').textContent.trim() : 'Pista',
}))"""

LEAFLET_VERSION = "1.9.4"
LEAFLET_DIST = f"https://unpkg.com/leaflet@{LEAFLET_VERSION}/dist"


def venue_list(venues: list) -> list:
    """Añade a cada pista sus coordenadas, leídas del enlace de Google Maps."""
    out = []
    for venue in venues:
        query = parse_qs(urlparse(venue["href"]).query).get("query", [""])[0]
        try:
            lat, lng = (float(part) for part in query.split(","))
        except ValueError:
            continue
        out.append({"name": venue["name"], "lat": lat, "lng": lng, "href": venue["href"]})
    return out


def venue_map_html(venues: list) -> str:
    if not venues:
        return ""
    return '<div data-venues-one-map style="height:100%;width:100%"></div>'


# Un solo mapa con las dos pistas numeradas; cada chincheta abre Google Maps.
VENUES_MAP_JS = """
<script src="assets/leaflet.js"></script>
<script>
(function () {
  var el = document.querySelector("[data-venues-one-map]");
  if (!el || !window.L) return;
  var VENUES = __VENUES__;
  var map = L.map(el, { scrollWheelZoom: false });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  var pts = [];
  VENUES.forEach(function (v, i) {
    pts.push([v.lat, v.lng]);
    var icon = L.divIcon({
      className: "",
      html: '<div style="width:28px;height:28px;border-radius:50%;background:#1b913d;color:#fff;'
        + 'border:2px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.45);display:flex;'
        + 'align-items:center;justify-content:center;font:bold 14px sans-serif">' + (i + 1) + "</div>",
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    L.marker([v.lat, v.lng], { icon: icon, title: v.name }).addTo(map)
      .bindPopup("<b>" + v.name + "</b><br><a href=\\"" + v.href + "\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">Abrir en Google Maps</a>");
  });
  map.fitBounds(L.latLngBounds(pts).pad(0.35));
})();
</script>
"""

MENU_JS = """
<script>
(function () {
  var btn = document.getElementById("menu-toggle");
  var nav = document.getElementById("mobile-nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", function () {
    var open = nav.hasAttribute("hidden");
    if (open) nav.removeAttribute("hidden"); else nav.setAttribute("hidden", "");
    btn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
})();
</script>
"""

FORM_JS = """
<script>
(function () {
  var form = document.getElementById("info-form");
  if (!form) return;
  var LEVELS = __LEVELS__;
  function val(id) { return document.getElementById(id).value.trim(); }
  function setError(id, msg) {
    var el = document.getElementById(id);
    var holder = el.parentNode;
    var old = holder.querySelector(".field-error");
    if (old) old.remove();
    if (msg) {
      var p = document.createElement("p");
      p.className = "field-error text-sm text-destructive";
      p.textContent = msg;
      holder.appendChild(p);
    }
  }
  function validate(d) {
    var e = {};
    if (d.name.length < 2) e.name = "Escribe tu nombre";
    else if (d.name.length > 100) e.name = "Máximo 100 caracteres";
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(d.email)) e.email = "Escribe un email válido";
    else if (d.email.length > 255) e.email = "Máximo 255 caracteres";
    if (d.phone.length > 30) e.phone = "Máximo 30 caracteres";
    else if (!/^[0-9+()\\s-]*$/.test(d.phone)) e.phone = "Solo números y símbolos + ( ) -";
    if (d.level && LEVELS.indexOf(d.level) === -1) e.level = "Selecciona una opción";
    if (d.message.length < 5) e.message = "Cuéntanos un poco más";
    else if (d.message.length > 1000) e.message = "Máximo 1000 caracteres";
    return e;
  }
  ["name", "email", "phone", "level", "message"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", function () { setError(id, ""); });
  });
  var status = document.createElement("p");
  status.className = "text-sm text-destructive";
  status.setAttribute("role", "alert");
  form.appendChild(status);
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    status.textContent = "";
    var d = { name: val("name"), email: val("email"), phone: val("phone"), level: val("level"), message: val("message") };
    var errors = validate(d);
    var ids = ["name", "email", "phone", "level", "message"];
    ids.forEach(function (id) { setError(id, errors[id] || ""); });
    if (Object.keys(errors).length) return;
    var btn = form.querySelector("button[type=submit]");
    var label = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = "Enviando…";
    fetch("https://formsubmit.co/ajax/__EMAIL__", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        Nombre: d.name, email: d.email, "Teléfono": d.phone || "-", Nivel: d.level || "-", Mensaje: d.message,
        _subject: "Nueva solicitud de información · Web del club", _template: "table", _captcha: "false"
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (String(res.success) !== "true") throw new Error(res.message || "error");
        document.getElementById("form-card").innerHTML = document.getElementById("form-sent").innerHTML;
      })
      .catch(function () {
        status.textContent = "No hemos podido enviar tu solicitud. Inténtalo de nuevo en unos minutos.";
        btn.disabled = false;
        btn.innerHTML = label;
      });
  });
})();
</script>
"""

SENT_HTML = """
<template id="form-sent">
  <div class="flex min-h-[420px] flex-col items-center justify-center text-center">
    __ICON__
    <h2 class="mt-5 text-3xl">¡Solicitud enviada!</h2>
    <p class="mt-3 max-w-sm text-muted-foreground">Gracias por escribirnos. Hemos recibido tu mensaje y te contactaremos pronto.</p>
    <a href="contacto.html" class="mt-8 inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">Enviar otra solicitud</a>
  </div>
</template>
"""


def download(url: str, images: dict) -> str:
    if url in images:
        return images[url]
    name = url.split("?")[0].rstrip("/").split("/")[-1] or "imagen"
    target = OUT / "assets" / name
    target.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(BASE + url if url.startswith("/") else url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as r:
        target.write_bytes(r.read())
    images[url] = f"assets/{name}"
    return images[url]


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as r:
        return r.read()


def rewrite_links(html: str) -> str:
    def repl(m):
        path, frag = m.group(1), m.group(2) or ""
        target = PAGES.get(path or "/")
        return f'href="{target}{frag}"' if target else m.group(0)

    html = re.sub(r'href="(/[a-z-]*)(#[^"]*)?"', repl, html)
    return html.replace('href="favicon.png"', 'href="favicon.png"')


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    images: dict = {}
    css = ""
    # Leaflet se guarda dentro de la copia: GitHub Pages no puede ejecutar la API
    # de Maps, pero sí dibujar un mapa con las dos pistas usando teselas libres.
    (OUT / "assets").mkdir(parents=True, exist_ok=True)
    (OUT / "assets" / "leaflet.js").write_bytes(fetch(f"{LEAFLET_DIST}/leaflet.js"))
    leaflet_css = fetch(f"{LEAFLET_DIST}/leaflet.css").decode("utf-8")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        mobile = browser.new_page(viewport={"width": 390, "height": 844})
        mobile.goto(BASE + "/", wait_until="networkidle")
        mobile.get_by_role("button", name="Abrir menú").click()
        mobile_nav = mobile.locator("header > nav").evaluate("n => n.outerHTML")
        mobile.close()

        page = browser.new_page(viewport={"width": 1280, "height": 1800})
        for route, filename in PAGES.items():
            page.goto(BASE + route, wait_until="networkidle")
            page.wait_for_timeout(500)
            if route == "/contacto":
                page.evaluate(
                    """() => {
                      const f = document.querySelector('form');
                      f.id = 'info-form';
                      f.parentElement.id = 'form-card';
                      const icon = document.querySelector('ul li svg').cloneNode(true);
                      icon.setAttribute('class', 'h-14 w-14 text-primary');
                      window.__sentIcon = icon.outerHTML;
                    }"""
                )
                icon = page.evaluate("() => window.__sentIcon")
            map_html = ""
            venues_data: list = []
            if route == "/club":
                venues_data = venue_list(page.evaluate(VENUES_JS))
                map_html = venue_map_html(venues_data)
            result = page.evaluate(CLEAN_JS.replace("__VENUE_MAP_HTML__", json.dumps(map_html)))
            html, css = result["html"], result["css"]

            # Menú móvil
            html = re.sub(
                r'<button type="button" class="p-2 md:hidden"',
                '<button type="button" id="menu-toggle" class="p-2 md:hidden"',
                html,
                count=1,
            )
            nav = mobile_nav.replace("<nav ", '<nav id="mobile-nav" hidden ', 1)
            nav = re.sub(r'\s*(data-status="active"|aria-current="page")', "", nav).replace(" active\"", "\"")
            nav = re.sub(r'href="([^"]*)"', lambda m: m.group(0) + (' data-status="active"' if m.group(1) == filename else ""), rewrite_links(nav))
            html = html.replace("</header>", nav + "</header>", 1)

            # Imágenes y enlaces
            for url in set(re.findall(r'(?:src|href)="(/__l5e/[^"]+)"', html)):
                html = html.replace(url, download(url, images))
            html = rewrite_links(html)
            html = html.replace('href="/favicon.png"', 'href="favicon.png"')

            scripts = MENU_JS
            if route == "/contacto":
                levels = page.evaluate(
                    "() => [...document.querySelectorAll('#level option')].map(o => o.value).filter(Boolean)"
                )
                scripts += SENT_HTML.replace("__ICON__", icon)
                scripts += FORM_JS.replace("__LEVELS__", json.dumps(levels, ensure_ascii=False)).replace(
                    "__EMAIL__", FORM_EMAIL
                )
            if route == "/club" and venues_data:
                scripts += VENUES_MAP_JS.replace("__VENUES__", json.dumps(venues_data, ensure_ascii=False))
            html = html.replace("</body>", scripts + "</body>", 1)
            html = re.sub(r' data-tsd-source="[^"]*"', "", html)
            (OUT / filename).write_text(html, encoding="utf-8")
            print("ok", filename)
        browser.close()

    for url in set(re.findall(r'url\\("?(https?://[^")]+)"?\\)', css)):
        if "fonts.g" not in url:
            css = css.replace(url, download(url, images).replace("assets/", "assets/"))
    (OUT / "styles.css").write_text(css + "\n" + leaflet_css, encoding="utf-8")
    shutil.copy(ROOT / "public" / "favicon.png", OUT / "favicon.png")
    (OUT / ".nojekyll").write_text("")
    print("imágenes:", list(images.values()))


if __name__ == "__main__":
    main()

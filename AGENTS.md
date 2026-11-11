<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Club content (training groups, schedules, level options) lives in `src/lib/club-data.ts`; pages read from it so schedule changes happen in one place.
- Info-request form: validation schema in `src/lib/info-request.ts` is shared by the browser and the server function; inserts go through a server function with the admin client, and the `info_requests` table has no anon/authenticated policies so visitors can never read submissions.
- GitHub Pages: `docs/` is a generated static copy of the site (Pages has no server); never edit it by hand — rerun `python3 scripts/export_github_pages.py` against the running dev server after any page change. Its contact form posts to FormSubmit instead of the server function.
- Venue map: the club page embeds a Google Map of the training schools. Keep each venue's coordinates and place id in `src/lib/club-data.ts` (resolved with the Geocoding API, not written by hand), leave the map container child-free because Google Maps injects nodes into it, and expect the managed browser key to render only on `*.lovable.app` / `*.lovableproject.com` origins — elsewhere the venue link cards are the fallback.

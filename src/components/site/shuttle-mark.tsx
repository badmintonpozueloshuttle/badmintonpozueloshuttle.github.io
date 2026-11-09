export function ShuttleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="none">
      <circle cx="16" cy="26" r="4.5" fill="currentColor" />
      <path
        d="M11.8 23.5 6 4.5l5.5 2 4.5-3 4.5 3 5.5-2-5.8 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M16 3.5v20M11.5 6.5l2 17M20.5 6.5l-2 17" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

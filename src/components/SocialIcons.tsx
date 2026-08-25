import { cn } from "@/lib/utils";

type IconProps = { className?: string };

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-4", className)} fill="currentColor" aria-hidden>
      <path d="M14.5 8.5V6.7c0-.7.5-1.2 1.2-1.2h1.3V3h-2.3C12.3 3 11 4.4 11 6.7V8.5H9v2.5h2V21h3v-10h2.2l.3-2.5H14.5Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-4", className)} fill="none" aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16.6" cy="7.4" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-4", className)} fill="currentColor" aria-hidden>
      <path d="M12.04 3.5A8.45 8.45 0 0 0 3.6 11.9c0 1.49.39 2.94 1.13 4.22L3.5 20.5l4.5-1.18A8.46 8.46 0 0 0 20.5 11.9 8.45 8.45 0 0 0 12.04 3.5Zm4.86 11.94c-.2.57-1.17 1.05-1.62 1.12-.41.06-.93.09-1.5-.09-.35-.11-.8-.26-1.38-.51-2.43-1.05-4.01-3.5-4.13-3.66-.12-.16-1-1.32-1-2.52s.63-1.79.86-2.03c.2-.22.45-.28.6-.28h.43c.14 0 .33-.05.51.39.2.48.67 1.64.73 1.76.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.24.25-.1.48.14.22.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.57-.14 1.14Z" />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-4", className)} fill="currentColor" aria-hidden>
      <path d="M6.5 9H4v11h2.5V9ZM5.25 4A1.5 1.5 0 1 0 5.26 7a1.5 1.5 0 0 0 0-3ZM20 20h-2.5v-5.4c0-1.5-.53-2.5-1.84-2.5-1 0-1.6.68-1.86 1.34-.1.23-.12.55-.12.87V20H11.2s.04-9.7 0-10.7h2.48v1.52c.33-.5 1.15-1.72 2.9-1.72 2.12 0 3.42 1.38 3.42 4.36V20Z" />
    </svg>
  );
}

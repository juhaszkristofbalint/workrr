type IconProps = {
  className?: string;
};

export function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4.5 10.4 12 4.2l7.5 6.2V20a1.3 1.3 0 0 1-1.3 1.3H5.8A1.3 1.3 0 0 1 4.5 20z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HomeIconFilled({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M11.4 3.55a1 1 0 0 1 1.2 0l8.1 6.4a1 1 0 0 1 .4.8V20a2 2 0 0 1-2 2H13.7v-7.2H10.3V22H5.9a2 2 0 0 1-2-2v-9.25a1 1 0 0 1 .4-.8z"
      />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="11" cy="11" r="6.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="m16 16 4.2 4.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SearchIconFilled({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M10.8 2.4a8.4 8.4 0 1 1-5.4 14.8l-2.7 2.7a1 1 0 1 1-1.4-1.4l2.7-2.7A8.4 8.4 0 0 1 10.8 2.4Zm0 2a6.4 6.4 0 1 0 0 12.8 6.4 6.4 0 0 0 0-12.8Z"
      />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="3.4"
        y="5.2"
        width="17.2"
        height="15.1"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M3.4 10h17.2M8 3.6v3.4M16 3.6v3.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CalendarIconFilled({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M8 2.4a1 1 0 0 1 1 1V4h6v-.6a1 1 0 1 1 2 0V4h1.4A3.6 3.6 0 0 1 22 7.6V9H2V7.6A3.6 3.6 0 0 1 5.6 4H7V3.4a1 1 0 0 1 1-1ZM2 11h20v8.4A3.6 3.6 0 0 1 18.4 23H5.6A3.6 3.6 0 0 1 2 19.4Z"
      />
    </svg>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M5.2 18.6 3.4 21.2c-.4.6.1 1.4.8 1.2l4.2-1.1A8.8 8.8 0 1 0 5.2 18.6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChatIconFilled({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 2.2a9.8 9.8 0 0 0-8.4 14.8L2.1 20.7a1.15 1.15 0 0 0 1.4 1.6l4.7-1.2A9.8 9.8 0 1 0 12 2.2Z"
      />
    </svg>
  );
}

export function PersonIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5.2 19.4c.7-3.3 3.4-5.2 6.8-5.2s6.1 1.9 6.8 5.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PersonIconFilled({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 2.8A5.1 5.1 0 1 1 12 13a5.1 5.1 0 0 1 0-10.2ZM12 14.6c4.3 0 7.9 2.4 8.7 6.2.2.8-.5 1.6-1.3 1.6H4.6c-.8 0-1.5-.8-1.3-1.6.8-3.8 4.4-6.2 8.7-6.2Z"
      />
    </svg>
  );
}

export function BriefcaseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="3.2"
        y="8"
        width="17.6"
        height="12.2"
        rx="2.6"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M9 8V6.4A2.4 2.4 0 0 1 11.4 4h1.2A2.4 2.4 0 0 1 15 6.4V8"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function BriefcaseIconFilled({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M9 4.6A2.6 2.6 0 0 1 11.6 2h.8A2.6 2.6 0 0 1 15 4.6V7h4.4A2.6 2.6 0 0 1 22 9.6V22H2V9.6A2.6 2.6 0 0 1 4.6 7H9V4.6Z"
      />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 3.2 19.4 6v6.1c0 4.3-3 7.4-7.4 8.7C7.6 19.5 4.6 16.4 4.6 12.1V6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MapPinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M9 6.5 15.5 12 9 17.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SunIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 3.2v1.8M12 19v1.8M4.9 4.9l1.3 1.3M17.8 17.8l1.3 1.3M3.2 12H5M19 12h1.8M4.9 19.1l1.3-1.3M17.8 6.2l1.3-1.3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CameraIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M8.2 7.2 9.4 5.4A1.6 1.6 0 0 1 10.7 4.8h2.6A1.6 1.6 0 0 1 14.6 5.4l1.2 1.8h2.4A2.2 2.2 0 0 1 20.4 9.4v8A2.2 2.2 0 0 1 18.2 19.6H5.8A2.2 2.2 0 0 1 3.6 17.4v-8A2.2 2.2 0 0 1 5.8 7.2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3.1" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M7.4 3.8h2.4c.6 0 1.1.4 1.2 1l.6 2.6a1.2 1.2 0 0 1-.3 1.1L10 10.2a12 12 0 0 0 3.8 3.8l1.7-1.3a1.2 1.2 0 0 1 1.1-.3l2.6.6c.6.1 1 .6 1 1.2v2.4a1.2 1.2 0 0 1-1.3 1.2A16.4 16.4 0 0 1 6.2 5.1 1.2 1.2 0 0 1 7.4 3.8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 3.6 14.4 9l5.8.6-4.4 3.8 1.3 5.7L12 16.4 6.9 19.1l1.3-5.7L3.8 9.6 9.6 9z"
      />
    </svg>
  );
}

export function ListIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M8 6.5h12M8 12h12M8 17.5h12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="4.5" cy="6.5" r="1.2" fill="currentColor" />
      <circle cx="4.5" cy="12" r="1.2" fill="currentColor" />
      <circle cx="4.5" cy="17.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function MapViewIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M3.8 6.4 9 4.6l6 2 5.2-1.8v12.8L15 19.4l-6-2-5.2 1.8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9 4.6v12.8M15 6.6v12.8"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function MoonIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M16.6 13.8A6.6 6.6 0 0 1 10 5.4 7.2 7.2 0 1 0 18.6 16a6.5 6.5 0 0 1-2-.2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

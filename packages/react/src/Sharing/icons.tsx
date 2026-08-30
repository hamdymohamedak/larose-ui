import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function ShareIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="1.125rem" height="1.125rem" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 3v10.2M12 3l3.5 3.5M12 3 8.5 6.5M6 10v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PeopleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="1.125rem" height="1.125rem" fill="none" aria-hidden="true" {...props}>
      <circle cx="9" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M4 19c0-2.8 2.2-5 5-5s5 2.2 5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M15 11.5a2.75 2.75 0 1 1 0 5.5M19 19c0-2.1-1.5-3.8-3.5-4.2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MessageIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="1.125rem" height="1.125rem" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 6.5h14a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H9l-4 3v-11.5A1.5 1.5 0 0 1 6.5 6.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VideoIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="1.125rem" height="1.125rem" fill="none" aria-hidden="true" {...props}>
      <rect x="4" y="7" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="m15 11 5-3v10l-5-3v-4Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LinkIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="1.125rem" height="1.125rem" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10 14a3.5 3.5 0 0 0 5 0l2-2a3.5 3.5 0 1 0-5-5l-1 1M14 10a3.5 3.5 0 0 0-5 0l-2 2a3.5 3.5 0 0 0 5 5l1-1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="1.125rem" height="1.125rem" fill="none" aria-hidden="true" {...props}>
      <rect x="8" y="8" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M6 16V6a2 2 0 0 1 2-2h10"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="0.875rem" height="0.875rem" fill="none" aria-hidden="true" {...props}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PrintIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="1.125rem" height="1.125rem" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7 8V4h10v4M7 16H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="7" y="14" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function MarkupIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="1.125rem" height="1.125rem" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="7.25" stroke="currentColor" strokeWidth="1.75" />
      <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function FilesIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="1.125rem" height="1.125rem" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8 6.5h8l2 2V18a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6.5 18V8A1.5 1.5 0 0 1 8 6.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M8 6.5V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5v1" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function AirPlayIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="1.125rem" height="1.125rem" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7 16h10M12 12l4 4H8l4-4ZM12 4a8 8 0 0 1 8 8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="1.125rem" height="1.125rem" fill="none" aria-hidden="true" {...props}>
      <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="m4 8 8 5 8-5" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}

export function PhotosIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="1.125rem" height="1.125rem" fill="none" aria-hidden="true" {...props}>
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <path d="m6 17 4-4 3 3 2-2 3 3" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}

type IconProps = { className?: string };

const base = "h-4 w-4";

export function IconWallet({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2v-4m0 0h-4a2 2 0 100 4h4" />
    </svg>
  );
}

export function IconAlert({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.007M10.29 3.86L1.82 18a1.5 1.5 0 001.29 2.25h17.78A1.5 1.5 0 0022.18 18L13.71 3.86a1.5 1.5 0 00-2.42 0z" />
    </svg>
  );
}

export function IconCalendar({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M4.5 6h15a.75.75 0 01.75.75v12a.75.75 0 01-.75.75h-15a.75.75 0 01-.75-.75v-12A.75.75 0 014.5 6z" />
    </svg>
  );
}

export function IconGift({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v13.5M6.75 8.25h10.5a1.5 1.5 0 001.5-1.5v-1.5a2.25 2.25 0 00-4.336-.836M6.75 8.25a1.5 1.5 0 01-1.5-1.5v-1.5a2.25 2.25 0 014.336-.836M6.75 8.25H3v6.75h18V8.25h-3.75M3 15v4.5A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5V15" />
    </svg>
  );
}

export function IconSun({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-2.386l1.591-1.591M3 12h2.25m.386-6.364L7.227 7.227M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

export function IconPlusCircle({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export function IconBanknote({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75h19.5M2.25 5.25h19.5M2.25 5.25v13.5M21.75 5.25v13.5M6 9.75a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0zM9.75 15a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0z" />
    </svg>
  );
}

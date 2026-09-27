import Link from 'next/link';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" aria-label="NOMA — início" className={`wd-exp text-[17px] font-[560] tracking-[0.34em] leading-none ${className}`}>
      NOMA
    </Link>
  );
}

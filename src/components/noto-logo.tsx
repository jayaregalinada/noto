import Image from 'next/image';

/** The Noto wordmark logo. Size it via `className` (e.g. `h-6 w-auto`). */
export function NotoLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/noto-logo.webp"
      alt="Noto"
      width={1084}
      height={351}
      priority
      className={className}
    />
  );
}

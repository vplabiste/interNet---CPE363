import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <svg
        className="h-6 w-6 text-accent"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.4852 6.51474C19.438 4.56198 22 5.86933 22 8.41421V15.5858C22 18.1307 19.438 19.438 17.4852 17.4852L9.51474 9.51474C7.56198 7.56198 9.86933 5 12.4142 5H15.5858C16.3986 5 17.0754 5.6768 17.0754 6.48962V6.51474C17.0754 6.74182 17.2582 6.92464 17.4852 6.92464C17.7123 6.92464 17.8951 6.74182 17.8951 6.51474V6.48962C17.8951 5.06877 16.8164 3.98999 15.3956 3.98999H12.4142C9.07172 3.98999 6.71987 7.28013 8.71987 9.28013L16.6904 17.2507C18.6904 19.2507 21.0717 17.9283 21.0717 15.5858V8.41421C21.0717 6.07172 18.7199 4.71987 16.7199 6.71987L8.74931 14.6904C6.74931 16.6904 4 15.3283 4 12.5858V8.41421C4 5.86933 6.56198 4.56198 8.51474 6.51474L17.4852 6.51474Z"
          fill="currentColor"
        />
      </svg>
      <span className="text-lg font-semibold tracking-tighter font-headline">
        interNet
      </span>
    </Link>
  );
}

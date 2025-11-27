import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <Image 
        src="/logo.svg" 
        alt="interNet logo" 
        width={24} 
        height={24}
        className="text-accent"
      />
      <span className="text-lg font-semibold tracking-tighter font-headline">
        interNet
      </span>
    </Link>
  );
}

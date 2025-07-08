import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={cn('flex h-screen flex-col items-center justify-center')}>
      <ul>
        <li>
          <Link href="/ascii-media">AsciiMedia</Link>
        </li>
      </ul>
    </div>
  );
}

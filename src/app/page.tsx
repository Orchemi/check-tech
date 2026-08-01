import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={cn('flex h-screen flex-col items-center justify-center')}>
      <ul>
        <li>
          <Link href="/ascii-media">AsciiMedia</Link>
        </li>
        <li>
          <Link href="/color-random">Color Random</Link>
        </li>
        <li>
          <Link href="/score-manager">Score Manager</Link>
        </li>
      </ul>
    </div>
  );
}

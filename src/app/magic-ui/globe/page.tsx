import { cn } from '@/lib/utils';
import { Globe } from '@/components/magicui/globe';

export default function GlobePage() {
  return (
    <div className={cn('flex h-screen flex-col items-center justify-center')}>
      <Globe />
    </div>
  );
}

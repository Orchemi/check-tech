import { cn } from '@/lib/utils';

const List = ({ type }: { type: 'A' | 'B' }) => {
  const bgColor1 = type === 'A' ? 'bg-yellow-100' : 'bg-green-100';
  const bgColor2 = type === 'A' ? 'bg-red-100' : 'bg-blue-100';

  return (
    <div className="flex h-screen flex-col items-center justify-center-safe">
      <ul className="w-full">
        {Array.from({ length: 100 }).map((_, index) => (
          <li key={index}>
            <div
              className={cn(
                'flex h-20 w-full items-center justify-center',
                'text-center font-bold text-black',
                index % 2 === 0 ? bgColor1 : bgColor2,
              )}
            >
              {index}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;

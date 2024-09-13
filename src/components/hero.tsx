import { cn } from '@/lib/utils';
import AnimatedGridPattern from './magicui/animated-grid-pattern';
import ShimmerLink from './magicui/shimmer-link';

export default function Hero() {
  return (
    <header className="relative flex h-[550px] w-full items-center justify-center overflow-hidden rounded-lg bg-background p-20">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col gap-4 items-center">
          <h1 className="z-10 whitespace-pre-wrap text-center text-6xl font-bold tracking-tighter text-white">
            Smll
          </h1>
          <p className="z-10 whitespace-pre-wrap text-center text-2xl tracking-tighter text-white">
            Think <span className="font-bold uppercase">big</span>, link{' '}
            <span className="font-light">smll</span>
          </p>
        </div>
        <ShimmerLink className="shadow-2xl h-11" href="/login">
          <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:to-slate-900/10 lg:text-lg">
            Start now
          </span>
        </ShimmerLink>
      </div>
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        className={cn(
          '[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]',
          'inset-x-0 inset-y-[-30%] h-[200%] skew-y-12'
        )}
      />
    </header>
  );
}

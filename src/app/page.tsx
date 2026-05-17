import Features from '@/components/landing/features';
import Hero from '@/components/landing/hero';
import { VelocityScroll } from '@/components/magicui/scroll-based-velocity';

export default function Page() {
  return (
    <>
      <Hero />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <VelocityScroll
          text="Smll links"
          default_velocity={5}
          className="font-display text-center text-4xl font-bold tracking-[-0.02em] text-black drop-shadow-sm dark:text-white md:text-7xl md:leading-[5rem]"
        />
        <main className="mt-16 flex flex-col gap-12 items-center">
          <section>
            <Features />
          </section>
        </main>
      </div>
    </>
  );
}

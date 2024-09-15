import { ChartColumn, Puzzle, SquarePen, Brain, Sparkles } from 'lucide-react';
import { MagicCard } from '../magicui/magic-card';

const features = [
  {
    Icon: ChartColumn,
    name: 'Analytics',
    description:
      'Track clicks, geographic data, and more with our robust analytics.'
  },
  {
    Icon: Puzzle,
    name: 'API integration',
    description:
      'Seamlessly integrate Smll into your applications with our powerful API.'
  },
  {
    Icon: SquarePen,
    name: 'Customize your shortlinks',
    description:
      'Create branded and memorable links that reflect your identity.'
  },
  {
    Icon: Brain,
    name: 'Smart passwords',
    description:
      'Route users to different destinations based on the password they enter, all from a single shortlink.'
  },
  {
    Icon: Sparkles,
    name: 'More incredible features',
    description: 'Discover additional tools to optimize your link management.'
  }
];

export default function Features() {
  return (
    <ul className="flex flex-col flex-nowrap sm:flex-row sm:flex-wrap gap-12">
      {features.map(({ name, description, Icon }) => (
        <li className="w-full sm:flex-1" key={name}>
          <MagicCard
            className="cursor-pointer flex flex-col items-center justify-center shadow-2xl whitespace-nowrap w-full h-full sm:h-80 p-4"
            gradientColor="#262626">
            <div className="flex flex-col gap-8 justify-center items-center">
              <div className="bg-zinc-800 p-4 inline rounded-full">
                <Icon className="w-9 h-9" />
              </div>
              <div className="flex flex-col gap-4 text-center">
                <h2 className="text-2xl sm:text-3xl font-medium text-pretty sm:text-nowrap">
                  {name}
                </h2>
                <p className="text-md sm:text-lg max-w-md text-pretty">
                  {description}
                </p>
              </div>
            </div>
          </MagicCard>
        </li>
      ))}
    </ul>
  );
}

import { MONTHS } from '@/constants';
import { useLinksStore } from '@/store/links';
import { BarChart } from '@mantine/charts';
import { Card } from '@mantine/core';

interface Props {
  activeLinks: number;
  inactiveLinks: number;
}

export const LinksStats: React.FC<Props> = ({ activeLinks, inactiveLinks }) => {
  const { links } = useLinksStore();

  const getData = () => {
    const currentYear = new Date().getFullYear();

    return MONTHS.map((monthName, idx) => {
      const totalViews = links.reduce((acc, link) => {
        const metric = link.metrics.find(
          (m) => m.year === currentYear && m.month === idx
        );

        return acc + (metric ? metric.views : 0);
      }, 0);

      return {
        month: monthName,
        Views: totalViews
      };
    });
  };

  return (
    <>
      <ul className="flex gap-10">
        <li className="flex flex-col gap-4 items-center">
          <h3 className="text-xl">Active Links</h3>
          <Card
            className="text-5xl text-center w-full"
            radius="md"
            shadow="sm"
            withBorder>
            {activeLinks}
          </Card>
        </li>
        <li className="flex flex-col gap-4 items-center">
          <h3 className="text-xl">Inactive Links</h3>
          <Card
            className="text-5xl text-center w-full"
            radius="md"
            shadow="sm"
            withBorder>
            {inactiveLinks}
          </Card>
        </li>
      </ul>
      <Card className="mt-10" radius="md" shadow="sm" withBorder>
        <BarChart
          h={300}
          data={getData()}
          dataKey="month"
          series={[{ name: 'Views', color: 'indigo' }]}
          tickLine="y"
          withYAxis={false}
        />
      </Card>
    </>
  );
};

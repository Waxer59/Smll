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
    const months = new Array(MONTHS.length)
      .fill(0)
      .map((_, i) => currentYear - i);
    return months.map((month, idx) => {
      const monthName = MONTHS[idx];
      const monthData = links.filter((link) =>
        link.metrics.find((m) => m.month === idx)
      );

      const totalViews = monthData.reduce(
        (acc, curr) => acc + curr.metrics.reduce((a, b) => a + b.views, 0),
        0
      );

      return {
        month: monthName,
        Views: totalViews
      };
    });
  };

  console.log(getData());

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

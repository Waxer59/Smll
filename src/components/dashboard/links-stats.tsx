import { BarChart } from '@mantine/charts';
import { Card } from '@mantine/core';

const data = [
  { month: 'January', Smartphones: 1200, Laptops: 900, Tablets: 200 },
  { month: 'February', Smartphones: 1900, Laptops: 1200, Tablets: 400 },
  { month: 'March', Smartphones: 400, Laptops: 1000, Tablets: 200 },
  { month: 'April', Smartphones: 1000, Laptops: 200, Tablets: 800 },
  { month: 'May', Smartphones: 800, Laptops: 1400, Tablets: 1200 },
  { month: 'June', Smartphones: 750, Laptops: 600, Tablets: 1000 }
];

interface Props {
  activeLinks: number;
  inactiveLinks: number;
}

export const LinksStats: React.FC<Props> = ({ activeLinks, inactiveLinks }) => {
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
          data={data}
          dataKey="month"
          series={[
            { name: 'Smartphones', color: 'violet.6' },
            { name: 'Laptops', color: 'blue.6' },
            { name: 'Tablets', color: 'teal.6' }
          ]}
          tickLine="y"
          withYAxis={false}
        />
      </Card>
    </>
  );
};

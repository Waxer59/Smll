'use client';

import { ActionIcon, Tooltip, VisuallyHidden } from '@mantine/core';
import { Copy, Minus } from 'lucide-react';
import { useState } from 'react';

interface Props {
  token: string;
}

export const TokenItem: React.FC<Props> = ({ token }) => {
  const [isTokenHidden, setIsTokenHidden] = useState(true);

  return (
    <li className="flex justify-between items-center w-full">
      <Tooltip label="Show/hide token" color="gray">
        <button onClick={() => setIsTokenHidden(!isTokenHidden)}>
          <input
            type={isTokenHidden ? 'password' : 'text'}
            value={token}
            readOnly
            className="p-2 rounded-md bg-zinc-800 text-white/80 cursor-pointer"
          />
        </button>
      </Tooltip>
      <div className="flex gap-2">
        <Tooltip label="Copy token" color="gray">
          <ActionIcon variant="light" color="gray" radius="md" size="lg">
            <VisuallyHidden>Copy token</VisuallyHidden>
            <Copy />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete token" color="gray">
          <ActionIcon variant="light" color="red" radius="md" size="lg">
            <VisuallyHidden>Delete token</VisuallyHidden>
            <Minus />
          </ActionIcon>
        </Tooltip>
      </div>
    </li>
  );
};

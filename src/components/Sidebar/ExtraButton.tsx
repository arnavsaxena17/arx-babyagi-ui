import { DotsHorizontalIcon, TrashIcon } from '@radix-ui/react-icons';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { on } from 'events';
import React, { FC } from 'react';
import { translate } from '../../utils/translate';

interface ExtraButtonProps {
  onDelete: () => void;
}

export const ExtraButton: FC<ExtraButtonProps> = ({ onDelete }) => {
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onDelete();
  };

  return (
    <div className="relative inline-block text-left">
      <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger asChild>
          {/* <button className="p-1 opacity-0 text-neutral-400 hover:opacity-100">
            <DotsHorizontalIcon />
          </button> */}
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Content
          align="center"
          sideOffset={4}
          className="z-50 w-48 p-2 rounded-lg shadow-md bg-neutral-900"
        >
          <PopoverPrimitive.Arrow className="text-gray-900 fill-current" />
          {/* <button
            className="inline-flex items-center w-full h-full gap-2 p-2 rounded-md hover:bg-neutral-800"
            onClick={handleClick}
          >
            <TrashIcon className="w-5 h-5" />
            {translate('DELETE')}
          </button> */}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Root>
    </div>
  );
};

import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/react';
import { Button } from '@heroui/button';
import { IconType } from 'react-icons';

export default function ShowShortMessage({
  Icon,
  header,
  content,
}: {
  Icon: IconType;
  header: string;
  content: string;
}) {
  return (
    <Popover placement="top" showArrow={true} className="bg-nonex">
      <PopoverTrigger>
        <Button className="custom-button min-w-4 h-4">
          <Icon />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-small font-bold">{header}</div>
          <div className="text-tiny">{content}</div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

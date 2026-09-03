import React from 'react';
import { Select, SelectItem } from '@heroui/react';
import { SharedSelection } from '@heroui/react';

export type Key = string | number;

export interface SelectionDataProps {
  key: Key;
  label: string;
}

interface CustomSelectProps {
  label: string;
  placeholder?: string;
  value: Key | null;
  onChange: (value: Key) => void;
  selectionData: Array<SelectionDataProps>;
  variant?: 'flat' | 'bordered' | 'faded' | 'underlined';
  className?: Partial<
    Record<
      | 'base'
      | 'label'
      | 'trigger'
      | 'mainWrapper'
      | 'innerWrapper'
      | 'selectorIcon'
      | 'value'
      | 'listboxWrapper'
      | 'listbox'
      | 'popoverContent'
      | 'helperWrapper'
      | 'description'
      | 'errorMessage',
      string
    >
  >;
  name?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  // placeholder = 'Select an option',
  value,
  onChange,
  selectionData,
  className,
  variant,
  name,
}) => {
  const handleSelectionChange = (keys: SharedSelection) => {
    const selectedKey = Array.isArray(keys) ? keys[0] : keys.currentKey || null;
    onChange(selectedKey as Key);
  };

  return (
    <Select
      label={label}
      variant={variant}
      // placeholder={placeholder}
      selectedKeys={value !== null ? new Set([value]) : new Set()}
      onSelectionChange={handleSelectionChange}
      classNames={className}
      name={name}
    >
      {selectionData.map((item) => (
        <SelectItem key={item.key}>
          {item.label}
        </SelectItem>
      ))}
    </Select>
  );
};

export default CustomSelect;

import { DateRangePicker } from '@heroui/react';
import { RangeValue } from '@react-types/shared';
import { CalendarDate } from '@internationalized/date';
import { Card, CardBody } from '@heroui/react';

export interface DateRangePickerWrapperProps {
  value: RangeValue<CalendarDate>;
  onChange: (range: RangeValue<CalendarDate> | null) => void;
  label?: string;
  className?: string;
  showCard?: boolean;
}

/**
 * Reusable Date Range Picker with consistent styling
 *
 * @example
 * ```tsx
 * const [dateRange, setDateRange] = useState({
 *   start: parseDate('2024-01-01'),
 *   end: parseDate('2024-01-31'),
 * });
 *
 * <DateRangePickerWrapper
 *   value={dateRange}
 *   onChange={setDateRange}
 *   label="Select Date Range"
 * />
 * ```
 */
export function DateRangePickerWrapper({
  value,
  onChange,
  label = 'Date Range',
  className = '',
  showCard = true,
}: DateRangePickerWrapperProps) {
  const pickerComponent = (
    <DateRangePicker
      label={label}
      classNames={{
        label: 'text-purple-600',
        base: `bg-white dark:bg-default-200/60 rounded-xl !w-[400px] !h-[40px] !items-start ${className}`,
        inputWrapper: [
          'bg-white',
          'dark:bg-default/60',
          'shadow-md',
          'hover:bg-white',
          'dark:hover:bg-default/70',
          'focus-within:!bg-white/50',
          'dark:focus-within:!bg-default/60',
          'border-none',
          '!cursor-text',
          '!px-4 !py-2',
        ],
      }}
      aria-label={label}
      variant="bordered"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value={value as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange={onChange as any}
    />
  );

  if (showCard) {
    return (
      <Card className="mx-4 my-4 mb-8 px-6 py-6 border-2 border-purple-600">
        <CardBody>
          <div className="flex items-center justify-between">
            {pickerComponent}
          </div>
        </CardBody>
      </Card>
    );
  }

  return pickerComponent;
}

/**
 * Inline Date Range Picker (without card wrapper)
 */
export function InlineDateRangePicker(
  props: Omit<DateRangePickerWrapperProps, 'showCard'>,
) {
  return <DateRangePickerWrapper {...props} showCard={false} />;
}

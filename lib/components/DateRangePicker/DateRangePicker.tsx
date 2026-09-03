import React from 'react';
import { DateRangePicker, DateRangePickerProps } from '@heroui/react';
import { Button, ButtonGroup } from '@heroui/button';
import { Radio, RadioGroup } from '@heroui/react';
import {
  endOfMonth,
  endOfWeek,
  getLocalTimeZone,
  startOfMonth,
  startOfWeek,
  today,
} from '@internationalized/date';
import { useLocale } from '@react-aria/i18n';
import { clsx } from 'clsx';

import { safeAny } from '@/lib/interfaces/global.interface';

interface CustomDateRangePickerProps extends DateRangePickerProps {
  // value: ZonedDateTime | CalendarDate | CalendarDateTime | undefined | null;
  label?: React.ReactNode;
  variant?: 'flat' | 'bordered' | 'faded' | 'underlined';
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  size?: 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  // defaultValue: string | undefined;
  // placeholderValue:
  //   | ZonedDateTime
  //   | CalendarDate
  //   | CalendarDateTime
  //   | undefined
  //   | null;
  // description: React.ReactNode;
  // onChange:
  //   | ((value: ZonedDateTime | CalendarDate | CalendarDateTime) => void)
  //   | undefined;
  initialRange?: { start: Date; end: Date };
  precisionOptions?: { value: string; label: string }[];
  predefinedRanges?: { label: string; range: { start: Date; end: Date } }[];
}

const CustomDateRangePicker = () => {
  const defaultDate = {
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ days: 7 }),
  };
  const [value, setValue] = React.useState(defaultDate);

  const { locale } = useLocale();
  // const formatter = useDateFormatter({ dateStyle: 'full' });
  const now = today(getLocalTimeZone());
  const nextWeek = {
    start: startOfWeek(now.add({ weeks: 1 }), locale),
    end: endOfWeek(now.add({ weeks: 1 }), locale),
  };
  const nextMonth = {
    start: startOfMonth(now.add({ months: 1 })),
    end: endOfMonth(now.add({ months: 1 })),
  };

  const CustomRadio = (props: safeAny) => {
    const { children, ...otherProps } = props;

    return (
      <Radio
        {...otherProps}
        classNames={{
          base: clsx(
            'flex-none m-0 h-8 bg-content1 hover:bg-content2 items-center justify-between',
            'cursor-pointer rounded-full border-2 border-default-200/60',
            'data-[selected=true]:border-primary',
          ),
          label: 'text-tiny text-purple-600',
          labelWrapper: 'px-1 m-0',
          wrapper: 'hidden',
        }}
      >
        {children}
      </Radio>
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <DateRangePicker
        classNames={{
          label: ' text-purple-600 ',
          base: ' bg-white dark:bg-default-200/60',
          inputWrapper: [
            'bg-white',
            'dark:bg-default/60',
            'shadow-large',
            'hover:bg-white',
            'dark:hover:bg-default/70',
            'focus-within:!bg-white/50',
            'dark:focus-within:!bg-default/60',
            'border-none',
            '!cursor-text',
          ],
        }}
        variant="bordered"
        CalendarBottomContent={
          <RadioGroup
            aria-label="Date precision"
            classNames={{
              base: 'w-full pb-2',
              wrapper:
                '-my-2.5 py-2.5 px-3 gap-1 flex-nowrap max-w-[w-[calc(var(--visible-months)_*_var(--calendar-width))]] overflow-scroll',
            }}
            defaultValue="exact_dates"
            orientation="horizontal"
          >
            <CustomRadio value="exact_dates" className=" text-secondary">
              Exact dates
            </CustomRadio>
            <CustomRadio value="1_day" className=" text-red">
              1 day
            </CustomRadio>
            <CustomRadio value="2_days" className=" text-secondary">
              2 days
            </CustomRadio>
            <CustomRadio value="3_days" className=" text-secondary">
              3 days
            </CustomRadio>
            <CustomRadio value="7_days" className=" text-secondary">
              7 days
            </CustomRadio>
            <CustomRadio value="14_days" className=" text-secondary">
              14 days
            </CustomRadio>
          </RadioGroup>
        }
        CalendarTopContent={
          <ButtonGroup
            fullWidth
            className="px-3 pb-2 pt-3 bg-content1 [&>button]:text-default-500 [&>button]:border-default-200/60 text-secondary"
            radius="full"
            size="sm"
            variant="bordered"
          >
            <Button
              onPress={() =>
                setValue({
                  start: now,
                  end: now.add({ days: 7 }),
                })
              }
              className=" text-secondary"
            >
              This week
            </Button>
            <Button
              onPress={() => setValue(nextWeek)}
              className="text-secondary"
            >
              Next week
            </Button>
            <Button
              onPress={() => setValue(nextMonth)}
              className=" text-secondary"
            >
              Next month
            </Button>
          </ButtonGroup>
        }
        calendarProps={{
          focusedValue: value?.start as safeAny,
          onFocusChange: (val) => setValue({ ...value, start: val } as safeAny),
          nextButtonProps: {
            variant: 'bordered',
          },
          prevButtonProps: {
            variant: 'bordered',
          },
        }}
        value={value as safeAny}
        onChange={setValue as safeAny}
        label="Event date"
      />
    </div>
  );
};
export default CustomDateRangePicker;

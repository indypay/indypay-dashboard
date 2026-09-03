'use client';
import React, { useState } from 'react';
import { DatePicker, Button, Space, Segmented } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { useDateRange } from './DateRangeContext';
import { useTenant } from '@/context/TenantContext';
import dayjs, { Dayjs } from 'dayjs';
import type { DateRangeType } from './DateRangeContext';

const { RangePicker } = DatePicker;

export const DateRangeSelector = () => {
  const { dateRange, setDateRange } = useDateRange();
  const { tenantConfig } = useTenant();
  const { primary, border, background, text, textMuted, surface } = tenantConfig.colors;

  const [value, setValue] = useState<[Dayjs, Dayjs]>([
    dayjs(dateRange.startDate),
    dayjs(dateRange.endDate),
  ]);
  const [quickSelect, setQuickSelect] = useState<string>('7_days');

  const handleChange = (
    dates: null | [Dayjs | null, Dayjs | null],
    type: DateRangeType = 'custom',
    label: string = 'Custom Range',
  ) => {
    if (!dates || !dates[0] || !dates[1]) return;
    setValue([dates[0], dates[1]]);
    setDateRange({ startDate: dates[0].toDate(), endDate: dates[1].toDate(), type, label });
  };

  const presetRanges = {
    Today:        [dayjs().startOf('day'), dayjs().endOf('day')] as [Dayjs, Dayjs],
    'This Week':  [dayjs().startOf('week'), dayjs().endOf('week')] as [Dayjs, Dayjs],
    'Last 7 Days':[dayjs().subtract(7, 'days'), dayjs()] as [Dayjs, Dayjs],
    'This Month': [dayjs().startOf('month'), dayjs().endOf('month')] as [Dayjs, Dayjs],
    'Last Month': [dayjs().subtract(1,'month').startOf('month'), dayjs().subtract(1,'month').endOf('month')] as [Dayjs,Dayjs],
    'Last 30 Days':[dayjs().subtract(30,'days'), dayjs()] as [Dayjs, Dayjs],
  };

  const quickSelectOptions = [
    { label: '1 Day',   value: '1_day'  },
    { label: '7 Days',  value: '7_days' },
    { label: '14 Days', value: '14_days'},
    { label: '30 Days', value: '30_days'},
  ];

  const handleQuickSelect = (val: string) => {
    setQuickSelect(val);
    const days = val === '1_day' ? 1 : val === '7_days' ? 7 : val === '14_days' ? 14 : 30;
    handleChange([dayjs().subtract(days, 'days'), dayjs()], 'custom', `Last ${days} days`);
  };

  const shortcutBtnStyle = {
    background: background,
    border: `1px solid ${border}`,
    color: text,
    borderRadius: '6px',
  };

  return (
    <div className="flex justify-end w-full sm:w-auto">
      <RangePicker
        value={value}
        onChange={(dates) => handleChange(dates)}
        presets={Object.entries(presetRanges).map(([label, range]) => ({ label, value: range }))}
        format="MMM DD, YYYY"
        size="large"
        suffixIcon={<CalendarOutlined style={{ color: text }} />}
        style={{
          background: surface,
          borderRadius: '8px',
          border: `1px solid ${primary}`,
        }}
        className="w-full sm:w-auto sm:min-w-[300px]"
        popupStyle={{ background: surface }}
        renderExtraFooter={() => (
          <div
            style={{
              padding: '12px 16px',
              borderTop: `1px solid ${border}`,
              background: surface,
            }}
          >
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', color: textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Quick Select
              </span>
            </div>
            <Segmented
              options={quickSelectOptions}
              value={quickSelect}
              onChange={(val) => handleQuickSelect(val as string)}
              style={{ background: background, padding: '2px' }}
              block
            />
            <div style={{ marginTop: '12px', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Shortcuts
              </span>
            </div>
            <Space size="small" wrap>
              <Button size="small" style={shortcutBtnStyle}
                onClick={() => handleChange(presetRanges['This Week'], 'custom', 'This Week')}>
                This Week
              </Button>
              <Button size="small" style={shortcutBtnStyle}
                onClick={() => handleChange(presetRanges['This Month'], 'thisMonth', 'This Month')}>
                This Month
              </Button>
              <Button size="small" style={shortcutBtnStyle}
                onClick={() => handleChange(presetRanges['Last Month'], 'lastMonth', 'Last Month')}>
                Last Month
              </Button>
            </Space>
          </div>
        )}
      />
    </div>
  );
};

'use client';
import React, { useState } from 'react';
import { createStyles } from 'antd-style';
import { EyeOutlined } from '@ant-design/icons';

import CustomDateRangePicker from '@/lib/components/DateRangePicker/DateRangePicker';
// import { title } from "@/lib/components/primitives";
import CustomSelect from '@/lib/components/SelectOptions/SelectOptions';
import SelectOptionsData from '@/lib/constants/dropdownConstants/SelectOptionData';
import { safeAny } from '@/lib/interfaces/global.interface';

const useStyle = createStyles(({ css }) => {
  return {
    customFilters: css`
      /* Custom Input Styles */
      .ant-input,
      .ant-input-number-input,
      .ant-picker-input > input {
        color: var(--text) !important;
        background: #ffffff !important;
      }

      .ant-input::placeholder,
      .ant-input-number-input::placeholder {
        color: var(--text-muted) !important;
      }

      /* Custom Select Styles */
      .ant-select-selector {
        background: #ffffff !important;
        border-color: #4e4e4e !important;
        color: var(--text) !important;
      }

      .ant-select-selection-placeholder {
        color: var(--text-muted) !important;
      }

      .ant-select-arrow {
        color: var(--text-muted) !important;
      }

      /* Custom DatePicker Styles */
      .ant-picker {
        background: #ffffff !important;
        border-color: #4e4e4e !important;
      }

      .ant-picker-input > input {
        color: var(--text) !important;
      }

      .ant-picker-suffix,
      .ant-picker-separator {
        color: var(--text-muted) !important;
      }
    `,
  };
});

const DownloadTransactions = () => {
  const { styles } = useStyle();
  const [selectedMerchants, setSelectedMerchants] = useState<string | null>('');
  const handleSelection = (value: string | null) => {
    setSelectedMerchants(value);
  };
  return (
    <>
      <div
        className={`flex items-center justify-between border mx-4 my-4 px-4 py-4 rounded-md ${styles.customFilters}`}
        style={{ borderColor: 'var(--border)' }}
      >
        <CustomSelect
          label="Select"
          placeholder="MerChant Id"
          value={selectedMerchants as safeAny}
          onChange={(value) => handleSelection(value as safeAny)}
          selectionData={SelectOptionsData}
        />
        <CustomDateRangePicker />
      </div>
    </>
  );
};

export default DownloadTransactions;

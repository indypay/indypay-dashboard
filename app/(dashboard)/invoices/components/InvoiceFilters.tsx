'use client';

import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { IInvoiceFilters } from '@/lib/interfaces/invoice.interface';

interface InvoiceFiltersProps {
  onSearch: (filters: IInvoiceFilters) => void;
}

export const InvoiceFilters = ({ onSearch }: InvoiceFiltersProps) => {
  const [search, setSearch] = useState('');

  const handleSearch = () => {
    onSearch({ search });
  };

  const handleClear = () => {
    setSearch('');
    onSearch({});
  };

  return (
    <div className="mx-4 px-6 py-4 mb-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search invoices"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          prefix={<SearchOutlined />}
          style={{
            width: 400,
            backgroundColor: 'var(--background)',
            borderColor: '#3A3F3E',
            color: 'var(--text)',
          }}
          allowClear
        />
        <Button
          type="primary"
          onClick={handleSearch}
          style={{
            background: 'var(--cta-gradient)',
            border: 'none',
            color: 'var(--background)',
            fontWeight: 600,
            height: '40px',
            paddingLeft: '24px',
            paddingRight: '24px',
          }}
        >
          Search
        </Button>
        <Button
          onClick={handleClear}
          style={{
            background: '#DC3545',
            border: 'none',
            color: '#FFFFFF',
            fontWeight: 600,
            height: '40px',
            paddingLeft: '24px',
            paddingRight: '24px',
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

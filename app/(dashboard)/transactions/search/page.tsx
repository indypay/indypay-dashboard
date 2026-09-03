'use client';
import React, { useState } from 'react';
import { useRef } from 'react';
import { Key } from 'react-stately';

import Input from '@/lib/components/InputContainer/Input';
import CustomSelect from '@/lib/components/SelectOptions/SelectOptions';
import SelectOptionsData from '@/lib/constants/dropdownConstants/SelectOptionData';
import { SearchIcon } from '@/public/assests/Icon/SearchIcon';

const SearchTransactions = () => {
  const [selectedMerchants, setSelectedMerchants] = useState<Key | null>(null);
  const handleSelection = (value: Key) => {
    setSelectedMerchants(value);
  };
  const inputRef = useRef<HTMLInputElement | null>();
  return (
    <>
      <div className="flex items-center justify-between border border-purple-400 mx-4 my-4 px-4 py-4 rounded-md">
        <CustomSelect
          label="Select"
          placeholder="MerChant Id"
          value={selectedMerchants}
          onChange={(value: Key) => handleSelection(value)}
          selectionData={SelectOptionsData}
        />
        <Input
          // ref={inputRef}
          label="Search Merchants"
          placeholder="Type to search..."
          type="search"
          startContent={<SearchIcon />}
          name="search merchants"
        />
      </div>
    </>
  );
};

export default SearchTransactions;

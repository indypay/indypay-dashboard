import React, { RefObject, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  TableProps,
} from '@heroui/react';
import { Spinner } from '@heroui/react';
import { AsyncListData } from 'react-stately';

interface Column<T> {
  key: keyof T;
  label: string;
}

interface CustomTableProps<T> extends TableProps {
  columns: Column<T>[];
  data: T[];
  // TableTopContent: React.ReactNode;
  hasMore: boolean;
  scrollRef: RefObject<HTMLElement>;
  loaderRef: RefObject<HTMLElement>;
  list: AsyncListData<T>;
  isLoading: boolean;
}

const CustomTable = <T,>({
  columns,
  data,
  // TableTopContent,
  hasMore,
  scrollRef,
  loaderRef,
  isLoading,
  list,
}: CustomTableProps<T>) => {
  const [showPaginatedButton, setShowPaginatedButton] = useState(false);

  return (
    <div className="flex items-center justify-center px-4 py-4 lg:w-full md:max-[400px]">
      <Table
        isStriped
        isHeaderSticky
        aria-label="Infinite pagination"
        baseRef={scrollRef}
        selectionMode="multiple"
        // topContent={TableTopContent}
        topContentPlacement="outside"
        bottomContent={
          hasMore ? (
            <div className="flex w-full justify-center">
              <Spinner ref={loaderRef} color="secondary" />
            </div>
          ) : null
        }
        classNames={{
          wrapper: 'max-h-[400px]',
        }}
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key as string} className="text-purple-600">
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          items={list.items}
          loadingContent={<Spinner color="white" />}
        >
          {(item) => (
            <TableRow key={JSON.stringify(item)}>
              {columns.map((column) => (
                <TableCell key={column.key as string}>
                  {String(item[column.key])}{' '}
                  {/* Ensure the value is a string */}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomTable;

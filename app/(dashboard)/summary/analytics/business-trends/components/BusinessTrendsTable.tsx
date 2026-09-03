'use client';

import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from '@heroui/react';
import { Card, CardBody } from '@heroui/react';
import { TableData } from '@/lib/interfaces/analytics.interface';

interface BusinessTrendsTableProps {
  data: TableData[];
}

const columns = [
  {
    key: 'paymentMethod',
    label: 'Payment Method',
  },
  {
    key: 'successRatioToday',
    label: "Today's Success",
  },
  {
    key: 'successRatioYesterday',
    label: "Yesterday's Success",
  },
  {
    key: 'averageSuccessRatio',
    label: 'Average Success',
  },
  {
    key: 'averageVolume',
    label: 'Average Volume',
  },
];

export const BusinessTrendsTable: React.FC<BusinessTrendsTableProps> = ({
  data,
}) => {
  return (
    <Card>
      <CardBody>
        <Table
          aria-label="Payment methods performance table"
          // classNames={{
          //   base: "max-h-[520px] overflow-auto",
          //   table: "min-h-[400px]",
          // }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.key}
                align={column.key === 'paymentMethod' ? 'start' : 'center'}
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={data}
            emptyContent="No payment methods data available"
          >
            {(item) => (
              <TableRow key={item.paymentMethod}>
                <TableCell>{item.paymentMethod}</TableCell>
                <TableCell>{item.successRatioToday}%</TableCell>
                <TableCell>{item.successRatioYesterday}%</TableCell>
                <TableCell>{item.averageSuccessRatio}%</TableCell>
                <TableCell>₹{item.averageVolume}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};

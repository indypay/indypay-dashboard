// "use client";

// import React from "react";

// import {
//   Table,
//   TableHeader,
//   TableColumn,
//   TableBody,
//   TableRow,
//   TableCell,
//   Selection,
//   SortDescriptor,
// } from "@heroui/react";
// import {
//   Dropdown,
//   DropdownTrigger,
//   DropdownMenu,
//   DropdownSection,
//   DropdownItem,
// } from "@heroui/react";
// import { Button } from "@heroui/button";
// import { Chip, ChipProps } from "@heroui/react";
// import {
//   columns,
//   statusOptions,
//   users,
// } from "@/lib/constants/recentTable/RecentTableData";
// import { User } from "@heroui/react";
// import { SearchIcon } from "@/lib/components/icons";
// import Input from "@/lib/components/InputContainer/Input";
// import {
//   Pagination,
//   PaginationItem,
//   PaginationCursor,
// } from "@heroui/react";
// import { VerticalDotsIcon } from "@/public/assests/Icon/VerticalDots";
// const statusColorMap: Record<string, ChipProps["color"]> = {
//   active: "success",
//   paused: "danger",
//   vacation: "warning",
// };

// const INITIAL_VISIBLE_COLUMNS = ["name", "role", "status", "actions"];

// type User = (typeof users)[0];

// const RecentTransactions = () => {
//   const [filterValue, setFilterValue] = React.useState("");
//   const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
//     new Set([])
//   );
//   const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
//     new Set(INITIAL_VISIBLE_COLUMNS)
//   );
//   const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
//   const [rowsPerPage, setRowsPerPage] = React.useState(5);
//   const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
//     column: "age",
//     direction: "ascending",
//   });

//   const [page, setPage] = React.useState(1);

//   const hasSearchFilter = Boolean(filterValue);

//   const headerColumns = React.useMemo(() => {
//     if (visibleColumns === "all") return columns;

//     return columns.filter((column) =>
//       Array.from(visibleColumns).includes(column.uid)
//     );
//   }, [visibleColumns]);

//   const filteredItems = React.useMemo(() => {
//     let filteredUsers = [...users];

//     if (hasSearchFilter) {
//       filteredUsers = filteredUsers.filter((user) =>
//         user.name.toLowerCase().includes(filterValue.toLowerCase())
//       );
//     }
//     if (
//       statusFilter !== "all" &&
//       Array.from(statusFilter).length !== statusOptions.length
//     ) {
//       filteredUsers = filteredUsers.filter((user) =>
//         Array.from(statusFilter).includes(user.status)
//       );
//     }

//     return filteredUsers;
//   }, [users, filterValue, statusFilter]);

//   const pages = Math.ceil(filteredItems.length / rowsPerPage);

//   const items = React.useMemo(() => {
//     const start = (page - 1) * rowsPerPage;
//     const end = start + rowsPerPage;

//     return filteredItems.slice(start, end);
//   }, [page, filteredItems, rowsPerPage]);

//   const sortedItems = React.useMemo(() => {
//     return [...items].sort((a: User, b: User) => {
//       const first = a[sortDescriptor.column as keyof User] as number;
//       const second = b[sortDescriptor.column as keyof User] as number;
//       const cmp = first < second ? -1 : first > second ? 1 : 0;

//       return sortDescriptor.direction === "descending" ? -cmp : cmp;
//     });
//   }, [sortDescriptor, items]);

//   const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
//     const cellValue = user[columnKey as keyof User];

//     switch (columnKey) {
//       case "name":
//         return (
//           <User
//             avatarProps={{ radius: "lg", src: user.avatar }}
//             description={user.email}
//             name={cellValue}
//           >
//             {user.email}
//           </User>
//         );
//       case "role":
//         return (
//           <div className="flex flex-col">
//             <p className="text-bold text-small capitalize">{cellValue}</p>
//             <p className="text-bold text-tiny capitalize text-default-400">
//               {user.team}
//             </p>
//           </div>
//         );
//       case "status":
//         return (
//           <Chip
//             className="capitalize"
//             color={statusColorMap[user.status]}
//             size="sm"
//             variant="flat"
//           >
//             {cellValue}
//           </Chip>
//         );
//       case "actions":
//         return (
//           <div className="relative flex justify-start items-start">
//             <Dropdown>
//               <DropdownTrigger>
//                 <Button isIconOnly size="sm" variant="light">
//                   <VerticalDotsIcon className="text-default-300" />
//                 </Button>
//               </DropdownTrigger>
//               <DropdownMenu>
//                 <DropdownItem>View</DropdownItem>
//                 <DropdownItem>Edit</DropdownItem>
//                 <DropdownItem>Delete</DropdownItem>
//               </DropdownMenu>
//             </Dropdown>
//           </div>
//         );
//       default:
//         return cellValue;
//     }
//   }, []);

//   const onNextPage = React.useCallback(() => {
//     if (page < pages) {
//       setPage(page + 1);
//     }
//   }, [page, pages]);

//   const onPreviousPage = React.useCallback(() => {
//     if (page > 1) {
//       setPage(page - 1);
//     }
//   }, [page]);

//   const onRowsPerPageChange = React.useCallback(
//     (e: React.ChangeEvent<HTMLSelectElement>) => {
//       setRowsPerPage(Number(e.target.value));
//       setPage(1);
//     },
//     []
//   );

//   const onSearchChange = React.useCallback((value?: string) => {
//     if (value) {
//       setFilterValue(value);
//       setPage(1);
//     } else {
//       setFilterValue("");
//     }
//   }, []);

//   const onClear = React.useCallback(() => {
//     setFilterValue("");
//     setPage(1);
//   }, []);

//   const topContent = React.useMemo(() => {
//     return (
//       <div className="flex flex-col gap-4 rounded-md shadow-large px-4 py-4">
//         <div className="flex  gap-3 items-end">
//           <Input
//             className="w-full sm:max-w-[80%]"
//             placeholder="Search by name..."
//             startContent={<SearchIcon />}
//             value={filterValue}
//             // on={() => onClear()}
//             onValueChange={onSearchChange}
//             name="search"
//           />
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-purple-400 text-small px-4">
//             Total {users.length} users
//           </span>
//           <label className="flex items-center text-purple-400 text-small px-4">
//             Rows per page:
//             <select
//               className="bg-transparent outline-none text-purple-400 text-small"
//               onChange={onRowsPerPageChange}
//             >
//               <option value="5">5</option>
//               <option value="10">10</option>
//               <option value="15">15</option>
//             </select>
//           </label>
//         </div>
//       </div>
//     );
//   }, [
//     filterValue,
//     statusFilter,
//     visibleColumns,
//     onSearchChange,
//     onRowsPerPageChange,
//     users.length,
//     hasSearchFilter,
//   ]);

//   const bottomContent = React.useMemo(() => {
//     return (
//       <div className="py-4 px-4 flex justify-between items-center shadow-large rounded-md">
//         <span className="w-[30%] text-small text-purple-600">
//           {selectedKeys === "all"
//             ? "All items selected"
//             : `${selectedKeys.size} of ${filteredItems.length} selected`}
//         </span>
//         <Pagination
//           isCompact
//           showControls
//           showShadow
//           color="secondary"
//           page={page}
//           total={pages}
//           onChange={setPage}
//         />
//         <div className="hidden sm:flex w-[30%] justify-end gap-2">
//           <Button
//             isDisabled={pages === 1}
//             size="sm"
//             variant="flat"
//             onPress={onPreviousPage}
//             color="secondary"
//           >
//             Previous
//           </Button>
//           <Button
//             isDisabled={pages === 1}
//             size="sm"
//             variant="flat"
//             onPress={onNextPage}
//             color="secondary"
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     );
//   }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

//   return (
//     <Table
//       aria-label="pagination and sorting"
//       isHeaderSticky
//       bottomContent={bottomContent}
//       bottomContentPlacement="outside"
//       classNames={{
//         wrapper: "max-h-[350px]",
//       }}
//       selectedKeys={selectedKeys}
//       selectionMode="multiple"
//       sortDescriptor={sortDescriptor}
//       topContent={topContent}
//       topContentPlacement="outside"
//       onSelectionChange={setSelectedKeys}
//       onSortChange={setSortDescriptor}
//       className="px-4 py-4"
//     >
//       <TableHeader columns={headerColumns}>
//         {(column) => (
//           <TableColumn
//             key={column.uid}
//             align={column.uid === "actions" ? "center" : "start"}
//             allowsSorting={column.sortable}
//             className="text-purple-600 hover:text-blue-400"
//           >
//             {column.name}
//           </TableColumn>
//         )}
//       </TableHeader>
//       <TableBody emptyContent={"No users found"} items={sortedItems}>
//         {(item) => (
//           <TableRow key={item.id}>
//             {(columnKey) => (
//               <TableCell>{renderCell(item, columnKey)}</TableCell>
//             )}
//           </TableRow>
//         )}
//       </TableBody>
//     </Table>
//   );
// };

// export default RecentTransactions;
// "use client";

// import Input from "@/lib/components/InputContainer/Input";
// import { SearchIcon } from "@/public/assests/Icon/SearchIcon";
// import { useRef, useState } from "react";
// import CustomDateRangePicker from "@/lib/components/DateRangePicker/DateRangePicker";
// import CustomSelect from "@/lib/components/SelectOptions/SelectOptions";
// import CustomTable from "@/lib/components/CustomTable/Table";
// import Services from "@/lib/services/Services";
// import { useInfiniteScroll } from "@heroui/react";
// import { TransactionColumns } from "@/lib/constants/CustomTable/CustomTable";
// import SelectOptionsData from "@/lib/constants/dropdownConstants/SelectOptionData";

// const Transactions = () => {
//   const inputRef = useRef(null);
//   const [inputField, setInputField] = useState("");
//   const [selectedMerchants, setSelectedMerchants] = useState<string | null>("");
//   const handleSelection = (value: string | null) => {
//     setSelectedMerchants(value);
//   };

//   const { hasMore, isLoading, list } = Services.paginatedData();
//   const [loaderRef, scrollerRef] = useInfiniteScroll({
//     hasMore,
//     onLoadMore: list.loadMore,
//   });

//   const handleChange = (e: string) => {
//     list.setFilterText(e);
//   };

//   const SerchIcon = () => {
//     return (
//       <SearchIcon
//         className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0"
//         height={12}
//         width={12}
//       />
//     );
//   };

//   // const TableTopContent = () => {
//   //   return (
//   //     <div className="flex items-center justify-between px-4 py-4 shadow-large rounded-md">
//   //       <Input
//   //         ref={inputRef}
//   //         label="Search Merchants"
//   //         placeholder="Type to search..."
//   //         type="search"
//   //         startContent={<SerchIcon />}
//   //         value={list.filterText}
//   //         onValueChange={list.setFilterText}
//   //         // loadingState={list.loadingState}
//   //         name="transactions"
//   //       />
//   //       <CustomDateRangePicker />
//   //       <CustomSelect
//   //         label="Merchants"
//   //         placeholder="Select Merchants"
//   //         value={selectedMerchants}
//   //         onChange={(value) => handleSelection(value)}
//   //         selectionData={SelectOptionsData}
//   //       />
//   //     </div>
//   //   );
//   // };

//   return (
//     <>
//       <CustomTable
//         columns={TransactionColumns}
//         // TableTopContent={<TableTopContent />}
//         hasMore={hasMore}
//         isLoading={isLoading}
//         list={list}
//         scrollRef={scrollerRef}
//         loaderRef={loaderRef}
//         data={list.items}
//       />
//     </>
//   );
// };

// export default Transactions;

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  Pagination,
  Tag,
  Spin,
  DatePicker,
  Input as AntInput,
  Select,
} from 'antd';
import type { TableColumnsType } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { createStyles } from 'antd-style';
import { EyeOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

import { safeAny } from '@/lib/interfaces/global.interface';
import {
  formatAmount,
  formatNumber,
  getFormattedTime,
  formatStatus,
  formatColorStatus,
} from '@/lib/utils/utils';
import '../../../../global.scss';

const useStyle = createStyles(({ css }) => {
  return {
    customTable: css`
      .ant-table-wrapper {
        width: 100%;
        background: linear-gradient(to right, var(--border), var(--primary));
        border-radius: 12px;
        padding: 2px;
      }

      .ant-table-inner-wrapper {
        background: #ffffff;
        border-radius: 10px;
        padding: 14px;
      }

      .ant-table {
        background: #ffffff;
        border-radius: 8px;

        .ant-table-container {
          border-radius: 8px;

          .ant-table-body,
          .ant-table-content {
            scrollbar-width: thin;
            scrollbar-color: #40a17f #01261d;
          }

          &::-webkit-scrollbar {
            height: 8px;
            width: 8px;
          }

          &::-webkit-scrollbar-track {
            background: #01261d;
            border-radius: 4px;
          }

          &::-webkit-scrollbar-thumb {
            background: #40a17f;
            border-radius: 4px;

            &:hover {
              background: #30f3bc;
            }
          }
        }

        .ant-table-thead > tr > th {
          background: #ffffff !important;
          color: var(--text-muted) !important;
          border-bottom: 1px solid var(--border) !important;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 16px 12px;
        }

        .ant-table-tbody > tr {
          background: #ffffff;
          transition: background 0.2s;

          &:hover > td {
            background: var(--background) !important;
          }

          > td {
            border-bottom: 1px solid var(--border) !important;
            color: var(--text) !important;
            padding: 16px 12px;
          }
        }
      }

      .ant-table-cell-fix-left,
      .ant-table-cell-fix-right {
        background: #ffffff !important;
      }

      .ant-table-thead .ant-table-cell-fix-left,
      .ant-table-thead .ant-table-cell-fix-right {
        background: #ffffff !important;
      }

      .ant-table-tbody > tr:hover {
        .ant-table-cell-fix-left,
        .ant-table-cell-fix-right {
          background: var(--background) !important;
        }
      }

      .ant-table-bordered .ant-table-container {
        border: none;
        border-radius: 8px;
      }

      /* Custom DatePicker Styles */
      .custom-date-picker {
        .ant-picker-input > input {
          color: var(--text) !important;
        }

        .ant-picker-suffix,
        .ant-picker-separator {
          color: var(--text-muted) !important;
        }
      }

      /* Custom Pagination Styles */
      .custom-pagination {
        .ant-pagination-item,
        .ant-pagination-item-link,
        .ant-pagination-total-text,
        .ant-pagination-jump-prev,
        .ant-pagination-jump-next,
        .ant-pagination-options-quick-jumper input {
          color: var(--text) !important;
        }

        .ant-pagination-item-active {
          background: linear-gradient(to right, var(--border), var(--primary)) !important;
          border-color: transparent !important;

          a {
            color: #0c0c0c !important;
          }
        }

        .ant-pagination-item {
          background: #ffffff !important;
          border-color: #4e4e4e !important;

          a {
            color: var(--text) !important;
          }

          &:hover {
            border-color: #30f3bc !important;
          }
        }

        .ant-pagination-prev,
        .ant-pagination-next {
          .ant-pagination-item-link {
            background: #ffffff !important;
            border-color: #4e4e4e !important;
            color: var(--text) !important;

            &:hover {
              border-color: #30f3bc !important;
            }
          }
        }
      }

      /* Custom Input Styles */
      .custom-input {
        background: #ffffff !important;
        border: 1px solid #4e4e4e !important;
        color: var(--text) !important;
        border-radius: 8px;

        &:hover {
          border-color: #30f3bc !important;
        }

        &:focus {
          border-color: #30f3bc !important;
          box-shadow: 0 0 0 2px rgba(48, 243, 188, 0.1) !important;
        }

        input {
          background: transparent !important;
          color: var(--text) !important;

          &::placeholder {
            color: var(--text-muted) !important;
          }
        }

        .ant-input-prefix {
          color: var(--text-muted) !important;
        }
      }

      /* Custom Select Styles */
      .custom-select {
        .ant-select-selector {
          background: #ffffff !important;
          border: 1px solid #4e4e4e !important;
          color: var(--text) !important;
          border-radius: 8px;

          &:hover {
            border-color: #30f3bc !important;
          }
        }

        &.ant-select-focused .ant-select-selector {
          border-color: #30f3bc !important;
          box-shadow: 0 0 0 2px rgba(48, 243, 188, 0.1) !important;
        }

        .ant-select-selection-placeholder {
          color: var(--text-muted) !important;
        }

        .ant-select-arrow {
          color: var(--text-muted) !important;
        }
      }
    `,
  };
});

interface TransactionData {
  id: string;
  date: string;
  transactionId: string;
  method: string;
  amount: number;
  status: 'Success' | 'Failed' | 'Pending';
}

const RecentTransactions = () => {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf('day'),
    dayjs().endOf('day'),
  ]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(100);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [transactionsData, setTransactionsData] = useState<TransactionData[]>(
    [],
  );

  const rowsPerPage = 50;
  const { styles } = useStyle();

  const handleViewDetails = (transactionId: string) => {
    router.push(`/transactions/${transactionId}`);
  };

  const getTagStyle = (status: string): React.CSSProperties => {
    const colorStatus = formatColorStatus(status);
    const colorMap: Record<
      string,
      { bg: string; text: string; border: string }
    > = {
      success: { bg: '#0DD25F15', text: '#0DD25F', border: '#0DD25F40' },
      warning: { bg: '#F5A52415', text: '#F5A524', border: '#F5A52440' },
      danger: { bg: '#D51C4415', text: '#D51C44', border: '#D51C4440' },
      default: { bg: '#30F3BC15', text: 'var(--secondary)', border: '#30F3BC40' },
    };
    const colors = colorMap[colorStatus] || colorMap.default;
    return {
      backgroundColor: colors.bg,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      borderRadius: '6px',
      padding: '4px 12px',
      fontWeight: 500,
    };
  };

  const columns: TableColumnsType<TransactionData> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      fixed: 'left',
      width: 180,
      render: (date: string) => getFormattedTime(new Date(date)) || '-',
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      width: 200,
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      width: 150,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      render: (amount: number) => formatAmount(amount) || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: string) => (
        <Tag style={getTagStyle(status)} bordered={false}>
          {formatStatus(status) || '-'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'view-details',
      fixed: 'right',
      width: 100,
      render: (_: safeAny, record: TransactionData) => (
        <div
          onClick={() => handleViewDetails(record.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--secondary)',
          }}
        >
          <EyeOutlined style={{ fontSize: '18px', color: 'var(--secondary)' }} />
        </div>
      ),
    },
  ];

  const handleDateRangeChange = (
    dates: null | [Dayjs | null, Dayjs | null],
  ) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
    }
  };

  return (
    <>
      <div
        className="mx-4 px-6 py-4 mb-1"
        style={{
          background: 'linear-gradient(to right, var(--border), var(--primary))',
          borderRadius: '12px',
          padding: '2px',
        }}
      >
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '10px',
            padding: '16px',
          }}
        >
          <div className="flex items-center gap-4 flex-wrap">
            <AntInput
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="custom-input"
              style={{ width: 300 }}
            />
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              format="YYYY-MM-DD"
              style={{
                width: 300,
                backgroundColor: '#FFFFFF',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
              allowClear={false}
              className="custom-date-picker"
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 200 }}
              className="custom-select"
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'success', label: 'Success' },
                { value: 'pending', label: 'Pending' },
                { value: 'failed', label: 'Failed' },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mx-4 my-4" style={{ maxWidth: 'calc(100vw - 190px)' }}>
        <div
          style={{
            width: '100%',
            position: 'relative',
            background: 'linear-gradient(to right, var(--border), var(--primary))',
            borderRadius: '12px',
            padding: '2px',
          }}
        >
          <div
            style={{
              width: '100%',
              overflowX: 'auto',
              background: '#FFFFFF',
              borderRadius: '10px',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            <Spin spinning={loading} size="large" tip="Loading">
              <Table
                className={styles.customTable}
                columns={columns}
                dataSource={transactionsData}
                rowKey="id"
                pagination={false}
                scroll={{ x: 'max-content', y: 'calc(100vh - 350px)' }}
                locale={{
                  emptyText: (
                    <div
                      className="text-center py-4 text-xl"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      No Data Found
                    </div>
                  ),
                }}
                size="middle"
              />
            </Spin>
          </div>

          <div
            className="flex justify-center p-4 sticky bottom-0 custom-pagination"
            style={{
              background: '#FFFFFF',
              borderTop: '1px solid #4E4E4E',
              borderRadius: '0 0 10px 10px',
              color: 'var(--text)',
            }}
          >
            <Pagination
              current={page}
              total={totalRecords}
              pageSize={rowsPerPage}
              onChange={(newPage) => setPage(newPage)}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} items`
              }
              style={{ color: 'var(--text)' }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentTransactions;

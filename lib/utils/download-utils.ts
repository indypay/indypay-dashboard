import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { safeAny } from '../interfaces/global.interface';

export const convertJsonToExcel = (data: safeAny[]): Blob => {
  // Convert your JSON data to the format you want
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

  // Generate blob
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
};

export const downloadFile = (
  data: Blob,
  filename: string = 'transactions-report.xlsx',
) => {
  saveAs(data, filename);
};

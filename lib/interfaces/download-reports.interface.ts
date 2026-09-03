export interface DownloadReportsInterface {
  userId: string | null;
  startDate?: string;
  endDate?: string;
  search?: string;
  status?: string;
  from?: number;
  count?: number;
}

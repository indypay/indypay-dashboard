import { useMutation } from '@tanstack/react-query';

import {
  postDownloadReports,
  postDownloadReportsPayout,
  postDownloadReportsSettlement,
  postDownloadPayinPayoutReports,
postDownloadCombinedReports,
postDownloadPaymentLinkReports,
postDownloadCheckoutReports,
postDownloadCheckoutPageReports,
postDownloadInvoiceReports,
} from '@/lib/services/download-reports';
import { DownloadReportsInterface } from '../interfaces/download-reports.interface';

export const useDownloadReports = () => {
  return useMutation({
    mutationKey: ['download-reports'],
    mutationFn: (downloadReports: DownloadReportsInterface) =>
      postDownloadReports(
        downloadReports.userId,
        downloadReports.search,
        downloadReports.startDate,
        downloadReports.endDate,
        downloadReports.status,
        downloadReports.from,
        downloadReports.count,
      ),
  });
};

export const useDownloadReportsPayout = () => {
  return useMutation({
    mutationKey: ['download-reports-payout'],
    mutationFn: (downloadReports: DownloadReportsInterface) =>
      postDownloadReportsPayout(
        downloadReports.userId,
        downloadReports.search,
        downloadReports.startDate,
        downloadReports.endDate,
        downloadReports.status,
        downloadReports.from,
        downloadReports.count,
      ),
  });
};

export const useDownloadReportsSettlement = () => {
  return useMutation({
    mutationKey: ['download-reports-settlement'],
    mutationFn: (downloadReports: DownloadReportsInterface) =>
      postDownloadReportsSettlement(
        downloadReports.userId,
        downloadReports.search,
        downloadReports.startDate,
        downloadReports.endDate,
        downloadReports.status,
        downloadReports.from,
        downloadReports.count,
      ),
  });
};
export const useDownloadCombinedReports = () => {
  return useMutation({
    mutationKey: ['download-combined-reports'],
    mutationFn: (downloadReports: DownloadReportsInterface) =>
      postDownloadCombinedReports(
        downloadReports.userId,
        downloadReports.search,
        downloadReports.startDate,
        downloadReports.endDate,
        downloadReports.status,
        downloadReports.from,
        downloadReports.count,
      ),
  });
};

export const useDownloadPayinPayoutReports = () => {
  return useMutation({
    mutationKey: ['download-payin-payout'],
    mutationFn: (downloadReports: DownloadReportsInterface) =>
      postDownloadPayinPayoutReports(
        downloadReports.userId,
        downloadReports.search,
        downloadReports.startDate,
        downloadReports.endDate,
        downloadReports.status,
        downloadReports.from,
        downloadReports.count,
      ),
  });
};

export const useDownloadPaymentLinkReports = () => {
  return useMutation({
    mutationKey: ['download-payment-links'],
    mutationFn: (downloadReports: DownloadReportsInterface) =>
      postDownloadPaymentLinkReports(
        downloadReports.userId,
        downloadReports.search,
        downloadReports.startDate,
        downloadReports.endDate,
        downloadReports.status,
        downloadReports.from,
        downloadReports.count,
      ),
  });
};

export const useDownloadCheckoutReports = () => {
  return useMutation({
    mutationKey: ['download-checkouts'],
    mutationFn: (downloadReports: DownloadReportsInterface) =>
      postDownloadCheckoutReports(
        downloadReports.userId,
        downloadReports.search,
        downloadReports.startDate,
        downloadReports.endDate,
        downloadReports.status,
        downloadReports.from,
        downloadReports.count,
      ),
  });
};

export const useDownloadCheckoutPageReports = () => {
  return useMutation({
    mutationKey: ['download-checkout-pages'],
    mutationFn: (downloadReports: DownloadReportsInterface) =>
      postDownloadCheckoutPageReports(
        downloadReports.userId,
        downloadReports.search,
        downloadReports.startDate,
        downloadReports.endDate,
        downloadReports.status,
        downloadReports.from,
        downloadReports.count,
      ),
  });
};

export const useDownloadInvoiceReports = () => {
  return useMutation({
    mutationKey: ['download-invoices'],
    mutationFn: (downloadReports: DownloadReportsInterface) =>
      postDownloadInvoiceReports(
        downloadReports.userId,
        downloadReports.search,
        downloadReports.startDate,
        downloadReports.endDate,
        downloadReports.status,
        downloadReports.from,
        downloadReports.count,
      ),
  });
};

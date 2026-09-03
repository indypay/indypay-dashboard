import { useQuery } from '@tanstack/react-query';
import { DashboardApiResponse } from '../interfaces/dashboard.interface';
import { isAdmin, isChannelPartner, isMerchant } from '../utils/utils';
import { useRole } from '../components/Role/RoleContext';
import {
  getAdminDashboardData,
  getChannelPartnerDashboardData,
  getMerchantDashboardData,
} from './useDashboardData';

interface UseTransactionDataProps {
  startDate: string;
  endDate: string;
}

export const useTransactionData = ({
  startDate,
  endDate,
}: UseTransactionDataProps) => {
  const { role } = useRole();

  const merchantDataQuery = useQuery({
    queryKey: ['merchantDashboardData', startDate, endDate],
    queryFn: () => getMerchantDashboardData({ startDate, endDate }),
    enabled: isMerchant(role),
  });

  const adminDataQuery = useQuery({
    queryKey: ['adminDashboardData', startDate, endDate],
    queryFn: () => getAdminDashboardData({ startDate, endDate }),
    enabled: isAdmin(role),
  });

  const channelPartnerDataQuery = useQuery({
    queryKey: ['channelPartnerDashboardData', startDate, endDate],
    queryFn: () => getChannelPartnerDashboardData({ startDate, endDate }),
    enabled: isChannelPartner(role),
  });

  let data: DashboardApiResponse[] | null = null;
  let isLoading = false;
  let error: Error | null = null;

  if (isMerchant(role)) {
    data =
      (merchantDataQuery.data as unknown as DashboardApiResponse[]) || null;
    isLoading = merchantDataQuery.isLoading;
    error = merchantDataQuery.error;
  } else if (isAdmin(role)) {
    data = (adminDataQuery.data as unknown as DashboardApiResponse[]) || null;
    isLoading = adminDataQuery.isLoading;
    error = adminDataQuery.error;
  } else if (isChannelPartner(role)) {
    data =
      (channelPartnerDataQuery.data as unknown as DashboardApiResponse[]) ||
      null;
    isLoading = channelPartnerDataQuery.isLoading;
    error = channelPartnerDataQuery.error;
  }

  return { data, isLoading, error };
};

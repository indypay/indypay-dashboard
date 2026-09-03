import { useRole } from '../components/Role/RoleContext';
import { isAdmin, isChannelPartner, isOps, viewOnlyAdmin } from '../utils/utils';
import {
  callAdminAnalyticsBusinessTrends,
  callMerchantAnalyticsBusinessTrends,
  callAdminAnalyticsConversionRate,
  callMerchantAnalyticsConversionRate,
  callAdminAnalyticsPaymentFailure,
  callMerchantAnalyticsPaymentFailure,
  callAdminAnalyticsSuccess,
  callMerchantAnalyticsSuccess,
} from './use-analytics';

const isAdminSideRole = (role: string) =>
  isAdmin(role) || isChannelPartner(role) || isOps(role) || viewOnlyAdmin(role);

export function useBusinessTrends(startDate: string, endDate: string) {
  const { role } = useRole();
  const useAdminApi = isAdminSideRole(role);
  const adminResult = callAdminAnalyticsBusinessTrends(role, startDate, endDate, useAdminApi);
  const merchantResult = callMerchantAnalyticsBusinessTrends(startDate, endDate, !useAdminApi);
  return useAdminApi ? adminResult : merchantResult;
}

export function useConversionRate(startDate: string, endDate: string) {
  const { role } = useRole();
  const useAdminApi = isAdminSideRole(role);
  const adminResult = callAdminAnalyticsConversionRate(role, startDate, endDate, useAdminApi);
  const merchantResult = callMerchantAnalyticsConversionRate(startDate, endDate, !useAdminApi);
  return useAdminApi ? adminResult : merchantResult;
}

export function usePaymentFailure(startDate: string, endDate: string) {
  const { role } = useRole();
  const useAdminApi = isAdminSideRole(role);
  const adminResult = callAdminAnalyticsPaymentFailure(role, startDate, endDate, useAdminApi);
  const merchantResult = callMerchantAnalyticsPaymentFailure(startDate, endDate, !useAdminApi);
  return useAdminApi ? adminResult : merchantResult;
}

export function usePaymentSuccess(startDate: string, endDate: string) {
  const { role } = useRole();
  const useAdminApi = isAdminSideRole(role);
  const adminResult = callAdminAnalyticsSuccess(role, startDate, endDate, useAdminApi);
  const merchantResult = callMerchantAnalyticsSuccess(startDate, endDate, !useAdminApi);
  return useAdminApi ? adminResult : merchantResult;
}


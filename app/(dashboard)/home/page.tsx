'use client';
import { useState } from 'react';
import { RangeValue } from '@react-types/shared';
import {
  CalendarDate,
  getLocalTimeZone,
  parseDate,
} from '@internationalized/date';

import { isAdmin, isChannelPartner, isMerchant } from '@/lib/utils/utils';
import {
  getAdminDashboardData,
  getChannelPartnerDashboardData,
  getMerchantDashboardData,
} from '@/lib/hooks/useDashboardData';
import { safeAny } from '@/lib/interfaces/global.interface';
import { Data, DashboardApiResponse } from '@/lib/interfaces/dashboard.interface';
import { useRole } from '@/lib/components/Role/RoleContext';
import { DashboardSection } from '@/lib/components/Dashboard';
import { DateRangePickerWrapper } from '@/lib/components/DateRangePickerWrapper';

const defaultData: Data = {
  payin: {
    totalAmount: 0,
    totalCount: 0,
    successAmount: null,
    successCount: 0,
    failedAmount: null,
    failedCount: 0,
  },
  payout: {
    totalAmount: 0,
    totalCount: 0,
    successAmount: null,
    successCount: 0,
    failedAmount: null,
    failedCount: 0,
    totalAmountWithCharges: 0,
    successAmountWithCharges: 0,
    failedAmountWithCharges: 0,
  },
  settlement: {
    totalAmount: 0,
    totalCount: 0,
    successAmount: 0,
    successCount: 0,
    failedAmount: 0,
    failedCount: 0,
  },
};

export default function Home() {
  const [dateRange, setDateRange] = useState<RangeValue<CalendarDate>>({
    start: parseDate(new Date().toISOString().split('T')[0]),
    end: parseDate(new Date().toISOString().split('T')[0]),
  });

  const { role } = useRole();

  const startDate = dateRange.start
    ? new Date(dateRange.start.toDate(getLocalTimeZone()).setHours(0, 0, 0, 0)).toISOString()
    : '';
  const endDate = dateRange.end
    ? new Date(dateRange.end.toDate(getLocalTimeZone()).setHours(23, 59, 59, 999)).toISOString()
    : '';

  const merchantQuery = getMerchantDashboardData({
    startDate,
    endDate,
    enabled: isMerchant(role),
  });

  const adminQuery = getAdminDashboardData({
    startDate,
    endDate,
    enabled: isAdmin(role),
  });

  const channelPartnerQuery = getChannelPartnerDashboardData({
    startDate,
    endDate,
    enabled: isChannelPartner(role),
  });

  const activeQuery = isMerchant(role)
    ? merchantQuery
    : isAdmin(role)
      ? adminQuery
      : channelPartnerQuery;

  // data is a tuple [DashboardApiResponse[] | null, error]; [0][0].data is the payload
  const renderData: Data = (activeQuery.data as [DashboardApiResponse[] | null, unknown] | undefined)?.[0]?.[0]?.data ?? defaultData;
  const isLoading = activeQuery.isFetching;

  return (
    <>
      <section className="flex flex-wrap items-start justify-between gap-5 px-5">
        <DateRangePickerWrapper
          value={dateRange as safeAny}
          onChange={(range: safeAny) => setDateRange(range)}
        />
        <DashboardSection
          title="Total Collections (PayIn)"
          data={renderData.payin}
          isLoading={isLoading}
        />
        <DashboardSection
          title="Total Payouts (PayOut)"
          data={renderData.payout}
          isLoading={isLoading}
        />
        <DashboardSection
          title="Total Settlements (Settlement)"
          data={renderData.settlement}
          isLoading={isLoading}
        />
      </section>
    </>
  );
}

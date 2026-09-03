'use client';
import { DashboardApiResponse } from '@/lib/interfaces/dashboard.interface';
import MetricCard from '@/lib/components/MetricCard';
import { Download, Upload, Landmark } from 'lucide-react';
import PromotionalCard from './PromotionalCard';
import TransactionTrendsChart from './TransactionTrendsChart';
import TopMerchantsCard from './TopMerchantsCard';
import PaymentMethodChart from './PaymentMethodChart';
import RecentTransactionsTable from './RecentTransactionsTable';
import { StatsPanelConstants } from '@/lib/constants/Stats/StatsPanel.constants';
import { useRouter } from 'next/navigation';

interface OverviewCardsProps {
  data: DashboardApiResponse[] | DashboardApiResponse | null;
  isLoading: boolean;
}

const OverviewCards = ({ data, isLoading }: OverviewCardsProps) => {
  const router = useRouter();
  const summaryData = (data as any)?.data ||
    (Array.isArray(data) ? data[0]?.data : null) || {
      payin: {
        // totalAmount: 0,
        // totalCount: 0,
        successAmount: 0,
        successCount: 0,
        // failedAmount: 0,
        // failedCount: 0,
      },
      payout: {
        // totalAmount: 0,
        // totalCount: 0,
        successAmount: 0,
        successCount: 0,
        // failedAmount: 0,
        // failedCount: 0,
        // totalAmountWithCharges: 0,
        // successAmountWithCharges: 0,
        // failedAmountWithCharges: 0,
      },
      settlement: {
        // totalAmount: 0,
        // totalCount: 0,
        successAmount: 0,
        successCount: 0,
        // failedAmount: 0,
        // failedCount: 0,
      },
      recentTransactions: [],
      topMerchants: [],
    };

  // Transform recent transactions data
  const recentTransactions = (summaryData.recentTransactions || []).map(
    (tx: any, index: number) => {
      // Normalize status to match expected type
      let normalizedStatus: 'Success' | 'Failed' | 'Pending' = 'Pending';
      const statusUpper = tx.status.toUpperCase();
      if (statusUpper === 'SUCCESS') {
        normalizedStatus = 'Success';
      } else if (statusUpper === 'FAILED' || statusUpper === 'FAIL') {
        normalizedStatus = 'Failed';
      } else if (statusUpper === 'PENDING') {
        normalizedStatus = 'Pending';
      }

      return {
        id: String(index + 1),
        date: new Date(tx.date).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        transactionId: tx.transactionId,
        method: tx.method,
        amount: parseFloat(tx.amount),
        status: normalizedStatus,
      };
    },
  );

  // Transform top merchants data
  const topMerchants = (summaryData.topMerchants || []).map(
    (merchant: any, index: number) => ({
      id: String(index + 1),
      name: merchant.merchantName,
      email: merchant.merchantEmail,
      avatar: '/path.jpg',
      totalAmount: merchant.totalAmount,
      transactionCount: merchant.transactionCount,
    }),
  );

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-8 top-40 md:top-72 z-0 relative w-full">
        {/* Loading state - you can add skeletons here if needed */}
      </div>
    );
  }

  const RedirectingSpecificPanel = (title: string) => {
    switch (title) {
      case StatsPanelConstants.COLLECTION:
        return router.push('/transactions');
      case StatsPanelConstants.PAYOUT:
        return router.push('/payout/payouts');
      case StatsPanelConstants.SETTLEMENT:
        return router.push('/settlement/settlement-transactions');
      default:
        return null;
    }
  };

  const graphData = [
    {
      title: 'Collections',
      value: summaryData.payin.successAmount,
      category: 'Collections',
    },
    {
      title: 'Payouts',
      value: summaryData.payout.successAmount,
      category: 'Payouts',
    },
    {
      title: 'Settlements',
      value: summaryData.settlement.successAmount,
      category: 'Settlements',
    },
  ];
  return (
    <div className="space-y-4 md:space-y-6 w-full">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-5 px-2 md:px-8">
        <MetricCard
          title="Collections"
          amount={summaryData.payin.successAmount || 0}
          borderColor="green"
          icon={<Download size={18} />}
          subtitle="Total collections"
          onViewDetails={() => RedirectingSpecificPanel(StatsPanelConstants.COLLECTION)}
          formatAmount={(amt) => `₹${Number(amt).toLocaleString()}`}
        />
        <MetricCard
          title="Disbursements"
          amount={summaryData.payout.successAmount || 0}
          borderColor="green"
          icon={<Upload size={18} />}
          subtitle="Total disbursements"
          onViewDetails={() => RedirectingSpecificPanel(StatsPanelConstants.PAYOUT)}
          formatAmount={(amt) => `₹${Number(amt).toLocaleString()}`}
        />
        <MetricCard
          title="Settlements"
          amount={summaryData.settlement.successAmount || 0}
          borderColor="green"
          icon={<Landmark size={18} />}
          subtitle="Total settlements"
          onViewDetails={() => RedirectingSpecificPanel(StatsPanelConstants.SETTLEMENT)}
          formatAmount={(amt) => `₹${Number(amt).toLocaleString()}`}
        />
      </div>
      {/* <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-3 md:gap-5 px-2 md:px-8 gap-x-8">
        <MetricCard
          title="Disputed Amount"
          amount={125400}
          percentageChange={32}
          changeLabel="collection this week"
          borderColor="green"
          onRefresh={() => {}}
          onViewDetails={() => {}}
          formatAmount={(amt) => `₹${amt.toLocaleString()}`}
        />
        <PromotionalCard
          title="AI insight"
          description="Unlock AI-powered predictive bills and payments with RupeeFlow Plus"
          buttonText="GET PLUS"
          borderColor="#83BFA7"
          buttonColor="#83BFA7"
          onButtonClick={() => {}}
        />
      </div> */}

      <div className="px-2 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-5">
        <div className="min-w-0">
          <TransactionTrendsChart data={graphData} />
        </div>
        <TopMerchantsCard
          merchants={topMerchants}
          onManageClick={(id: string) => console.log('Manage:', id)}
        />
      </div>

      <div className="px-2 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
        <PaymentMethodChart
          data={[
            { method: 'Card', amount: 55000 },
            { method: 'UPI', amount: 95000 },
            { method: 'Net Banking', amount: 40000 },
            { method: 'Wallet', amount: 50000 },
            { method: 'Others', amount: 28000 },
          ]}
        />
        <RecentTransactionsTable
          transactions={recentTransactions}
          maxDisplay={6}
        />
      </div>
      {/* <TransactionGraphs data={data} isLoading={isLoading} /> */}
    </div>
  );
};

export default OverviewCards;

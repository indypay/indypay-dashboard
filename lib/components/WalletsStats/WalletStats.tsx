import { Card, CardBody } from '@heroui/react';

interface WalletStatsProps {
  stats: {
    availablePayoutBalance: number;
    totalTopup: number;
    // totalPayout: number;
  };
}

const WalletStats = ({ stats }: WalletStatsProps) => {
  return (
    <div className="flex justify-between gap-4 mb-4">
      <Card className="w-full bg-green-400">
        <CardBody>
          <div className="flex justify-between">
            <p className="text-6xl text-gray-400 font-extralight mb-4">₹</p>
            <div className="flex flex-col">
              <p className="text-lg font-bold text-right text-white">
                {stats.availablePayoutBalance.toLocaleString('en-IN')}
              </p>
              <p className="text-2xl text-gray-200">Available Balance</p>
            </div>
          </div>
        </CardBody>
      </Card>
      <Card className="w-full bg-blue-400">
        <CardBody>
          <div className="flex justify-between">
            <p className="text-6xl text-gray-400 font-extralight text-left mb-4">
              ₹
            </p>
            <div className="flex flex-col">
              <p className="text-lg font-bold text-white text-right">
                {stats.totalTopup.toLocaleString('en-IN')}
              </p>
              <p className="text-2xl text-gray-200 text-left">Today's TopUp</p>
            </div>
          </div>
        </CardBody>
      </Card>
      {/* <Card className="w-full bg-purple-400">
        <CardBody>
          <div className="flex justify-between">
            <p className="text-6xl text-gray-400 font-extralight text-left mb-4">
              ₹
            </p>
            <div className="flex flex-col">
              <p className="text-lg font-bold text-white text-right">
                {stats.totalPayout.toLocaleString('en-IN')}
              </p>
              <p className="text-2xl text-gray-200 text-left">Today's Payout</p>
            </div>
          </div>
        </CardBody>
      </Card> */}
    </div>
  );
};

export default WalletStats;

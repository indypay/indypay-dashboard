import { cn } from '@heroui/react';

const CardComponent = ({
  color,
  amount,
  withChargesAmount,
  label,
}: {
  color: string;
  amount: number;
  withChargesAmount?: number;
  label: string;
}) => {
  const bgColors = {
    green: 'bg-emerald-500',
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
  };

  return (
    <div
      className={cn(
        bgColors[color as keyof typeof bgColors],
        'rounded-lg p-6 text-white px-4 py-4 w-full',
      )}
    >
      <div className="flex justify-between items-center">
        <span className="text-3xl">₹</span>
        <div className="text-right">
          <div className="text-4xl font-semibold leading-snug">
            {(amount ?? 0).toLocaleString()}
          </div>
          <div className="text-xs opacity-90 mt-1">
            {withChargesAmount ? (
              <>
                <span className="italic">With Charges:</span>{' '}
                <span className="font-semibold">
                  ₹{withChargesAmount?.toLocaleString()}
                </span>
              </>
            ) : (
              ''
            )}
          </div>
          <div className="text-sm opacity-80 italic mt-1">{label}</div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;

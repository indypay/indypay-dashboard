import { useEnableMultiAuth } from '@/lib/hooks/use-multiAuth';
import { getUserProfiles } from '@/lib/hooks/user-profile';
import { Card, CardBody } from '@heroui/react';
import { Switch } from '@heroui/react';
import { unstable_noStore } from 'next/cache';
import { useEffect } from 'react';

export const TwoFactorAuth = () => {
  unstable_noStore();
  const { mutate, isPending, isSuccess } = useEnableMultiAuth();
  const { data, isLoading, refetch } = getUserProfiles();
  const user = data?.[0]?.data;

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess]);

  return (
    <div
      style={{
        background: 'linear-gradient(to right, var(--border), var(--primary))',
        borderRadius: '12px',
        padding: '2px',
        marginBottom: '16px',
      }}
    >
      <Card
        style={{ background: '#FFFFFF', borderRadius: '10px', border: 'none' }}
      >
        <CardBody className="p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)' }}>
              Enable two-factor authentication
            </h3>
            <div className="flex items-center">
              <Switch
                isSelected={!!user?.twoFactorEnabled}
                isDisabled={!!user?.twoFactorEnabled || isPending || isLoading}
                onValueChange={(isSelected) => {
                  if (isSelected) {
                    mutate();
                  }
                }}
                className="cursor-pointer disabled:cursor-default"
                color="success"
              />
            </div>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Enable two-factor authentication to secure your account, adding an
            extra layer of protection for enhanced account security
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

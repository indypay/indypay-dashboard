'use client';
import { Card } from 'antd';
import React, { useCallback, useState } from 'react';
import { CgLock } from 'react-icons/cg';

import UpdatePassword from '@/lib/components/UpdatePassword/Page';
import { CustomButton } from '@/lib/components/ButtonComponent/CustomButton';
import { useLogout } from '@/lib/hooks/auth-verification';
import { useRouter } from 'next/navigation';
import { TwoFactorAuth } from './TwoFactorAuth';

const cardWrapStyle = (mb = '16px'): React.CSSProperties => ({
  background: 'linear-gradient(to right, var(--border), var(--primary))',
  borderRadius: '12px',
  padding: '2px',
  marginBottom: mb,
});

const Security = () => {
  const { mutateAsync: logout } = useLogout();
  const router = useRouter();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleOpenModal = useCallback(() => {
    setOpenModal((prevState) => !prevState);
  }, []);

  const handlePasswordUpdateSuccess = async () => {
    try {
      await logout(undefined, {
        onSuccess: () => {
          router.push('/sign-in');
        },
      });
    } catch (error) {
      console.error('Error logging out after password update:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Account Security header card */}
      <div style={cardWrapStyle()}>
        <Card
          style={{
            background: '#FFFFFF',
            borderRadius: '10px',
            border: 'none',
          }}
          styles={{ body: { padding: '24px' } }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ flexGrow: 1 }}>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  marginBottom: '8px',
                  margin: '0 0 8px 0',
                  color: 'var(--text)',
                }}
              >
                Account Security
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
                Secure accounts with passwords, PINs, and two-step
                authentication for robust defense, safeguarding personal
                information and ensuring digital privacy
              </p>
            </div>
            <div style={{ marginLeft: '24px', flexShrink: 0 }}>
              <CgLock size={48} style={{ color: 'var(--primary)' }} />
            </div>
          </div>
        </Card>
      </div>

      {/* Update Password card */}
      <div style={cardWrapStyle()}>
        <Card
          style={{
            background: '#FFFFFF',
            borderRadius: '10px',
            border: 'none',
          }}
          styles={{ body: { padding: '24px' } }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--text)',
                margin: 0,
              }}
            >
              Update your password due to security reasons
            </h3>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <UpdatePassword
                isOpen={openModal}
                handleModal={handleOpenModal}
                onSuccess={handlePasswordUpdateSuccess}
              />
              <CustomButton
                style={{
                  background: 'linear-gradient(to right, var(--secondary), var(--primary))',
                  color: 'var(--background)',
                  fontWeight: 600,
                }}
                onClick={handleOpenModal}
              >
                Update Password
              </CustomButton>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
            Updating your password regularly enhances security by protecting
            your accounts from unauthorized access. It helps mitigate risks
            associated with data breaches and ensures your personal information
            remains secure
          </p>
        </Card>
      </div>

      <TwoFactorAuth />
    </div>
  );
};

export default Security;

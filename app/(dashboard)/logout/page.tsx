'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from '@heroui/button';

import CustomModal from '@/lib/components/ModalContainer/Modal';
import { useLogout } from '@/lib/hooks/auth-verification';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { safeAny } from '@/lib/interfaces/global.interface';

const page = () => {
  const [openLogout, setOpenLogout] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { showToast } = useToast();
  const { mutate } = useLogout();
  const signOut = () => {
    setIsLoading(true);
    mutate(undefined, {
      onSuccess: (data: safeAny) => {
        const [response, error] = data;

        if (error) {
          showToast(error?.message, 'error');
          setIsLoading(false);
          return;
        }

        if (response) {
          showToast(response?.message, 'success');
          router.push('/sign-in');
          return;
        }
      },
    });
  };

  const handleCloseModal = () => {
    setOpenLogout(false);
    router.push('/');
  };

  const LogOutContent = () => {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center mb-4">Are you sure you want to logout?</p>
        <div className="flex justify-end gap-4 mb-4">
          <Button
            style={{
              background: '#FFFFFF',
              color: 'var(--text)',
              border: '1px solid #4E4E4E',
            }}
            onClick={handleCloseModal}
          >
            Cancel
          </Button>
          <Button
            style={{
              background: isLoading
                ? 'var(--border)'
                : 'linear-gradient(to right, var(--border), var(--primary))',
              color: isLoading ? 'var(--text-muted)' : '#FFFFFF',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
            onClick={isLoading ? undefined : signOut}
            disabled={isLoading}
          >
            {isLoading ? 'Logging out...' : 'Yes'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      {openLogout && (
        <CustomModal
          handleModal={handleCloseModal}
          content={<LogOutContent />}
          isOpen
          hideFooter
        />
      )}
    </>
  );
};

export default page;

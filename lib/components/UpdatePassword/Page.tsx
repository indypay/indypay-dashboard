'use client';
import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import { useToast } from '../Toast/ToastContext';

import { useResetPassword } from '@/lib/hooks/generate-secretKey';
import { ResetPasswordApiRequest } from '@/lib/interfaces/reset-password.interface';
import { STRONG_PASSWORD_REGEX } from '@/lib/utils/validators-regex';

interface UpdatePasswordProps {
  isOpen: boolean;
  handleModal: () => void;
  onSuccess: () => void;
}

const UpdatePassword: React.FC<UpdatePasswordProps> = ({
  isOpen,
  handleModal,
  onSuccess,
}) => {
  const { showToast } = useToast();
  const [olderPassword, setOlderPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

  const { mutate: resetPassword } = useResetPassword();

  const validatePassword = (password: string): boolean => {
    return STRONG_PASSWORD_REGEX.test(password);
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    if (value && !validatePassword(value)) {
      setNewPasswordError(
        'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.',
      );
    } else {
      setNewPasswordError(null);
    }
    // Check confirm password match
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError(
        'New password and confirm password do not match.',
      );
    } else {
      setConfirmPasswordError(null);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (newPassword && value && newPassword !== value) {
      setConfirmPasswordError(
        'New password and confirm password do not match.',
      );
    } else {
      setConfirmPasswordError(null);
    }
  };

  const handleResetPassword = () => {
    if (newPasswordError || confirmPasswordError) {
      return;
    }

    const data: ResetPasswordApiRequest = {
      oldPassword: olderPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    };
    resetPassword(data, {
      onSuccess: (data) => {
        const [response, error] = data;

        if (response) {
          handleModal();
          showToast(response.data?.message, 'success');
          onSuccess();
        }
        if (error) {
          showToast(error?.message, 'error');
        }
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={handleModal}
        footer={null}
        closeIcon={
          <CloseOutlined style={{ color: 'var(--text-muted)', fontSize: '20px' }} />
        }
        centered
        width={650}
        styles={{
          content: {
            background: 'transparent',
            padding: '2px',
            borderRadius: '12px',
            boxShadow: 'none',
          },
        }}
        style={{
          background: 'linear-gradient(135deg, var(--border), var(--primary))',
          borderRadius: '12px',
        }}
      >
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '10px',
            padding: '40px 48px',
          }}
        >
          {/* Header */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: '32px',
              paddingTop: '8px',
            }}
          >
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--primary)',
                margin: 0,
              }}
            >
              Update Password
            </h2>
          </div>

          {/* Body */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* Older Password */}
            <div>
              <Input.Password
                placeholder="Older Password"
                value={olderPassword}
                onChange={(e) => setOlderPassword(e.target.value)}
                size="large"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '16px',
                  padding: '12px 16px',
                }}
                styles={{
                  input: {
                    background: '#FFFFFF',
                    color: 'var(--text)',
                  },
                }}
              />
            </div>

            {/* New Password */}
            <div>
              <Input.Password
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => handleNewPasswordChange(e.target.value)}
                size="large"
                style={{
                  background: '#FFFFFF',
                  border: newPasswordError
                    ? '1px solid #D32F4A'
                    : '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '16px',
                  padding: '12px 16px',
                }}
                styles={{
                  input: {
                    background: '#FFFFFF',
                    color: 'var(--text)',
                  },
                }}
              />
              {newPasswordError && (
                <div
                  style={{
                    color: '#D51C44',
                    fontSize: '12px',
                    marginTop: '4px',
                  }}
                >
                  {newPasswordError}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Input.Password
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                size="large"
                style={{
                  background: '#FFFFFF',
                  border: confirmPasswordError
                    ? '1px solid #D32F4A'
                    : '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '16px',
                  padding: '12px 16px',
                }}
                styles={{
                  input: {
                    background: '#FFFFFF',
                    color: 'var(--text)',
                  },
                }}
              />
              {confirmPasswordError && (
                <div
                  style={{
                    color: '#D51C44',
                    fontSize: '12px',
                    marginTop: '4px',
                  }}
                >
                  {confirmPasswordError}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: '32px' }}>
            <Button
              type="primary"
              size="large"
              onClick={handleResetPassword}
              disabled={!!newPasswordError || !!confirmPasswordError}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, var(--border), var(--primary))',
                border: 'none',
                borderRadius: '8px',
                height: '48px',
                fontSize: '16px',
                fontWeight: 600,
                color: '#FFFFFF',
              }}
            >
              Update Password
            </Button>
          </div>
        </div>
      </Modal>

      <style jsx global>{`
        .ant-modal-close {
          top: 16px;
          right: 16px;
        }
        .ant-modal-close:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .ant-input-password .ant-input-suffix {
          color: var(--text-muted);
        }
        .ant-input-password:hover .ant-input-suffix {
          color: var(--text);
        }
        .ant-modal-mask {
          background: rgba(0, 0, 0, 0.7);
        }
        .ant-modal-wrap {
          backdrop-filter: blur(4px);
        }
      `}</style>
    </>
  );
};

export default UpdatePassword;

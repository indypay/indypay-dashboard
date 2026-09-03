'use client';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';
import { Spinner } from '@heroui/react';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation';

interface VerifyingPopupsProps {
  title: string;
  content: string;
  isOpen: boolean;
}
const VerifyingPopus = ({ title, content, isOpen }: VerifyingPopupsProps) => {
  useState<React.ReactNode>(null);
  const router = useRouter();
  useEffect(() => {
    if (isOpen) {
      const openConnection = io('http://localhost:4000');
      openConnection.on('onMobileVerify', (data) => {
        if (data?.isVerified) {
          router.push('/auth/merchants');
        }
      });
    }
  }, [isOpen]);

  return (
    <div className="flex items-center justify-center">
      <Modal
        size="xl"
        isOpen={isOpen}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        hideCloseButton={true}
        className="mb-2"
      >
        <ModalContent>
          <ModalHeader className="text-secondary">{title}</ModalHeader>
          <ModalBody>
            <div className=" flex flex-col gap-y-2">
              {content}
              <Spinner label="Loading..." color="primary" className=" mb-4" />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default VerifyingPopus;

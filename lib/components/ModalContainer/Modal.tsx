'use client';
import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import { Button } from '@heroui/button';

interface ModalContainerProps {
  isOpen: boolean;
  handleModal: () => void;
  title?: string;
  content: React.ReactNode;
  headerClassName?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  hideFooter?: boolean;
}

const ModalContainer = ({
  isOpen,
  handleModal,
  title,
  content,
  headerClassName,
  size,
  className,
  hideFooter,
}: ModalContainerProps) => {
  return (
    <Modal
      size={size}
      isOpen={isOpen}
      onClose={handleModal}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      className={className}
    >
      <ModalContent>
        <ModalHeader className={headerClassName}>{title}</ModalHeader>
        <ModalBody onClick={(e) => e.stopPropagation()}>{content}</ModalBody>
        {!hideFooter && (
          <ModalFooter>
            <Button color="secondary" onClick={handleModal}>
              Close
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalContainer;

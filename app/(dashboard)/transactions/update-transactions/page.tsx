'use client';
import { Button } from '@heroui/button';
import React, { useState } from 'react';

import CustomModal from '@/lib/components/ModalContainer/Modal';

const UpateTransactions = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal((prevState) => !prevState);
  };

  return (
    <>
      <div className="flex items-start justify-start px-4 py-4">
        <Button color="secondary" onClick={handleOpenModal}>
          Update Transactions
        </Button>
      </div>
      {openModal && (
        <CustomModal
          title="Update Transactions"
          handleModal={handleOpenModal}
          content="Hello How are you?"
          isOpen
        />
      )}
    </>
  );
};

export default UpateTransactions;

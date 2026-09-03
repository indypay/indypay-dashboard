import { IItem } from '@/lib/interfaces/invoice.interface';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';

interface DeleteItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: IItem;
}

const DeleteItemModal = ({ isOpen, onClose, item }: DeleteItemModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Delete Item</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete this item?</p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onPress={onClose}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteItemModal;

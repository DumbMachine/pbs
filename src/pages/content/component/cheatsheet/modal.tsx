import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

interface GenericModalProps {
  open: boolean;
  onClose: () => void;
}
export const GenericModal: React.FC<GenericModalProps> = ({
  open,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(open);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Dialog.Panel>
        <Dialog.Title>Deactivate account</Dialog.Title>
        <Dialog.Description>
          This will permanently deactivate your account
        </Dialog.Description>

        <p>
          Are you sure you want to deactivate your account? All of your data
          will be permanently removed. This action cannot be undone.
        </p>
      </Dialog.Panel>
    </Dialog>
  );
};

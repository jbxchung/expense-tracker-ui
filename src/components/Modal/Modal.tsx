// src/components/Modal.tsx
import React from 'react';

import styles from './Modal.module.scss';
import Card from 'components/Card/Card';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className={styles.modalWrapper}
      onClick={onClose} // close on click outside
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <Card>
          {children}
        </Card>
      </div>
    </div>
  );
}

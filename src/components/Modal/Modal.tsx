// src/components/Modal.tsx
import React from 'react';
import { createPortal } from 'react-dom';

import Card from 'components/Card/Card';

import styles from './Modal.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className={styles.modalWrapper}
      onClick={(e) => {
        console.log(e.target, e.currentTarget);
        // close when clicking on the modal background
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <Card>
          {children}
        </Card>
      </div>
    </div>,
    document.body
  );
}

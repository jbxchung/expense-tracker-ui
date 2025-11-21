// src/components/Modal.tsx
import React from 'react';
import { createPortal } from 'react-dom';

import Card from 'components/Card/Card';

import styles from './Modal.module.scss';

interface ModalProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  closeOnOutsideClick?: boolean;
  children: React.ReactNode;
}

export default function Modal({ title, isOpen, onClose, closeOnOutsideClick = true, children }: ModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className={styles.modalWrapper}
      onClick={(e) => {
        // close when clicking on the modal background
        if (closeOnOutsideClick && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <Card>
          <div className={styles.modalHeader}>
            {title && <h3 className={styles.modalTitle}>{title}</h3>}
            <span className={styles.closeIcon} title="Close" onClick={onClose}>
              &times;
            </span>
          </div>
          {children}
        </Card>
      </div>
    </div>,
    document.body
  );
}

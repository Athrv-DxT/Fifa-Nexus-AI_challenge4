import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-brand-dark-900 border border-brand-dark-700 w-full max-w-lg rounded-lg shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-brand-dark-700 flex items-center justify-between">
          <h2 id="modal-title" className="text-base font-semibold text-slate-100">
            {title}
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-full text-slate-400 hover:text-slate-200"
          >
            <X size={18} />
          </Button>
        </div>

        {/* Content */}
        <div className="px-5 py-5 overflow-y-auto text-sm text-slate-200 flex-1">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-3 border-t border-brand-dark-700 bg-brand-dark-950 flex justify-end gap-3 text-xs">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

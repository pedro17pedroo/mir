import { useState } from 'react';

/**
 * Custom hook para gerenciar estado de modais
 * @returns {object} { isOpen, open, close, toggle, editingItem, setEditingItem }
 */
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const open = (item = null) => {
    if (item) {
      setEditingItem(item);
    }
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    // Delay para limpar após animação de fechamento
    setTimeout(() => {
      setEditingItem(null);
    }, 200);
  };

  const toggle = () => {
    setIsOpen(prev => !prev);
  };

  return {
    isOpen,
    open,
    close,
    toggle,
    editingItem,
    setEditingItem
  };
};

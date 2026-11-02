import { useState, useEffect } from 'react';

/**
 * Custom hook para debounce de valores
 * @param {any} value - Valor a ser debounced
 * @param {number} delay - Delay em ms (padrão: 500ms)
 * @returns {any} Valor debounced
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

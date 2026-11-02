import { useState, useEffect } from 'react';

/**
 * Custom hook para media queries
 * @param {string} query - Media query (ex: '(max-width: 768px)')
 * @returns {boolean} Se a media query corresponde
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Verifica se está no cliente
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia(query);
    
    // Define valor inicial
    setMatches(media.matches);

    // Listener para mudanças
    const listener = (e) => setMatches(e.matches);
    
    // Adiciona listener
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      // Fallback para navegadores antigos
      media.addListener(listener);
    }

    // Cleanup
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
};

// Hooks pré-configurados para breakpoints comuns
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
export const useIsTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');

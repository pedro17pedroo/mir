'use client';
import '../styles/globals.css';
import useSiteStore from '../store/useSiteStore';
import { useEffect } from 'react';

export default function RootLayout({ children }) {
  const theme = useSiteStore(state => state.theme);
  const loadTheme = useSiteStore(state => state.loadTheme);
  const loadMenus = useSiteStore(state => state.loadMenus);

  useEffect(() => {
    loadTheme();
    loadMenus();
  }, [loadTheme, loadMenus]);

  // Aplicar variáveis CSS globais de tipografia, cores e estilo quando o tema muda
  useEffect(() => {
    if (!theme || typeof document === 'undefined') return;
    const root = document.documentElement;

    const headingFont = theme.fonteTitulos || 'Playfair Display';
    const bodyFont = theme.fonteCorpo || 'Inter';
    const fontSizeMap = { compact: '15px', normal: '16px', large: '18px' };
    const weightMap = { semibold: '600', bold: '700', extrabold: '800' };
    const btnRadiusMap = { pill: '9999px', rounded: '0.75rem', square: '0.25rem' };
    const cardRadiusMap = { small: '0.5rem', medium: '0.75rem', large: '1rem', xlarge: '1.5rem' };

    root.style.setProperty('--font-heading', `'${headingFont}', Georgia, serif`);
    root.style.setProperty('--font-body', `'${bodyFont}', -apple-system, BlinkMacSystemFont, sans-serif`);
    root.style.setProperty('--font-size-base', fontSizeMap[theme.tamanhoFonteBase] || '16px');
    root.style.setProperty('--heading-weight', weightMap[theme.pesoTitulos] || '700');
    root.style.setProperty('--color-primary', theme.corPrimaria || '#9333ea');
    root.style.setProperty('--color-secondary', theme.corSecundaria || '#ec4899');
    root.style.setProperty('--color-text', theme.corTexto || '#1f2937');
    root.style.setProperty('--color-bg', theme.corFundo || '#ffffff');
    root.style.setProperty('--color-link', theme.corLink || '#9333ea');
    root.style.setProperty('--color-link-hover', theme.corLinkHover || '#7c3aed');
    root.style.setProperty('--btn-radius', btnRadiusMap[theme.estiloBotoes] || '0.75rem');
    root.style.setProperty('--card-radius', cardRadiusMap[theme.arredondamentoCards] || '1rem');
  }, [theme]);

  return (
    <html lang="pt" className="scroll-smooth">
      <body className="font-sans bg-white text-gray-900 min-h-screen flex flex-col">
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}

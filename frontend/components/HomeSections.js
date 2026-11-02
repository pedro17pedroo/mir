'use client';

import useSiteStore from '../store/useSiteStore';
import SobreOPastor from './SobreOPastor';
import Servicos from './Servicos';
import Mensagem from './Mensagem';
import Testemunhos from './Testemunhos';
import Eventos from './Eventos';

const DEFAULT_ORDER = ['pastor', 'servicos', 'mensagem', 'testemunhos', 'eventos'];

export default function HomeSections() {
  const theme = useSiteStore((state) => state.theme);

  const ordem =
    Array.isArray(theme?.homeOrdemSecoes) && theme.homeOrdemSecoes.length > 0
      ? theme.homeOrdemSecoes
      : DEFAULT_ORDER;

  // Garante que nenhuma secção fique perdida caso tenha sido adicionada depois
  const fullOrder = [
    ...ordem,
    ...DEFAULT_ORDER.filter((key) => !ordem.includes(key)),
  ];

  const isSectionVisible = (key) => {
    switch (key) {
      case 'pastor':
        return theme?.homeSecaoPastorAtivo !== false;
      case 'servicos':
        return theme?.homeSecaoServicosAtivo !== false;
      case 'mensagem':
        return theme?.homeSecaoMensagemAtivo !== false;
      case 'testemunhos':
        return theme?.homeSecaoTestemunhosAtivo !== false;
      case 'eventos':
        return theme?.homeSecaoEventosAtivo !== false;
      default:
        return true;
    }
  };

  const renderSection = (key) => {
    if (!isSectionVisible(key)) return null;
    switch (key) {
      case 'pastor':
        return <SobreOPastor key="pastor" />;
      case 'servicos':
        return <Servicos key="servicos" />;
      case 'mensagem':
        return <Mensagem key="mensagem" />;
      case 'testemunhos':
        return <Testemunhos key="testemunhos" />;
      case 'eventos':
        return <Eventos key="eventos" />;
      default:
        return null;
    }
  };

  return <>{fullOrder.map((key) => renderSection(key))}</>;
}


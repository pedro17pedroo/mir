'use client';

import { useEffect, useState } from 'react';
import api from '../lib/api';
import useSiteStore from '../store/useSiteStore';

export default function Mensagem() {
  const [mensagem, setMensagem] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useSiteStore((state) => state.theme);

  useEffect(() => {
    const fetchMensagem = async () => {
      try {
        const response = await api.get('/mensagens');
        const mensagens = response.data || [];
        const mensagemAtiva = mensagens.find((m) => m.status === 'ativo');
        setMensagem(mensagemAtiva);
      } catch (error) {
        console.error('Erro ao carregar mensagem:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMensagem();
  }, []);

  if (loading || !mensagem) return null;

  // Extrai o texto e a referência do conteúdo
  const conteudoParts = mensagem.conteudo?.split(' - ') || [];
  const texto = mensagem.resumo || conteudoParts[0] || '';
  const referencia = conteudoParts[1] || '';

  // Procura a secção imediatamente seguinte na ordem da Home para harmonização perfeita
  const ordem =
    Array.isArray(theme?.homeOrdemSecoes) && theme.homeOrdemSecoes.length > 0
      ? theme.homeOrdemSecoes
      : ['pastor', 'servicos', 'mensagem', 'testemunhos', 'eventos'];
  const idxMensagem = ordem.indexOf('mensagem');
  const proximaSecao = idxMensagem >= 0 && idxMensagem < ordem.length - 1 ? ordem[idxMensagem + 1] : null;

  let corPadraoProxima = '#ffffff';
  if (proximaSecao === 'testemunhos') {
    corPadraoProxima = theme?.homeSecaoTestemunhosCorFundo || '#faf5ff';
  } else if (proximaSecao === 'servicos') {
    corPadraoProxima = theme?.homeSecaoServicosCorFundo || '#ffffff';
  } else if (proximaSecao === 'eventos') {
    corPadraoProxima = theme?.homeSecaoEventosCorFundo || '#f9fafb';
  } else if (proximaSecao === 'pastor') {
    corPadraoProxima = theme?.boasVindasCorFundo || '#f9fafb';
  }

  // Cor da curva: prioridade para a cor definida na mensagem, depois no tema, depois a cor da próxima secção
  const corCurvaEfetiva =
    mensagem.corCurvaFundo ||
    theme?.homeSecaoMensagemCurvaCor ||
    corPadraoProxima;

  const gradInicio = mensagem.corGradienteInicio || theme?.homeSecaoMensagemGradInicio || '#a855f7';
  const gradFim = mensagem.corGradienteFim || theme?.homeSecaoMensagemGradFim || '#ec4899';
  const corTexto = mensagem.corTexto || theme?.homeSecaoMensagemCorTexto || '#ffffff';
  const mostrarCurva =
    mensagem.mostrarCurva !== false &&
    theme?.homeSecaoMensagemMostrarCurva !== false &&
    mensagem.estiloCurva !== 'nenhuma';

  return (
    <section className="relative min-h-[400px] md:min-h-[450px] flex items-center overflow-hidden">
      {/* Background com gradiente personalizável e/ou imagem */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, ${gradInicio} 0%, ${gradFim} 100%)`,
        }}
      >
        {mensagem.imagem && (
          <img
            src={mensagem.imagem}
            alt={mensagem.titulo || 'Palavra Pastoral'}
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-45"
          />
        )}
        {/* Silhuetas decorativas sutis */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 300px 400px at 20% 50%, rgba(0,0,0,0.15) 0%, transparent 50%),
              radial-gradient(ellipse 250px 350px at 25% 60%, rgba(0,0,0,0.12) 0%, transparent 50%),
              radial-gradient(ellipse 280px 380px at 75% 55%, rgba(0,0,0,0.15) 0%, transparent 50%),
              radial-gradient(ellipse 230px 330px at 80% 65%, rgba(0,0,0,0.12) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Forma ondulada no fundo com cor ajustável / perfeitamente sincronizada */}
      {mostrarCurva && (
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          <svg
            viewBox="0 0 1440 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            preserveAspectRatio="none"
            style={{ height: '100px' }}
          >
            <path
              d="M0,160 C320,100 420,100 720,140 C1020,180 1120,180 1440,140 L1440,200 L0,200 Z"
              fill={corCurvaEfetiva}
            />
          </svg>
        </div>
      )}

      {/* Conteúdo com cor de texto e aspas personalizáveis */}
      <div className="relative z-20 w-full px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="max-w-6xl mx-auto flex items-center gap-4 md:gap-8">
          {/* Ícone de aspas */}
          <div className="flex-shrink-0">
            <svg
              className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32"
              fill="currentColor"
              viewBox="0 0 24 24"
              style={{ color: corTexto, opacity: 0.85 }}
            >
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
            </svg>
          </div>

          {/* Texto da mensagem */}
          <div className="flex-1">
            <blockquote style={{ color: corTexto }}>
              <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight mb-3 md:mb-4">
                {texto}
              </p>
              {referencia && (
                <cite
                  className="block text-base md:text-lg lg:text-xl xl:text-2xl font-medium tracking-wide mb-4 not-italic"
                  style={{ opacity: 0.95 }}
                >
                  {referencia}
                </cite>
              )}
              <a
                href="/devocional"
                className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-sm font-semibold transition-all backdrop-blur-sm"
                style={{ color: corTexto }}
              >
                Ler Devocionais e Palavra Pastoral →
              </a>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

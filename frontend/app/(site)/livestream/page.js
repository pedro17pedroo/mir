'use client';

import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import useSiteStore from '@/store/useSiteStore';
import { livestreams } from '@/lib/api';
import {
  FaCircle,
  FaPrayingHands,
  FaHandHoldingHeart,
  FaUserPlus,
  FaPlay,
  FaCalendarAlt,
  FaUserTie,
  FaWhatsapp,
  FaBookOpen,
  FaDownload,
  FaCopy,
  FaCheck,
  FaInfoCircle,
  FaExpand,
  FaCompress,
  FaClock
} from 'react-icons/fa';

export default function LivestreamPage() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [streamAtiva, setStreamAtiva] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('acoes'); // 'acoes' | 'notas' | 'detalhes'
  const [cinemaMode, setCinemaMode] = useState(false);
  const [anotacoes, setAnotacoes] = useState('');
  const [notasCopiadas, setNotasCopiadas] = useState(false);
  const theme = useSiteStore((state) => state.theme);

  useEffect(() => {
    livestreams
      .getAll()
      .then((res) => {
        const all = (res.data || []).filter((s) => s.ativa !== false);
        setStreams(all);
        const live = all.find((s) => s.aoVivo) || all[0] || null;
        setStreamAtiva(live);
      })
      .catch((err) => console.error('Erro ao carregar transmissões:', err))
      .finally(() => setLoading(false));

    // Carrega anotações do localStorage se existirem
    try {
      const salvas = localStorage.getItem('mir_culto_anotacoes');
      if (salvas) setAnotacoes(salvas);
    } catch (e) {
      // Ignora falhas de localStorage
    }
  }, []);

  const handleSalvarNotas = (texto) => {
    setAnotacoes(texto);
    try {
      localStorage.setItem('mir_culto_anotacoes', texto);
    } catch (e) {
      // Ignora erro
    }
  };

  const handleInserirCarimbo = () => {
    const agora = new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' });
    const novoTexto = anotacoes ? `${anotacoes}\n[${agora}] ` : `[${agora}] `;
    handleSalvarNotas(novoTexto);
  };

  const handleCopiarNotas = async () => {
    try {
      await navigator.clipboard.writeText(anotacoes);
      setNotasCopiadas(true);
      setTimeout(() => setNotasCopiadas(false), 2500);
    } catch (err) {
      console.error('Erro ao copiar anotações:', err);
    }
  };

  const handleDownloadNotas = () => {
    if (!anotacoes.trim()) return;
    const blob = new Blob([anotacoes], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anotacoes-culto-mir-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePartilharWhatsApp = () => {
    if (!streamAtiva) return;
    const texto = `🔴 Estou a acompanhar o culto ao vivo da Igreja MIR: "${streamAtiva.titulo}"!\nAssista connosco e seja edificado: ${typeof window !== 'undefined' ? window.location.href : ''}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, '_blank');
  };

  const filtrados = filtro ? streams.filter((s) => s.plataforma === filtro) : streams;

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        cinemaMode ? 'bg-black text-white' : ''
      }`}
      style={{ backgroundColor: cinemaMode ? '#0a0a0f' : theme?.corFundoPaginas || '#f9fafb' }}
    >
      <Navbar />

      {!cinemaMode && (
        <PageHero
          title="Cultos e Transmissões ao Vivo"
          subtitle="Acompanhe as nossas celebrações em direto de qualquer lugar do mundo e edifique a sua fé"
        />
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Barra de Controlo do Modo Cinema */}
        {streamAtiva && (
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              <span className={cinemaMode ? 'text-gray-300' : 'text-gray-700'}>
                Transmissão em Alta Definição
              </span>
            </div>
            <button
              type="button"
              onClick={() => setCinemaMode(!cinemaMode)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                cinemaMode
                  ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm'
              }`}
            >
              {cinemaMode ? <FaCompress /> : <FaExpand />}
              {cinemaMode ? 'Sair do Modo Cinema' : 'Modo Cinema Expandido'}
            </button>
          </div>
        )}

        {/* Player Principal em Modo Cinema com Abas Interativas */}
        {streamAtiva ? (
          <section
            className={`rounded-3xl overflow-hidden shadow-2xl border transition-all ${
              cinemaMode
                ? 'bg-gray-950 border-gray-800 ring-2 ring-purple-900/40'
                : 'bg-gray-900 border-gray-800 text-white'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3">
              {/* Vídeo 16:9 */}
              <div
                className={`lg:col-span-2 bg-black relative aspect-video flex items-center justify-center ${
                  cinemaMode ? 'min-h-[380px] md:min-h-[520px]' : 'min-h-[300px] md:min-h-[440px]'
                }`}
              >
                <ReactPlayer
                  url={streamAtiva.urlVideo || streamAtiva.url}
                  controls
                  playing={Boolean(streamAtiva.aoVivo)}
                  width="100%"
                  height="100%"
                />
              </div>

              {/* Painel Lateral com Abas Interativas */}
              <div className="flex flex-col bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-t lg:border-t-0 lg:border-l border-gray-800 text-white min-h-[440px]">
                {/* Cabeçalho do Painel: Título e Status */}
                <div className="p-5 border-b border-gray-800/80">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {streamAtiva.aoVivo ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-red-600 text-white shadow-sm">
                        <FaCircle className="text-[7px] animate-ping" />
                        Ao Vivo Agora
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase bg-purple-900/60 text-purple-200 border border-purple-700/40">
                        Culto em Destaque
                      </span>
                    )}
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">
                      {streamAtiva.plataforma || 'YouTube'}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-white line-clamp-2 leading-snug">
                    {streamAtiva.titulo}
                  </h2>

                  {streamAtiva.pregador && (
                    <p className="text-xs text-purple-300 font-semibold flex items-center gap-1.5 mt-1">
                      <FaUserTie className="text-amber-400" /> {streamAtiva.pregador}
                    </p>
                  )}
                </div>

                {/* Seleção de Abas do Culto */}
                <div className="flex border-b border-gray-800 bg-gray-950/60 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setAbaAtiva('acoes')}
                    className={`flex-1 py-3 text-center transition border-b-2 ${
                      abaAtiva === 'acoes'
                        ? 'border-purple-500 text-purple-300 bg-white/5'
                        : 'border-transparent text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    ✨ Ações
                  </button>
                  <button
                    type="button"
                    onClick={() => setAbaAtiva('notas')}
                    className={`flex-1 py-3 text-center transition border-b-2 flex items-center justify-center gap-1.5 ${
                      abaAtiva === 'notas'
                        ? 'border-purple-500 text-purple-300 bg-white/5'
                        : 'border-transparent text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <FaBookOpen className="text-[11px]" /> Caderno Bíblico
                  </button>
                  <button
                    type="button"
                    onClick={() => setAbaAtiva('detalhes')}
                    className={`flex-1 py-3 text-center transition border-b-2 ${
                      abaAtiva === 'detalhes'
                        ? 'border-purple-500 text-purple-300 bg-white/5'
                        : 'border-transparent text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    ℹ️ Detalhes
                  </button>
                </div>

                {/* Conteúdo Dinâmico das Abas */}
                <div className="p-5 flex-1 flex flex-col justify-between overflow-y-auto">
                  {abaAtiva === 'acoes' && (
                    <div className="space-y-3.5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Participe e Conecte-se:
                      </p>

                      <Link
                        href="/oracao"
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition shadow-md"
                      >
                        <FaPrayingHands /> Enviar Pedido de Oração
                      </Link>

                      <div className="grid grid-cols-2 gap-2.5">
                        <Link
                          href="/donate"
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold text-xs transition shadow-md"
                        >
                          <FaHandHoldingHeart /> Dízimos & Ofertas
                        </Link>
                        <Link
                          href="/sou-novo"
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition border border-white/10"
                        >
                          <FaUserPlus /> Sou Novo / Decisão
                        </Link>
                      </div>

                      <button
                        type="button"
                        onClick={handlePartilharWhatsApp}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-md"
                      >
                        <FaWhatsapp className="text-sm" /> Partilhar no WhatsApp
                      </button>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-gray-300 space-y-1">
                        <p className="font-semibold text-amber-300 flex items-center gap-1">
                          <FaClock /> Horários das Celebrações:
                        </p>
                        <p>Domingos às 09:00 e 17:00 • Quartas-feiras às 18:30</p>
                      </div>
                    </div>
                  )}

                  {abaAtiva === 'notas' && (
                    <div className="space-y-3 flex flex-col h-full">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-300 flex items-center gap-1">
                          <FaBookOpen /> Anotações do Sermão
                        </span>
                        <button
                          type="button"
                          onClick={handleInserirCarimbo}
                          className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md text-gray-200 transition"
                        >
                          + Hora Atual
                        </button>
                      </div>

                      <textarea
                        value={anotacoes}
                        onChange={(e) => handleSalvarNotas(e.target.value)}
                        placeholder="Escreva versículos, palavras-chave e reflexões do culto... (salvo automaticamente)"
                        className="w-full flex-1 min-h-[140px] p-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono leading-relaxed resize-none"
                      />

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleCopiarNotas}
                          disabled={!anotacoes.trim()}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white text-xs font-medium transition"
                        >
                          {notasCopiadas ? (
                            <>
                              <FaCheck className="text-emerald-400" /> Copiado!
                            </>
                          ) : (
                            <>
                              <FaCopy /> Copiar
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleDownloadNotas}
                          disabled={!anotacoes.trim()}
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-bold transition"
                          title="Descarregar ficheiro .txt"
                        >
                          <FaDownload /> Descarregar .txt
                        </button>
                      </div>
                    </div>
                  )}

                  {abaAtiva === 'detalhes' && (
                    <div className="space-y-3 text-xs text-gray-300">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">
                          Tema da Mensagem
                        </span>
                        <p className="font-bold text-white text-sm">{streamAtiva.titulo}</p>
                      </div>

                      {streamAtiva.pregador && (
                        <div>
                          <span className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">
                            Ministrador / Pregador
                          </span>
                          <p className="text-purple-300 font-semibold">{streamAtiva.pregador}</p>
                        </div>
                      )}

                      {streamAtiva.descricao && (
                        <div>
                          <span className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">
                            Sinopse / Palavra
                          </span>
                          <p className="leading-relaxed text-gray-300 max-h-40 overflow-y-auto pr-1">
                            {streamAtiva.descricao}
                          </p>
                        </div>
                      )}

                      <div className="pt-2 border-t border-gray-800 text-[11px] text-gray-400">
                        <p>📍 Igreja MIR — Ministério Internacional da Restauração</p>
                        <p>Luanda, Angola</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : (
          !loading && (
            <div className="bg-white rounded-2xl shadow p-12 text-center text-gray-500">
              Nenhuma transmissão disponível no momento.
            </div>
          )
        )}

        {/* Arquivo de Transmissões e Cultos Anteriores */}
        {streams.length > 0 && (
          <section>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h3
                  className={`text-2xl font-bold ${
                    cinemaMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Todas as Transmissões
                </h3>
                <p className={`text-sm ${cinemaMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Selecione um culto abaixo para assistir no player principal
                </p>
              </div>
              <select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className={`border px-4 py-2 rounded-xl text-sm font-medium shadow-sm ${
                  cinemaMode
                    ? 'bg-gray-900 text-white border-gray-800'
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
              >
                <option value="">Todas as Plataformas</option>
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtrados.map((s, i) => {
                const isSelected = streamAtiva?._id === s._id;
                return (
                  <div
                    key={s._id || i}
                    onClick={() => {
                      setStreamAtiva(s);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className={`cursor-pointer rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border-2 flex flex-col justify-between ${
                      cinemaMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-transparent'
                    } ${
                      isSelected
                        ? 'border-purple-600 ring-2 ring-purple-400/50'
                        : ''
                    }`}
                  >
                    <div>
                      <div className="relative h-48 bg-gray-900 flex items-center justify-center overflow-hidden">
                        {s.thumbnail ? (
                          <img
                            src={s.thumbnail}
                            alt={s.titulo}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 flex items-center justify-center">
                            <FaPlay className="text-4xl text-white/80" />
                          </div>
                        )}
                        {s.aoVivo && (
                          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase bg-red-600 text-white shadow">
                            <FaCircle className="text-[7px] animate-ping" /> AO VIVO
                          </span>
                        )}
                        <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md text-xs font-semibold uppercase bg-black/70 text-white">
                          {s.plataforma || 'youtube'}
                        </span>
                      </div>

                      <div className="p-5">
                        <h4
                          className={`font-bold text-lg mb-1 line-clamp-2 ${
                            cinemaMode ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {s.titulo}
                        </h4>
                        {s.pregador && (
                          <p className="text-xs font-semibold text-purple-400 mb-2">
                            {s.pregador}
                          </p>
                        )}
                        {s.descricao && (
                          <p
                            className={`text-sm line-clamp-2 mb-3 ${
                              cinemaMode ? 'text-gray-400' : 'text-gray-600'
                            }`}
                          >
                            {s.descricao}
                          </p>
                        )}
                      </div>
                    </div>

                    <div
                      className={`px-5 py-3 border-t flex items-center justify-between text-xs ${
                        cinemaMode
                          ? 'bg-gray-950/70 border-gray-800 text-gray-400'
                          : 'bg-gray-50 border-gray-100 text-gray-500'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <FaCalendarAlt />
                        {s.data ? new Date(s.data).toLocaleDateString('pt-AO') : 'Recente'}
                      </span>
                      <span className="font-bold text-purple-500">
                        {isSelected ? 'A Reproduzir' : 'Assistir →'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

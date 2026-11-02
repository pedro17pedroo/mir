'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaShare,
  FaFacebook,
  FaWhatsapp,
  FaEnvelope,
  FaUsers,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes
} from 'react-icons/fa';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MapDisplay from '@/components/MapDisplay';
import useSiteStore from '@/store/useSiteStore';
import { eventos as eventosApi } from '@/lib/api';

export default function EventoDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [sucessoInscricao, setSucessoInscricao] = useState('');
  const [erroInscricao, setErroInscricao] = useState('');
  const [formInscricao, setFormInscricao] = useState({
    nome: '',
    telefone: '',
    email: '',
    acompanhantes: 0,
    observacoes: ''
  });

  const theme = useSiteStore((state) => state.theme);
  const loadTheme = useSiteStore((state) => state.loadTheme);

  useEffect(() => {
    if (!theme || !theme.corPrimaria) {
      loadTheme();
    }
    if (params.slug) {
      loadEvento();
    }
  }, [params.slug]);

  const loadEvento = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/eventos/slug/${params.slug}`
      );
      if (response.ok) {
        const data = await response.json();
        setEvento(data);
      } else {
        router.push('/eventos');
      }
    } catch (error) {
      console.error('Erro ao carregar evento:', error);
      router.push('/eventos');
    } finally {
      setLoading(false);
    }
  };

  const handleInscrever = async (e) => {
    e.preventDefault();
    if (!evento?._id) return;
    setEnviando(true);
    setSucessoInscricao('');
    setErroInscricao('');
    try {
      const res = await eventosApi.inscrever(evento._id, formInscricao);
      setEvento(res.data.evento);
      setSucessoInscricao(res.data.message || 'Inscrição realizada com sucesso!');
      setFormInscricao({
        nome: '',
        telefone: '',
        email: '',
        acompanhantes: 0,
        observacoes: ''
      });
    } catch (err) {
      setErroInscricao(err.response?.data?.message || err.message || 'Erro ao realizar inscrição no evento.');
    } finally {
      setEnviando(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('pt-AO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isEventoPast = (dataFim, dataInicio) => {
    const ref = dataFim || dataInicio;
    return ref ? new Date(ref) < new Date() : false;
  };

  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const url = window.location.href;
    const text = `Confira este evento: ${evento.titulo}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  };

  const shareByEmail = () => {
    const subject = `Evento: ${evento.titulo}`;
    const body = `Olá! Gostaria de compartilhar este evento com você:\n\n${evento.titulo}\n${window.location.href}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!evento) {
    return null;
  }

  const isPast = isEventoPast(evento.dataFim, evento.dataInicio);
  const totalInscritos = (evento.inscritos || []).reduce(
    (acc, item) => acc + 1 + (item.acompanhantes || 0),
    0
  );
  const vagasRestantes =
    evento.capacidade > 0 ? Math.max(0, evento.capacidade - totalInscritos) : null;
  const esgotado = vagasRestantes !== null && vagasRestantes <= 0;

  return (
    <>
      <Navbar />
      {/* Hero com Imagem */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        {evento.imagem ? (
          <>
            <img
              src={evento.imagem}
              alt={evento.titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </>
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(to right, ${theme?.heroPaginasGradienteInicio || '#9333ea'}, ${theme?.heroPaginasGradienteFim || '#ec4899'})`
            }}
          />
        )}

        {/* Botão Voltar */}
        <Link
          href="/eventos"
          className="absolute top-6 left-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer"
          style={{ zIndex: 100 }}
        >
          <FaArrowLeft />
          Voltar
        </Link>

        {/* Badge de Status */}
        {isPast && (
          <div
            className="absolute top-6 right-6 bg-gray-600 text-white px-4 py-2 rounded-full font-bold"
            style={{ zIndex: 100 }}
          >
            Evento Realizado
          </div>
        )}
        {evento.destaque && !isPast && (
          <div
            className="absolute top-6 right-6 bg-yellow-500 text-white px-4 py-2 rounded-full font-bold"
            style={{ zIndex: 100 }}
          >
            Destaque
          </div>
        )}

        {/* Título e Data */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {evento.titulo}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white text-lg">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <FaCalendar />
                <span>{formatDate(evento.dataInicio)}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <FaClock />
                <span>{evento.horarioInicio || formatTime(evento.dataInicio)}</span>
              </div>
              {evento.local && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <FaMapMarkerAlt />
                  <span>{evento.local}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2">
            {/* Descrição */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre o Evento</h2>
              <div
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: evento.descricao }}
              />
            </div>

            {/* Localização no Mapa */}
            {evento.localizacao?.latitude && evento.localizacao?.longitude && (
              <div
                className="bg-white rounded-xl shadow-lg p-8 mb-8 relative"
                style={{ zIndex: 1 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-purple-600" />
                  Como Chegar
                </h2>
                <MapDisplay
                  latitude={evento.localizacao.latitude}
                  longitude={evento.localizacao.longitude}
                  endereco={evento.localizacao.endereco}
                  local={evento.local}
                />
              </div>
            )}

            {/* Compartilhar */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaShare />
                Compartilhar Evento
              </h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={shareOnFacebook}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <FaFacebook className="text-xl" />
                  Facebook
                </button>
                <button
                  onClick={shareOnWhatsApp}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <FaWhatsapp className="text-xl" />
                  WhatsApp
                </button>
                <button
                  onClick={shareByEmail}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <FaEnvelope className="text-xl" />
                  E-mail
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Card de Informações */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg p-8 text-white sticky top-6">
              <h3 className="text-2xl font-bold mb-6">Informações</h3>

              <div className="space-y-6">
                {/* Data */}
                <div>
                  <div className="text-sm opacity-90 mb-1">Data</div>
                  <div className="font-bold text-lg">
                    {formatDate(evento.dataInicio)}
                    {evento.dataFim && evento.dataInicio !== evento.dataFim && (
                      <div className="text-sm font-normal opacity-90 mt-1">
                        até {formatDate(evento.dataFim)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Horário */}
                <div>
                  <div className="text-sm opacity-90 mb-1">Horário</div>
                  <div className="font-bold text-lg">
                    {evento.horarioInicio || formatTime(evento.dataInicio)}
                    {evento.horarioFim ? ` às ${evento.horarioFim}` : ''}
                  </div>
                </div>

                {/* Local */}
                {evento.local && (
                  <div>
                    <div className="text-sm opacity-90 mb-1">Local</div>
                    <div className="font-bold text-lg">{evento.local}</div>
                  </div>
                )}

                {/* Organizador */}
                {evento.organizador && (
                  <div>
                    <div className="text-sm opacity-90 mb-1">Organizador</div>
                    <div className="font-bold text-lg">{evento.organizador}</div>
                  </div>
                )}

                {/* Taxa / Entrada */}
                <div>
                  <div className="text-sm opacity-90 mb-1">Entrada</div>
                  <div className="font-bold text-lg">
                    {evento.preco > 0
                      ? `${Number(evento.preco).toLocaleString('pt-AO')} Kz`
                      : 'Entrada Franca / Gratuita'}
                  </div>
                </div>

                {/* Vagas */}
                {vagasRestantes !== null && (
                  <div className="bg-white/15 rounded-lg p-3 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <FaUsers /> Vagas restantes:
                    </span>
                    <span className="font-extrabold">{vagasRestantes}</span>
                  </div>
                )}

                {/* Botão de Ação */}
                {!isPast && evento.inscricaoAberta !== false && (
                  <div className="pt-4 border-t border-white/20">
                    <button
                      onClick={() => {
                        setSucessoInscricao('');
                        setModalAberto(true);
                      }}
                      disabled={esgotado}
                      className="block w-full bg-white text-purple-600 hover:bg-gray-100 font-bold py-4 px-6 rounded-lg text-center transition-colors disabled:opacity-50"
                    >
                      {esgotado ? 'Vagas Esgotadas' : 'Quero Participar (Inscrição)'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Inscrição */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setModalAberto(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="w-5 h-5" />
            </button>

            {sucessoInscricao ? (
              <div className="text-center py-6">
                <FaCheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Presença Confirmada!
                </h3>
                <p className="text-sm text-gray-600 mb-6">{sucessoInscricao}</p>
                <button
                  onClick={() => setModalAberto(false)}
                  className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-semibold text-sm"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Inscrição: {evento.titulo}
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Confirme a sua participação neste evento da Igreja MIR.
                </p>

                {erroInscricao && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-800 text-xs animate-fade-in">
                    <FaExclamationCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>{erroInscricao}</span>
                  </div>
                )}

                <form onSubmit={handleInscrever} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formInscricao.nome}
                      onChange={(e) =>
                        setFormInscricao({ ...formInscricao, nome: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Telefone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formInscricao.telefone}
                        onChange={(e) =>
                          setFormInscricao({ ...formInscricao, telefone: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="+244 923 000 000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Nº de Acompanhantes
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={formInscricao.acompanhantes}
                        onChange={(e) =>
                          setFormInscricao({
                            ...formInscricao,
                            acompanhantes: Number(e.target.value)
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      E-mail (opcional)
                    </label>
                    <input
                      type="email"
                      value={formInscricao.email}
                      onChange={(e) =>
                        setFormInscricao({ ...formInscricao, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Observações (opcional)
                    </label>
                    <textarea
                      rows={2}
                      value={formInscricao.observacoes}
                      onChange={(e) =>
                        setFormInscricao({ ...formInscricao, observacoes: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={enviando}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-50"
                  >
                    {enviando ? 'Confirmando...' : 'Confirmar Inscrição'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

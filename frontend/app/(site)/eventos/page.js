'use client';

import { useEffect, useState } from 'react';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaArrowRight, FaStar } from 'react-icons/fa';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import useSiteStore from '@/store/useSiteStore';

export default function EventosPage() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useSiteStore(state => state.theme);
  const loadTheme = useSiteStore(state => state.loadTheme);

  useEffect(() => {
    if (!theme || !theme.corPrimaria) {
      loadTheme();
    }
    loadEventos();
  }, []);

  const loadEventos = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/eventos`);
      if (!response.ok) {
        throw new Error('Erro ao carregar eventos');
      }
      const data = await response.json();
      setEventos(data);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      setEventos([]);
    } finally {
      setLoading(false);
    }
  };

  // Configurações do hero do tema (Páginas Internas)
  const heroConfig = {
    gradienteInicio: theme?.heroPaginasGradienteInicio || '#9333ea',
    gradienteFim: theme?.heroPaginasGradienteFim || '#ec4899',
    gradienteDirecao: theme?.heroPaginasGradienteDirecao || 'to right',
    textoTitulo: theme?.heroPaginasTextoTitulo || '#ffffff',
    textoSubtitulo: theme?.heroPaginasTextoSubtitulo || '#f3f4f6',
    curvaEstilo: theme?.heroPaginasCurvaEstilo || 'wave',
    curvaCor: theme?.heroPaginasCurvaCor || '#ffffff',
    altura: theme?.heroPaginasAltura || 'medium',
    overlay: theme?.heroPaginasOverlay || 'gradient'
  };

  const alturaMap = {
    small: 'py-12',
    medium: 'py-20',
    large: 'py-28',
    xlarge: 'py-36'
  };

  const curvasPaths = {
    wave: 'M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
    curve: 'M0,160L1440,96L1440,320L0,320Z',
    triangle: 'M0,320L720,96L1440,320Z',
    tilt: 'M0,224L1440,96L1440,320L0,320Z',
    none: ''
  };

  const getOverlayStyle = () => {
    switch (heroConfig.overlay) {
      case 'gradient':
        return 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.1))';
      case 'dark':
        return 'rgba(0,0,0,0.4)';
      case 'light':
        return 'rgba(255,255,255,0.2)';
      default:
        return 'none';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isEventoPast = (evento) => {
    const dataRef = evento.dataFim || evento.dataInicio;
    if (!dataRef) return false;
    return new Date(dataRef) < new Date();
  };

  const eventosDestaque = eventos.filter(e => e.destaque && !isEventoPast(e));
  const eventosFuturos = eventos.filter(e => !isEventoPast(e) && !e.destaque);
  const eventosPassados = eventos.filter(e => isEventoPast(e));

  return (
    <>
      <Navbar />
      <PageHero
        title="Eventos"
        subtitle="Participe dos nossos eventos e experimente momentos especiais com Deus"
      />

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            {/* Eventos em Destaque */}
            {eventosDestaque.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <FaStar className="text-3xl text-yellow-500" />
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Eventos em Destaque
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {eventosDestaque.map((evento) => (
                    <Link 
                      key={evento._id} 
                      href={`/eventos/${evento.slug}`}
                      className="group"
                    >
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                        {evento.imagem && (
                          <div className="relative h-64 overflow-hidden">
                            <img 
                              src={evento.imagem} 
                              alt={evento.titulo}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
                              <FaStar />
                              Destaque
                            </div>
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                            {evento.titulo}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {evento.descricao}
                          </p>
                          <div className="space-y-2 text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-2">
                              <FaCalendar className="text-purple-600" />
                              <span>{formatDate(evento.dataInicio)}</span>
                              {evento.dataFim && evento.dataInicio !== evento.dataFim && (
                                <span>até {formatDate(evento.dataFim)}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <FaClock className="text-purple-600" />
                              <span>{formatTime(evento.dataInicio)}</span>
                            </div>
                            {evento.local && (
                              <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-purple-600" />
                                <span>{evento.local}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center text-purple-600 font-semibold group-hover:gap-3 transition-all">
                            Ver detalhes
                            <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Próximos Eventos */}
            {eventosFuturos.length > 0 && (
              <section className="mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                  Próximos Eventos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {eventosFuturos.map((evento) => (
                    <Link 
                      key={evento._id} 
                      href={`/eventos/${evento.slug}`}
                      className="group"
                    >
                      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        {evento.imagem && (
                          <div className="relative h-48 overflow-hidden">
                            <img 
                              src={evento.imagem} 
                              alt={evento.titulo}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-5">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                            {evento.titulo}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {evento.descricao}
                          </p>
                          <div className="space-y-1 text-xs text-gray-500 mb-3">
                            <div className="flex items-center gap-2">
                              <FaCalendar className="text-purple-600" />
                              <span>{formatDate(evento.dataInicio)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaClock className="text-purple-600" />
                              <span>{formatTime(evento.dataInicio)}</span>
                            </div>
                          </div>
                          <div className="flex items-center text-purple-600 text-sm font-semibold">
                            Ver mais
                            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Eventos Passados */}
            {eventosPassados.length > 0 && (
              <section>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                  Eventos Realizados
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {eventosPassados.map((evento) => (
                    <Link 
                      key={evento._id} 
                      href={`/eventos/${evento.slug}`}
                      className="group"
                    >
                      <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-all duration-300 opacity-75 hover:opacity-100">
                        {evento.imagem && (
                          <div className="relative h-32 overflow-hidden">
                            <img 
                              src={evento.imagem} 
                              alt={evento.titulo}
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="text-sm font-bold text-gray-700 mb-1 line-clamp-2">
                            {evento.titulo}
                          </h3>
                          <div className="text-xs text-gray-500">
                            {formatDate(evento.dataInicio)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Nenhum evento */}
            {eventos.length === 0 && (
              <div className="text-center py-20">
                <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-700 mb-2">
                  Nenhum evento disponível
                </h3>
                <p className="text-gray-500">
                  Fique atento! Em breve teremos novos eventos.
                </p>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

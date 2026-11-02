'use client';

import { useEffect, useState } from 'react';
import { FaPlay, FaPause, FaHeadphones, FaFilter } from 'react-icons/fa';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import useSiteStore from '@/store/useSiteStore';

export default function AudiosPage() {
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [audioAtual, setAudioAtual] = useState(null);
  const [tocando, setTocando] = useState(false);
  const theme = useSiteStore(state => state.theme);
  const loadTheme = useSiteStore(state => state.loadTheme);

  useEffect(() => {
    if (!theme || !theme.corPrimaria) {
      loadTheme();
    }
    loadAudios();
  }, [categoriaFiltro]);

  const loadAudios = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const url = categoriaFiltro 
        ? `${apiUrl}/audios?categoria=${categoriaFiltro}`
        : `${apiUrl}/audios`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setAudios(data);
      }
    } catch (error) {
      console.error('Erro ao carregar áudios:', error);
    } finally {
      setLoading(false);
    }
  };

  const categorias = [
    { value: '', label: 'Todas' },
    { value: 'pregacao', label: 'Pregações' },
    { value: 'ensino', label: 'Ensinos' },
    { value: 'devocional', label: 'Devocionais' },
    { value: 'podcast', label: 'Podcasts' },
    { value: 'outro', label: 'Outros' }
  ];

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

  const audiosDestaque = audios.filter(a => a.destaque);
  const audiosRegulares = audios.filter(a => !a.destaque);

  return (
    <>
      <Navbar />
      <PageHero
        title="Áudios e Podcasts"
        subtitle="Ouça pregações, ensinos e mensagens edificantes"
      />

      {/* Filtros */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 overflow-x-auto">
            <FaFilter className="text-gray-500 flex-shrink-0" />
            {categorias.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCategoriaFiltro(cat.value)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  categoriaFiltro === cat.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            {/* Áudios em Destaque */}
            {audiosDestaque.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  ⭐ Em Destaque
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {audiosDestaque.map(audio => (
                    <Link
                      key={audio._id}
                      href={`/ensino/audio/${audio.slug}`}
                      className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <FaPlay className="text-white text-2xl ml-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                            {audio.titulo}
                          </h3>
                          {audio.pregador && (
                            <p className="text-gray-600 mt-1">{audio.pregador}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            {audio.duracao && <span>{audio.duracao}</span>}
                            <span className="flex items-center gap-1">
                              <FaHeadphones />
                              {audio.reproducoes} reproduções
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Todos os Áudios */}
            {audiosRegulares.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {audiosDestaque.length > 0 ? 'Mais Áudios' : 'Todos os Áudios'}
                </h2>
                <div className="space-y-4">
                  {audiosRegulares.map(audio => (
                    <Link
                      key={audio._id}
                      href={`/ensino/audio/${audio.slug}`}
                      className="group flex items-center gap-4 bg-white rounded-lg p-4 hover:shadow-md transition-all border border-gray-200"
                    >
                      <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                        <FaPlay className="text-purple-600 text-lg ml-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                          {audio.titulo}
                        </h3>
                        {audio.pregador && (
                          <p className="text-sm text-gray-600 mt-1">{audio.pregador}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {audio.duracao && (
                          <span className="hidden sm:block">{audio.duracao}</span>
                        )}
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                          {audio.categoria}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {audios.length === 0 && !loading && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">Nenhum áudio encontrado</p>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { FaPlay, FaEye, FaFilter } from 'react-icons/fa';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import useSiteStore from '@/store/useSiteStore';

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const theme = useSiteStore(state => state.theme);
  const loadTheme = useSiteStore(state => state.loadTheme);

  useEffect(() => {
    if (!theme || !theme.corPrimaria) {
      loadTheme();
    }
    loadVideos();
  }, [categoriaFiltro]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const url = categoriaFiltro 
        ? `${apiUrl}/videos?categoria=${categoriaFiltro}`
        : `${apiUrl}/videos`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getThumbnail = (video) => {
    if (video.thumbnail) return video.thumbnail;
    if (video.tipoVideo === 'youtube') {
      return `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;
    }
    if (video.tipoVideo === 'vimeo') {
      return '/default-video-thumb.jpg'; // Placeholder
    }
    return '/default-video-thumb.jpg';
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

  const categorias = [
    { value: '', label: 'Todas' },
    { value: 'pregacao', label: 'Pregações' },
    { value: 'ensino', label: 'Ensinos' },
    { value: 'louvor', label: 'Louvor' },
    { value: 'testemunho', label: 'Testemunhos' },
    { value: 'evento', label: 'Eventos' },
    { value: 'outro', label: 'Outros' }
  ];

  const videosDestaque = videos.filter(v => v.destaque);
  const videosRegulares = videos.filter(v => !v.destaque);

  return (
    <>
      <Navbar />
      <PageHero
        title="Vídeos e Pregações"
        subtitle="Assista pregações, ensinos e momentos especiais"
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
            {/* Vídeos em Destaque */}
            {videosDestaque.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  ⭐ Em Destaque
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {videosDestaque.map(video => (
                    <Link
                      key={video._id}
                      href={`/ensino/video/${video.slug}`}
                      className="group"
                    >
                      <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                        <img
                          src={getThumbnail(video)}
                          alt={video.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FaPlay className="text-purple-600 text-2xl ml-1" />
                          </div>
                        </div>
                        {video.duracao && (
                          <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-sm">
                            {video.duracao}
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {video.titulo}
                        </h3>
                        {video.pregador && (
                          <p className="text-gray-600 mt-1">{video.pregador}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaEye />
                            {video.visualizacoes} visualizações
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                            {video.categoria}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Todos os Vídeos */}
            {videosRegulares.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {videosDestaque.length > 0 ? 'Mais Vídeos' : 'Todos os Vídeos'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videosRegulares.map(video => (
                    <Link
                      key={video._id}
                      href={`/ensino/video/${video.slug}`}
                      className="group"
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                        <img
                          src={getThumbnail(video)}
                          alt={video.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FaPlay className="text-purple-600 text-lg ml-1" />
                          </div>
                        </div>
                        {video.duracao && (
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                            {video.duracao}
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                          {video.titulo}
                        </h3>
                        {video.pregador && (
                          <p className="text-sm text-gray-600 mt-1">{video.pregador}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaEye />
                            {video.visualizacoes}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {videos.length === 0 && !loading && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">Nenhum vídeo encontrado</p>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </>
  );
}

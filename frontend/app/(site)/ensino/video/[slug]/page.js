'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaEye, FaCalendar, FaUser, FaTag } from 'react-icons/fa';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function VideoDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const [video, setVideo] = useState(null);
  const [videosRelacionados, setVideosRelacionados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      loadVideo();
    }
  }, [params.slug]);

  const loadVideo = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/videos/slug/${params.slug}`);
      if (response.ok) {
        const data = await response.json();
        setVideo(data);
        loadVideosRelacionados(data.categoria);
      } else {
        router.push('/ensino/video');
      }
    } catch (error) {
      console.error('Erro ao carregar vídeo:', error);
      router.push('/ensino/video');
    } finally {
      setLoading(false);
    }
  };

  const loadVideosRelacionados = async (categoria) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/videos?categoria=${categoria}`);
      if (response.ok) {
        const data = await response.json();
        setVideosRelacionados(data.slice(0, 6));
      }
    } catch (error) {
      console.error('Erro ao carregar vídeos relacionados:', error);
    }
  };

  const getVideoEmbed = () => {
    if (!video) return null;

    if (video.tipoVideo === 'youtube') {
      return (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
          title={video.titulo}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (video.tipoVideo === 'vimeo') {
      return (
        <iframe
          className="w-full h-full"
          src={`https://player.vimeo.com/video/${video.vimeoId}?autoplay=1`}
          title={video.titulo}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (video.tipoVideo === 'upload' && video.videoUrl) {
      return (
        <video
          className="w-full h-full"
          controls
          autoPlay
          src={video.videoUrl}
        >
          Seu navegador não suporta o elemento de vídeo.
        </video>
      );
    }

    return null;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
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

  if (!video) {
    return null;
  }

  return (
    <>
      <Navbar />
      
      {/* Player Section */}
      <div className="bg-black min-h-screen pt-20">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Botão Voltar */}
          <Link 
            href="/ensino/video"
            className="inline-flex items-center gap-2 text-white hover:text-purple-400 transition-colors mb-6"
            style={{ zIndex: 100 }}
          >
            <FaArrowLeft />
            Voltar para Vídeos
          </Link>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Player Principal */}
            <div className="xl:col-span-4">
              <div className="bg-black rounded-lg overflow-hidden shadow-2xl mb-6" style={{ minHeight: '80vh', height: '80vh' }}>
                {getVideoEmbed()}
              </div>

              {/* Informações do Vídeo */}
              <div className="bg-gray-900 rounded-lg p-6 text-white">
                <h1 className="text-2xl md:text-3xl font-bold mb-4">
                  {video.titulo}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-4 text-sm">
                  <span className="flex items-center gap-2">
                    <FaEye />
                    {video.visualizacoes} visualizações
                  </span>
                  <span className="flex items-center gap-2">
                    <FaCalendar />
                    {formatDate(video.dataPublicacao)}
                  </span>
                  {video.pregador && (
                    <span className="flex items-center gap-2">
                      <FaUser />
                      {video.pregador}
                    </span>
                  )}
                </div>

                {video.tags && video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {video.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm flex items-center gap-1"
                      >
                        <FaTag className="text-xs" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {video.descricao && (
                  <div className="border-t border-gray-700 pt-4">
                    <h2 className="text-lg font-bold mb-3">Sobre este vídeo</h2>
                    <div 
                      className="prose prose-invert max-w-none text-gray-300"
                      dangerouslySetInnerHTML={{ __html: video.descricao }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Vídeos Relacionados */}
            <div className="xl:col-span-1">
              <div className="bg-gray-900 rounded-lg p-4 sticky top-24">
                <h2 className="text-lg font-bold text-white mb-4">Relacionados</h2>
                <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {videosRelacionados
                    .filter(v => v._id !== video._id)
                    .slice(0, 10)
                    .map(videoRel => (
                      <Link
                        key={videoRel._id}
                        href={`/ensino/video/${videoRel.slug}`}
                        className="block group hover:bg-gray-800 p-2 rounded-lg transition-colors"
                      >
                        <div className="relative w-full aspect-video rounded overflow-hidden mb-2">
                          <img
                            src={videoRel.thumbnail || (videoRel.tipoVideo === 'youtube' 
                              ? `https://img.youtube.com/vi/${videoRel.youtubeId}/mqdefault.jpg`
                              : '/default-video-thumb.jpg')}
                            alt={videoRel.titulo}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          {videoRel.duracao && (
                            <div className="absolute bottom-1 right-1 bg-black/80 text-white px-1 py-0.5 rounded text-xs">
                              {videoRel.duracao}
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2 text-sm mb-1">
                          {videoRel.titulo}
                        </h3>
                        {videoRel.pregador && (
                          <p className="text-xs text-gray-400 mb-1">{videoRel.pregador}</p>
                        )}
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <FaEye className="text-xs" />
                          {videoRel.visualizacoes} visualizações
                        </p>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

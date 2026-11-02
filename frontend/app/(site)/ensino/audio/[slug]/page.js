'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaPlay, FaPause, FaHeadphones, FaCalendar, FaUser, FaTag } from 'react-icons/fa';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AudioDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const audioRef = useRef(null);
  const [audio, setAudio] = useState(null);
  const [audiosRelacionados, setAudiosRelacionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tocando, setTocando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [tempoAtual, setTempoAtual] = useState('0:00');
  const [tempoTotal, setTempoTotal] = useState('0:00');

  useEffect(() => {
    if (params.slug) {
      loadAudio();
    }
  }, [params.slug]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handleTimeUpdate = () => {
      const current = audioElement.currentTime;
      const duration = audioElement.duration;
      setProgresso((current / duration) * 100);
      setTempoAtual(formatTime(current));
    };

    const handleLoadedMetadata = () => {
      setTempoTotal(formatTime(audioElement.duration));
    };

    const handleEnded = () => {
      setTocando(false);
    };

    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('ended', handleEnded);

    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, [audio]);

  const loadAudio = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/audios/slug/${params.slug}`);
      if (response.ok) {
        const data = await response.json();
        setAudio(data);
        loadAudiosRelacionados(data.categoria);
      } else {
        router.push('/ensino/audio');
      }
    } catch (error) {
      console.error('Erro ao carregar áudio:', error);
      router.push('/ensino/audio');
    } finally {
      setLoading(false);
    }
  };

  const loadAudiosRelacionados = async (categoria) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/audios?categoria=${categoria}`);
      if (response.ok) {
        const data = await response.json();
        setAudiosRelacionados(data.slice(0, 6));
      }
    } catch (error) {
      console.error('Erro ao carregar áudios relacionados:', error);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (tocando) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setTocando(!tocando);
    }
  };

  const handleProgressClick = (e) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  if (!audio) {
    return null;
  }

  return (
    <>
      <Navbar />
      
      {/* Player Hero */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 py-12 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Botão Voltar */}
          <Link 
            href="/ensino/audio"
            className="inline-flex items-center gap-2 text-white hover:text-purple-200 transition-colors mb-8"
            style={{ zIndex: 100 }}
          >
            <FaArrowLeft />
            Voltar para Áudios
          </Link>

          {/* Player Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Thumbnail */}
              <div className="w-48 h-48 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                {audio.thumbnail ? (
                  <img 
                    src={audio.thumbnail} 
                    alt={audio.titulo}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <FaHeadphones className="text-6xl text-white/50" />
                )}
              </div>

              {/* Info e Controles */}
              <div className="flex-1 w-full">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {audio.titulo}
                </h1>
                {audio.pregador && (
                  <p className="text-xl opacity-90 mb-6">{audio.pregador}</p>
                )}

                {/* Controles */}
                <div className="space-y-4">
                  {/* Barra de Progresso */}
                  <div 
                    className="w-full h-2 bg-white/20 rounded-full cursor-pointer"
                    onClick={handleProgressClick}
                  >
                    <div 
                      className="h-full bg-white rounded-full transition-all"
                      style={{ width: `${progresso}%` }}
                    />
                  </div>

                  {/* Tempo */}
                  <div className="flex justify-between text-sm opacity-90">
                    <span>{tempoAtual}</span>
                    <span>{tempoTotal}</span>
                  </div>

                  {/* Botão Play/Pause */}
                  <button
                    onClick={togglePlay}
                    className="w-16 h-16 bg-white text-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                  >
                    {tocando ? (
                      <FaPause className="text-2xl" />
                    ) : (
                      <FaPlay className="text-2xl ml-1" />
                    )}
                  </button>
                </div>

                {/* Estatísticas */}
                <div className="flex items-center gap-4 mt-6 text-sm opacity-90">
                  <span className="flex items-center gap-2">
                    <FaHeadphones />
                    {audio.reproducoes} reproduções
                  </span>
                  <span className="flex items-center gap-2">
                    <FaCalendar />
                    {formatDate(audio.dataPublicacao)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Audio Element (hidden) */}
          <audio ref={audioRef} src={audio.audioUrl} preload="metadata" />
        </div>
      </div>

      {/* Informações do Áudio */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2">
            {audio.tags && audio.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {audio.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1"
                  >
                    <FaTag className="text-xs" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {audio.descricao && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Sobre este áudio</h2>
                <div 
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: audio.descricao }}
                />
              </div>
            )}
          </div>

          {/* Sidebar - Áudios Relacionados */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Áudios Relacionados</h2>
            <div className="space-y-4">
              {audiosRelacionados
                .filter(a => a._id !== audio._id)
                .slice(0, 5)
                .map(audioRel => (
                  <Link
                    key={audioRel._id}
                    href={`/ensino/audio/${audioRel.slug}`}
                    className="flex gap-3 group bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaPlay className="text-purple-600 ml-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 text-sm">
                        {audioRel.titulo}
                      </h3>
                      {audioRel.pregador && (
                        <p className="text-xs text-gray-600 mt-1">{audioRel.pregador}</p>
                      )}
                      {audioRel.duracao && (
                        <p className="text-xs text-gray-500 mt-1">{audioRel.duracao}</p>
                      )}
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

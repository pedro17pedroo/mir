'use client';

import { useState, useEffect } from 'react';
import {
  FaImages,
  FaCalendarAlt,
  FaTimes,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { galeria } from '@/lib/api';

const CATEGORIAS = [
  'Todas',
  'Culto',
  'Batismo',
  'Conferência',
  'Ação Social',
  'Jovens',
  'Casamento',
  'Infantil'
];

export default function GaleriaPublicaPage() {
  const [albuns, setAlbuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');
  const [albumAberto, setAlbumAberto] = useState(null);
  const [fotoIndex, setFotoIndex] = useState(0);

  useEffect(() => {
    loadAlbuns();
  }, []);

  const loadAlbuns = async () => {
    try {
      setLoading(true);
      const res = await galeria.getPublic();
      setAlbuns(res.data || []);
    } catch (err) {
      console.error('Erro ao carregar galeria:', err);
    } finally {
      setLoading(false);
    }
  };

  const albunsFiltrados =
    categoriaAtiva === 'Todas'
      ? albuns
      : albuns.filter((a) => a.categoria === categoriaAtiva);

  const abrirLightbox = (album, idx = 0) => {
    setAlbumAberto(album);
    setFotoIndex(idx);
  };

  const fotosDoAlbum =
    albumAberto?.fotos?.length > 0
      ? albumAberto.fotos
      : albumAberto?.capa
      ? [{ url: albumAberto.capa, legenda: albumAberto.titulo }]
      : [];

  return (
    <>
      <Navbar />
      <PageHero
        badge="Momentos da Nossa Comunidade"
        badgeIcon={FaImages}
        titulo="Galeria de Fotos"
        subtitulo="Reveja momentos especiais de cultos, batismos, conferências e ações sociais da Igreja MIR"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
        {/* Filtro de Categorias */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaAtiva(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                categoriaAtiva === cat
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
          </div>
        ) : albunsFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl">
            <FaImages className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              Nenhum álbum encontrado nesta categoria
            </h3>
            <p className="text-gray-500">
              Em breve publicaremos novos registos fotográficos dos nossos eventos e cultos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albunsFiltrados.map((album) => {
              const capaUrl = album.capa || album.fotos?.[0]?.url;
              return (
                <div
                  key={album._id}
                  onClick={() => abrirLightbox(album, 0)}
                  className="group cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="relative h-64 bg-gray-100 overflow-hidden">
                    {capaUrl ? (
                      <img
                        src={capaUrl}
                        alt={album.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FaImages className="text-5xl" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-purple-600 text-white">
                      {album.categoria}
                    </span>
                    <span className="absolute bottom-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-black/70 text-white">
                      {album.fotos?.length || 1} foto(s)
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <FaCalendarAlt className="text-purple-600" />
                      <span>
                        {new Date(album.dataEvento || album.createdAt).toLocaleDateString(
                          'pt-AO',
                          { day: '2-digit', month: 'long', year: 'numeric' }
                        )}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                      {album.titulo}
                    </h3>
                    {album.descricao && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {album.descricao}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {albumAberto && fotosDoAlbum.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-5xl flex items-center justify-between text-white mb-4">
            <div>
              <h3 className="text-lg font-bold">{albumAberto.titulo}</h3>
              <p className="text-xs text-gray-300">
                Foto {fotoIndex + 1} de {fotosDoAlbum.length}
                {fotosDoAlbum[fotoIndex]?.legenda
                  ? ` — ${fotosDoAlbum[fotoIndex].legenda}`
                  : ''}
              </p>
            </div>
            <button
              onClick={() => setAlbumAberto(null)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          <div className="relative w-full max-w-5xl flex items-center justify-center">
            {fotosDoAlbum.length > 1 && (
              <button
                onClick={() =>
                  setFotoIndex((prev) =>
                    prev === 0 ? fotosDoAlbum.length - 1 : prev - 1
                  )
                }
                className="absolute left-2 z-10 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full"
              >
                <FaChevronLeft />
              </button>
            )}

            <img
              src={fotosDoAlbum[fotoIndex]?.url}
              alt={fotosDoAlbum[fotoIndex]?.legenda || albumAberto.titulo}
              className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
            />

            {fotosDoAlbum.length > 1 && (
              <button
                onClick={() =>
                  setFotoIndex((prev) =>
                    prev === fotosDoAlbum.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-2 z-10 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full"
              >
                <FaChevronRight />
              </button>
            )}
          </div>

          {fotosDoAlbum.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto max-w-4xl py-2">
              {fotosDoAlbum.map((f, idx) => (
                <button
                  key={idx}
                  onClick={() => setFotoIndex(idx)}
                  className={`w-16 h-12 rounded overflow-hidden border-2 flex-shrink-0 ${
                    idx === fotoIndex ? 'border-purple-400' : 'border-transparent opacity-50'
                  }`}
                >
                  <img src={f.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <Footer />
    </>
  );
}


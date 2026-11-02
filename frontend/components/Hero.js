"use client";
import { useEffect } from 'react';
import Carousel from './Carousel';
import useSiteStore from '../store/useSiteStore';
import { FaChurch, FaHeart, FaPrayingHands } from 'react-icons/fa';

export default function Hero() {
  const slides = useSiteStore(state => state.slides);
  const loadSlides = useSiteStore(state => state.loadSlides);
  const theme = useSiteStore(state => state.theme);
  const loadTheme = useSiteStore(state => state.loadTheme);

  useEffect(() => {
    if (!slides.length) {
      loadSlides();
    }
    if (!theme || !theme.corPrimaria) {
      loadTheme();
    }
  }, [slides.length, theme, loadSlides, loadTheme]);

  const defaultHeroImage = theme?.heroHomeImagem || '/default-hero.jpg';
  const showBoasVindas = theme?.boasVindasAtivo !== false;
  const corPrimaria = theme?.corPrimaria || '#9333ea';
  const corSecundaria = theme?.corSecundaria || '#ec4899';

  return (
    <>
      <header className="relative w-full">
        <Carousel slides={slides.length ? slides : [
          { 
            imagem: defaultHeroImage, 
            posicaoImagem: theme?.heroHomePosicaoImagem || 'center',
            titulo: theme?.nomeIgreja ? `Bem-vindo ao ${theme.nomeIgreja}` : 'Bem-vindo à Igreja MIR', 
            descricao: 'Uma comunidade de fé, amor e esperança' 
          }
        ]} />
      </header>

      {/* Seção de Boas-Vindas Personalizável */}
      {showBoasVindas && (
        <section
          className="py-16 transition-colors"
          style={{ backgroundColor: theme?.boasVindasCorFundo || '#f9fafb' }}
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ color: theme?.corTexto || '#111827' }}
              >
                {theme?.boasVindasTitulo || 'Seja Bem-Vindo!'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {theme?.boasVindasSubtitulo ||
                  'Somos uma família que ama a Deus e deseja compartilhar Seu amor com você. Venha nos visitar e fazer parte desta comunidade!'}
              </p>
            </div>

            {/* Cards de Destaque */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                  style={{ backgroundColor: `${corPrimaria}1a` }}
                >
                  <FaChurch className="text-3xl" style={{ color: corPrimaria }} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {theme?.card1Titulo || 'Nossa Fé'}
                </h3>
                <p className="text-gray-600">
                  {theme?.card1Texto ||
                    'Fundamentados na Palavra de Deus, buscamos viver uma fé autêntica e transformadora.'}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                  style={{ backgroundColor: `${corSecundaria}1a` }}
                >
                  <FaHeart className="text-3xl" style={{ color: corSecundaria }} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {theme?.card2Titulo || 'Nosso Amor'}
                </h3>
                <p className="text-gray-600">
                  {theme?.card2Texto ||
                    'Amamos a Deus sobre todas as coisas e ao próximo como a nós mesmos.'}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <FaPrayingHands className="text-3xl text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {theme?.card3Titulo || 'Nossa Comunhão'}
                </h3>
                <p className="text-gray-600">
                  {theme?.card3Texto ||
                    'Valorizamos os relacionamentos e a vida em comunidade, crescendo juntos na fé.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

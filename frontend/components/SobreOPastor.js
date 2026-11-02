"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../lib/api';

export default function SobreOPastor() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get('/sobre-pastor');
        setDados(res.data);
      } catch(e) {
        setDados(null);
      }
    }
    fetchData();
  }, []);

  if (!dados) return null;

  // Verifica se o link é externo (começa com http:// ou https://)
  const isExternalLink = dados.linkBotao && (dados.linkBotao.startsWith('http://') || dados.linkBotao.startsWith('https://'));

  return (
    <section 
      id="sobre"
      className="relative min-h-[600px] flex items-center overflow-hidden" 
      style={{ backgroundColor: dados.corFundo || 'rgba(109, 40, 217, 0.95)' }}
    >
      {/* Imagem de fundo com overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={dados.imagem || '/pastor-bg.jpg'} 
          alt="Pastor Presidente" 
          className="object-cover w-full h-full" 
        />
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: dados.corFundo || 'rgba(109, 40, 217, 0.85)' }}
        ></div>
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="max-w-3xl">
          {/* Título */}
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight" 
            style={{ color: dados.corTitulo || '#FFC107' }}
          >
            {dados.titulo || 'Conheça Nosso Pastor'}
          </h2>
          
          {/* Linha decorativa */}
          <div 
            className="w-24 h-1 mb-8"
            style={{ backgroundColor: dados.corTitulo || '#FFC107' }}
          ></div>
          
          {/* Texto */}
          <p 
            className="text-xl md:text-2xl leading-relaxed mb-8" 
            style={{ color: dados.corTexto || '#FFFFFF' }}
          >
            {dados.texto || 'Sou um parágrafo. Aqui você pode adicionar seu próprio texto.'}
          </p>
          
          {/* Botão */}
          {dados.textoBotao && dados.linkBotao && (
            isExternalLink ? (
              <a 
                href={dados.linkBotao} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                style={{ 
                  backgroundColor: dados.corBotao || '#FFC107', 
                  color: '#1F2937' 
                }}
              >
                {dados.textoBotao}
              </a>
            ) : (
              <Link 
                href={dados.linkBotao}
                className="inline-block font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                style={{ 
                  backgroundColor: dados.corBotao || '#FFC107', 
                  color: '#1F2937' 
                }}
              >
                {dados.textoBotao}
              </Link>
            )
          )}
        </div>
      </div>

      {/* Padrão decorativo */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent z-0"></div>
    </section>
  );
}


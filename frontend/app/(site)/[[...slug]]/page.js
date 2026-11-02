import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Função auxiliar para fazer requisições no servidor
async function fetchFromAPI(endpoint) {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const url = `${baseURL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    const isSystemRequest = endpoint.includes('.well-known') || 
                           endpoint.includes('favicon') || 
                           endpoint.includes('robots.txt');
    
    if (!isSystemRequest) {
      console.error(`Erro ao buscar ${endpoint}:`, error.message);
    }
    throw error;
  }
}

export async function generateMetadata({ params }) {
  const slug = params?.slug ? params.slug.join('/') : 'inicio';
  
  const ignoredPaths = [
    '.well-known',
    'favicon.ico',
    'robots.txt',
    'sitemap.xml',
    '_next',
    'api',
    'ensino/video',
    'ensino/audio',
    'ensino/cursos',
    'ensino',
    'audio',
    'video',
    'audios',
    'eventos',
    'ministerios',
    'oracao',
    'sou-novo',
    'escalas',
    'avisos',
    'donate',
    'livestream',
    'galeria',
    'devocional',
    'contato',
    'servicos',
    'admin'
  ];
  
  if (slug && slug !== 'inicio' && ignoredPaths.some(path => slug.startsWith(path))) {
    return {
      title: 'Igreja MIR',
      description: 'Igreja MIR - Uma comunidade de fé, amor e esperança',
    };
  }
  
  try {
    const pagina = await fetchFromAPI(`/paginas/slug/${slug}`);
    
    return {
      title: `${pagina.titulo} | Igreja MIR`,
      description: pagina.metaDescricao || 'Igreja MIR - Uma comunidade de fé, amor e esperança',
      openGraph: {
        title: `${pagina.titulo} | Igreja MIR`,
        description: pagina.metaDescricao || 'Igreja MIR - Uma comunidade de fé, amor e esperança',
        type: 'website',
        url: `https://igrejamiradouro.com/${slug}`,
      },
    };
  } catch (error) {
    return {
      title: 'Página não encontrada | Igreja MIR',
      description: 'A página que você está procurando não foi encontrada.',
    };
  }
}

// Componentes da página inicial
import Navbar from '../../../components/Navbar';
import Hero from '../../../components/Hero';
import HomeSections from '../../../components/HomeSections';
import Footer from '../../../components/Footer';
import PageTemplate from '../../../components/PageTemplate';

export default async function PaginaDinamica({ params }) {
  const slug = params?.slug ? params.slug.join('/') : '';
  
  const ignoredPaths = [
    '.well-known',
    'favicon.ico',
    'robots.txt',
    'sitemap.xml',
    '_next',
    'api',
    'ensino/video',
    'ensino/audio',
    'ensino/cursos',
    'ensino',
    'audio',
    'video',
    'audios',
    'eventos',
    'ministerios',
    'oracao',
    'sou-novo',
    'escalas',
    'avisos',
    'donate',
    'livestream',
    'galeria',
    'devocional',
    'contato',
    'servicos',
    'admin'
  ];
  
  if (slug && ignoredPaths.some(path => slug.startsWith(path))) {
    notFound();
  }
  
  if (!params?.slug || params.slug.length === 0) {
    return (
      <>
        <Navbar />
        <Hero />
        <HomeSections />
        <Footer />
      </>
    );
  }
  
  try {
    const pagina = await fetchFromAPI(`/paginas/slug/${slug}`);

    return (
      <>
        <Navbar />
        <PageTemplate page={pagina} />
        <Footer />
      </>
    );
  } catch (error) {
    console.error('Erro ao carregar a página:', error);
    notFound();
  }
}

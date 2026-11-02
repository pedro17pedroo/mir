export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://igrejamiradouro.com';
  const routes = [
    '',
    '/sobre/ministerio',
    '/sobre/no-que-cremos',
    '/sobre/presidente',
    '/servicos',
    '/sou-novo',
    '/ministerios',
    '/oracao',
    '/avisos',
    '/escalas',
    '/devocional',
    '/galeria',
    '/ensino/cursos',
    '/eventos',
    '/ensino/video',
    '/ensino/audio',
    '/livestream',
    '/donate',
    '/contato',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}


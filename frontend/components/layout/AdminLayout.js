'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  FaHome, 
  FaFileAlt, 
  FaImages, 
  FaCalendarAlt, 
  FaComments,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaCog,
  FaPalette,
  FaChevronDown,
  FaChevronRight,
  FaUsers,
  FaHandHoldingHeart,
  FaVideo,
  FaEnvelope,
  FaInbox,
  FaBars as FaMenu,
  FaHeadphones,
  FaPhone,
  FaChurch,
  FaUserTie,
  FaPrayingHands,
  FaHandsHelping,
  FaUserShield,
  FaUserPlus,
  FaCalendarCheck,
  FaGraduationCap,
  FaBullhorn,
  FaBoxes
} from 'react-icons/fa';
import useAuthStore from '@/store/useAuthStore';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [expandedSections, setExpandedSections] = useState(['conteudo', 'ministerios']);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Prevenir scroll no body quando sidebar mobile está aberta
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [sidebarOpen]);

  if (!isMounted) {
    return null;
  }

  if (!user) {
    router.push('/admin/login');
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isActive = (path) => {
    if (path === '/admin') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  // Estrutura do menu organizada
  const menuSections = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      items: [
        { 
          name: 'Visão Geral', 
          path: '/admin', 
          icon: <FaHome className="w-5 h-5" />
        }
      ]
    },
    {
      id: 'conteudo',
      name: 'Gestão de Conteúdo',
      items: [
        { 
          name: 'Páginas', 
          path: '/admin/paginas', 
          icon: <FaFileAlt className="w-5 h-5" />,
          description: 'Gerir páginas do site'
        },
        { 
          name: 'Menus', 
          path: '/admin/menus', 
          icon: <FaMenu className="w-5 h-5" />,
          description: 'Gerir menus de navegação'
        },
        { 
          name: 'Carrossel/Hero', 
          path: '/admin/carrossel', 
          icon: <FaImages className="w-5 h-5" />,
          description: 'Slides da página inicial'
        },
        { 
          name: 'Nosso Pastor', 
          path: '/admin/pastor', 
          icon: <FaUserTie className="w-5 h-5" />,
          description: 'Seção sobre o pastor'
        },
        { 
          name: 'Palavra & Devocional', 
          path: '/admin/mensagens', 
          icon: <FaComments className="w-5 h-5" />,
          description: 'Devocionais e versículo na Home'
        },
        { 
          name: 'Galeria de Fotos', 
          path: '/admin/galeria', 
          icon: <FaImages className="w-5 h-5" />,
          description: 'Álbuns de cultos e batismos'
        },
        { 
          name: 'Eventos', 
          path: '/admin/eventos', 
          icon: <FaCalendarAlt className="w-5 h-5" />,
          description: 'Gerir eventos e inscrições'
        },
        { 
          name: 'Vídeos', 
          path: '/admin/videos', 
          icon: <FaVideo className="w-5 h-5" />,
          description: 'Gerir vídeos'
        },
        { 
          name: 'Áudios', 
          path: '/admin/audios', 
          icon: <FaHeadphones className="w-5 h-5" />,
          description: 'Gerir áudios'
        },
        { 
          name: 'Testemunhos', 
          path: '/admin/testemunhos', 
          icon: <FaComments className="w-5 h-5" />,
          description: 'Gerir testemunhos'
        },
        { 
          name: 'Serviços', 
          path: '/admin/servicos', 
          icon: <FaChurch className="w-5 h-5" />,
          description: 'Gerir serviços e horários'
        }
      ]
    },
    {
      id: 'ministerios',
      name: 'Membros e Ministérios',
      items: [
        { 
          name: 'Membros', 
          path: '/admin/membros', 
          icon: <FaUsers className="w-5 h-5" />,
          description: 'Gerir membros e aniversariantes'
        },
        { 
          name: 'Visitantes / Consolidação', 
          path: '/admin/visitantes', 
          icon: <FaUserPlus className="w-5 h-5" />,
          description: 'Novos convertidos e 1ª visita'
        },
        { 
          name: 'Ministérios e Células', 
          path: '/admin/ministerios', 
          icon: <FaHandsHelping className="w-5 h-5" />,
          description: 'Departamentos e grupos caseiros'
        },
        { 
          name: 'Escala de Obreiros', 
          path: '/admin/escalas', 
          icon: <FaCalendarCheck className="w-5 h-5" />,
          description: 'Equipas de serviço dos cultos'
        },
        { 
          name: 'Escola Bíblica e Cursos', 
          path: '/admin/cursos', 
          icon: <FaGraduationCap className="w-5 h-5" />,
          description: 'Batismo, discipulado e turmas'
        },
        { 
          name: 'Pedidos de Oração', 
          path: '/admin/oracoes', 
          icon: <FaPrayingHands className="w-5 h-5" />,
          description: 'Mural de oração e pastoral'
        }
      ]
    },
    {
      id: 'comunicacao',
      name: 'Comunicação',
      items: [
        { 
          name: 'Mural de Avisos', 
          path: '/admin/avisos', 
          icon: <FaBullhorn className="w-5 h-5" />,
          description: 'Comunicados e boletim semanal'
        },
        { 
          name: 'Transmissões', 
          path: '/admin/transmissoes', 
          icon: <FaVideo className="w-5 h-5" />,
          description: 'Gerir livestreams'
        },
        { 
          name: 'Newsletter', 
          path: '/admin/newsletter', 
          icon: <FaEnvelope className="w-5 h-5" />,
          description: 'Gerir inscritos'
        },
        { 
          name: 'Informações de Contato', 
          path: '/admin/contato', 
          icon: <FaPhone className="w-5 h-5" />,
          description: 'Gerir página de contato'
        },
        { 
          name: 'Mensagens de Contato', 
          path: '/admin/contato/mensagens', 
          icon: <FaInbox className="w-5 h-5" />,
          description: 'Ver mensagens recebidas'
        }
      ]
    },
    {
      id: 'financeiro',
      name: 'Financeiro & Património',
      items: [
        { 
          name: 'Tesouraria e Fluxo de Caixa', 
          path: '/admin/doacoes', 
          icon: <FaHandHoldingHeart className="w-5 h-5" />,
          description: 'Entradas, despesas e balancete'
        },
        { 
          name: 'Património e Equipamentos', 
          path: '/admin/patrimonio', 
          icon: <FaBoxes className="w-5 h-5" />,
          description: 'Inventário de bens da igreja'
        }
      ]
    },
    {
      id: 'aparencia',
      name: 'Sistema e Aparência',
      items: [
        { 
          name: 'Utilizadores', 
          path: '/admin/usuarios', 
          icon: <FaUserShield className="w-5 h-5" />,
          description: 'Equipa e permissões'
        },
        { 
          name: 'Tema', 
          path: '/admin/tema', 
          icon: <FaPalette className="w-5 h-5" />,
          description: 'Cores e estilo'
        },
        { 
          name: 'Configurações', 
          path: '/admin/configuracoes', 
          icon: <FaCog className="w-5 h-5" />,
          description: 'Configurações gerais'
        }
      ]
    }
  ];

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar - Fixa com Scroll Próprio */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-72 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl flex flex-col h-screen`}
      >
        {/* Header da Sidebar - Fixo */}
        <div className="flex-shrink-0 p-6 border-b border-gray-700">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Igreja MIR</h1>
                <p className="text-xs text-gray-400">Painel Admin</p>
              </div>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Menu - Com Scroll Próprio */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <div className="space-y-6">
            {menuSections.map((section) => (
              <div key={section.id}>
                {section.id !== 'dashboard' && (
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-white transition-colors"
                  >
                    <span>{section.name}</span>
                    {expandedSections.includes(section.id) ? (
                      <FaChevronDown className="w-3 h-3" />
                    ) : (
                      <FaChevronRight className="w-3 h-3" />
                    )}
                  </button>
                )}
                
                {(section.id === 'dashboard' || expandedSections.includes(section.id)) && (
                  <div className="space-y-1 mt-2">
                    {section.items.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                          isActive(item.path)
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className={`mr-3 ${isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-purple-400'}`}>
                          {item.icon}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          {item.description && !isActive(item.path) && (
                            <p className="text-xs text-gray-500 group-hover:text-gray-400">{item.description}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Footer da Sidebar - Fixo com User Info */}
        <div className="flex-shrink-0 border-t border-gray-700">
          {/* User Info */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center font-bold text-sm">
                {user?.nome?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.nome || 'Usuário'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
              </div>
            </div>
          </div>
          
          {/* Botão Sair */}
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
            >
              <FaSignOutAlt className="w-5 h-5 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main Content - Com margem para a sidebar no desktop */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        {/* Topbar */}
        <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Alternar barra lateral"
              >
                <FaBars className="w-5 h-5" />
              </button>
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500">
                <Link href="/admin" className="hidden sm:inline hover:text-purple-600 transition-colors font-medium">
                  Painel MIR
                </Link>
                <span className="hidden sm:inline text-gray-300">/</span>
                <span className="font-semibold text-gray-900">
                  {menuSections.flatMap(s => s.items).find(item => isActive(item.path))?.name || 'Administração'}
                </span>
              </nav>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all shadow-sm"
              >
                <span>Ver Site Público</span>
                <span className="text-sm leading-none">↗</span>
              </Link>
            </div>
          </div>
        </header>
        
        {/* Content - Com scroll próprio */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="flex-shrink-0 bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 gap-2">
            <p>© {new Date().getFullYear()} Igreja MIR. Todos os direitos reservados.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-gray-700 transition-colors">Ajuda</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Documentação</a>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden sidebar-mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

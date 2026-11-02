'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import useAuthStore from '@/store/useAuthStore';

// Carrega o AdminLayout de forma dinâmica para evitar problemas de hidratação
const AdminLayout = dynamic(
  () => import('@/components/layout/AdminLayout'),
  { ssr: false }
);

export default function AdminLayoutWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading, initialize } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  // Marca quando o componente está montado
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Inicializa o estado de autenticação apenas uma vez
  useEffect(() => {
    if (isMounted) {
      console.log('🚀 Inicializando admin layout...');
      initialize();
    }
  }, [isMounted]);

  // Redireciona se não estiver autenticado (exceto na página de login)
  useEffect(() => {
    if (isMounted && !loading) {
      const isLoginPage = pathname.includes('/admin/login');
      
      if (!isAuthenticated && !isLoginPage) {
        console.log('⚠️ Não autenticado, redirecionando para login...');
        router.push('/admin/login');
      } else if (isAuthenticated && isLoginPage) {
        console.log('✅ Já autenticado, redirecionando para dashboard...');
        router.push('/admin');
      }
    }
  }, [isAuthenticated, loading, pathname, isMounted]);

  // Se não estiver montado ainda, não renderiza nada
  if (!isMounted) {
    return null;
  }

  // Se estiver carregando, mostra um spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se for a página de login, não usa o AdminLayout
  if (pathname.includes('/admin/login')) {
    return <>{children}</>;
  }

  // Se não estiver autenticado, mostra loading enquanto redireciona
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  // Para todas as outras páginas do admin, usa o AdminLayout
  return <AdminLayout>{children}</AdminLayout>;
}

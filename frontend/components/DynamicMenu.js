'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

const DynamicMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await api.get('/paginas?menu=true');
        // Ordenar itens do menu pela ordem definida
        const sortedItems = response.data.sort((a, b) => a.ordemMenu - b.ordemMenu);
        setMenuItems(sortedItems);
      } catch (err) {
        console.error('Erro ao carregar itens do menu:', err);
        setError('Não foi possível carregar o menu');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  if (loading) {
    return (
      <div className="flex space-x-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  return (
    <nav>
      <ul className="flex space-x-6">
        {menuItems.map((item) => {
          const isActive = pathname === `/${item.slug}` || 
                         (pathname === '/' && item.slug === 'inicio');
          
          return (
            <li key={item._id}>
              <Link 
                href={`/${item.slug === 'inicio' ? '' : item.slug}`}
                className={`font-medium transition-colors hover:text-blue-600 ${
                  isActive ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {item.titulo}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default DynamicMenu;

'use client';

import { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa';

const MapDisplay = ({ latitude, longitude, endereco, local, address, showDirections }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [L, setL] = useState(null);

  // Usar address se endereco não estiver disponível
  const displayAddress = endereco || address;

  // Carregar Leaflet dinamicamente (client-side only)
  useEffect(() => {
    const loadLeaflet = async () => {
      const leaflet = await import('leaflet');
      await import('leaflet/dist/leaflet.css');
      
      // Fix para ícones do Leaflet
      delete leaflet.Icon.Default.prototype._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
      
      setL(leaflet);
    };

    loadLeaflet();
  }, []);

  // Inicializar mapa
  useEffect(() => {
    if (!L || !mapRef.current || mapInstanceRef.current || !latitude || !longitude) return;

    const map = L.map(mapRef.current, {
      scrollWheelZoom: false // Desabilitar zoom com scroll para melhor UX
    }).setView([latitude, longitude], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Adicionar marcador
    const marker = L.marker([latitude, longitude]).addTo(map);
    
    // Adicionar popup com informações
    if (local || displayAddress) {
      marker.bindPopup(`
        <div class="text-center">
          <strong class="text-purple-600">${local || 'Local do Evento'}</strong>
          ${displayAddress ? `<br><span class="text-sm text-gray-600">${displayAddress}</span>` : ''}
        </div>
      `).openPopup();
    }

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [L, latitude, longitude, local, displayAddress]);

  if (!latitude || !longitude) {
    return null;
  }

  const openInGoogleMaps = () => {
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
  };

  const openInWaze = () => {
    window.open(`https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`, '_blank');
  };

  return (
    <div className="space-y-4 relative" style={{ zIndex: 1 }}>
      {/* Mapa */}
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg shadow-lg border-2 border-gray-200 relative"
        style={{ zIndex: 1 }}
      />

      {/* Informações e Ações */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Endereço */}
        {displayAddress && (
          <div className="mb-4">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-purple-600 text-xl mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 mb-1">Endereço</p>
                <p className="text-gray-700">{displayAddress}</p>
              </div>
            </div>
          </div>
        )}

        {/* Botões de Navegação */}
        {showDirections && (
          <>
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={openInGoogleMaps}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaExternalLinkAlt />
                Abrir no Google Maps
              </button>
              <button
                onClick={openInWaze}
                className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaExternalLinkAlt />
                Abrir no Waze
              </button>
            </div>

            {/* Dica */}
            <p className="text-xs text-gray-500 mt-4">
              Clique nos botões acima para obter direções até o local
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default MapDisplay;

'use client';

import { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

const MapPicker = ({ value, onChange }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [L, setL] = useState(null);

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
    if (!L || !mapRef.current || mapInstanceRef.current) return;

    const defaultLat = value?.latitude || -23.5505; // São Paulo
    const defaultLng = value?.longitude || -46.6333;

    const map = L.map(mapRef.current).setView([defaultLat, defaultLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Adicionar marcador inicial se houver valor
    if (value?.latitude && value?.longitude) {
      markerRef.current = L.marker([value.latitude, value.longitude]).addTo(map);
    }

    // Clique no mapa para adicionar/mover marcador
    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      
      // Remover marcador anterior
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }
      
      // Adicionar novo marcador
      markerRef.current = L.marker([lat, lng]).addTo(map);
      
      // Buscar endereço via reverse geocoding
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        const endereco = data.display_name || '';
        
        onChange({
          latitude: lat,
          longitude: lng,
          endereco
        });
      } catch (error) {
        console.error('Erro ao buscar endereço:', error);
        onChange({
          latitude: lat,
          longitude: lng,
          endereco: ''
        });
      }
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [L]);

  // Buscar endereço
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current || !L) return;

    setSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        
        // Mover mapa para localização
        mapInstanceRef.current.setView([latitude, longitude], 15);
        
        // Remover marcador anterior
        if (markerRef.current) {
          mapInstanceRef.current.removeLayer(markerRef.current);
        }
        
        // Adicionar novo marcador
        markerRef.current = L.marker([latitude, longitude]).addTo(mapInstanceRef.current);
        
        onChange({
          latitude,
          longitude,
          endereco: display_name
        });
      } else {
        alert('Endereço não encontrado. Tente ser mais específico.');
      }
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      alert('Erro ao buscar endereço. Tente novamente.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-4 relative" style={{ zIndex: 1 }}>
      {/* Busca de Endereço (sem <form> aninhado para evitar submit acidental do form pai) */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch(e);
              }
            }}
            placeholder="Buscar endereço (ex: Luanda, Angola)"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching || !searchQuery.trim()}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          {searching ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Buscando...
            </>
          ) : (
            <>
              <FaMapMarkerAlt />
              Buscar
            </>
          )}
        </button>
      </div>

      {/* Mapa */}
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border-2 border-gray-300 shadow-inner relative"
        style={{ zIndex: 1 }}
      />

      {/* Informações */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 mb-2">
          <strong>Como usar:</strong>
        </p>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Busque um endereço usando o campo acima</li>
          <li>Ou clique diretamente no mapa para marcar a localização</li>
          <li>Arraste o mapa para navegar</li>
          <li>Use a roda do mouse para dar zoom</li>
        </ul>
      </div>

      {/* Endereço Selecionado */}
      {value?.endereco && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm font-medium text-green-800 mb-1">
            <FaMapMarkerAlt className="inline mr-2" />
            Localização Selecionada:
          </p>
          <p className="text-sm text-green-700">{value.endereco}</p>
          <p className="text-xs text-green-600 mt-2">
            Coordenadas: {value.latitude?.toFixed(6)}, {value.longitude?.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapPicker;

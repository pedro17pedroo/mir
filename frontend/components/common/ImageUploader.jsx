'use client';

import { useState, useRef } from 'react';
import { FaUpload, FaLink, FaTrash, FaImage, FaCheck, FaSpinner, FaArrowsAlt } from 'react-icons/fa';

/**
 * Universal Image Uploader & URL Selector with automatic client-side Canvas compression.
 * Supports uploading from computer (resized & compressed to keep payloads light) or pasting an external URL.
 */
export default function ImageUploader({
  value = '',
  onChange,
  label = 'Imagem',
  helperText = 'Carregue uma imagem do seu computador ou cole um link externo.',
  aspectRatio = 'video', // 'video' (16:9), 'square' (1:1), 'banner' (21:9), 'logo' (auto)
  maxWidth = 1600,
  quality = 0.82,
  showPositionControl = false,
  positionValue = 'center',
  onPositionChange = null,
  placeholder = 'https://exemplo.com/imagem.jpg',
}) {
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      // Keep SVGs or tiny files (< 150KB) as direct DataURL to preserve transparency/vectors
      if (file.type === 'image/svg+xml' || (file.type === 'image/png' && file.size < 250 * 1024)) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Erro ao ler ficheiro'));
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Preserve PNG if logo or transparent, otherwise use JPEG for compact size
          const outputType = file.type === 'image/png' && aspectRatio === 'logo' ? 'image/png' : 'image/jpeg';
          const compressedDataUrl = canvas.toDataURL(outputType, quality);
          resolve(compressedDataUrl);
        };
        img.onerror = () => reject(new Error('Ficheiro de imagem inválido'));
        img.src = event.target.result;
      };
      reader.onerror = () => reject(new Error('Erro ao ler ficheiro'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor selecione um ficheiro de imagem válido (JPG, PNG, WEBP, SVG).');
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setError('A imagem original não deve ultrapassar 12MB.');
      return;
    }

    try {
      setProcessing(true);
      setError('');
      const optimizedDataUrl = await compressImage(file);
      onChange(optimizedDataUrl);
    } catch (err) {
      setError(err.message || 'Erro ao processar imagem.');
    } finally {
      setProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const previewHeightClass =
    aspectRatio === 'square'
      ? 'h-40 w-40'
      : aspectRatio === 'logo'
      ? 'h-24 w-48 bg-slate-800/90 p-3'
      : aspectRatio === 'banner'
      ? 'h-36 w-full'
      : 'h-44 w-full';

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
        <div className="inline-flex rounded-lg bg-gray-100 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition ${
              mode === 'upload' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaUpload className="text-[10px]" /> Computador
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition ${
              mode === 'url' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaLink className="text-[10px]" /> URL / Link
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div className="flex flex-wrap items-center gap-3">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-sm font-medium transition">
            {processing ? (
              <>
                <FaSpinner className="animate-spin" /> A otimizar imagem...
              </>
            ) : (
              <>
                <FaUpload /> Escolher Imagem do Dispositivo
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={processing}
              className="hidden"
            />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
            >
              <FaTrash /> Remover Imagem
            </button>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={value?.startsWith('data:') ? '' : value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={value?.startsWith('data:') ? 'Imagem carregada do computador (cole um link para substituir)' : placeholder}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-medium transition"
              title="Limpar imagem"
            >
              <FaTrash />
            </button>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}

      {/* Preview Box & Focal Point Control */}
      {value ? (
        <div className="space-y-2 pt-1">
          <div className={`relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 ${previewHeightClass}`}>
            <img
              src={value}
              alt="Pré-visualização"
              style={{ objectPosition: positionValue || 'center' }}
              className={`w-full h-full ${aspectRatio === 'logo' ? 'object-contain' : 'object-cover'}`}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="absolute bottom-2 right-2 bg-black/65 text-white text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1">
              <FaCheck className="text-emerald-400 text-[10px]" />
              {value.startsWith('data:') ? 'Imagem Otimizada' : 'Link Externo'}
            </span>
          </div>

          {showPositionControl && typeof onPositionChange === 'function' && (
            <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
              <FaArrowsAlt className="text-gray-400" />
              <span className="font-medium">Enquadramento Vertical:</span>
              {[
                { id: 'top', label: 'Topo (Rostos acima)' },
                { id: 'center', label: 'Centro (Padrão)' },
                { id: 'bottom', label: 'Base' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onPositionChange(opt.id)}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    (positionValue || 'center') === opt.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-gray-400 py-2 px-3 border border-dashed border-gray-200 rounded-lg bg-gray-50/50">
          <FaImage className="text-gray-300 text-base" />
          <span>Nenhuma imagem selecionada</span>
        </div>
      )}
    </div>
  );
}


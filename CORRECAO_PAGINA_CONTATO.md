# Correção da Página de Contato - Dynamic Imports

## Problema Identificado

Erro ao carregar a página de contato:
```
Error: Lazy element type must resolve to a class or function
```

## Causa Raiz

Os componentes `MapDisplay` e `MapPicker` estavam usando **named exports** mas os dynamic imports estavam tentando acessá-los de forma incorreta.

### Código Problemático

**MapDisplay.jsx:**
```javascript
export const MapDisplay = ({ ... }) => { ... }
```

**MapPicker.jsx:**
```javascript
export const MapPicker = ({ ... }) => { ... }
```

**contato/page.js:**
```javascript
const MapDisplay = dynamic(() => import('@/components/MapDisplay').then(mod => mod.MapDisplay), { ssr: false });
```

## Solução Aplicada

### 1. Alterado para Default Exports

**MapDisplay.jsx:**
```javascript
const MapDisplay = ({ ... }) => { ... }

export default MapDisplay;
```

**MapPicker.jsx:**
```javascript
const MapPicker = ({ ... }) => { ... }

export default MapPicker;
```

### 2. Simplificado Dynamic Imports

**contato/page.js:**
```javascript
const MapDisplay = dynamic(() => import('@/components/MapDisplay'), { ssr: false });
```

**admin/contato/page.js:**
```javascript
const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false });
```

### 3. Corrigido Props do MapPicker

**Antes:**
```javascript
<MapPicker
  initialLatitude={contactInfo?.localizacao?.latitude}
  initialLongitude={contactInfo?.localizacao?.longitude}
  onLocationChange={(lat, lng, address) => {
    setContactInfo({
      ...contactInfo,
      localizacao: { latitude: lat, longitude: lng }
    });
  }}
/>
```

**Depois:**
```javascript
<MapPicker
  value={contactInfo?.localizacao}
  onChange={(location) => {
    setContactInfo({
      ...contactInfo,
      localizacao: location
    });
  }}
/>
```

## Arquivos Modificados

1. ✅ `frontend/components/MapDisplay.jsx` - Alterado para default export
2. ✅ `frontend/components/MapPicker.jsx` - Alterado para default export
3. ✅ `frontend/app/(site)/contato/page.js` - Simplificado dynamic import
4. ✅ `frontend/app/admin/contato/page.js` - Simplificado dynamic import e corrigido props
5. ✅ `frontend/app/(site)/eventos/[slug]/page.js` - Corrigido import de MapDisplay
6. ✅ `frontend/app/admin/eventos/EventoForm.jsx` - Corrigido import de MapPicker

## Verificação

- ✅ Sem erros de diagnóstico
- ✅ Dynamic imports corretos
- ✅ Props corretas
- ✅ Default exports configurados

## Status

🟢 **CORRIGIDO** - Página de contato pronta para teste

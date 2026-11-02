# Correção de Erros 404

## ❌ PROBLEMAS IDENTIFICADOS

### 1. Menu "Contacto" com URL Incorreta
**Erro:**
```
Erro ao buscar /paginas/slug/contacto: HTTP error! status: 404
```

**Causa:**
- Menu apontava para `/contacto` (com "c")
- Página tinha slug `contato` (sem "c")

### 2. Rotas Específicas Sendo Tratadas como Páginas Dinâmicas
**Erros:**
```
Erro ao buscar /paginas/slug/audio: HTTP error! status: 404
Erro ao buscar /paginas/slug/audios/ensino-frutos.mp3: HTTP error! status: 404
```

**Causa:**
- Sistema tentava buscar `/audio`, `/audios`, etc. como páginas dinâmicas
- Essas são rotas específicas que têm suas próprias páginas

## ✅ SOLUÇÕES IMPLEMENTADAS

### 1. Correção do Menu "Contacto"

**Arquivo**: `backend/scripts/fixMenuContacto.js` (novo)

```javascript
await Menu.updateOne(
  { titulo: 'Contacto' },
  { $set: { url: '/contato' } }
);
```

**Executado:**
```bash
node backend/scripts/fixMenuContacto.js
```

**Resultado:**
```
✅ Menu "Contacto" atualizado: /contacto → /contato
```

### 2. Atualização da Lista de Rotas Ignoradas

**Arquivo**: `frontend/app/(site)/[[...slug]]/page.js`

**ANTES:**
```javascript
const ignoredPaths = [
  '.well-known',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  '_next',
  'api',
  'ensino/video',
  'ensino/audio',
  'eventos',
  'donate',
  'livestream'
];
```

**DEPOIS:**
```javascript
const ignoredPaths = [
  '.well-known',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  '_next',
  'api',
  'ensino/video',
  'ensino/audio',
  'ensino',        // ← NOVO
  'audio',         // ← NOVO
  'video',         // ← NOVO
  'audios',        // ← NOVO
  'eventos',
  'donate',
  'livestream',
  'admin'          // ← NOVO
];
```

**Rotas adicionadas:**
- `ensino` - Rota base de ensino
- `audio` - Rota de áudio (caso alguém acesse diretamente)
- `video` - Rota de vídeo (caso alguém acesse diretamente)
- `audios` - Plural de áudio (para evitar confusão)
- `admin` - Painel administrativo

## 📊 ESTRUTURA DE ROTAS

### Rotas Específicas (Não Dinâmicas)
```
/                           → Página inicial
/ensino/video              → Listagem de vídeos
/ensino/video/[slug]       → Detalhes do vídeo
/ensino/audio              → Listagem de áudios
/ensino/audio/[slug]       → Detalhes do áudio
/eventos                   → Listagem de eventos
/eventos/[slug]            → Detalhes do evento
/donate                    → Página de doações
/livestream                → Transmissão ao vivo
/admin/*                   → Painel administrativo
```

### Rotas Dinâmicas (Páginas do CMS)
```
/[slug]                    → Qualquer página criada no admin
/sobre/ministerio          → Página "Nosso Ministério"
/sobre/no-que-cremos       → Página "No que Cremos"
/sobre/presidente          → Página "Presidente do MIR"
/contato                   → Página de contato
/conferencia-fe            → Página "Conferência de Fé"
... etc
```

## 🔍 COMO FUNCIONA

### 1. Verificação de Rotas Ignoradas
```javascript
if (slug && ignoredPaths.some(path => slug.startsWith(path))) {
  notFound();  // Retorna 404 sem tentar buscar no banco
}
```

### 2. Busca de Página Dinâmica
```javascript
try {
  const pagina = await fetchFromAPI(`/paginas/slug/${slug}`);
  return <PageTemplate page={pagina} />;
} catch (error) {
  notFound();  // Se não encontrar, retorna 404
}
```

## 🧪 TESTES

### Teste 1: Menu Contacto
```bash
# Verificar se o menu foi atualizado
curl http://localhost:5000/api/menus | jq '.[] | select(.titulo == "Contacto")'
```

**Resultado Esperado:**
```json
{
  "titulo": "Contacto",
  "url": "/contato"  ← Correto!
}
```

### Teste 2: Rotas Ignoradas
Acessar as seguintes URLs não deve gerar erros 404 no console:
- `http://localhost:3000/ensino/video`
- `http://localhost:3000/ensino/audio`
- `http://localhost:3000/eventos`
- `http://localhost:3000/admin`

### Teste 3: Páginas Dinâmicas
Acessar as seguintes URLs deve carregar as páginas corretamente:
- `http://localhost:3000/contato`
- `http://localhost:3000/sobre/ministerio`
- `http://localhost:3000/conferencia-fe`

## ⚠️ NOTAS IMPORTANTES

### Ordem de Prioridade das Rotas
1. **Rotas específicas** (definidas em `app/(site)/`)
2. **Rotas ignoradas** (retornam 404 sem buscar no banco)
3. **Rotas dinâmicas** (buscam no banco de dados)

### Adicionando Novas Rotas Específicas
Se criar uma nova rota específica (ex: `/galeria`), adicione-a à lista `ignoredPaths`:

```javascript
const ignoredPaths = [
  // ... outras rotas
  'galeria',  // ← Nova rota
];
```

### Erros Comuns
- **Erro**: "Página não encontrada" ao acessar rota específica
- **Solução**: Adicionar a rota à lista `ignoredPaths`

- **Erro**: Rota dinâmica não funciona
- **Solução**: Verificar se o slug da página no banco está correto

## 📝 ARQUIVOS MODIFICADOS

```
backend/scripts/fixMenuContacto.js (novo)
frontend/app/(site)/[[...slug]]/page.js (atualizado)
```

## 🎯 RESULTADO

✅ Erro 404 do menu "Contacto" resolvido
✅ Erros 404 de rotas específicas resolvidos
✅ Sistema de rotas mais robusto
✅ Melhor separação entre rotas específicas e dinâmicas

---

**Status**: ✅ RESOLVIDO
**Data**: 2026-02-09
**Impacto**: Alto (erros 404 no console resolvidos)

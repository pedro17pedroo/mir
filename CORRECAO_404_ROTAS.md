# Correção de Erros 404 nas Rotas

## ❌ PROBLEMAS IDENTIFICADOS

### 1. Rotas Específicas Sendo Tratadas como Páginas Dinâmicas
```
Erro ao buscar /paginas/slug/ensino/audio: HTTP error! status: 404
Erro ao buscar /paginas/slug/audios/ensino-frutos.mp3: HTTP error! status: 404
Erro ao buscar /paginas/slug/contacto: HTTP error! status: 404
```

### 2. Causa Raiz
A página dinâmica `[[...slug]]` está tentando buscar TODAS as rotas como páginas no banco de dados, incluindo:
- Rotas específicas do Next.js (`/ensino/video`, `/ensino/audio`, `/eventos`)
- Arquivos de mídia (`/audios/ensino-frutos.mp3`)
- Páginas que não existem (`/contacto`)

## ✅ SOLUÇÃO

### Arquivo: `frontend/app/(site)/[[...slug]]/page.js`

Adicionada lista de rotas que devem ser ignoradas pela página dinâmica:

```javascript
const ignoredPaths = [
  '.well-known',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  '_next',
  'api',
  'ensino/video',    // Rota específica para vídeos
  'ensino/audio',    // Rota específica para áudios
  'ensino',          // Rota pai
  'audio',           // Evita conflito
  'video',           // Evita conflito
  'audios',          // Pasta de arquivos
  'eventos',         // Rota específica para eventos
  'donate',          // Rota específica para doações
  'livestream',      // Rota específica para transmissões
  'admin'            // Área administrativa
];

// Se o slug começa com algum caminho ignorado, retorna 404
if (slug && ignoredPaths.some(path => slug.startsWith(path))) {
  notFound();
}
```

## 📊 ROTAS DO SISTEMA

### Rotas Específicas (Next.js)
Estas rotas têm arquivos `page.js` próprios e NÃO devem ser tratadas como páginas dinâmicas:

```
/ensino/video              → frontend/app/(site)/ensino/video/page.js
/ensino/video/[slug]       → frontend/app/(site)/ensino/video/[slug]/page.js
/ensino/audio              → frontend/app/(site)/ensino/audio/page.js
/ensino/audio/[slug]       → frontend/app/(site)/ensino/audio/[slug]/page.js
/eventos                   → frontend/app/(site)/eventos/page.js
/eventos/[slug]            → frontend/app/(site)/eventos/[slug]/page.js
/donate                    → frontend/app/(site)/donate/page.js
/livestream                → frontend/app/(site)/livestream/page.js
/admin/*                   → frontend/app/admin/*
```

### Páginas Dinâmicas (Banco de Dados)
Estas rotas SÃO buscadas no banco de dados:

```
/                          → Página inicial (hardcoded)
/sobre                     → Página do banco
/sobre/ministerio          → Página do banco
/sobre/no-que-cremos       → Página do banco
/sobre/presidente          → Página do banco
/contato                   → Página do banco
/conferencia-fe            → Página do banco
/escola-fundacao           → Página do banco
... (outras páginas criadas no admin)
```

## 🔧 COMO FUNCIONA

### 1. Requisição Chega
```
GET /ensino/video
```

### 2. Next.js Verifica Rotas
```
1. Procura arquivo específico: /ensino/video/page.js ✅ ENCONTRADO
2. Retorna a página específica
3. NÃO passa pela página dinâmica [[...slug]]
```

### 3. Se Não Encontrar Rota Específica
```
GET /sobre/ministerio
```

```
1. Procura arquivo específico: /sobre/ministerio/page.js ❌ NÃO ENCONTRADO
2. Passa para [[...slug]]/page.js
3. Verifica se está na lista de ignorados ❌ NÃO
4. Busca no banco: /api/paginas/slug/sobre/ministerio ✅ ENCONTRADO
5. Renderiza PageTemplate com os dados
```

### 4. Se Estiver na Lista de Ignorados
```
GET /ensino/audio
```

```
1. Procura arquivo específico: /ensino/audio/page.js ✅ ENCONTRADO
2. Retorna a página específica
```

Mas se por algum motivo passar pela [[...slug]]:
```
1. Verifica se está na lista de ignorados ✅ SIM
2. Retorna notFound() (404)
3. NÃO tenta buscar no banco
```

## ⚠️ PROBLEMA COM ARQUIVOS DE MÍDIA

### Erro Original
```
Erro ao buscar /paginas/slug/audios/ensino-frutos.mp3: HTTP error! status: 404
```

### Causa
Alguém está tentando acessar um arquivo de áudio diretamente pela URL:
```
http://localhost:3000/audios/ensino-frutos.mp3
```

### Solução
1. Arquivos de mídia devem estar em `/public/audios/`
2. Ou usar URLs externas (CDN, S3, etc.)
3. Adicionado `'audios'` à lista de ignorados

## 📝 PÁGINAS QUE FALTAM

### Contato
- Menu aponta para: `/contato`
- Página existe no banco: ✅ `slug: "contato"`
- Status: OK

### Contacto (com 'c')
- Erro mostra: `/contacto`
- Não existe no banco
- Solução: Já corrigido no menu para `/contato`

## 🧪 COMO TESTAR

### 1. Rotas Específicas
```bash
# Devem funcionar (páginas específicas)
curl http://localhost:3000/ensino/video
curl http://localhost:3000/ensino/audio
curl http://localhost:3000/eventos
```

### 2. Páginas Dinâmicas
```bash
# Devem funcionar (páginas do banco)
curl http://localhost:3000/sobre/ministerio
curl http://localhost:3000/contato
curl http://localhost:3000/conferencia-fe
```

### 3. Rotas Ignoradas
```bash
# Devem retornar 404 (não existem)
curl http://localhost:3000/audios/teste.mp3
curl http://localhost:3000/admin/teste
```

## 🎯 RESULTADO

✅ Rotas específicas não tentam buscar no banco
✅ Páginas dinâmicas funcionam normalmente
✅ Arquivos de mídia não causam erros
✅ Menos logs de erro no console
✅ Performance melhorada (menos requisições desnecessárias)

## 📋 CHECKLIST PARA ADICIONAR NOVAS ROTAS

Ao criar uma nova rota específica:

1. Criar o arquivo `page.js` na pasta apropriada
2. Adicionar o caminho à lista `ignoredPaths` em `[[...slug]]/page.js`
3. Testar a rota diretamente
4. Verificar que não há erros 404 no console

Exemplo para criar `/galeria`:
```javascript
// 1. Criar: frontend/app/(site)/galeria/page.js
// 2. Adicionar em ignoredPaths:
const ignoredPaths = [
  // ... outros
  'galeria',  // ← Adicionar aqui
];
```

---

**Status**: ✅ CORRIGIDO
**Data**: 2026-02-09
**Impacto**: Médio (menos erros no console, melhor performance)
**Arquivo**: `frontend/app/(site)/[[...slug]]/page.js`

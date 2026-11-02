#!/bin/bash

echo "🔧 Limpando e reinstalando dependências do frontend..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: package.json não encontrado!${NC}"
    echo "Execute este script dentro do diretório frontend/"
    exit 1
fi

echo -e "${YELLOW}📦 Removendo node_modules e package-lock.json...${NC}"
rm -rf node_modules package-lock.json

echo -e "${YELLOW}🧹 Limpando cache do npm...${NC}"
npm cache clean --force

echo -e "${YELLOW}🗑️  Limpando cache do Next.js...${NC}"
rm -rf .next

echo -e "${YELLOW}📥 Instalando dependências...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Dependências instaladas com sucesso!${NC}"
    echo ""
    echo -e "${YELLOW}📊 Atualizando browserslist...${NC}"
    npx update-browserslist-db@latest
    echo ""
    echo -e "${GREEN}✨ Tudo pronto!${NC}"
    echo ""
    echo "Para iniciar o servidor, execute:"
    echo -e "${YELLOW}npm run dev${NC}"
else
    echo ""
    echo -e "${RED}❌ Erro ao instalar dependências!${NC}"
    echo "Tente executar manualmente:"
    echo "  npm install"
    exit 1
fi

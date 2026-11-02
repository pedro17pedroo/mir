#!/bin/bash

echo "🧹 Limpando cache do Next.js..."
echo ""

# Limpar .next
if [ -d ".next" ]; then
  echo "✓ Removendo .next/"
  rm -rf .next
fi

# Limpar node_modules/.cache
if [ -d "node_modules/.cache" ]; then
  echo "✓ Removendo node_modules/.cache/"
  rm -rf node_modules/.cache
fi

echo ""
echo "✅ Cache limpo com sucesso!"
echo ""
echo "🚀 Iniciando servidor..."
echo ""

npm run dev

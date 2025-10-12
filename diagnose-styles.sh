#!/bin/bash

echo "🔍 Diagnóstico de Estilos - OctoFi"
echo "=================================="
echo ""

echo "✓ Verificando archivos de configuración..."
echo ""

# Verificar que existan los archivos necesarios
files=(
    "src/index.css"
    "src/main.tsx"
    "tailwind.config.ts"
    "postcss.config.js"
    "index.html"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file existe"
    else
        echo "  ✗ $file NO EXISTE"
    fi
done

echo ""
echo "✓ Verificando importación de estilos en main.tsx..."
if grep -q "import.*index.css" src/main.tsx; then
    echo "  ✓ index.css está importado"
else
    echo "  ✗ index.css NO está importado"
fi

echo ""
echo "✓ Verificando directivas de Tailwind en index.css..."
if grep -q "@tailwind base" src/index.css && \
   grep -q "@tailwind components" src/index.css && \
   grep -q "@tailwind utilities" src/index.css; then
    echo "  ✓ Directivas de Tailwind presentes"
else
    echo "  ✗ Faltan directivas de Tailwind"
fi

echo ""
echo "✓ Verificando dependencias..."
if [ -d "node_modules" ]; then
    echo "  ✓ node_modules existe"
    if [ -d "node_modules/tailwindcss" ]; then
        echo "  ✓ tailwindcss instalado"
    else
        echo "  ✗ tailwindcss NO instalado"
    fi
else
    echo "  ✗ node_modules NO existe - ejecuta 'npm install'"
fi

echo ""
echo "=================================="
echo "Diagnóstico completado"
echo ""
echo "Para iniciar el servidor:"
echo "  npm run dev"
echo ""

# 🔍 Troubleshooting: Dashboard No Carga

## Problema Reportado
La página `http://localhost:8080/dashboard` no carga.

## Pasos de Diagnóstico

### 1. Verificar Consola del Navegador
Abre las **DevTools** del navegador (F12 o Cmd+Option+I en Mac) y ve a la pestaña **Console**. 
Busca errores en rojo que indiquen:
- Módulos no encontrados
- Errores de sintaxis
- Problemas con importaciones

### 2. Verificar Pestaña Network
En DevTools, ve a la pestaña **Network**:
- Verifica que los archivos `.js` se carguen correctamente (status 200)
- Busca archivos con status 404 o errores 500

### 3. Verificar Terminal del Servidor
En la terminal donde corre `npm run dev`, verifica:
- ✅ El servidor inició sin errores
- ✅ Muestra: `VITE ready in XXms` o similar
- ✅ Muestra la URL: `http://localhost:8080`

### 4. Limpiar Caché
```bash
# Detener el servidor (Ctrl+C)
# Limpiar caché de node_modules
rm -rf node_modules/.vite
rm -rf dist

# Reiniciar
npm run dev
```

### 5. Reinstalar Dependencias
Si los pasos anteriores no funcionan:
```bash
# Detener el servidor
rm -rf node_modules
rm -f package-lock.json
npm install
npm run dev
```

## Errores Comunes y Soluciones

### Error: "Cannot find module"
**Solución**: Reinstalar dependencias (paso 5 arriba)

### Página en Blanco sin Errores
**Posibles causas**:
- JavaScript deshabilitado en el navegador
- Extensiones del navegador bloqueando scripts
- Error en un componente hijo que no se muestra

**Solución**: Probar en modo incógnito o con otro navegador

### Error: "Failed to fetch dynamically imported module"
**Solución**: Limpiar caché (paso 4) y recargar con Cmd+Shift+R (Mac) o Ctrl+Shift+R (Windows)

## Dashboard Simplificado de Prueba

Si el problema persiste, he creado una versión simplificada para probar:
- Archivo: `src/pages/DashboardSimple.tsx`
- Ruta de prueba: Cambia temporalmente la ruta en App.tsx

## Información del Sistema
- **Puerto**: 8080
- **Servidor**: Vite + React
- **Build Tool**: SWC
- **Rutas**: React Router DOM con lazy loading

## Próximos Pasos
1. Revisar console del navegador y reportar errores específicos
2. Intentar acceder a otras rutas (/, /about, /stake) para ver si el problema es global
3. Si solo el Dashboard falla, el problema está en ese componente específico

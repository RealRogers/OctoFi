# 🚀 Panel de Control DeFi

Un panel de control moderno y completo para finanzas descentralizadas (DeFi) construido con las últimas tecnologías web. Proporciona una interfaz intuitiva para monitorear portfolios, realizar intercambios de tokens, gestionar staking y supervisar agentes de trading automatizados.

## ✨ Características Principales

- 📊 **Dashboard Completo**: Portfolio de $12,345+ con métricas en tiempo real
- 🔄 **Swap Interface**: Intercambio de tokens con interfaz moderna
- 💰 **Sistema de Staking**: Gestión de posiciones y pools disponibles
- 🤖 **Agente de Trading**: Monitoreo y control de trading automatizado
- 📱 **Responsive Design**: Optimizado para móvil, tablet y desktop
- 🎨 **Dark Theme**: Diseño elegante con gradientes púrpura-azul
- ♿ **Accesibilidad**: ARIA labels y navegación por teclado

## 🛠️ Stack Tecnológico

### Frontend Core
- **React 18** - Librería UI con Concurrent Features
- **TypeScript** - Tipado estático y mejor DX
- **Vite** - Build tool ultra-rápido con HMR
- **React Router DOM** - Routing con lazy loading

### UI & Styling
- **shadcn/ui** - Sistema de componentes moderno (40+ componentes)
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Primitivos accesibles y sin estilos
- **Lucide React** - Iconos SVG optimizados

### State & Data
- **TanStack Query** - Server state management
- **React Hook Form** - Formularios performantes
- **Zod** - Validación de esquemas TypeScript-first

### Testing & Quality
- **Vitest** - Test runner ultra-rápido
- **React Testing Library** - Testing utilities
- **ESLint** - Linting con reglas modernas
- **TypeScript** - Type checking estricto

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/          # Atomic Design Architecture
│   ├── atoms/          # Componentes básicos (StatusIndicator)
│   ├── molecules/      # Componentes compuestos (PositionCard, PoolRow)
│   ├── organisms/      # Secciones complejas (SwapInterface, UserPositions)
│   ├── ui/            # Sistema shadcn/ui (40+ componentes)
│   └── shared/        # Componentes compartidos
├── pages/             # Páginas de la aplicación
│   ├── Dashboard.tsx  # Panel principal con métricas
│   ├── Stake.tsx      # Sistema de staking
│   ├── Swap.tsx       # Interfaz de intercambio
│   └── ...           # Más páginas
├── hooks/             # Custom React hooks
├── lib/              # Utilidades y datos mock
└── tests/            # Configuración de testing
```

## 🚀 Inicio Rápido

### Prerrequisitos
- **Node.js** 18+ 
- **Bun** (recomendado) o npm/yarn

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd panel-defi
   ```

2. **Instala dependencias**
   ```bash
   bun install
   # o npm install
   ```

3. **Inicia el servidor de desarrollo**
   ```bash
   bun run dev
   # o npm run dev
   ```
   
   La aplicación estará disponible en `http://localhost:8080`

### Scripts Disponibles

```bash
bun run dev          # Servidor de desarrollo
bun run build        # Build de producción
bun run build:dev    # Build de desarrollo
bun run preview      # Preview del build
bun run test         # Ejecutar tests
bun run lint         # Linting con ESLint
```

## 📱 Páginas y Funcionalidades

### 🏠 Landing Page (`/`)
- Hero section con gradientes animados
- Sección de características principales
- Call-to-action y footer

### 📊 Dashboard (`/dashboard`)
- **Portfolio Summary**: $12,345.67 con cambios en 24h
- **Gas Fee Tracker**: Indicador en tiempo real (32.5 Gwei)
- **Agent Status**: Estado del agente de trading
- **Assets Table**: ETH, OCTO, DAI con predicciones AI

### 💰 Staking (`/stake`)
- **User Positions**: Ethereum (5.2% APY), Optimism (8.1% APY)
- **Available Pools**: USD Coin, Tether, Arbitrum
- **Actions**: Stake, Claim, Withdraw

### 🔄 Swap (`/swap`)
- **Token Selection**: Interface moderna de selección
- **Price Impact**: Cálculo automático de slippage
- **Transaction Preview**: Confirmación antes de ejecutar

### 🤖 Agent Status (`/agent-status`)
- **Performance Metrics**: ROI, trades exitosos, drawdown
- **Recent Decisions**: Historial de operaciones
- **Controls**: Pause/Resume, configuración de riesgo

## 🎨 Sistema de Diseño

### Colores (HSL)
```css
--primary: 267 84% 65%        /* Púrpura vibrante */
--secondary: 195 92% 58%      /* Azul cyan */
--background: 220 40% 6%      /* Azul muy oscuro */
--accent: 280 85% 68%         /* Magenta */
```

### Gradientes
- **Primary**: `linear-gradient(135deg, hsl(267 84% 65%), hsl(280 85% 68%))`
- **Secondary**: `linear-gradient(135deg, hsl(195 92% 58%), hsl(267 84% 65%))`

### Tipografía
- **Font Family**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700, 800, 900

## 🧪 Testing

```bash
# Ejecutar todos los tests
bun run test

# Tests en modo watch
bun run test --watch

# Coverage report
bun run test --coverage
```

### Estructura de Tests
- **Unit Tests**: Componentes individuales
- **Integration Tests**: Flujos de usuario
- **Setup**: Configurado con Vitest + React Testing Library

## 📦 Build y Deploy

### Build de Producción
```bash
bun run build
```

### Preview Local
```bash
bun run preview
```

### Optimizaciones
- **Code Splitting**: Por rutas con lazy loading
- **Tree Shaking**: Eliminación de código no usado
- **Asset Optimization**: Compresión de imágenes y fonts
- **Bundle Analysis**: Análisis de tamaño de bundles

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convenciones de Código
- **ESLint**: Configuración estricta
- **Prettier**: Formateo automático
- **TypeScript**: Tipado estricto sin `any`
- **Atomic Design**: Organización de componentes

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🔗 Enlaces Útiles

- [Documentación de Vite](https://vitejs.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [TanStack Query](https://tanstack.com/query/)

---

**Estado del Proyecto**: ✅ Production Ready | **Última Actualización**: Diciembre 2024
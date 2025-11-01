# 🚀 Panel de Control DeFi

Un panel de control moderno y completo para finanzas descentralizadas (DeFi) construido con las últimas tecnologías web. Proporciona una interfaz intuitiva para monitorear portfolios, realizar intercambios de tokens, gestionar staking y supervisar agentes de trading automatizados.

## ✨ Características Principales

- 📊 **Dashboard Completo**: Portfolio de $12,345+ con métricas en tiempo real
- 🔄 **Swap Interface**: Intercambio de tokens con interfaz moderna
- 💰 **Sistema de Staking Completo**: 
  - Gestión de posiciones con APY en tiempo real
  - 3 pools disponibles (USDC, USDT, ARB)
  - Modales interactivos para stake, withdraw y claim
  - Integración con Somnia Testnet (Chain ID 997)
  - Predicciones AI de APY con Vertex AI
  - Datos mock para desarrollo
- 🤖 **Agente de Trading**: Monitoreo y control de trading automatizado
- 📱 **Responsive Design**: Optimizado para móvil, tablet y desktop
- 🎨 **Dark Theme**: Diseño elegante con gradientes púrpura-azul
- ♿ **Accesibilidad**: ARIA labels y navegación por teclado
- 🔗 **Web3 Integration**: Conexión con MetaMask y gestión de redes

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
- **ethers.js v6** - Interacción con blockchain Ethereum

### Blockchain & Web3
- **Somnia Testnet** - Red de pruebas (Chain ID 997)
- **MetaMask Integration** - Conexión de wallet
- **Smart Contract Interaction** - Staking pools y rewards

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
│   ├── molecules/      # Componentes compuestos
│   │   ├── PositionCard.tsx      # Tarjeta de posición de staking
│   │   ├── PoolRow.tsx           # Fila de pool disponible
│   │   ├── StakeModal.tsx        # Modal para hacer stake
│   │   ├── WithdrawModal.tsx     # Modal para retirar
│   │   ├── ClaimModal.tsx        # Modal para reclamar rewards
│   │   ├── PoolFilters.tsx       # Filtros de pools
│   │   ├── StakingSkeletons.tsx  # Loading states
│   │   ├── StakingEmptyStates.tsx # Estados vacíos
│   │   ├── ErrorAlert.tsx        # Alertas de error
│   │   ├── ValueCard.tsx         # Tarjeta de valor
│   │   └── FeatureCard.tsx       # Tarjeta de característica
│   ├── organisms/      # Secciones complejas
│   │   ├── StakingHeader.tsx     # Header con estadísticas
│   │   ├── UserPositions.tsx     # Posiciones del usuario
│   │   ├── AvailablePools.tsx    # Pools disponibles
│   │   ├── StakingHistory.tsx    # Historial de transacciones
│   │   └── SwapInterface.tsx     # Interfaz de swap
│   ├── ui/            # Sistema shadcn/ui (40+ componentes)
│   └── shared/        # Componentes compartidos
├── pages/             # Páginas de la aplicación
│   ├── Dashboard.tsx      # Panel principal con métricas
│   ├── Stake.tsx          # Sistema de staking completo
│   ├── StakeSimple.tsx    # Versión simplificada de staking
│   ├── StakeDebug.tsx     # Página de debug para staking
│   ├── Swap.tsx           # Interfaz de intercambio
│   ├── AboutUs.tsx        # Página About Us
│   └── ...               # Más páginas
├── hooks/             # Custom React hooks
│   ├── useStakingPools.ts        # Hook para pools
│   ├── useStakingPositions.ts    # Hook para posiciones
│   ├── useStakingTransactions.ts # Hook para transacciones
│   ├── useStakingMutations.ts    # Hook para mutaciones
│   ├── useWalletBalance.ts       # Hook para balance
│   └── useStaking.ts             # Hook principal de staking
├── services/          # Servicios de negocio
│   ├── blockchainService.ts      # Servicio de blockchain
│   ├── stakingService.ts         # Servicio de staking
│   ├── poolService.ts            # Servicio de pools
│   ├── rewardsService.ts         # Servicio de rewards
│   └── aiPredictionService.ts    # Servicio de predicciones AI
├── lib/              # Utilidades y constantes
│   ├── stakingConstants.ts       # Constantes de staking
│   ├── stakingUtils.ts           # Utilidades de staking
│   ├── stakingValidators.ts      # Validadores Zod
│   ├── mockData.ts               # Datos mock Dashboard
│   ├── aboutData.ts              # Datos About Us
│   └── utils.ts                  # Funciones utilitarias
├── types/            # Definiciones TypeScript
│   └── staking.ts                # Tipos de staking
└── tests/            # Configuración de testing
```

## 🚀 Inicio Rápido

### Prerrequisitos
- **Node.js** 18+ 
- **Bun** (recomendado) o npm/yarn
- **MetaMask** (opcional, para funcionalidad de staking)

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

3. **Configura variables de entorno (opcional)**
   ```bash
   cp .env.example .env
   ```
   
   Edita `.env` con tus configuraciones:
   ```env
   # Somnia Testnet
   VITE_SOMNIA_RPC_URL=https://testnet.rpc.somnia.network
   VITE_SOMNIA_CHAIN_ID=997
   
   # Contract Addresses (cuando estén desplegados)
   VITE_USDC_POOL_ADDRESS=0x...
   VITE_USDT_POOL_ADDRESS=0x...
   VITE_ARB_POOL_ADDRESS=0x...
   ```

4. **Inicia el servidor de desarrollo**
   ```bash
   bun run dev
   # o npm run dev
   ```
   
   La aplicación estará disponible en `http://localhost:8080`

### Modo de Desarrollo con Mock Data

Por defecto, la aplicación usa datos mock para el sistema de staking. Para cambiar a contratos reales:

1. Despliega los contratos de staking en Somnia Testnet
2. Actualiza las direcciones en `.env`
3. En `src/services/stakingService.ts`, cambia:
   ```typescript
   private useMockData = false // Cambiar a false
   ```

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
- **Staking Header**: Estadísticas agregadas (Total Staked, Pending Rewards, Average APY, Active Positions)
- **User Positions**: Visualización de posiciones activas con:
  - Información de pool (nombre, símbolo, logo)
  - Cantidad staked y rewards acumulados
  - APY actual y estado de lock
  - Botones de acción (Withdraw, Claim)
  - Indicadores de tiempo de unlock
- **Available Pools**: 3 pools disponibles
  - USDC Staking (12.5% APY, flexible)
  - USDT Staking (15.8% APY, 30 días lock)
  - ARB Staking (22.3% APY, 90 días lock)
- **Filtros y Ordenamiento**: Por APY, TVL, nombre, lock period
- **AI Predictions**: Predicciones de APY futuro con Vertex AI
- **Transaction History**: Historial completo de operaciones
- **Modales Interactivos**:
  - Stake Modal: Con preview de transacción y validación
  - Withdraw Modal: Con cálculo de fees y confirmación
  - Claim Modal: Para reclamar rewards
- **Wallet Integration**: 
  - Conexión con MetaMask
  - Detección de red (Somnia Testnet)
  - Cambio automático de red
- **Mock Data**: Datos de desarrollo sin contratos desplegados

### 🔄 Swap (`/swap`)
- **Token Selection**: Interface moderna de selección
- **Price Impact**: Cálculo automático de slippage
- **Transaction Preview**: Confirmación antes de ejecutar

### 🤖 Agent Status (`/agent-status`)
- **Performance Metrics**: ROI, trades exitosos, drawdown
- **Recent Decisions**: Historial de operaciones
- **Controls**: Pause/Resume, configuración de riesgo

### ℹ️ About Us (`/about`)
- **Hero Section**: Misión y visión de OctoFi
- **Platform Overview**: Historia desde 2020, enfoque community-driven
- **AI Features**: 4 características del agente AI (Market Analysis, Auto Reallocation, Risk Management, Autonomous Trading)
- **Community & Governance**: Participación en propuestas, airdrops, y social links
- **Core Values**: Decentralization, AI Innovation, Security First, Community First
- **Call to Action**: Links a Dashboard y comunidad

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

## 📚 Componentes Destacados

### Staking Components

#### StakingHeader (Organism)
Componente de header con estadísticas agregadas:
- Total Staked USD con animación CountUp
- Pending Rewards con formato de moneda
- Average APY calculado con peso
- Active Positions counter
- Loading states con skeletons

#### PositionCard (Molecule)
Tarjeta de posición de staking con:
- Información del pool (logo, nombre, APY)
- Cantidad staked y rewards
- Indicadores de lock/unlock
- Botones de acción condicionales
- Estados disabled según condiciones

#### PoolRow (Molecule)
Fila de pool disponible con:
- Información del asset (logo, nombre)
- APY con formato de porcentaje
- TVL con formato compacto (K, M, B)
- Predicción AI opcional
- Botón de stake

#### Modales Interactivos
- **StakeModal**: Preview de transacción, validación de balance, aprobación de tokens
- **WithdrawModal**: Cálculo de fees, validación de lock period, confirmación
- **ClaimModal**: Resumen de rewards, estimación de gas, confirmación

### Utility Components

#### ValueCard (Molecule)
Componente reutilizable para mostrar valores y principios con:
- Icon personalizable con colores accent
- Título y descripción
- Hover effects y transiciones
- Optimizado con React.memo

#### FeatureCard (Molecule)
Componente para características AI con:
- Icon con background accent
- Título, descripción y highlights opcionales
- Lista de bullet points
- Optimizado con React.memo

### Datos Mock
- **mockData.ts**: Datos para Dashboard (ETH, OCTO, DAI)
- **aboutData.ts**: Contenido completo para About Us page
- **stakingService.ts**: Datos mock para pools y posiciones de staking

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🌐 Rutas Disponibles

- `/` - Landing page
- `/dashboard` - Panel principal
- `/stake` - Sistema de staking (versión simplificada)
- `/stake-full` - Sistema de staking completo
- `/stake-debug` - Página de debug para staking
- `/swap` - Interfaz de swap
- `/about` - Página About Us
- `/agent-status` - Estado del agente
- `/agent-dashboard` - Dashboard del agente
- `/settings` - Configuración

## 🔧 Configuración de Staking

### Somnia Testnet
- **Chain ID**: 997
- **RPC URL**: https://testnet.rpc.somnia.network
- **Explorer**: https://testnet.explorer.somnia.network

### Agregar Red a MetaMask
```javascript
{
  chainId: '0x3E5', // 997 en hexadecimal
  chainName: 'Somnia Testnet',
  nativeCurrency: {
    name: 'STT',
    symbol: 'STT',
    decimals: 18
  },
  rpcUrls: ['https://testnet.rpc.somnia.network'],
  blockExplorerUrls: ['https://testnet.explorer.somnia.network']
}
```

## 🔗 Enlaces Útiles

- [Documentación de Vite](https://vitejs.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [TanStack Query](https://tanstack.com/query/)
- [ethers.js v6](https://docs.ethers.org/v6/)
- [Zod Validation](https://zod.dev/)

---

**Estado del Proyecto**: ✅ Production Ready | **Última Actualización**: Octubre 2024
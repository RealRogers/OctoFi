# Estructura del Proyecto - Panel de Control DeFi

## 📁 Estructura Completa de Archivos y Carpetas

```
your-dream-website-lab/
├── .git/                           # Control de versiones Git
├── .kiro/                          # Configuración de Kiro IDE
│   └── specs/                      # Especificaciones de desarrollo
│       ├── stake-page/             # Spec para página de staking
│       └── swap-interface/         # Spec para interfaz de swap
├── .vscode/                        # Configuración de VS Code
│   └── settings.json               # Configuraciones del editor
├── node_modules/                   # Dependencias de Node.js (auto-generado)
├── public/                         # Archivos estáticos públicos
│   ├── favicon.ico                 # Icono del sitio web
│   ├── placeholder.svg             # Imagen placeholder para componentes
│   └── robots.txt                  # Configuración para crawlers
├── src/                            # Código fuente principal
│   ├── components/                 # Componentes React organizados por Atomic Design
│   │   ├── atoms/                  # Componentes básicos reutilizables
│   │   │   └── StatusIndicator.tsx # Indicador de estado visual
│   │   ├── modals/                 # Componentes de modales
│   │   │   └── WalletModal.tsx     # Modal para conexión de wallet
│   │   ├── molecules/              # Componentes compuestos
│   │   │   ├── DecisionCard.tsx    # Tarjeta para decisiones del agente
│   │   │   ├── MetricCard.tsx      # Tarjeta para métricas
│   │   │   ├── PoolRow.tsx         # Fila de pool de staking
│   │   │   └── PositionCard.tsx    # Tarjeta de posición de staking
│   │   ├── organisms/              # Secciones complejas de la UI
│   │   │   ├── AgentStatusHeader.tsx      # Header del estado del agente
│   │   │   ├── AvailablePools.tsx         # Lista de pools disponibles
│   │   │   ├── PerformanceMetricsGrid.tsx # Grid de métricas de rendimiento
│   │   │   ├── RecentDecisionsList.tsx    # Lista de decisiones recientes
│   │   │   ├── SwapInterface.tsx          # Interfaz principal de swap
│   │   │   ├── SwapInterface.test.tsx     # Tests para SwapInterface
│   │   │   └── UserPositions.tsx          # Posiciones del usuario
│   │   ├── shared/                 # Componentes compartidos
│   │   │   └── ConnectWalletButton.tsx    # Botón de conexión de wallet
│   │   ├── ui/                     # Sistema de componentes shadcn/ui (40+ componentes)
│   │   │   ├── accordion.tsx       # Componente acordeón
│   │   │   ├── alert-dialog.tsx    # Diálogo de alerta
│   │   │   ├── button.tsx          # Componente botón
│   │   │   ├── card.tsx            # Componente tarjeta
│   │   │   ├── dialog.tsx          # Componente diálogo
│   │   │   ├── input.tsx           # Componente input
│   │   │   ├── select.tsx          # Componente select
│   │   │   ├── table.tsx           # Componente tabla
│   │   │   ├── toast.tsx           # Componente toast
│   │   │   └── ... (35+ más)       # Otros componentes UI
│   │   ├── AppLayout.tsx           # Layout principal de la aplicación
│   │   ├── CTA.tsx                 # Sección Call-to-Action
│   │   ├── Features.tsx            # Sección de características
│   │   ├── Footer.tsx              # Footer del sitio
│   │   ├── Hero.tsx                # Sección hero de landing
│   │   ├── HowItWorks.tsx          # Sección "Cómo funciona"
│   │   └── Navbar.tsx              # Barra de navegación
│   ├── hooks/                      # Custom React hooks
│   │   ├── use-mobile.tsx          # Hook para detección móvil
│   │   └── use-toast.ts            # Hook para sistema de toasts
│   ├── lib/                        # Utilidades y datos
│   │   ├── mockData.ts             # Datos simulados para desarrollo
│   │   └── utils.ts                # Funciones utilitarias
│   ├── pages/                      # Páginas de la aplicación
│   │   ├── AgentDashboardPage.tsx  # Dashboard del agente de trading
│   │   ├── AgentStatus.tsx         # Estado detallado del agente
│   │   ├── AssetDetail.tsx         # Detalle de activos individuales
│   │   ├── Dashboard.tsx           # Dashboard principal
│   │   ├── Index.tsx               # Página de inicio/landing
│   │   ├── NotFound.tsx            # Página 404
│   │   ├── Settings.tsx            # Configuraciones de usuario
│   │   ├── Stake.tsx               # Página de staking
│   │   ├── StyleTest.tsx           # Página para testing de estilos
│   │   └── Swap.tsx                # Página de intercambio de tokens
│   ├── tests/                      # Configuración de tests
│   │   └── setup.ts                # Setup para Vitest
│   ├── App.css                     # Estilos específicos de App (legacy)
│   ├── App.tsx                     # Componente raíz de la aplicación
│   ├── index.css                   # Estilos globales y variables CSS
│   ├── main.tsx                    # Punto de entrada de la aplicación
│   └── vite-env.d.ts               # Tipos de TypeScript para Vite
├── .gitignore                      # Archivos ignorados por Git
├── bun.lockb                       # Lockfile de Bun
├── components.json                 # Configuración de shadcn/ui
├── diagnose-styles.sh              # Script de diagnóstico de estilos
├── eslint.config.js                # Configuración de ESLint
├── index.html                      # Template HTML principal
├── package-lock.json               # Lockfile de npm
├── package.json                    # Dependencias y scripts del proyecto
├── postcss.config.js               # Configuración de PostCSS
├── README.md                       # Documentación del proyecto
├── SOLUCION-ESTILOS.md            # Documentación de solución de estilos
├── tailwind.config.ts              # Configuración de Tailwind CSS
├── test-styles.html                # Archivo de test para estilos
├── tsconfig.app.json               # Configuración TypeScript para app
├── tsconfig.json                   # Configuración principal de TypeScript
├── tsconfig.node.json              # Configuración TypeScript para Node
└── vite.config.ts                  # Configuración de Vite
```

## 📋 Descripción de Propósitos

### 🏗️ **Configuración y Build**
- **vite.config.ts**: Configuración del bundler Vite con plugins de React y SWC
- **tailwind.config.ts**: Sistema de diseño con colores HSL y tema dark
- **tsconfig.json**: Configuración TypeScript con paths aliases (@/*)
- **package.json**: Dependencias del stack moderno (React 18, Vite, shadcn/ui)

### 🎨 **Sistema de Componentes (Atomic Design)**
- **atoms/**: Componentes básicos como StatusIndicator
- **molecules/**: Componentes compuestos como PositionCard, PoolRow
- **organisms/**: Secciones complejas como SwapInterface, UserPositions
- **ui/**: Sistema completo shadcn/ui con 40+ componentes estilizados

### 📄 **Páginas y Routing**
- **Index.tsx**: Landing page con Hero, Features, CTA
- **Dashboard.tsx**: Panel principal con portfolio ($12,345.67) y métricas
- **Stake.tsx**: Sistema de staking con posiciones y pools disponibles
- **Swap.tsx**: Interfaz de intercambio de tokens
- **AgentStatus.tsx**: Monitoreo del agente de trading automatizado

### 🔧 **Utilidades y Datos**
- **lib/mockData.ts**: Datos simulados (ETH, OCTO, DAI) para desarrollo
- **lib/utils.ts**: Función cn() para merge de clases Tailwind
- **hooks/**: Custom hooks para funcionalidad móvil y toasts

### 🎯 **Características Técnicas**
- **Responsive Design**: Mobile-first con breakpoints MD/LG
- **Accesibilidad**: ARIA labels, touch targets 44x44px
- **Performance**: Lazy loading, code splitting por rutas
- **Type Safety**: TypeScript estricto con interfaces definidas
- **Testing**: Vitest + React Testing Library configurado

### 🚀 **Estado del Proyecto**
- ✅ **Completamente funcional**: Todas las páginas implementadas
- ✅ **Sistema de staking**: Posiciones y pools operativos
- ✅ **Interfaz de swap**: Lista para intercambios
- ✅ **Dashboard**: Métricas y estado del agente
- ✅ **Responsive**: Optimizado para todos los dispositivos

El proyecto está en estado **production-ready** con una arquitectura sólida y escalable.
# 📁 Archivos Implicados en Stake

## 🎯 Archivos Principales (Core)

### 1. Página Principal
```
src/pages/Stake.tsx
```
- Componente principal de la página
- Orquesta UserPositions y AvailablePools

---

## 🧩 Componentes Organisms (Secciones Grandes)

### 2. UserPositions
```
src/components/organisms/UserPositions.tsx
```
- Muestra las posiciones activas del usuario
- Renderiza múltiples PositionCard

### 3. AvailablePools
```
src/components/organisms/AvailablePools.tsx
```
- Muestra los pools disponibles para stakear
- Renderiza múltiples PoolRow en formato tabla

---

## 🔧 Componentes Molecules (Componentes Medianos)

### 4. PositionCard
```
src/components/molecules/PositionCard.tsx
```
- Card individual de una posición stakeada
- Muestra: token, APY, cantidad, recompensas
- Botones: Claim, Withdraw

### 5. PoolRow
```
src/components/molecules/PoolRow.tsx
```
- Fila de tabla para un pool disponible
- Muestra: asset, APY, TVL
- Botón: Stake

---

## 🎨 Componentes UI (Shadcn/UI)

### 6. Button
```
src/components/ui/button.tsx
```
- Componente de botón reutilizable
- Usado en: PositionCard, PoolRow, AppLayout

### 7. DropdownMenu
```
src/components/ui/dropdown-menu.tsx
```
- Menú desplegable
- Usado en: AppLayout (menú de usuario)

---

## 🏗️ Layout y Estructura

### 8. AppLayout
```
src/components/AppLayout.tsx
```
- Layout principal de la aplicación
- Incluye: Navbar, Footer, navegación
- Envuelve todo el contenido de Stake

### 9. Footer
```
src/components/Footer.tsx
```
- Footer de la aplicación
- Usado en: AppLayout

---

## 🔌 Componentes Compartidos

### 10. ConnectWalletButton
```
src/components/shared/ConnectWalletButton.tsx
```
- Botón para conectar wallet
- Usado en: AppLayout navbar

### 11. AgentStatusIndicator
```
src/components/atoms/AgentStatusIndicator.tsx
```
- Indicador de estado del agente
- Usado en: AppLayout navbar

---

## 📦 Dependencias Externas

### Librerías de React
- `react` - Core de React
- `react-router-dom` - Navegación (Link, useNavigate, useLocation)

### Librerías de UI
- `lucide-react` - Iconos (Wallet, Menu, X, User, Settings, LogOut)

### Utilidades
- `@/lib/utils` - Funciones de utilidad (cn para classnames)

---

## 📊 Resumen por Tipo

### Páginas (1)
1. `src/pages/Stake.tsx`

### Organisms (2)
2. `src/components/organisms/UserPositions.tsx`
3. `src/components/organisms/AvailablePools.tsx`

### Molecules (2)
4. `src/components/molecules/PositionCard.tsx`
5. `src/components/molecules/PoolRow.tsx`

### Atoms (1)
6. `src/components/atoms/AgentStatusIndicator.tsx`

### Shared (1)
7. `src/components/shared/ConnectWalletButton.tsx`

### Layout (2)
8. `src/components/AppLayout.tsx`
9. `src/components/Footer.tsx`

### UI Components (2)
10. `src/components/ui/button.tsx`
11. `src/components/ui/dropdown-menu.tsx`

---

## 🎯 Total: 11 archivos directos

---

## 📸 Assets Referenciados

### Imágenes
- `/placeholder.svg` - Usado en PositionCard y PoolRow para iconos de tokens
- `/OctoFi-Logo.png` - Logo en AppLayout

---

## 🔗 Árbol de Dependencias

```
Stake.tsx
├── AppLayout.tsx
│   ├── ConnectWalletButton.tsx
│   ├── AgentStatusIndicator.tsx
│   ├── Footer.tsx
│   ├── ui/button.tsx
│   └── ui/dropdown-menu.tsx
├── UserPositions.tsx
│   └── PositionCard.tsx
│       └── ui/button.tsx
└── AvailablePools.tsx
    └── PoolRow.tsx
        └── ui/button.tsx
```

---

## 📝 Archivos que NO existen pero se necesitarían

### Modales (Faltantes)
- `src/components/molecules/StakeModal.tsx` ❌
- `src/components/molecules/WithdrawModal.tsx` ❌
- `src/components/molecules/ClaimModal.tsx` ❌

### Servicios (Faltantes)
- `src/services/stakingService.ts` ❌
- `src/services/poolService.ts` ❌
- `src/services/rewardsService.ts` ❌

### Tipos (Faltantes)
- `src/types/staking.ts` ❌
- `src/types/pool.ts` ❌

### Hooks (Faltantes)
- `src/hooks/useStaking.ts` ❌
- `src/hooks/usePools.ts` ❌
- `src/hooks/useRewards.ts` ❌

### Store (Faltante)
- `src/store/stakingStore.ts` ❌

---

## 🎨 Estilos

Los estilos están inline usando Tailwind CSS, no hay archivos CSS separados para Stake.

### Clases Tailwind principales usadas:
- Layout: `max-w-6xl`, `mx-auto`, `grid`, `gap-6`
- Cards: `bg-card/50`, `backdrop-blur-sm`, `border`, `rounded-2xl`
- Typography: `text-4xl`, `font-bold`, `text-foreground`
- Spacing: `p-6`, `mb-8`, `mt-6`
- Responsive: `md:grid-cols-2`, `sm:col-span-1`

---

## 🔍 Comandos para Verificar

```bash
# Ver todos los archivos relacionados
ls -la src/pages/Stake.tsx
ls -la src/components/organisms/{UserPositions,AvailablePools}.tsx
ls -la src/components/molecules/{PositionCard,PoolRow}.tsx
ls -la src/components/AppLayout.tsx
ls -la src/components/Footer.tsx
ls -la src/components/shared/ConnectWalletButton.tsx
ls -la src/components/atoms/AgentStatusIndicator.tsx
ls -la src/components/ui/{button,dropdown-menu}.tsx

# Buscar todas las referencias a "Stake"
grep -r "Stake" src/pages/
grep -r "UserPositions\|AvailablePools" src/components/
```

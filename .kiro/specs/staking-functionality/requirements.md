# Requirements Document

## Introduction

Este documento define los requisitos para implementar la funcionalidad completa de staking en la plataforma OctoFi. El sistema permitirá a los usuarios stakear tokens en pools de liquidez, retirar fondos, reclamar recompensas y visualizar información detallada sobre sus posiciones y pools disponibles. La implementación incluirá integración con Somnia Testnet blockchain, validaciones robustas, modales interactivos, estados de UI apropiados, y características avanzadas como filtros, calculadora de rendimientos y predicciones de APY potenciadas por AI.

## Glossary

- **Staking System**: El sistema completo que gestiona el staking de tokens en OctoFi
- **User**: Usuario de la plataforma que interactúa con el sistema de staking
- **Pool**: Contrato inteligente que acepta tokens stakeados y distribuye recompensas
- **Position**: Cantidad de tokens que un usuario tiene stakeada en un pool específico
- **Wallet**: Billetera Web3 del usuario (MetaMask u otra compatible)
- **Transaction**: Operación blockchain (stake, withdraw, claim)
- **APY**: Annual Percentage Yield - rendimiento anual porcentual
- **TVL**: Total Value Locked - valor total bloqueado en un pool
- **Somnia Testnet**: Red blockchain de prueba con Chain ID 997
- **Modal**: Diálogo interactivo para realizar acciones
- **AI Agent**: Componente de inteligencia artificial que predice rendimientos
- **DIA Oracle**: Servicio que proporciona datos de precios y APY en tiempo real

## Requirements

### Requirement 1: Stake Modal Interaction

**User Story:** Como usuario, quiero abrir un modal para stakear tokens en un pool, para poder ingresar la cantidad deseada y confirmar la transacción de manera segura.

#### Acceptance Criteria

1. WHEN el usuario hace click en el botón "Stake" de un pool, THE Staking System SHALL mostrar el StakeModal con información del pool seleccionado
2. WHILE el StakeModal está abierto, THE Staking System SHALL mostrar el balance disponible del token en la wallet del usuario
3. WHEN el usuario ingresa una cantidad en el input del StakeModal, THE Staking System SHALL validar que la cantidad no exceda el balance disponible
4. WHEN el usuario ingresa una cantidad válida, THE Staking System SHALL calcular y mostrar la cantidad estimada de recompensas y el APY proyectado
5. IF el token requiere aprobación, THEN THE Staking System SHALL mostrar un paso de aprobación antes del stake

### Requirement 2: Token Approval Process

**User Story:** Como usuario, quiero aprobar el uso de mis tokens por el contrato de staking, para poder completar la transacción de stake de manera segura.

#### Acceptance Criteria

1. WHEN el usuario intenta stakear un token sin aprobación previa, THE Staking System SHALL detectar la falta de aprobación
2. WHEN se requiere aprobación, THE Staking System SHALL mostrar un botón "Approve" en el modal
3. WHEN el usuario hace click en "Approve", THE Staking System SHALL iniciar una transacción de aprobación en la blockchain
4. WHILE la transacción de aprobación está pendiente, THE Staking System SHALL mostrar un indicador de carga con el estado "Approving..."
5. WHEN la aprobación se completa exitosamente, THE Staking System SHALL habilitar el botón "Stake" y actualizar el estado del modal

### Requirement 3: Stake Transaction Execution

**User Story:** Como usuario, quiero ejecutar una transacción de stake, para poder depositar mis tokens en el pool y comenzar a ganar recompensas.

#### Acceptance Criteria

1. WHEN el usuario hace click en "Stake" con una cantidad válida, THE Staking System SHALL iniciar una transacción de stake en Somnia Testnet
2. WHILE la transacción está pendiente, THE Staking System SHALL mostrar un indicador de progreso con el mensaje "Staking in progress..."
3. WHEN la transacción se confirma exitosamente, THE Staking System SHALL mostrar un toast de éxito con el hash de la transacción
4. WHEN la transacción se confirma, THE Staking System SHALL actualizar la lista de posiciones del usuario automáticamente
5. IF la transacción falla, THEN THE Staking System SHALL mostrar un mensaje de error descriptivo y mantener el modal abierto

### Requirement 4: Withdraw Modal Interaction

**User Story:** Como usuario, quiero abrir un modal para retirar tokens de mi posición, para poder recuperar mis fondos stakeados cuando lo desee.

#### Acceptance Criteria

1. WHEN el usuario hace click en "Withdraw" en una posición activa, THE Staking System SHALL mostrar el WithdrawModal con detalles de la posición
2. WHILE el WithdrawModal está abierto, THE Staking System SHALL mostrar la cantidad total stakeada disponible para retiro
3. WHEN el usuario ingresa una cantidad en el WithdrawModal, THE Staking System SHALL validar que no exceda la cantidad stakeada
4. WHEN el usuario ingresa una cantidad válida, THE Staking System SHALL calcular y mostrar las recompensas pendientes que se perderían
5. WHERE el pool tiene período de lock, THE Staking System SHALL mostrar el tiempo restante antes de poder retirar

### Requirement 5: Withdraw Transaction Execution

**User Story:** Como usuario, quiero ejecutar una transacción de retiro, para poder recuperar mis tokens stakeados del pool.

#### Acceptance Criteria

1. WHEN el usuario hace click en "Withdraw" con una cantidad válida, THE Staking System SHALL iniciar una transacción de retiro en Somnia Testnet
2. WHILE la transacción de retiro está pendiente, THE Staking System SHALL mostrar un indicador de progreso
3. WHEN la transacción se confirma exitosamente, THE Staking System SHALL actualizar el balance de la wallet y la lista de posiciones
4. WHEN el retiro se completa, THE Staking System SHALL mostrar un toast de éxito con la cantidad retirada
5. IF el período de lock no ha expirado, THEN THE Staking System SHALL prevenir la transacción y mostrar un mensaje explicativo

### Requirement 6: Claim Rewards Modal

**User Story:** Como usuario, quiero reclamar mis recompensas acumuladas, para poder recibir los tokens ganados por mi staking.

#### Acceptance Criteria

1. WHEN el usuario hace click en "Claim" en una posición con recompensas, THE Staking System SHALL mostrar el ClaimModal con el monto de recompensas
2. WHILE el ClaimModal está abierto, THE Staking System SHALL mostrar el valor en USD de las recompensas
3. WHEN el usuario confirma el claim, THE Staking System SHALL iniciar una transacción de claim en Somnia Testnet
4. WHEN la transacción se confirma, THE Staking System SHALL actualizar el balance de recompensas a cero
5. IF no hay recompensas disponibles, THEN THE Staking System SHALL deshabilitar el botón "Claim"

### Requirement 7: Balance Validation

**User Story:** Como usuario, quiero que el sistema valide mi balance antes de permitir transacciones, para evitar errores y transacciones fallidas.

#### Acceptance Criteria

1. WHEN el usuario abre un modal de stake, THE Staking System SHALL consultar el balance del token en la wallet del usuario
2. WHEN el usuario ingresa una cantidad, THE Staking System SHALL validar en tiempo real que no exceda el balance disponible
3. IF el usuario intenta stakear más de su balance, THEN THE Staking System SHALL mostrar un mensaje de error "Insufficient balance"
4. WHEN el balance es insuficiente, THE Staking System SHALL deshabilitar el botón de confirmación
5. WHILE el usuario edita la cantidad, THE Staking System SHALL actualizar la validación dinámicamente

### Requirement 8: Amount Validation

**User Story:** Como usuario, quiero que el sistema valide las cantidades que ingreso, para asegurar que cumplen con los requisitos mínimos y máximos del pool.

#### Acceptance Criteria

1. WHEN un pool define una cantidad mínima de stake, THE Staking System SHALL validar que la cantidad ingresada cumpla el mínimo
2. WHEN un pool define una cantidad máxima de stake, THE Staking System SHALL validar que la cantidad ingresada no exceda el máximo
3. IF la cantidad es menor al mínimo, THEN THE Staking System SHALL mostrar el mensaje "Minimum stake amount is X tokens"
4. IF la cantidad excede el máximo, THEN THE Staking System SHALL mostrar el mensaje "Maximum stake amount is X tokens"
5. WHEN la cantidad es válida, THE Staking System SHALL mostrar un indicador visual de validación exitosa

### Requirement 9: Loading States

**User Story:** Como usuario, quiero ver indicadores de carga durante las operaciones, para saber que el sistema está procesando mi solicitud.

#### Acceptance Criteria

1. WHEN la página de Stake se carga inicialmente, THE Staking System SHALL mostrar skeleton loaders para pools y posiciones
2. WHILE se está ejecutando una transacción, THE Staking System SHALL mostrar un spinner en el botón de acción
3. WHEN se están cargando datos de pools, THE Staking System SHALL mostrar skeleton cards en la sección de pools disponibles
4. WHEN se están cargando posiciones del usuario, THE Staking System SHALL mostrar skeleton cards en la sección de posiciones
5. WHILE se consulta el balance de la wallet, THE Staking System SHALL mostrar un indicador de carga en el campo de balance

### Requirement 10: Empty States

**User Story:** Como usuario, quiero ver mensajes informativos cuando no hay datos disponibles, para entender el estado actual y qué acciones puedo tomar.

#### Acceptance Criteria

1. WHEN el usuario no tiene posiciones activas, THE Staking System SHALL mostrar un empty state con el mensaje "No active positions yet"
2. WHEN no hay pools disponibles, THE Staking System SHALL mostrar un empty state con el mensaje "No pools available"
3. WHEN el empty state se muestra en posiciones, THE Staking System SHALL incluir un botón CTA "Explore Pools"
4. WHEN la wallet no está conectada, THE Staking System SHALL mostrar un empty state con el botón "Connect Wallet"
5. WHEN se muestra un empty state, THE Staking System SHALL incluir un ícono ilustrativo relevante

### Requirement 11: Error Handling

**User Story:** Como usuario, quiero recibir mensajes de error claros cuando algo falla, para entender qué salió mal y cómo solucionarlo.

#### Acceptance Criteria

1. WHEN una transacción falla en la blockchain, THE Staking System SHALL mostrar un toast con el mensaje de error específico
2. WHEN el usuario rechaza una transacción en la wallet, THE Staking System SHALL mostrar el mensaje "Transaction rejected by user"
3. IF hay un error de red, THEN THE Staking System SHALL mostrar el mensaje "Network error. Please check your connection"
4. WHEN ocurre un error de contrato, THE Staking System SHALL mostrar el mensaje de error del contrato
5. WHEN se muestra un error, THE Staking System SHALL incluir un botón "Try Again" para reintentar la operación

### Requirement 12: Dynamic Pool Data

**User Story:** Como usuario, quiero ver datos actualizados de los pools en tiempo real, para tomar decisiones informadas sobre dónde stakear.

#### Acceptance Criteria

1. WHEN la página se carga, THE Staking System SHALL consultar los datos de pools desde Somnia Testnet
2. WHEN se obtienen datos de pools, THE Staking System SHALL mostrar APY, TVL y tokens disponibles para cada pool
3. WHILE el usuario está en la página, THE Staking System SHALL actualizar los datos de pools cada 30 segundos
4. WHEN se actualiza un pool, THE Staking System SHALL animar el cambio de valores para indicar la actualización
5. WHERE DIA Oracle está disponible, THE Staking System SHALL obtener APY y precios desde el oracle

### Requirement 13: Dynamic Position Data

**User Story:** Como usuario, quiero ver mis posiciones actualizadas en tiempo real, para monitorear mis inversiones y recompensas acumuladas.

#### Acceptance Criteria

1. WHEN la wallet está conectada, THE Staking System SHALL consultar las posiciones del usuario desde Somnia Testnet
2. WHEN se obtienen posiciones, THE Staking System SHALL mostrar cantidad stakeada, recompensas acumuladas y APY actual
3. WHILE el usuario está en la página, THE Staking System SHALL actualizar las recompensas cada 10 segundos
4. WHEN las recompensas aumentan, THE Staking System SHALL animar el incremento del valor
5. WHEN una transacción se confirma, THE Staking System SHALL refrescar inmediatamente los datos de posiciones

### Requirement 14: Pool Details Expansion

**User Story:** Como usuario, quiero ver detalles adicionales de un pool al hacer click, para obtener más información antes de stakear.

#### Acceptance Criteria

1. WHEN el usuario hace click en un pool, THE Staking System SHALL expandir el PoolRow mostrando detalles adicionales
2. WHEN un pool se expande, THE Staking System SHALL mostrar información de lock period, fees, y total stakers
3. WHILE un pool está expandido, THE Staking System SHALL mostrar un gráfico de rendimiento histórico del APY
4. WHEN el usuario hace click nuevamente, THE Staking System SHALL colapsar el pool ocultando los detalles
5. WHERE hay información de AI predictions, THE Staking System SHALL mostrar el APY predicho en los detalles

### Requirement 15: Transaction History

**User Story:** Como usuario, quiero ver un historial de mis transacciones de staking, para llevar un registro de mis operaciones.

#### Acceptance Criteria

1. WHEN el usuario navega a la sección de historial, THE Staking System SHALL mostrar una tabla con transacciones pasadas
2. WHEN se muestra el historial, THE Staking System SHALL incluir tipo de transacción, cantidad, fecha y hash
3. WHEN el usuario hace click en un hash de transacción, THE Staking System SHALL abrir el explorador de blockchain en una nueva pestaña
4. WHILE se carga el historial, THE Staking System SHALL mostrar un skeleton loader de tabla
5. WHERE no hay transacciones, THE Staking System SHALL mostrar un empty state "No transactions yet"

### Requirement 16: Rewards Calculator

**User Story:** Como usuario, quiero usar una calculadora para estimar mis recompensas futuras, para planificar mis inversiones de staking.

#### Acceptance Criteria

1. WHEN el usuario abre la calculadora, THE Staking System SHALL mostrar inputs para cantidad y período de tiempo
2. WHEN el usuario ingresa una cantidad y período, THE Staking System SHALL calcular las recompensas estimadas basadas en el APY actual
3. WHEN se calcula, THE Staking System SHALL mostrar el resultado en tokens y valor USD
4. WHILE el usuario ajusta los valores, THE Staking System SHALL actualizar el cálculo en tiempo real
5. WHERE hay predicción de AI, THE Staking System SHALL mostrar dos escenarios: APY actual y APY predicho

### Requirement 17: Pool Filtering

**User Story:** Como usuario, quiero filtrar los pools disponibles, para encontrar fácilmente las opciones que me interesan.

#### Acceptance Criteria

1. WHEN el usuario hace click en el filtro de APY, THE Staking System SHALL mostrar opciones de rango de APY
2. WHEN se selecciona un filtro, THE Staking System SHALL mostrar solo los pools que cumplen el criterio
3. WHEN se aplican múltiples filtros, THE Staking System SHALL combinar los criterios con lógica AND
4. WHEN el usuario limpia los filtros, THE Staking System SHALL mostrar todos los pools nuevamente
5. WHILE los filtros están activos, THE Staking System SHALL mostrar un badge indicando el número de filtros aplicados

### Requirement 18: Pool Search

**User Story:** Como usuario, quiero buscar pools por nombre de token, para encontrar rápidamente un pool específico.

#### Acceptance Criteria

1. WHEN el usuario escribe en el campo de búsqueda, THE Staking System SHALL filtrar pools que coincidan con el texto
2. WHEN se ingresa texto, THE Staking System SHALL buscar en nombre de token, símbolo y descripción del pool
3. WHILE el usuario escribe, THE Staking System SHALL actualizar los resultados dinámicamente sin delay perceptible
4. WHEN no hay resultados, THE Staking System SHALL mostrar el mensaje "No pools found matching your search"
5. WHEN el usuario limpia la búsqueda, THE Staking System SHALL mostrar todos los pools disponibles

### Requirement 19: Pool Sorting

**User Story:** Como usuario, quiero ordenar los pools por diferentes criterios, para encontrar las mejores oportunidades según mis preferencias.

#### Acceptance Criteria

1. WHEN el usuario hace click en el header de columna APY, THE Staking System SHALL ordenar los pools por APY descendente
2. WHEN el usuario hace click nuevamente en el mismo header, THE Staking System SHALL invertir el orden de clasificación
3. WHEN se ordena por TVL, THE Staking System SHALL mostrar primero los pools con mayor valor bloqueado
4. WHEN se aplica un ordenamiento, THE Staking System SHALL mostrar un ícono indicando la dirección del sort
5. THE Staking System SHALL permitir ordenar por APY, TVL, nombre de token y fecha de creación

### Requirement 20: Header Statistics

**User Story:** Como usuario, quiero ver estadísticas generales de mi staking en un header, para tener una vista rápida de mi situación total.

#### Acceptance Criteria

1. WHEN la wallet está conectada, THE Staking System SHALL mostrar el total stakeado en USD en el header
2. WHEN hay posiciones activas, THE Staking System SHALL mostrar el total de recompensas pendientes en el header
3. WHEN se calculan estadísticas, THE Staking System SHALL mostrar el APY promedio ponderado de todas las posiciones
4. WHILE se cargan las estadísticas, THE Staking System SHALL mostrar skeleton loaders en el header
5. WHEN las estadísticas se actualizan, THE Staking System SHALL animar los cambios de valores

### Requirement 21: Yield Performance Chart

**User Story:** Como usuario, quiero ver un gráfico de rendimiento histórico, para analizar cómo han evolucionado mis recompensas en el tiempo.

#### Acceptance Criteria

1. WHEN el usuario navega a la sección de gráficos, THE Staking System SHALL mostrar un gráfico de línea con rendimiento histórico
2. WHEN se muestra el gráfico, THE Staking System SHALL incluir datos de los últimos 30 días por defecto
3. WHEN el usuario selecciona un período diferente, THE Staking System SHALL actualizar el gráfico con los datos correspondientes
4. WHEN el usuario hace hover sobre el gráfico, THE Staking System SHALL mostrar un tooltip con valores exactos
5. WHERE hay múltiples posiciones, THE Staking System SHALL mostrar líneas separadas por cada pool

### Requirement 22: AI Predicted APY

**User Story:** Como usuario, quiero ver predicciones de APY generadas por AI, para tomar decisiones más informadas sobre mis inversiones.

#### Acceptance Criteria

1. WHEN se muestra un pool, THE Staking System SHALL consultar la predicción de APY desde el AI Agent
2. WHEN hay predicción disponible, THE Staking System SHALL mostrar el APY predicho junto al APY actual
3. WHEN se muestra predicción, THE Staking System SHALL incluir un badge "AI Predicted" para distinguirla
4. WHERE la predicción difiere significativamente del APY actual, THE Staking System SHALL mostrar un indicador de tendencia
5. IF el AI Agent no está disponible, THEN THE Staking System SHALL ocultar la sección de predicción sin afectar funcionalidad

### Requirement 23: Wallet Connection Integration

**User Story:** Como usuario, quiero conectar mi wallet para interactuar con el sistema de staking, para poder realizar transacciones en la blockchain.

#### Acceptance Criteria

1. WHEN el usuario no tiene wallet conectada, THE Staking System SHALL mostrar un botón "Connect Wallet" prominente
2. WHEN el usuario hace click en "Connect Wallet", THE Staking System SHALL abrir el modal de conexión de wallet
3. WHEN la wallet se conecta exitosamente, THE Staking System SHALL cargar automáticamente las posiciones del usuario
4. WHEN la wallet está conectada, THE Staking System SHALL mostrar la dirección abreviada en el header
5. IF la wallet está en una red incorrecta, THEN THE Staking System SHALL mostrar un mensaje solicitando cambiar a Somnia Testnet

### Requirement 24: Network Validation

**User Story:** Como usuario, quiero que el sistema valide que estoy en la red correcta, para evitar transacciones en la blockchain equivocada.

#### Acceptance Criteria

1. WHEN la wallet se conecta, THE Staking System SHALL verificar que el Chain ID sea 997 (Somnia Testnet)
2. IF el Chain ID es incorrecto, THEN THE Staking System SHALL mostrar un banner de advertencia en la parte superior
3. WHEN se muestra la advertencia, THE Staking System SHALL incluir un botón "Switch Network" para cambiar automáticamente
4. WHEN el usuario hace click en "Switch Network", THE Staking System SHALL solicitar a la wallet cambiar a Somnia Testnet
5. WHEN la red es correcta, THE Staking System SHALL ocultar cualquier advertencia de red

### Requirement 25: Transaction Preview

**User Story:** Como usuario, quiero ver un preview de mi transacción antes de confirmarla, para verificar todos los detalles antes de ejecutarla.

#### Acceptance Criteria

1. WHEN el usuario está por confirmar una transacción, THE Staking System SHALL mostrar un resumen con todos los detalles
2. WHEN se muestra el preview, THE Staking System SHALL incluir cantidad, fees estimados y gas cost
3. WHEN hay slippage aplicable, THE Staking System SHALL mostrar el slippage tolerance y cantidad mínima a recibir
4. WHEN el usuario revisa el preview, THE Staking System SHALL mostrar el tiempo estimado de confirmación
5. WHERE hay riesgos identificados, THE Staking System SHALL mostrar advertencias en el preview

### Requirement 26: Responsive Design

**User Story:** Como usuario móvil, quiero que la interfaz de staking sea completamente funcional en mi dispositivo, para poder gestionar mis inversiones desde cualquier lugar.

#### Acceptance Criteria

1. WHEN la página se visualiza en móvil, THE Staking System SHALL adaptar el layout a una columna única
2. WHEN se abre un modal en móvil, THE Staking System SHALL ocupar toda la pantalla para mejor usabilidad
3. WHEN se muestran tablas en móvil, THE Staking System SHALL convertirlas a cards apiladas verticalmente
4. WHEN el usuario interactúa con inputs en móvil, THE Staking System SHALL asegurar que el teclado no oculte contenido importante
5. THE Staking System SHALL mantener todas las funcionalidades disponibles en desktop también en móvil

### Requirement 27: Accessibility Compliance

**User Story:** Como usuario con necesidades de accesibilidad, quiero que la interfaz sea completamente navegable y usable, para poder gestionar mi staking de manera independiente.

#### Acceptance Criteria

1. WHEN se navega con teclado, THE Staking System SHALL permitir acceder a todos los elementos interactivos con Tab
2. WHEN un modal se abre, THE Staking System SHALL mover el foco al primer elemento interactivo del modal
3. WHEN se muestran elementos interactivos, THE Staking System SHALL incluir aria-labels descriptivos
4. WHEN hay cambios de estado, THE Staking System SHALL anunciar los cambios a lectores de pantalla
5. THE Staking System SHALL mantener un ratio de contraste mínimo de 4.5:1 para todo el texto

### Requirement 28: Gas Estimation

**User Story:** Como usuario, quiero ver una estimación del costo de gas antes de confirmar una transacción, para decidir si proceder con la operación.

#### Acceptance Criteria

1. WHEN se prepara una transacción, THE Staking System SHALL estimar el gas cost en la red Somnia
2. WHEN se muestra el gas cost, THE Staking System SHALL incluir el valor en tokens nativos y USD
3. WHERE el gas cost es inusualmente alto, THE Staking System SHALL mostrar una advertencia al usuario
4. WHEN las condiciones de red cambian, THE Staking System SHALL actualizar la estimación de gas
5. IF la estimación de gas falla, THEN THE Staking System SHALL mostrar un valor aproximado basado en transacciones similares

### Requirement 29: Lock Period Display

**User Story:** Como usuario, quiero ver claramente los períodos de lock de los pools, para entender cuándo podré retirar mis fondos.

#### Acceptance Criteria

1. WHEN un pool tiene período de lock, THE Staking System SHALL mostrar la duración del lock en días
2. WHEN el usuario tiene una posición con lock activo, THE Staking System SHALL mostrar el tiempo restante hasta unlock
3. WHEN el lock está próximo a expirar, THE Staking System SHALL mostrar un badge "Unlocking soon"
4. WHERE no hay período de lock, THE Staking System SHALL mostrar un badge "No lock period"
5. WHEN se muestra información de lock, THE Staking System SHALL incluir un tooltip explicativo

### Requirement 30: Fee Information Display

**User Story:** Como usuario, quiero ver claramente todas las fees asociadas con el staking, para entender el costo total de mis operaciones.

#### Acceptance Criteria

1. WHEN un pool tiene fees de entrada, THE Staking System SHALL mostrar el porcentaje de fee en los detalles del pool
2. WHEN un pool tiene fees de salida, THE Staking System SHALL mostrar el porcentaje de fee de withdraw
3. WHEN se calcula una transacción, THE Staking System SHALL incluir las fees en el preview de la transacción
4. WHEN hay fees de performance, THE Staking System SHALL mostrar el porcentaje que se deduce de las recompensas
5. WHERE no hay fees, THE Staking System SHALL mostrar un badge "0% fees" como ventaja del pool

# MyInvestor Client

Aplicacion front-end desarrollada en React para gestionar fondos de inversion. Permite consultar un catalogo de fondos, comprar participaciones, gestionar un portfolio personal y realizar traspasos entre fondos.

## Como correr el proyecto localmente

### Requisitos previos

- Node.js (v18+)
- Yarn

### 1. Levantar el servidor

Desde la raiz del proyecto:

```bash
yarn start
```

Esto inicia:
- API REST en `http://localhost:3000`
- Documentacion Swagger en `http://localhost:3001/api-docs`

### 2. Levantar el cliente

```bash
cd myinvestor-client
yarn install
yarn dev
```

El cliente se levanta por defecto en `http://localhost:5173`.

### 3. Comandos disponibles

| Comando              | Descripcion                        |
|----------------------|------------------------------------|
| `yarn dev`           | Servidor de desarrollo con HMR     |
| `yarn build`         | Compila TypeScript y genera build  |
| `yarn lint`          | Ejecuta ESLint                     |
| `yarn test`          | Ejecuta tests con Vitest           |
| `yarn test:ui`       | Tests con interfaz visual          |
| `yarn test:coverage` | Tests con reporte de cobertura     |

## Decisiones tecnicas

### Stack

- **React 19** con **TypeScript 5.9** en modo estricto (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- **Vite 7** como bundler y servidor de desarrollo
- **Tailwind CSS 3.4** para estilos, sin librerias de componentes externas
- **react-hook-form** con **Zod** para formularios con validacion en tiempo real
- **Vitest** + **Testing Library** para tests unitarios

### Arquitectura (Screaming Architecture)

```
src/
├── api/              # Cliente HTTP base con validacion Zod
├── common/           # Componentes y utilidades reutilizables
├── features/
│   ├── funds/        # Listado de fondos y compra
│   └── portfolio/    # Cartera, venta, traspasos e historial
├── app.tsx
└── main.tsx
```

Cada feature agrupa sus propios componentes, llamadas API y contexto. Las features no importan entre si; solo comparten lo que esta en `common/` y `api/`.

### Otras decisiones relevantes

- **Validacion con Zod en toda la capa API**: todas las respuestas del servidor se validan en runtime con schemas Zod, garantizando seguridad de tipos tanto en compilacion como en ejecucion.
- **HTML `<dialog>` nativo**: los modales usan el elemento `<dialog>` del navegador en vez de librerias externas, con soporte para cierre por backdrop y tecla ESC.
- **Lazy loading**: los componentes principales (`FundList`, `Portfolio`) se cargan de forma diferida con `React.lazy` y `Suspense`.
- **Context API para estado**: `PortfolioContext` gestiona el estado de la cartera con enrichment de datos (join portfolio + fondos). `OrdersContext` persiste el historial de ordenes en `localStorage`.
- **Cero dependencias de UI**: todos los componentes (Dialog, Pagination, CurrencyInput, SwipeableItem) estan construidos desde cero con Tailwind.
- **Internacionalizacion**: interfaz en espanol con formato `es-ES` para moneda, porcentajes y fechas.

## Funcionalidades implementadas

### Listado de fondos
- Tabla paginada con 10 fondos por pagina
- Ordenacion por columnas (nombre, valor, rentabilidad YTD y 1 ano)
- Diseno responsive: tabla en escritorio, tarjetas en movil
- Boton de compra por cada fondo

### Compra de fondos (BuyDialog)
- Input de cantidad con formato de moneda (separador decimal con coma)
- Validacion: maximo 10.000 EUR, sin valores negativos
- Registro automatico de la orden en el historial

### Cartera (Portfolio)
- Vista con dos pestanas: Posiciones y Ordenes
- Holdings agrupados por categoria del fondo (GLOBAL, TECH, HEALTH, MONEY_MARKET)
- Ordenacion alfabetica dentro de cada categoria
- Responsive: tarjetas con swipe en movil, tabla con botones en escritorio

### Venta de fondos (SellDialog)
- Validacion dinamica segun las participaciones actuales
- Muestra cantidad disponible y valor del fondo

### Traspasos (TransferDialog)
- Selector de fondo destino (excluye el fondo origen)
- Validacion de cantidad segun las participaciones disponibles
- Registro con detalle completo (fondo origen y destino)

### Historial de ordenes (OrderHistory)
- Log de todas las operaciones (compra, venta, traspaso)
- Codigo de color por tipo de operacion
- Persistencia en localStorage

### Componentes comunes
- **CurrencyInput**: input numerico con formato de moneda y `inputMode="decimal"`
- **Pagination**: paginacion inteligente con elipsis y navegacion movil simplificada
- **SwipeableItem**: gestos tactiles para revelar acciones en movil
- **ErrorBoundary**: captura de errores con fallback visual

## Que mejoraria con mas tiempo

- **Tests de integracion**: ampliar la cobertura con tests e2e usando Playwright o Cypress para cubrir flujos completos de compra, venta y traspaso.
- **Gestion de estado mas robusta**: evaluar React Query (TanStack Query) para manejar cache, revalidacion y estados de carga/error de forma declarativa.
- **Accesibilidad (a11y)**: auditoria completa con herramientas como axe-core, mejorar navegacion por teclado y soporte de lectores de pantalla.
- **Animaciones y transiciones**: agregar transiciones suaves entre vistas y feedback visual en las acciones del usuario.
- **Filtros y busqueda**: permitir filtrar fondos por categoria, moneda o nombre.
- **Manejo de errores global**: implementar un sistema de notificaciones (toasts) para feedback de exito y error en las operaciones.
- **Modo oscuro**: aprovechar la configuracion de Tailwind para agregar soporte de tema oscuro.
- **Internacionalizacion completa**: usar una libreria como `react-intl` o `i18next` para gestionar traducciones de forma escalable en vez de strings hardcodeados.

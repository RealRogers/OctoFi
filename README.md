# Panel de Control DeFi

Este proyecto es un panel de control para finanzas descentralizadas (DeFi) construido con tecnologías web modernas. Proporciona una interfaz de usuario para monitorear activos de criptomonedas, realizar intercambios (swaps) y gestionar agentes de trading simulados.

El estado actual del proyecto es una maqueta funcional, con la interfaz de usuario completamente desarrollada y la lógica de negocio simulada en el frontend.

## Tecnologías Utilizadas

Este proyecto está construido con:

- **Vite:** Como herramienta de construcción y servidor de desarrollo.
- **React:** Como librería principal para la construcción de la interfaz de usuario.
- **TypeScript:** Para el tipado estático y la mejora de la calidad del código.
- **shadcn-ui:** Para el sistema de componentes de la interfaz de usuario.
- **Tailwind CSS:** Para el estilizado de la aplicación.
- **Vitest & React Testing Library:** Para las pruebas unitarias y de integración.

## Cómo Empezar

Para trabajar en este proyecto localmente, necesitas tener Node.js y `bun` instalados.

Sigue estos pasos:

1.  **Clona el repositorio:**
    ```sh
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_PROYECTO>
    ```

2.  **Instala las dependencias:**
    ```sh
    bun install
    ```

3.  **Inicia el servidor de desarrollo:**
    Esto iniciará la aplicación en modo de desarrollo con recarga automática.
    ```sh
    bun run dev
    ```

4.  **Ejecuta las pruebas:**
    Para correr el conjunto de pruebas automatizadas, usa:
    ```sh
    bun run test
    ```
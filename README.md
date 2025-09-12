# Fintu - Gestión Financiera Personal 💰

**Fintu** es una aplicación móvil de gestión financiera personal desarrollada con React Native y Expo. Permite a los usuarios administrar sus finanzas de manera simple y eficiente.

## Características Principales

- **Gestión de Cuentas**: Crea y administra múltiples cuentas bancarias
- **Registro de Transacciones**: Añade ingresos y gastos con categorización automática
- **Categorías Personalizables**: Organiza tus transacciones con categorías personalizadas
- **Historial Detallado**: Revisa el historial de transacciones por categoría
- **Transferencias**: Mueve dinero entre cuentas fácilmente

## Tecnologías

- **React Native** con **Expo** para desarrollo multiplataforma
- **TypeScript** para tipado estático
- **Expo Router** para navegación basada en archivos
- **SQLite** para almacenamiento local de datos
- **SVG Icons** para una interfaz moderna y escalable

## Instalación y Desarrollo

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI

### Configuración del Proyecto

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Iniciar la aplicación**
   ```bash
   npx expo start
   ```

3. **Ejecutar en dispositivos**
   - **Android**: `npx expo start --android`
   - **Web**: `npx expo start --web`

## Estructura del Proyecto

```
├── app/                    # Navegación principal (Expo Router)
│   ├── (drawer)/          # Pantallas con drawer navigation
│   └── index.tsx          # Pantalla de inicio
├── src/                   # Código fuente principal
│   ├── shared/           # Código compartido
│   │   ├── context/      # Context providers
│   │   ├── hooks/        # Hooks personalizados
│   │   ├── services/     # Servicios (API, base de datos)
│   │   └── styles/       # Sistema de diseño
│   └── types/            # Definiciones de tipos TypeScript
├── components/           # Componentes reutilizables
└── assets/              # Recursos estáticos (íconos, imágenes)
```

## Características Técnicas

- **Arquitectura**: Feature-based con separación de responsabilidades
- **Estado**: Context API + hooks personalizados
- **Navegación**: Expo Router con tipado de rutas
- **Base de Datos**: SQLite local con migraciones
- **UI/UX**: Sistema de diseño consistente con tokens de diseño
- **Iconografía**: SVG optimizado para todas las plataformas

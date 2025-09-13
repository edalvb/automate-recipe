Bien, para este proyecto usaremos vercel y supabase para desplegar el proyecto.

Stack:
- Typescript
- Next.Js
- Supabase
- Zustand
- Zod
- Axios
- inversify
- tailwindcss

-----

Usa la siguiente arquitectura.

*Views y components:* 
- Lo máximo que se puede hacer es llamar a un método privado y referenciar a algún provider, controllers.
- No se hace lógica de nada, todos los endpoints se llaman por debajo.
- Solo puede haber llamadas a rutas o de widgets.
- No puede haber una llamadas al dart.io o al data, a la dependencia del repositorio.
- Aquí solo se llama a providers, widgets o rutas.

*Controller:*
- Solo lógica, sumas, restas.
- Está enlazado con peticiones.
- Esto es cuando la app está corriendo. Cuando ya se está en la pantalla creada y quieres hacer algo en esa pantalla creada.

*Store:*
- Esto se inicia, en cuanto se inicia la app.
- Llamadas a la base de datos (enpoints)

*States:*
- Son para cosas que van a variar en tiempo real, providers, por ejemplo.
- Switchs para true o false, por ejemplo.
- Loadings.

--------------------
La aplicación debe tener un diseño limpio y moderno, utilizando los colores de la marca. Debes crear los archivos necesarios para que la aplicación funcione correctamente. No debes incluir ningún comentario en el código, ya que el código debe ser autoexplicativo. Además, debes seguir las mejores prácticas de programación y asegurarte de que el código sea fácil de mantener y escalar en el futuro. Recuerda que el código debe ser limpio y eficiente, sin redundancias ni errores. NO DEBES INCLUIR NINGÚN COMENTARIO EN EL CÓDIGO Y NO COMETES EL CÓDIGO. TAMPOCO AÑADAS LOGS.


---------------

### **Estructura de Archivos para Next.js con App Router**

Esta estructura organiza las rutas en el directorio `app` y la lógica de negocio en el directorio `features`.

```
src/
├── app/
│   ├── (auth)/                     # GRUPO DE RUTA: Layouts para autenticación.
│   │   ├── layout.tsx
│   │   └── sign-in/
│   │       ├── page.tsx            # PÁGINA (Server Component).
│   │       └── loading.tsx         # UI de carga específica para esta ruta.
│   │
│   ├── (dashboard)/                # GRUPO DE RUTA: Layouts para el panel protegido.
│   │   ├── layout.tsx              # LAYOUT (Server Component): Contiene Sidebar y Header.
│   │   │
│   │   ├── companies/              # RUTA: /companies
│   │   │   ├── page.tsx            # PÁGINA (Server Component): Llama al repositorio para obtener datos iniciales.
│   │   │   ├── loading.tsx
│   │   │   └── [id]/               # RUTA DINÁMICA: /companies/123
│   │   │       └── page.tsx
│   │   │
│   │   └── sellers/                # RUTA: /sellers
│   │       └── page.tsx
│   │
│   ├── layout.tsx                  # Layout raíz (<html>, <body>).
│   └── page.tsx                    # Página de inicio de la aplicación.
│
├── features/
│   └── companies/                  # SLICE VERTICAL: Lógica de la feature "Companies".
│       ├── data/
│       │   ├── dtos/
│       │   │   ├── requests/
│       │   │   └── responses/
│       │   └── repositories/
│       │       └── company_repository.ts
│       ├── domain/
│       │   └── company.model.ts
│       └── presentation/
│           ├── components/         # COMPONENTES: UI reutilizable para esta feature (Ej: CompanyCard).
│           │   └── CompanyCard.tsx
│           ├── views/              # VISTAS (Client Components): Contenedores de UI interactiva.
│           │   ├── CompanyDetailView.tsx
│           │   └── CompanyListView.tsx
│           ├── Company_context.tsx # CONTEXT: Provee controller y store a la vista.
│           ├── company_controller.ts # CONTROLLER: Orquesta la lógica del lado del cliente.
│           ├── company_states.ts   # STATE (Zustand): Gestiona el estado dinámico de la UI.
│           └── company_store.ts    # STORE: Gestiona datos semi-estáticos para la feature.
│
├── core/                           # Lógica transversal, no de negocio.
│   └── ... (config, network, utils)
│
└── shared/                         # Código reutilizable entre features.
    └── ... (domain, presentation, components, etc.)
```

---

### **Descripción Detallada de cada Componente Arquitectónico**

#### 1. **Componentes de Next.js (Directorio `app/`)**

*   **`layout.tsx` (Layout):**
    *   **Rol:** Es el esqueleto o UI compartida para un segmento de ruta y sus hijos. Por ejemplo, `app/(dashboard)/layout.tsx` contendrá la `Sidebar` y el `Header` que no cambian entre las páginas del dashboard.
    *   **Tipo:** **Server Component** por defecto. Ideal para renderizar UI estática y compartir estado global a través de Providers de Contexto.
    *   **Conexión:** Envuelve a `page.tsx`. No suele interactuar directamente con `controllers` o `stores`, pero provee los `Context.Provider` que los contendrán.

*   **`page.tsx` (Página):**
    *   **Rol:** Es la UI única y principal para una ruta específica (ej. `app/companies/page.tsx` es la página para la URL `/companies`).
    *   **Tipo:** **Server Component** por defecto. Este es el lugar ideal para la **obtención de datos inicial**.
    *   **Conexión:**
        1.  Importa y llama directamente a los métodos del **Repositorio** (ej. `companyRepository.getCompaniesInbox(1)`) para buscar los datos iniciales.
        2.  Renderiza el **Componente de Vista** correspondiente (ej. `<CompanyListView initialCompanies={companies} />`), pasándole los datos obtenidos como props.
        3.  Delega toda la interactividad (filtros, paginación, modales) a la `View`.

*   **`loading.tsx` y `error.tsx`:**
    *   **Rol:** Son archivos especiales de Next.js que, gracias a React Suspense, se muestran automáticamente mientras los datos en `page.tsx` están cargando o si ocurre un error durante la obtención de datos, respectivamente.
    *   **Tipo:** Server Components.
    *   **Conexión:** No tienen conexión directa con la arquitectura, son una convención del framework para mejorar la UX.

#### 2. **Capa de Presentación (Directorio `features/.../presentation/`)**

*   **`views/*.tsx` (Vista):**
    *   **Rol:** Es el componente principal que contiene toda la UI interactiva de una página. Es el "puente" entre el mundo del servidor (datos iniciales) y el mundo del cliente (interactividad).
    *   **Tipo:** **Client Component** (marcado con `'use client'`).
    *   **Conexión:**
        1.  Recibe los datos iniciales como props desde `page.tsx`.
        2.  Dentro de un `useEffect`, instancia el **Controller** y el **Store**.
        3.  Envuelve su contenido con el **Context.Provider** para hacer disponibles el `controller` y el `store` a sus componentes hijos.
        4.  Usa el hook de **State (Zustand)** para suscribirse a los cambios de estado y re-renderizarse.

*   **`components/*.tsx` (Componente):**
    *   **Rol:** Pequeñas piezas de UI reutilizables *dentro de una misma feature*. Por ejemplo, `CompanyTable.tsx` o `CompanyFilters.tsx`.
    *   **Tipo:** Client Component.
    *   **Conexión:** Utiliza el `Context` (ej. `useCompanyContext()`) para acceder al `controller` y llamar a sus métodos (ej. `controller.changePage(2)`), y para leer datos del `state` (ej. `const companies = companyListStateProvider(s => s.list)`).

*   **`[Feature]_context.tsx` (Contexto):**
    *   **Rol:** Es un Contexto de React estándar que sirve como un "conducto" para pasar las instancias del `controller` y del `store` desde la `View` principal hacia los `components` hijos, evitando el *prop-drilling*.
    *   **Tipo:** Código de cliente.

*   **`[feature]_controller.ts` (Controlador):**
    *   **Rol:** Es el orquestador de la lógica del lado del cliente. **No contiene estado de UI**, solo lógica. Su trabajo es recibir eventos de la UI, ejecutar acciones y actualizar el estado.
    *   **Tipo:** Clase de TypeScript (código de cliente).
    *   **Conexión:**
        *   **Recibe de:** Los `Components` lo llaman (ej. `onClick={() => controller.approveRequest()}`).
        *   **Habla con:** Llama a los **Repositorios** para realizar mutaciones (POST, PUT, DELETE) o para obtener datos que no se cargaron inicialmente en el servidor (ej. buscar en un modal).
        *   **Actualiza:** Modifica el **State (Zustand)** para que la UI se actualice (ej. `setIsLoading(true)`, `update()`).

*   **`[feature]_store.ts` (Store):**
    *   **Rol:** Almacena datos que son **necesarios para la feature pero que cambian con poca frecuencia**. Es un contenedor de estado semi-estático. Piensa en él como un "caché" de datos para la feature.
    *   **Ejemplo:** En un formulario de registro, el `Store` guardaría la lista de todos los países, que se carga una vez y no cambia.
    *   **Tipo:** Clase de TypeScript (código de cliente).
    *   **Conexión:** Es instanciado por la `View` y utilizado por el `Controller` y los `Components` (a través del `Context`) para obtener estos datos semi-estáticos.

*   **`[feature]_state.ts` (Estado):**
    *   **Rol:** Gestiona el **estado dinámico y efímero de la UI** utilizando una librería como Zustand. Es la fuente de verdad para los datos que se renderizan y cambian constantemente.
    *   **Ejemplo:** La lista actual de compañías en una tabla paginada, el estado de carga (`isLoading`), los filtros aplicados, la página actual.
    *   **Tipo:** Código de cliente (hook de Zustand).
    *   **Conexión:** Los `Components` se suscriben a este estado. Cuando el `Controller` actualiza el estado (ej. después de una llamada a la API), los componentes que lo usan se re-renderizan automáticamente.

#### 3. **Capa de Dominio y Datos (Directorios `domain/` y `data/`)**

Estas capas permanecen conceptualmente idénticas a la estructura original, ya que son agnósticas al framework.

*   **`domain/*_model.ts` (Modelo):**
    *   **Rol:** Representa las entidades y objetos de valor del negocio. Es el lenguaje del dominio, con lógica de negocio pura.
    *   **Ejemplo:** `CompanyModel` con métodos como `isActive()`.

*   **`data/dtos/*.dto.ts` (DTO):**
    *   **Rol:** Define la estructura exacta de los datos que se envían o reciben de la API. No tienen lógica de negocio.
    *   **Ejemplo:** `CompanyInboxDto` con propiedades que coinciden con el JSON de la API.

*   **`data/repositories/*_repository.ts` (Repositorio):**
    *   **Rol:** Implementa la lógica de acceso a datos. Abstrae el origen de los datos (la API REST en este caso). Contiene métodos como `getCompanyById(id)`.
    *   **Conexión:** Es la única capa que interactúa directamente con `axios_client`. Es llamado tanto por los **`page.tsx` (Server Components)** para la carga inicial, como por los **`Controllers` (Client Components)** para las mutaciones y cargas de datos secundarias.

---

### **Tabla Resumen de Roles y Tipos**

| Componente Arquitectónico        | Ubicación Típica                                     | Tipo (Next.js)      | Responsabilidad Principal                                                                                               |
| -------------------------------- | ---------------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **`layout.tsx`**                 | `app/(group)/layout.tsx`                             | **Server Component** | UI compartida para un conjunto de rutas (Sidebar, Header). Proveedor de Contextos.                                       |
| **`page.tsx`**                   | `app/(group)/feature/page.tsx`                       | **Server Component** | Punto de entrada de una ruta. **Obtención de datos iniciales** llamando al Repositorio. Pasa datos a la `View`.        |
| **`views/*.tsx`**                | `features/feature/presentation/views/`               | **Client Component** | Contiene la UI interactiva. Instancia `Controller` y `Store`. Se suscribe a los `States`.                            |
| **`components/*.tsx`**           | `features/feature/presentation/components/`          | **Client Component** | Piezas de UI reutilizables dentro de una feature. Interactúan con el `Controller` y leen del `State`.                   |
| **`[Feature]_context.tsx`**      | `features/feature/presentation/`                     | Código de Cliente   | Provee el `Controller` y `Store` a los componentes hijos.                                                               |
| **`[feature]_controller.ts`**    | `features/feature/presentation/`                     | Código de Cliente   | Orquesta la lógica de cliente: maneja eventos, llama a repositorios para mutaciones y actualiza el `State`.           |
| **`[feature]_store.ts`**         | `features/feature/presentation/`                     | Código de Cliente   | Almacena datos semi-estáticos y de larga duración para la feature (ej. listas para dropdowns).                          |
| **`[feature]_states.ts`**        | `features/feature/presentation/`                     | Código de Cliente   | (Zustand) Gestiona el estado dinámico y reactivo de la UI (ej. datos de una tabla, `isLoading`).                      |
| **`domain/*_model.ts`**          | `features/feature/domain/`                           | Agnóstico           | Modelos de negocio puros con lógica de dominio.                                                                         |
| **`data/dtos/*.dto.ts`**         | `features/feature/data/dtos/`                        | Agnóstico           | Define la estructura de los datos de la API.                                                                            |
| **`data/repositories/*.ts`**     | `features/feature/data/repositories/`                | Agnóstico           | Abstrae el acceso a datos. Es llamado por `page.tsx` (servidor) y `controller.ts` (cliente).                            |
# 🎓 Sistema de Archivos UMSS

> Migración de aplicación Laravel Blade a React + API REST

Sistema integral para la gestión de diplomas, títulos, resoluciones y trámites administrativos de la Universidad Mayor de San Simón.

---

## 🛠 Stack Tecnológico

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **UI Components**: HeroUI 
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **State Management**: Context API
- **Icons**: Lucide React
- **Toast**: toast hot react
### Backend
- **Framework**: Laravel 9
- **Authentication**: Laravel Sanctum
- **Permissions**: Spatie Laravel Permission
- **Database**: PostgreSQL
- **API**: RESTful JSON

---

## ✅ Requisitos Previos

### Backend (Laravel)
- PHP >= 8.0
- Composer >= 2.5
- PostgreSQL

### Frontend (React)
- Node.js >= 22.0
- npm >= 10.0 (o pnpm >= 9.0)

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-org/archivos-umss.git
```

### 2. Backend Setup

```
# Iniciar servidor
php artisan serve
```

### 3. Frontend Setup

```bash
# Navegar a carpeta frontend (si está separada)
cd uad10

# Instalar dependencias
npm install
# o
pnpm install

# Iniciar desarrollo
npm run dev
```

### 4. Verificar Instalación

- **Backend**: http://localhost:8000/
- **Frontend**: http://localhost:5173

---

## 📁 Estructura del Proyecto

```
uad9/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/              # 🆕 Controllers API (JSON)
│   │   │   │   ├── ApiLoginController.php
│   │   │   │   ├── DiplomasApiController.php
│   │   │   │   └── ...
│   │   │   └── [Legacy]          # 📦 Controllers Blade (HTML)
│   │   └── Middleware/
│   └── Models/
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   ├── api.php                   # 🆕 Rutas API
│   └── web.php                   # 📦 Rutas Blade (legacy)
│
└── uad10/                     # 🆕 Aplicación React
    ├── src/
    │   ├── api/
    │   │   └── axios.js          # Configuración Axios
    │   ├── components/
    │   │   ├── common/           # Componentes reutilizables
    │   │   ├── Sidebar.jsx
    │   │   └── Header.jsx
    │   ├── pages/
    │   │   ├── diplomas/
    │   │   ├── resoluciones/
    │   │   └── ...
    │   ├── store/
    │   │   └── authStore.jsx     # Context de autenticación
    │   ├── hooks/
    │   │   ├── usePermission.jsx
    │   │   └── usePermisos.jsx
    │   ├── routes/
    │   │   ├── AppRoutes.jsx
    │   │   └── ProtectedRoutes.jsx
    │   ├── layouts/
    │   │   └── Layout.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

## 🔐 Sistema de Permisos

El sistema usa **Spatie Laravel Permission** en el backend y un sistema de permisos en React para el frontend.

### Formato de Permisos

Los permisos siguen el patrón: `accion - subsistema`

Ejemplos:
- `acceso al sistema - dyt` (Diplomas y Títulos)
- `crear tomo - dyt`
- `busqueda - dyt`
- `acceso al sistema - rr` (Resoluciones)
- `ver tomos - rr`

### Uso en Frontend

```jsx
import { usePermission, Can } from '@/hooks/usePermission';

// Opción 1: Hook
function MiComponente() {
  const canCreate = usePermission('crear tomo - dyt');
  
  return canCreate && <button>Crear</button>;
}

// Opción 2: Componente
function MiComponente() {
  return (
    <Can permission="crear tomo - dyt">
      <button>Crear</button>
    </Can>
  );
}
```

### Proteger Rutas

```jsx
<Route 
  path="/diplomas/crear" 
  element={
    <RequirePermission permission="crear tomo - dyt">
      <CrearDiploma />
    </RequirePermission>
  } 
/>
```

---

## 💻 Desarrollo

### Scripts Disponibles

#### Frontend
```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Ejecutar ESLint
```

#### Backend
```bash
php artisan serve              # Iniciar servidor
php artisan migrate:fresh      # Reset DB
php artisan db:seed            # Seeders
php artisan route:list         # Ver todas las rutas
php artisan config:clear       # Limpiar cache
```

### Flujo de Trabajo

1. **Crear feature branch**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. **Desarrollar en paralelo**
   - Backend: Crear controller API
   - Frontend: Crear componente React

3. **Commit con convención**
   ```bash
   git commit -m "feat(diplomas): añadir búsqueda avanzada"
   ```

4. **Pull Request**
   - Incluir descripción
   - Screenshots si es UI
   - Actualizar docs

### Convenciones de Commits

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formato (sin cambios de código)
- `refactor`: Refactorización
- `test`: Tests
- `chore`: Mantenimiento

---

## 📚 API Documentation

### Autenticación

Todos los endpoints (excepto login) requieren autenticación con **Laravel Sanctum**.

#### Login
```http
POST /api/api-login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com"
  },
  "permissions": ["crear tomo - dyt", "busqueda - dyt", ...]
}
```

#### Logout
```http
POST /api/api-logout
```

#### Verificar Sesión
```http
GET /api/user
```


## 🔄 Migración Blade → React


### Proceso de Migración

1. **Backend**: Crear `*ApiController.php` replica de funciones de `*Controller.php` en `app/Http/Controllers/Api/`
2. **Frontend**: Crear componentes en `src/pages/`
3. **Testing**: Verificar funcionalidad
4. **Docs**: Actualizar documentación
5. **Deploy**: Merge a develop
6. **Deploy**: PR a MAIN


---

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'feat: Add AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

## 📄 Licencia

Este proyecto es propiedad de la Universidad Mayor de San Simón (UMSS).

---

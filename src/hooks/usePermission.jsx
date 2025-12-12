import { useAuth } from '../store/authStore';

/**
 * Hook para verificar permisos en componentes
 * 
 * @param {string|array} permission - Permiso(s) a verificar
 * @param {string} mode - 'single' | 'any' | 'all'
 * @returns {boolean}
 * 
 * Ejemplos:
 * 1. const canCreate = usePermission('crear tomo - dyt');
 * 2. const canSearch = usePermission(['busqueda - dyt', 'busqueda avanzada - dyt'], 'any');
 * 3. const canManage = usePermission(['crear tomo - dyt', 'editar tomo - dyt'], 'all');
 */
export function usePermission(permission, mode = 'single') {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

  if (mode === 'single' && typeof permission === 'string') {
    return hasPermission(permission);
  }

  if (mode === 'any' && Array.isArray(permission)) {
    return hasAnyPermission(permission);
  }

  if (mode === 'all' && Array.isArray(permission)) {
    return hasAllPermissions(permission);
  }

  return false;
}

/**
 * Componente Can - Similar a @can de Laravel Blade
 * 
 * Uso:
 * <Can permission="crear tomo - dyt">
 *   <button>Crear</button>
 * </Can>
 */
export function Can({ permission, children, fallback = null }) {
  const hasAccess = usePermission(permission);
  return hasAccess ? children : fallback;
}

/**
 * Componente CanAny - Similar a @canany de Laravel Blade
 * 
 * Uso:
 * <CanAny permissions={['busqueda - dyt', 'busqueda avanzada - dyt']}>
 *   <div>Panel de búsqueda</div>
 * </CanAny>
 */
export function CanAny({ permissions, children, fallback = null }) {
  const hasAccess = usePermission(permissions, 'any');
  return hasAccess ? children : fallback;
}

/**
 * Componente CanAll - Verifica que tenga TODOS los permisos
 * 
 * Uso:
 * <CanAll permissions={['crear tomo - dyt', 'editar tomo - dyt']}>
 *   <div>Panel completo</div>
 * </CanAll>
 */
export function CanAll({ permissions, children, fallback = null }) {
  const hasAccess = usePermission(permissions, 'all');
  return hasAccess ? children : fallback;
}
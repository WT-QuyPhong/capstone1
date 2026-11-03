import type { AppRole, Content, DemoSession } from '../types'

export const ROLE_LABELS: Record<AppRole, string> = {
  user: 'User',
  manager: 'Manager',
  administrator: 'Administrator',
}

export function isAppRole(value: unknown): value is AppRole {
  return value === 'user' || value === 'manager' || value === 'administrator'
}

export type Permission = 'createContent' | 'manageCatalog' | 'reviewContent' | 'manageUsers'

export function hasPermission(role: AppRole | undefined, permission: Permission): boolean {
  if (!isAppRole(role)) return false
  if (permission === 'manageUsers') return role === 'administrator'
  if (permission === 'createContent') return true
  return role === 'administrator' || role === 'manager'
}

const routePermissions: Record<string, Permission> = {
  '/dashboard': 'createContent',
  '/dashboard/content-studio': 'createContent',
  '/dashboard/image-studio': 'createContent',
  '/dashboard/history': 'createContent',
  '/dashboard/products': 'manageCatalog',
  '/dashboard/brands': 'manageCatalog',
  '/dashboard/audiences': 'manageCatalog',
  '/dashboard/analytics': 'reviewContent',
  '/dashboard/admin': 'manageUsers',
}

export function canAccessRoute(role: AppRole | undefined, path: string): boolean {
  // Only known, internal routes can be used as a post-login destination.
  const pathname = path.split(/[?#]/)[0].replace(/\/+$/, '')
  return (
    Object.hasOwn(routePermissions, pathname) && hasPermission(role, routePermissions[pathname])
  )
}

export function loginPath(role: AppRole) {
  return `/login/${role}`
}

export function parseDemoSession(raw: string | null): DemoSession | null {
  if (!raw) return null
  try {
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== 'object') return null
    const item = value as Record<string, unknown>
    if (
      typeof item.name !== 'string' ||
      !item.name.trim() ||
      typeof item.email !== 'string' ||
      !item.email.trim()
    )
      return null
    // Existing sessions predate roles. Migrate them to the least privileged role.
    const role = item.role === undefined ? 'user' : item.role
    return isAppRole(role) ? { name: item.name, email: item.email, role } : null
  } catch {
    return null
  }
}

export function canSaveContent(
  role: AppRole | undefined,
  item: Content,
  existing?: Content,
): boolean {
  if (!hasPermission(role, 'createContent')) return false
  return (
    hasPermission(role, 'reviewContent') ||
    (item.status !== 'Approved' && existing?.status !== 'Approved')
  )
}

export function canDeleteContent(role: AppRole | undefined, item?: Content): boolean {
  return (
    hasPermission(role, 'createContent') &&
    (hasPermission(role, 'reviewContent') || item?.status !== 'Approved')
  )
}

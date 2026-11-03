import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Audience, Brand, Content, Product, User, WorkspaceData } from '../types'
import { readWorkspace, upsert, WORKSPACE_KEY } from '../utils/storage'
import { useToast } from './ToastContext'
import { useAuth } from './AuthContext'
import { canDeleteContent, canSaveContent, hasPermission, type Permission } from '../auth/roles'

interface WorkspaceContextValue extends WorkspaceData {
  saveProduct: (item: Product) => void
  deleteProduct: (id: string) => void
  saveBrand: (item: Brand) => void
  deleteBrand: (id: string) => void
  saveAudience: (item: Audience) => void
  deleteAudience: (id: string) => void
  saveContent: (item: Content) => void
  deleteContent: (id: string) => void
  saveUser: (item: User) => void
  deleteUser: (id: string) => void
}
const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { notify } = useToast()
  const { session } = useAuth()
  const [data, setData] = useState<WorkspaceData>(() => {
    try {
      return readWorkspace(localStorage.getItem(WORKSPACE_KEY))
    } catch {
      return readWorkspace(null)
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(WORKSPACE_KEY, JSON.stringify(data))
    } catch {
      notify(
        'Browser storage is unavailable or full. Changes remain available until this page closes.',
        'error',
      )
    }
  }, [data, notify])
  const save = <K extends keyof WorkspaceData>(key: K, value: WorkspaceData[K][number]) => {
    setData((previous) => ({
      ...previous,
      [key]: upsert(previous[key] as { id: string }[], value),
    }))
  }
  const remove = (key: keyof WorkspaceData, id: string) =>
    setData((previous) => ({ ...previous, [key]: previous[key].filter((item) => item.id !== id) }))
  const permitted = (permission: Permission) => {
    const allowed = hasPermission(session?.role, permission)
    if (!allowed) notify('Your role does not have permission for this action.', 'error')
    return allowed
  }
  return (
    <WorkspaceContext.Provider
      value={{
        ...data,
        users: hasPermission(session?.role, 'manageUsers') ? data.users : [],
        saveProduct: (item) => {
          if (permitted('manageCatalog')) save('products', item)
        },
        deleteProduct: (id) => {
          if (permitted('manageCatalog')) remove('products', id)
        },
        saveBrand: (item) => {
          if (permitted('manageCatalog')) save('brands', item)
        },
        deleteBrand: (id) => {
          if (permitted('manageCatalog')) remove('brands', id)
        },
        saveAudience: (item) => {
          if (permitted('manageCatalog')) save('audiences', item)
        },
        deleteAudience: (id) => {
          if (permitted('manageCatalog')) remove('audiences', id)
        },
        saveContent: (item) => {
          if (
            canSaveContent(
              session?.role,
              item,
              data.contents.find((entry) => entry.id === item.id),
            )
          )
            save('contents', item)
          else notify('Only a manager or administrator can change approved content.', 'error')
        },
        deleteContent: (id) => {
          if (
            canDeleteContent(
              session?.role,
              data.contents.find((item) => item.id === id),
            )
          )
            remove('contents', id)
          else notify('Only a manager or administrator can delete approved content.', 'error')
        },
        saveUser: (item) => {
          if (permitted('manageUsers')) save('users', item)
        },
        deleteUser: (id) => {
          if (permitted('manageUsers')) remove('users', id)
        },
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}
export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) throw new Error('WorkspaceProvider is missing')
  return context
}

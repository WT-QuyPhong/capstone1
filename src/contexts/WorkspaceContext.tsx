import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Audience, Brand, Content, Product, User, WorkspaceData } from '../types'
import { readWorkspace, upsert, WORKSPACE_KEY } from '../utils/storage'
import { useToast } from './ToastContext'

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
  return (
    <WorkspaceContext.Provider
      value={{
        ...data,
        saveProduct: (item) => save('products', item),
        deleteProduct: (id) => remove('products', id),
        saveBrand: (item) => save('brands', item),
        deleteBrand: (id) => remove('brands', id),
        saveAudience: (item) => save('audiences', item),
        deleteAudience: (id) => remove('audiences', id),
        saveContent: (item) => save('contents', item),
        deleteContent: (id) => remove('contents', id),
        saveUser: (item) => save('users', item),
        deleteUser: (id) => remove('users', id),
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

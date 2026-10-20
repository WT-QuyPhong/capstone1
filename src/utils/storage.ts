import { z } from 'zod'
import type { WorkspaceData } from '../types'
import { seed } from '../mocks/seed'

export const WORKSPACE_KEY = 'contentcraft-workspace-v1'
const text = z.string()
const workspaceSchema = z.object({
  brands: z.array(
    z.object({
      id: text,
      name: text,
      industry: text,
      description: text,
      voice: text,
      audience: text,
      website: text,
      color: text,
      status: z.enum(['Active', 'Draft']),
    }),
  ),
  products: z.array(
    z.object({
      id: text,
      name: text,
      category: text,
      description: text,
      price: z.number().nonnegative(),
      status: z.enum(['Active', 'Draft', 'Archived']),
      image: text,
      brandId: text,
      features: text,
    }),
  ),
  audiences: z.array(
    z.object({
      id: text,
      name: text,
      description: text,
      age: text,
      location: text,
      interests: text,
      tone: text,
      status: z.enum(['Active', 'Draft']),
    }),
  ),
  contents: z.array(
    z.object({
      id: text,
      title: text,
      body: text,
      type: text,
      channel: text,
      brandId: text,
      productId: text,
      audienceId: text,
      status: z.enum(['Draft', 'In review', 'Approved']),
      createdAt: z.iso.datetime(),
      kind: z.enum(['text', 'image']),
      image: text.optional(),
    }),
  ),
  users: z.array(
    z.object({
      id: text,
      name: text,
      email: text,
      role: z.enum(['Admin', 'Editor', 'Reviewer']),
      status: z.enum(['Active', 'Invited', 'Suspended']),
    }),
  ),
})

export function readWorkspace(raw: string | null): WorkspaceData {
  if (!raw) return structuredClone(seed)
  try {
    const result = workspaceSchema.safeParse(JSON.parse(raw))
    return result.success ? result.data : structuredClone(seed)
  } catch {
    return structuredClone(seed)
  }
}
export function upsert<T extends { id: string }>(items: T[], item: T): T[] {
  return items.some((value) => value.id === item.id)
    ? items.map((value) => (value.id === item.id ? item : value))
    : [item, ...items]
}

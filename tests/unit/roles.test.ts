import { describe, expect, it } from 'vitest'
import {
  canAccessRoute,
  canDeleteContent,
  canSaveContent,
  hasPermission,
  parseDemoSession,
} from '../../src/auth/roles'
import { seed } from '../../src/mocks/seed'

describe('role permissions', () => {
  it('keeps administration exclusive and catalog/review available to managers', () => {
    expect(canAccessRoute('user', '/dashboard/content-studio')).toBe(true)
    expect(canAccessRoute('user', '/dashboard/admin')).toBe(false)
    expect(canAccessRoute('user', '/dashboard/brands')).toBe(false)
    expect(canAccessRoute('user', '/dashboard/analytics')).toBe(false)
    expect(canAccessRoute('manager', '/dashboard/brands')).toBe(true)
    expect(canAccessRoute('manager', '/dashboard/history?status=review')).toBe(true)
    expect(canAccessRoute('manager', '/dashboard/admin')).toBe(false)
    expect(canAccessRoute('administrator', '/dashboard/admin/')).toBe(true)
    expect(hasPermission(undefined, 'createContent')).toBe(false)
  })
  it('rejects unknown and external post-login destinations', () => {
    for (const path of [
      'https://example.com',
      '//example.com',
      '/dashboard/not-real',
      '/dashboard/../admin',
      '/constructor',
    ]) {
      expect(canAccessRoute('administrator', path)).toBe(false)
    }
  })
  it('lets users submit drafts but protects approved records from changes or deletion', () => {
    const draft = { ...seed.contents[0], status: 'Draft' as const }
    const approved = { ...draft, status: 'Approved' as const }
    expect(canSaveContent('user', draft)).toBe(true)
    expect(canSaveContent('user', { ...draft, status: 'In review' })).toBe(true)
    expect(canSaveContent('user', approved)).toBe(false)
    expect(canSaveContent('user', draft, approved)).toBe(false)
    expect(canDeleteContent('user', approved)).toBe(false)
    expect(canDeleteContent(undefined, draft)).toBe(false)
    expect(canSaveContent('manager', approved, draft)).toBe(true)
    expect(canDeleteContent('administrator', approved)).toBe(true)
  })
})

describe('stored demo sessions', () => {
  it('migrates old sessions to User only and preserves valid roles', () => {
    const old = { name: 'Creator', email: 'creator@example.com' }
    expect(parseDemoSession(JSON.stringify(old))).toEqual({ ...old, role: 'user' })
    expect(parseDemoSession(JSON.stringify({ ...old, role: 'manager' }))?.role).toBe('manager')
  })
  it('rejects malformed or unknown roles instead of granting access', () => {
    for (const raw of [
      null,
      '{',
      'null',
      '{}',
      '[]',
      JSON.stringify({ name: 'A', email: 'a@example.com', role: 'superadmin' }),
      JSON.stringify({ name: '', email: 'a@example.com', role: 'administrator' }),
    ]) {
      expect(parseDemoSession(raw)).toBeNull()
    }
  })
})

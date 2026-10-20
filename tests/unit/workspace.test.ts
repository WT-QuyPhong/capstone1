import { describe, expect, it } from 'vitest'
import { readWorkspace, upsert } from '../../src/utils/storage'
import { composeDemoText } from '../../src/services/demo'
import { makeAuthSchema } from '../../src/pages/auth/AuthPage'

describe('demo data boundaries', () => {
  it('recovers missing, malformed and structurally invalid browser data', () => {
    for (const raw of [null, '{broken', '{"products":[]}'])
      expect(readWorkspace(raw).products.length).toBe(4)
  })
  it('round-trips user edits without reseeding them', () => {
    const data = readWorkspace(null)
    data.products[0].name = 'My edited coffee'
    expect(readWorkspace(JSON.stringify(data)).products[0].name).toBe('My edited coffee')
  })
  it('adds and replaces immutable records without duplicates', () => {
    const items = [{ id: 'a', value: 1 }]
    expect(upsert(items, { id: 'a', value: 2 })).toEqual([{ id: 'a', value: 2 }])
    expect(upsert(items, { id: 'b', value: 3 })).toHaveLength(2)
    expect(items[0].value).toBe(1)
  })
})
describe('demo content and authentication', () => {
  it('uses selected context and marks output as a demo', () => {
    const text = composeDemoText({
      brandName: 'Aurora',
      productName: 'Coffee',
      audienceName: 'Students',
      contentType: 'Social post',
      tone: 'Warm',
      channel: 'Instagram',
      brief: 'A morning ritual',
      language: 'English',
    })
    expect(text).toContain('Aurora')
    expect(text).toContain('Coffee')
    expect(text).toContain('A morning ritual')
    expect(text).toContain('Demo Social post draft for Instagram')
  })
  it('requires valid email and a sufficiently long demo password', () => {
    expect(makeAuthSchema(false).safeParse({ email: 'wrong', password: '123' }).success).toBe(false)
    expect(
      makeAuthSchema(false).safeParse({ email: 'creator@example.com', password: 'demo12345' })
        .success,
    ).toBe(true)
  })
  it('requires name, matching confirmation and terms for registration', () => {
    const base = {
      email: 'creator@example.com',
      password: 'demo12345',
      fullName: 'A Creator',
      confirmPassword: 'demo12345',
      terms: true,
    }
    expect(makeAuthSchema(true).safeParse(base).success).toBe(true)
    expect(makeAuthSchema(true).safeParse({ ...base, confirmPassword: 'different' }).success).toBe(
      false,
    )
    expect(makeAuthSchema(true).safeParse({ ...base, terms: false }).success).toBe(false)
    expect(makeAuthSchema(true).safeParse({ ...base, fullName: ' ' }).success).toBe(false)
  })
})

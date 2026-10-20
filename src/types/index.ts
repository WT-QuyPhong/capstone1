export interface Product {
  id: string
  name: string
  category: string
  description: string
  price: number
  status: 'Active' | 'Draft' | 'Archived'
  image: string
  brandId: string
  features: string
}
export interface Brand {
  id: string
  name: string
  industry: string
  description: string
  voice: string
  audience: string
  website: string
  color: string
  status: 'Active' | 'Draft'
}
export interface Audience {
  id: string
  name: string
  description: string
  age: string
  location: string
  interests: string
  tone: string
  status: 'Active' | 'Draft'
}
export interface Content {
  id: string
  title: string
  body: string
  type: string
  channel: string
  brandId: string
  productId: string
  audienceId: string
  status: 'Draft' | 'In review' | 'Approved'
  createdAt: string
  kind: 'text' | 'image'
  image?: string
}
export interface User {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Editor' | 'Reviewer'
  status: 'Active' | 'Invited' | 'Suspended'
}
export interface WorkspaceData {
  products: Product[]
  brands: Brand[]
  audiences: Audience[]
  contents: Content[]
  users: User[]
}
export interface DemoSession {
  name: string
  email: string
}

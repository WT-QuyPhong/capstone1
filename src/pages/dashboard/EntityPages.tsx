import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  FileCheck2,
  FileText,
  GraduationCap,
  Image,
  KeyRound,
  Leaf,
  Link2,
  MessageSquareText,
  MoreHorizontal,
  Plus,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  Users,
} from 'lucide-react'
import {
  Badge,
  Button,
  DemoNotice,
  EmptyState,
  Field,
  Input,
  Modal,
  PageHeading,
  SearchInput,
  Select,
} from '../../components/ui'
import { useToast } from '../../contexts/ToastContext'
import { useWorkspace } from '../../contexts/WorkspaceContext'
import type { Audience, Brand, Product, User } from '../../types'
import './entities.css'

const productSchema = z.object({
  name: z.string().trim().min(2, 'Enter at least 2 characters.').max(100),
  category: z.string().trim().min(2, 'Choose or enter a category.'),
  brandId: z.string().min(1, 'Select a brand.'),
  description: z.string().trim().min(10, 'Add a description of at least 10 characters.'),
  price: z
    .string()
    .refine(
      (value) => value.trim() !== '' && Number.isFinite(Number(value)) && Number(value) >= 0,
      'Enter a valid price of 0 or more.',
    ),
  status: z.enum(['Active', 'Draft', 'Archived']),
  features: z.string().trim().min(3, 'Add a few useful product facts.'),
  image: z.string(),
})
const brandSchema = z.object({
  name: z.string().trim().min(2, 'Enter a brand name of at least 2 characters.').max(100),
  industry: z.string().trim().min(2, 'Enter your industry.'),
  description: z.string().trim().min(10, 'Tell us about the brand in at least 10 characters.'),
  voice: z.string().trim().min(3, 'Describe the brand voice.'),
  audience: z.string().trim().min(3, 'Describe the intended audience.'),
  website: z
    .string()
    .trim()
    .refine(
      (value) => !value || /^https?:\/\/[^\s.]+\.[^\s]+$/.test(value),
      'Enter a complete URL, such as https://example.com.',
    ),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Choose a valid brand color.'),
  status: z.enum(['Active', 'Draft']),
})
const audienceSchema = z.object({
  name: z.string().trim().min(2, 'Enter a profile name of at least 2 characters.').max(100),
  description: z.string().trim().min(10, 'Add a description of at least 10 characters.'),
  age: z.string().trim().min(2, 'Enter an age range.'),
  location: z.string().trim().min(2, 'Enter a location or market.'),
  interests: z.string().trim().min(3, 'Add interests or traits separated by commas.'),
  tone: z.string().trim().min(3, 'Describe a suitable tone.'),
  status: z.enum(['Active', 'Draft']),
})
const userSchema = z.object({
  name: z.string().trim().min(2, 'Enter the member’s full name.').max(100),
  email: z.string().trim().email('Enter a valid email address.'),
  role: z.enum(['Admin', 'Editor', 'Reviewer']),
  status: z.enum(['Active', 'Invited', 'Suspended']),
})
type ProductFormValues = z.infer<typeof productSchema>
type BrandFormValues = z.infer<typeof brandSchema>
type AudienceFormValues = z.infer<typeof audienceSchema>
type UserFormValues = z.infer<typeof userSchema>
type DeleteTarget = { name: string; action: () => void } | null

function brandTextColor(color: string) {
  const hex = /^#[0-9a-fA-F]{6}$/.test(color) ? color.slice(1) : 'a6e69a'
  const [red, green, blue] = [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16))
  return red * 0.299 + green * 0.587 + blue * 0.114 > 150 ? '#294233' : '#ffffff'
}

function EntityMenu({
  label,
  onEdit,
  onDelete,
}: {
  label: string
  onEdit: () => void
  onDelete: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const outside = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('click', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('click', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [])
  return (
    <div className="entity-menu" ref={ref}>
      <button
        className="entity-icon-button"
        aria-label={`Actions for ${label}`}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <MoreHorizontal size={19} />
      </button>
      {open && (
        <div className="entity-menu-panel">
          <button
            onClick={() => {
              setOpen(false)
              onEdit()
            }}
          >
            Edit details
          </button>
          <button
            className="entity-delete-action"
            onClick={() => {
              setOpen(false)
              onDelete()
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

function DeleteConfirmation({ target, onClose }: { target: DeleteTarget; onClose: () => void }) {
  return (
    <Modal
      open={!!target}
      onClose={onClose}
      title="Delete this item?"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              target?.action()
              onClose()
            }}
          >
            Delete permanently
          </Button>
        </>
      }
    >
      <p className="entity-modal-description">
        “{target?.name}” will be removed from this demo workspace. This action cannot be undone.
      </p>
    </Modal>
  )
}

function FilterPanel({ children, onReset }: { children: ReactNode; onReset: () => void }) {
  return (
    <div className="entity-filter-panel">
      {children}
      <Button variant="ghost" onClick={onReset}>
        Reset filters
      </Button>
    </div>
  )
}

function ImportBanner({
  icon,
  title,
  description,
  action,
  onClick,
}: {
  icon: ReactNode
  title: string
  description: string
  action: string
  onClick: () => void
}) {
  return (
    <div className="entity-import-banner">
      <span className="entity-banner-icon">{icon}</span>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <Button variant="secondary" onClick={onClick}>
        {action}
      </Button>
    </div>
  )
}

function JsonImport({
  kind,
  open,
  onClose,
  onImport,
}: {
  kind: 'brand' | 'audience'
  open: boolean
  onClose: () => void
  onImport: (items: unknown[]) => void
}) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [filename, setFilename] = useState('')
  const loadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 500_000) {
      setError('Choose a JSON file smaller than 500 KB.')
      return
    }
    try {
      setText(await file.text())
      setFilename(file.name)
      setError('')
    } catch {
      setError('This file could not be read.')
    }
  }
  const example =
    kind === 'brand'
      ? {
          name: 'My brand',
          industry: 'Retail',
          description: 'Thoughtful products for everyday life.',
          voice: 'Warm, helpful, clear',
          audience: 'Young professionals',
          website: '',
          color: '#a6e69a',
          status: 'Active',
        }
      : {
          name: 'New customer profile',
          description: 'People who value thoughtful everyday products.',
          age: '22–35',
          location: 'Urban',
          interests: 'Quality, Convenience',
          tone: 'Friendly, direct',
          status: 'Active',
        }
  const submit = () => {
    try {
      const parsed: unknown = JSON.parse(text)
      const items = Array.isArray(parsed) ? (parsed as unknown[]) : [parsed]
      if (!items.length || items.length > 50)
        throw new Error('Import between 1 and 50 records at a time.')
      for (const item of items) {
        const result = (kind === 'brand' ? brandSchema : audienceSchema).safeParse(item)
        if (!result.success)
          throw new Error(result.error.issues[0]?.message || 'Check the record format.')
      }
      onImport(items)
      setText('')
      setFilename('')
      setError('')
      onClose()
    } catch (caught) {
      setError(
        caught instanceof SyntaxError
          ? 'This is not valid JSON. Check the example format below.'
          : caught instanceof Error
            ? caught.message
            : 'Unable to import records.',
      )
    }
  }
  return (
    <Modal
      open={open}
      title={`Import ${kind === 'brand' ? 'brand assets' : 'audience data'}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!text.trim()}>
            Import records
          </Button>
        </>
      }
    >
      <DemoNotice text="Import structured JSON into your local demo workspace. Live Figma, website and CRM connections require backend integration." />
      <Field label="Upload JSON file" error={error}>
        <Input type="file" accept="application/json,.json" onChange={loadFile} />
      </Field>
      {filename && (
        <p className="entity-file-label">
          <FileCheck2 size={16} />
          {filename}
        </p>
      )}
      <Field label="Or paste JSON">
        <textarea
          className="entity-textarea entity-code-input"
          value={text}
          onChange={(event) => {
            setText(event.target.value)
            setError('')
          }}
          rows={7}
          placeholder={JSON.stringify(example, null, 2)}
        />
      </Field>
      <details className="entity-import-example">
        <summary>View example format</summary>
        <pre>{JSON.stringify(example, null, 2)}</pre>
      </details>
    </Modal>
  )
}

function ProductEditor({
  product,
  open,
  brands,
  onClose,
  onSave,
}: {
  product: Product | null
  open: boolean
  brands: Brand[]
  onClose: () => void
  onSave: (product: Product) => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({ resolver: zodResolver(productSchema) })
  useEffect(() => {
    if (open)
      reset(
        product
          ? { ...product, price: String(product.price) }
          : {
              name: '',
              category: 'Beverage',
              brandId: brands[0]?.id || '',
              description: '',
              price: '0',
              status: 'Draft',
              features: '',
              image: '/assets/product-coffee.svg',
            },
      )
  }, [product, open, brands, reset])
  const submit = (values: ProductFormValues) => {
    onSave({ ...values, id: product?.id || crypto.randomUUID(), price: Number(values.price) })
    onClose()
  }
  return (
    <Modal
      open={open}
      title={product ? 'Edit product' : 'Add product'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="entity-product-form">
            {product ? 'Save changes' : 'Add product'}
          </Button>
        </>
      }
    >
      <p className="entity-modal-description">
        Keep product facts accurate so every content draft has the right context.
      </p>
      <form
        id="entity-product-form"
        onSubmit={handleSubmit(submit)}
        className="entity-form"
        noValidate
      >
        <Field label="Product name" error={errors.name?.message}>
          <Input {...register('name')} placeholder="e.g. Cold Brew 250ml" />
        </Field>
        <div className="entity-form-grid">
          <Field label="Brand" error={errors.brandId?.message}>
            <Select {...register('brandId')}>
              <option value="">Select a brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Category" error={errors.category?.message}>
            <Input list="entity-product-categories" {...register('category')} />
          </Field>
          <datalist id="entity-product-categories">
            {['Beverage', 'Cosmetics', 'Food & Menu', 'Seasonal', 'Lifestyle'].map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </div>
        <Field label="Description" error={errors.description?.message}>
          <textarea
            className="entity-textarea"
            rows={3}
            {...register('description')}
            placeholder="What makes this product useful?"
          />
        </Field>
        <Field label="Key product facts" error={errors.features?.message}>
          <textarea
            className="entity-textarea"
            rows={2}
            {...register('features')}
            placeholder="Separate ingredients, benefits, or features with commas"
          />
        </Field>
        <div className="entity-form-grid">
          <Field label="Price (USD)" error={errors.price?.message}>
            <Input type="number" step="0.01" min="0" {...register('price')} />
          </Field>
          <Field label="Status">
            <Select {...register('status')}>
              <option>Active</option>
              <option>Draft</option>
              <option>Archived</option>
            </Select>
          </Field>
        </div>
        <Field label="Product illustration">
          <Select {...register('image')}>
            <option value="/assets/product-coffee.svg">Coffee</option>
            <option value="/assets/product-serum.svg">Skincare</option>
            <option value="/assets/product-burger.svg">Food</option>
            <option value="/assets/product-gift.svg">Gift box</option>
          </Select>
        </Field>
        {!brands.length && (
          <p className="entity-form-error">Create a brand before adding a product.</p>
        )}
      </form>
    </Modal>
  )
}

export function ProductsPage() {
  const { products, brands, saveProduct, deleteProduct } = useWorkspace()
  const { notify } = useToast()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(false)
  const [status, setStatus] = useState('All statuses')
  const [category, setCategory] = useState('All categories')
  const [editor, setEditor] = useState<{ open: boolean; value: Product | null }>({
    open: false,
    value: null,
  })
  const [deleting, setDeleting] = useState<DeleteTarget>(null)
  const categories = [...new Set(products.map((product) => product.category))]
  const filtered = products.filter((product) => {
    const brand = brands.find((item) => item.id === product.brandId)?.name || ''
    return (
      `${product.name} ${product.category} ${product.description} ${brand}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (status === 'All statuses' || product.status === status) &&
      (category === 'All categories' || product.category === category)
    )
  })
  const active = products.filter((product) => product.status === 'Active').length
  return (
    <div className="entity-page entity-products-page">
      <PageHeading
        title="Product management"
        description="Maintain product facts and assets used by AI generation."
        action={
          <Button onClick={() => setEditor({ open: true, value: null })}>
            <Plus size={19} /> Add product
          </Button>
        }
      />
      <div className="entity-toolbar entity-product-toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search products, SKUs, or brands..."
        />
        <span className="entity-count">
          <i />
          {active} active products configured
        </span>
        <Button variant="secondary" onClick={() => setFilters(!filters)} aria-expanded={filters}>
          <SlidersHorizontal size={16} /> Filter
          {(status !== 'All statuses' || category !== 'All categories') && (
            <span className="entity-filter-dot" />
          )}
        </Button>
      </div>
      {filters && (
        <FilterPanel
          onReset={() => {
            setStatus('All statuses')
            setCategory('All categories')
          }}
        >
          <Field label="Status">
            <Select value={status} onChange={(event) => setStatus(event.target.value)}>
              {['All statuses', 'Active', 'Draft', 'Archived'].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </Select>
          </Field>
          <Field label="Category">
            <Select value={category} onChange={(event) => setCategory(event.target.value)}>
              {['All categories', ...categories].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </Select>
          </Field>
        </FilterPanel>
      )}
      <div className="entity-product-list">
        {filtered.map((product) => (
          <div className="entity-product-row" key={product.id}>
            <button
              className={`entity-product-identity entity-product-color-${products.indexOf(product) % 4}`}
              onClick={() => setEditor({ open: true, value: product })}
            >
              <span className="entity-product-image">
                <img src={product.image || '/assets/product-coffee.svg'} alt="" />
              </span>
              <span>
                <strong>{product.name}</strong>
                <small>
                  {brands.find((brand) => brand.id === product.brandId)?.name || 'Unassigned brand'}
                  <span className="entity-separator">•</span>
                  {product.features.split(',').filter(Boolean).length} facts
                </small>
              </span>
            </button>
            <span className="entity-readiness">
              <Check size={13} />
              {product.category} · {product.status === 'Active' ? 'Ready for AI' : 'Incomplete'}
            </span>
            <span className="entity-asset-icons" title="Product illustration and content facts">
              <Image size={14} />
              <FileText size={14} />
              <FileCheck2 size={14} />
            </span>
            <Badge tone={product.status === 'Active' ? 'green' : 'gray'}>{product.status}</Badge>
            <EntityMenu
              label={product.name}
              onEdit={() => setEditor({ open: true, value: product })}
              onDelete={() =>
                setDeleting({
                  name: product.name,
                  action: () => {
                    deleteProduct(product.id)
                    notify('Product deleted.')
                  },
                })
              }
            />
          </div>
        ))}
      </div>
      {!filtered.length && (
        <EmptyState
          title="No products found"
          description={
            products.length
              ? 'Try another search or reset your filters.'
              : 'Add your first product to give AI content useful context.'
          }
          action={
            <Button onClick={() => setEditor({ open: true, value: null })}>
              <Plus size={16} />
              Add product
            </Button>
          }
        />
      )}
      <ProductEditor
        product={editor.value}
        open={editor.open}
        brands={brands}
        onClose={() => setEditor({ open: false, value: null })}
        onSave={(product) => {
          saveProduct(product)
          notify(editor.value ? 'Product updated.' : 'Product added.')
        }}
      />
      <DeleteConfirmation target={deleting} onClose={() => setDeleting(null)} />
    </div>
  )
}

function BrandEditor({
  brand,
  open,
  onClose,
  onSave,
}: {
  brand: Brand | null
  open: boolean
  onClose: () => void
  onSave: (brand: Brand) => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BrandFormValues>({ resolver: zodResolver(brandSchema) })
  useEffect(() => {
    if (open)
      reset(
        brand || {
          name: '',
          industry: '',
          description: '',
          voice: '',
          audience: '',
          website: '',
          color: '#a6e69a',
          status: 'Active',
        },
      )
  }, [brand, open, reset])
  return (
    <Modal
      open={open}
      title={brand ? 'Brand context & voice' : 'Create a brand'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="entity-brand-form">
            {brand ? 'Save changes' : 'Create brand'}
          </Button>
        </>
      }
    >
      <p className="entity-modal-description">
        Define reusable context and a consistent voice for your brand.
      </p>
      <form
        id="entity-brand-form"
        onSubmit={handleSubmit((values) => {
          onSave({ ...values, id: brand?.id || crypto.randomUUID() })
          onClose()
        })}
        className="entity-form"
        noValidate
      >
        <Field label="Brand name" error={errors.name?.message}>
          <Input {...register('name')} placeholder="e.g. Aurora Coffee" />
        </Field>
        <Field label="Industry" error={errors.industry?.message}>
          <Input {...register('industry')} placeholder="e.g. Food & Beverage" />
        </Field>
        <Field label="About the brand" error={errors.description?.message}>
          <textarea className="entity-textarea" rows={3} {...register('description')} />
        </Field>
        <Field label="Brand voice & tone" error={errors.voice?.message}>
          <textarea
            className="entity-textarea"
            rows={2}
            {...register('voice')}
            placeholder="Warm, local, approachable. Avoid jargon."
          />
        </Field>
        <Field label="Target audience" error={errors.audience?.message}>
          <Input {...register('audience')} placeholder="Who are you speaking to?" />
        </Field>
        <Field label="Website (optional)" error={errors.website?.message}>
          <Input type="url" {...register('website')} placeholder="https://example.com" />
        </Field>
        <div className="entity-form-grid">
          <Field label="Brand color" error={errors.color?.message}>
            <Input type="color" className="entity-color-input" {...register('color')} />
          </Field>
          <Field label="Status">
            <Select {...register('status')}>
              <option>Active</option>
              <option>Draft</option>
            </Select>
          </Field>
        </div>
      </form>
    </Modal>
  )
}

export function BrandsPage() {
  const { brands, products, saveBrand, deleteBrand } = useWorkspace()
  const { notify } = useToast()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(false)
  const [status, setStatus] = useState('All statuses')
  const [editor, setEditor] = useState<{ open: boolean; value: Brand | null }>({
    open: false,
    value: null,
  })
  const [deleting, setDeleting] = useState<DeleteTarget>(null)
  const [importing, setImporting] = useState(false)
  const filtered = brands.filter(
    (brand) =>
      `${brand.name} ${brand.industry} ${brand.voice}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (status === 'All statuses' || brand.status === status),
  )
  return (
    <div className="entity-page entity-brands-page">
      <PageHeading
        title="Brand management"
        description="Keep reusable voice, values, preferences and context in one place."
        action={
          <Button onClick={() => setEditor({ open: true, value: null })}>
            <Plus size={19} />
            New brand
          </Button>
        }
      />
      <div className="entity-toolbar entity-combined-toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search brands or keywords..."
        />
        <span className="entity-count">
          <i />
          {brands.length} of {Math.max(6, brands.length)} brand workspaces configured
        </span>
        <Button variant="ghost" onClick={() => setFilters(!filters)} aria-expanded={filters}>
          <SlidersHorizontal size={15} />
          Filter
        </Button>
      </div>
      {filters && (
        <FilterPanel onReset={() => setStatus('All statuses')}>
          <Field label="Status">
            <Select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option>All statuses</option>
              <option>Active</option>
              <option>Draft</option>
            </Select>
          </Field>
        </FilterPanel>
      )}
      <div className="entity-card-grid">
        {filtered.map((brand) => (
          <article className="entity-brand-card" key={brand.id}>
            <div className="entity-card-top">
              <span
                className={`entity-brand-avatar entity-pastel-${brands.indexOf(brand) % 3}`}
                style={{ backgroundColor: brand.color, color: brandTextColor(brand.color) }}
              >
                {brand.name.charAt(0).toUpperCase()}
              </span>
              <span className="entity-card-top-right">
                <Badge
                  tone={brand.status === 'Active' && brands.indexOf(brand) === 1 ? 'green' : 'gray'}
                >
                  {brand.status === 'Draft'
                    ? 'Draft'
                    : brands.indexOf(brand) === 0
                      ? 'Default'
                      : brands.indexOf(brand) === 1
                        ? 'Active'
                        : 'Ready'}
                </Badge>
                <EntityMenu
                  label={brand.name}
                  onEdit={() => setEditor({ open: true, value: brand })}
                  onDelete={() =>
                    setDeleting({
                      name: brand.name,
                      action: () => {
                        if (products.some((product) => product.brandId === brand.id)) {
                          notify(
                            'This brand has linked products. Reassign or delete those products first.',
                            'error',
                          )
                          return
                        }
                        deleteBrand(brand.id)
                        notify('Brand deleted.')
                      },
                    })
                  }
                />
              </span>
            </div>
            <h2>{brand.name}</h2>
            <p className="entity-brand-voice">{brand.voice}</p>
            <dl className="entity-brand-facts">
              <div>
                <dt>
                  <BookOpen size={15} />
                  Guidelines
                </dt>
                <dd>
                  {brand.voice.split(/[,;.]/).filter((part) => part.trim()).length} voice rules
                </dd>
              </div>
              <div>
                <dt>
                  <Users size={15} />
                  Industry
                </dt>
                <dd title={brand.industry}>{brand.industry}</dd>
              </div>
              <div>
                <dt>
                  <Clock3 size={15} />
                  Context
                </dt>
                <dd>
                  {products.filter((product) => product.brandId === brand.id).length} linked
                  products
                </dd>
              </div>
            </dl>
            <Button
              variant="secondary"
              className="entity-card-button"
              onClick={() => setEditor({ open: true, value: brand })}
            >
              Open brand <ArrowRight size={15} />
            </Button>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <EmptyState
          title="No brands found"
          description="Try another keyword, or create a brand to get started."
          action={<Button onClick={() => setEditor({ open: true, value: null })}>New brand</Button>}
        />
      )}
      <ImportBanner
        icon={<FileCheck2 size={25} />}
        title="Need to import a brand kit from Figma or website?"
        description="Bring existing voice rules, color palettes, and tone presets into one workspace."
        action="Import brand assets"
        onClick={() => setImporting(true)}
      />
      <BrandEditor
        brand={editor.value}
        open={editor.open}
        onClose={() => setEditor({ open: false, value: null })}
        onSave={(brand) => {
          saveBrand(brand)
          notify(editor.value ? 'Brand context updated.' : 'Brand created.')
        }}
      />
      <JsonImport
        kind="brand"
        open={importing}
        onClose={() => setImporting(false)}
        onImport={(items) => {
          items.forEach((item) =>
            saveBrand({ ...brandSchema.parse(item), id: crypto.randomUUID() }),
          )
          notify(`${items.length} brand${items.length === 1 ? '' : 's'} imported.`)
        }}
      />
      <DeleteConfirmation target={deleting} onClose={() => setDeleting(null)} />
    </div>
  )
}

function AudienceEditor({
  audience,
  open,
  onClose,
  onSave,
}: {
  audience: Audience | null
  open: boolean
  onClose: () => void
  onSave: (audience: Audience) => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AudienceFormValues>({ resolver: zodResolver(audienceSchema) })
  useEffect(() => {
    if (open)
      reset(
        audience || {
          name: '',
          description: '',
          age: '',
          location: '',
          interests: '',
          tone: '',
          status: 'Active',
        },
      )
  }, [audience, open, reset])
  return (
    <Modal
      open={open}
      title={audience ? 'Edit customer profile' : 'New customer profile'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="entity-audience-form">
            Save profile
          </Button>
        </>
      }
    >
      <p className="entity-modal-description">
        Help your AI content speak to the people who matter to your brand.
      </p>
      <form
        id="entity-audience-form"
        className="entity-form"
        onSubmit={handleSubmit((values) => {
          onSave({ ...values, id: audience?.id || crypto.randomUUID() })
          onClose()
        })}
        noValidate
      >
        <Field label="Profile name" error={errors.name?.message}>
          <Input {...register('name')} placeholder="e.g. Young professionals" />
        </Field>
        <Field label="About this audience" error={errors.description?.message}>
          <textarea className="entity-textarea" rows={3} {...register('description')} />
        </Field>
        <div className="entity-form-grid">
          <Field label="Age range" error={errors.age?.message}>
            <Input {...register('age')} placeholder="22–35" />
          </Field>
          <Field label="Location / market" error={errors.location?.message}>
            <Input {...register('location')} placeholder="Urban" />
          </Field>
        </div>
        <Field label="Interests & traits" error={errors.interests?.message}>
          <textarea
            className="entity-textarea"
            rows={2}
            {...register('interests')}
            placeholder="Convenience-oriented, Mobile-first"
          />
        </Field>
        <Field label="Preferred content tone" error={errors.tone?.message}>
          <Input {...register('tone')} placeholder="Direct, snappy, aspirational" />
        </Field>
        <Field label="Status">
          <Select {...register('status')}>
            <option>Active</option>
            <option>Draft</option>
          </Select>
        </Field>
      </form>
    </Modal>
  )
}

export function AudiencesPage() {
  const { audiences, saveAudience, deleteAudience } = useWorkspace()
  const { notify } = useToast()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(false)
  const [status, setStatus] = useState('All statuses')
  const [editor, setEditor] = useState<{ open: boolean; value: Audience | null }>({
    open: false,
    value: null,
  })
  const [deleting, setDeleting] = useState<DeleteTarget>(null)
  const [importing, setImporting] = useState(false)
  const filtered = audiences.filter(
    (audience) =>
      `${audience.name} ${audience.description} ${audience.interests} ${audience.location}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (status === 'All statuses' || audience.status === status),
  )
  return (
    <div className="entity-page entity-audiences-page">
      <PageHeading
        title="Target customer profiles"
        description="Save audience context that can be reused across AI requests."
        action={
          <Button onClick={() => setEditor({ open: true, value: null })}>
            <Plus size={19} />
            New profile
          </Button>
        }
      />
      <div className="entity-toolbar entity-combined-toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search customer profiles, tags, or traits..."
        />
        <span className="entity-count">
          <i />
          {audiences.filter((audience) => audience.status === 'Active').length} customer profiles
          active
        </span>
        <Button variant="secondary" onClick={() => setFilters(!filters)} aria-expanded={filters}>
          <SlidersHorizontal size={16} />
          Filters
        </Button>
      </div>
      {filters && (
        <FilterPanel onReset={() => setStatus('All statuses')}>
          <Field label="Status">
            <Select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option>All statuses</option>
              <option>Active</option>
              <option>Draft</option>
            </Select>
          </Field>
        </FilterPanel>
      )}
      <div className="entity-card-grid">
        {filtered.map((audience) => (
          <article className="entity-audience-card" key={audience.id}>
            <div className="entity-card-top">
              <span
                className={`entity-persona-icon entity-persona-${audiences.indexOf(audience) % 3}`}
              >
                {audiences.indexOf(audience) % 3 === 0 ? (
                  <UserRound size={23} />
                ) : audiences.indexOf(audience) % 3 === 1 ? (
                  <Leaf size={23} />
                ) : (
                  <GraduationCap size={23} />
                )}
              </span>
              <Badge tone={audience.status === 'Active' ? 'green' : 'gray'}>
                {audience.status}
              </Badge>
              <EntityMenu
                label={audience.name}
                onEdit={() => setEditor({ open: true, value: audience })}
                onDelete={() =>
                  setDeleting({
                    name: audience.name,
                    action: () => {
                      deleteAudience(audience.id)
                      notify('Customer profile deleted.')
                    },
                  })
                }
              />
            </div>
            <h2>{audience.name}</h2>
            <p className="entity-audience-description">{audience.description}</p>
            <div className="entity-traits">
              {[audience.age, audience.location, ...audience.interests.split(',')]
                .map((trait) => trait.trim())
                .filter(Boolean)
                .slice(0, 6)
                .map((trait, traitIndex) => (
                  <span key={`${trait}-${traitIndex}`}>{trait}</span>
                ))}
            </div>
            <div className="entity-guardrails">
              <span>
                <MessageSquareText size={15} />
                <ShieldCheck size={15} />
                AI Prompt Guardrails:
              </span>
              <p>Tone: {audience.tone}</p>
              <small>
                <Link2 size={13} />
                Reusable audience context
              </small>
            </div>
            <Button
              variant="secondary"
              className="entity-card-button"
              onClick={() => setEditor({ open: true, value: audience })}
            >
              Edit profile <ArrowRight size={15} />
            </Button>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <EmptyState
          title="No customer profiles found"
          description="Try another search or create your first audience profile."
          action={
            <Button onClick={() => setEditor({ open: true, value: null })}>New profile</Button>
          }
        />
      )}
      <ImportBanner
        icon={<Users size={26} />}
        title="Need to generate synthetic personas from customer surveys or CRM data?"
        description="Import audience profiles to organize customer insights and reuse your personas."
        action="Import audience data"
        onClick={() => setImporting(true)}
      />
      <AudienceEditor
        audience={editor.value}
        open={editor.open}
        onClose={() => setEditor({ open: false, value: null })}
        onSave={(audience) => {
          saveAudience(audience)
          notify(editor.value ? 'Customer profile updated.' : 'Customer profile created.')
        }}
      />
      <JsonImport
        kind="audience"
        open={importing}
        onClose={() => setImporting(false)}
        onImport={(items) => {
          items.forEach((item) =>
            saveAudience({ ...audienceSchema.parse(item), id: crypto.randomUUID() }),
          )
          notify(`${items.length} customer profile${items.length === 1 ? '' : 's'} imported.`)
        }}
      />
      <DeleteConfirmation target={deleting} onClose={() => setDeleting(null)} />
    </div>
  )
}

type AuditEvent = { id: string; message: string; date: string }
function readAudit(): AuditEvent[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem('contentcraft-member-audit') || '[]')
    return Array.isArray(value)
      ? value.filter(
          (item): item is AuditEvent =>
            !!item &&
            typeof item === 'object' &&
            'id' in item &&
            'message' in item &&
            'date' in item &&
            typeof item.id === 'string' &&
            typeof item.message === 'string' &&
            typeof item.date === 'string',
        )
      : []
  } catch {
    return []
  }
}

function MemberEditor({
  member,
  open,
  users,
  onClose,
  onSave,
}: {
  member: User | null
  open: boolean
  users: User[]
  onClose: () => void
  onSave: (member: User) => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UserFormValues>({ resolver: zodResolver(userSchema) })
  useEffect(() => {
    if (open) reset(member || { name: '', email: '', role: 'Editor', status: 'Invited' })
  }, [member, open, reset])
  const submit = (values: UserFormValues) => {
    if (
      users.some(
        (user) => user.id !== member?.id && user.email.toLowerCase() === values.email.toLowerCase(),
      )
    ) {
      setError('email', { message: 'A member with this email already exists.' })
      return
    }
    if (
      member?.role === 'Admin' &&
      member.status === 'Active' &&
      (values.role !== 'Admin' || values.status !== 'Active') &&
      users.filter((user) => user.role === 'Admin' && user.status === 'Active').length <= 1
    ) {
      setError('role', { message: 'Keep at least one active administrator in the workspace.' })
      return
    }
    onSave({ ...values, id: member?.id || crypto.randomUUID() })
    onClose()
  }
  return (
    <Modal
      open={open}
      title={member ? 'Edit team member' : 'Invite member'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="entity-member-form">
            {member ? 'Save member' : 'Create demo invitation'}
          </Button>
        </>
      }
    >
      {!member && (
        <DemoNotice text="Demo invitation: this adds a member to the local workspace. No invitation email is sent." />
      )}
      <form
        id="entity-member-form"
        onSubmit={handleSubmit(submit)}
        className="entity-form"
        noValidate
      >
        <Field label="Full name" error={errors.name?.message}>
          <Input {...register('name')} autoComplete="name" />
        </Field>
        <Field label="Email address" error={errors.email?.message}>
          <Input type="email" {...register('email')} autoComplete="email" />
        </Field>
        <div className="entity-form-grid">
          <Field label="Workspace role" error={errors.role?.message}>
            <Select {...register('role')}>
              <option>Admin</option>
              <option>Editor</option>
              <option>Reviewer</option>
            </Select>
          </Field>
          <Field label="Status">
            <Select {...register('status')}>
              <option>Active</option>
              <option>Invited</option>
              <option>Suspended</option>
            </Select>
          </Field>
        </div>
        <p className="entity-form-hint">
          Admins manage the workspace, editors create content, and reviewers review content. Role
          enforcement requires backend authorization.
        </p>
      </form>
    </Modal>
  )
}

export function AdminPage() {
  const { users, products, brands, audiences, contents, saveUser, deleteUser } = useWorkspace()
  const { notify } = useToast()
  const [tab, setTab] = useState('Users')
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState<{ open: boolean; value: User | null }>({
    open: false,
    value: null,
  })
  const [deleting, setDeleting] = useState<DeleteTarget>(null)
  const [sso, setSso] = useState(false)
  const [audit, setAudit] = useState<AuditEvent[]>(readAudit)
  const [roleFilter, setRoleFilter] = useState('All roles')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [showFilters, setShowFilters] = useState(false)
  const log = (message: string) => {
    const next = [
      { id: crypto.randomUUID(), message, date: new Date().toISOString() },
      ...audit,
    ].slice(0, 50)
    setAudit(next)
    try {
      localStorage.setItem('contentcraft-member-audit', JSON.stringify(next))
    } catch {
      /* Audit is still available for this session. */
    }
  }
  const filtered = users.filter(
    (user) =>
      `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(search.toLowerCase()) &&
      (roleFilter === 'All roles' || user.role === roleFilter) &&
      (statusFilter === 'All statuses' || user.status === statusFilter),
  )
  const roles = [
    {
      name: 'Admin',
      description: 'Manage workspace settings, members, and all content.',
      permissions: ['Manage members', 'Edit content', 'Review content', 'Workspace settings'],
    },
    {
      name: 'Editor',
      description: 'Create and maintain products, brands, and marketing content.',
      permissions: ['Create content', 'Manage brand context', 'Edit drafts'],
    },
    {
      name: 'Reviewer',
      description: 'Review drafts and provide editorial feedback.',
      permissions: ['View workspace', 'Review content'],
    },
  ]
  return (
    <div className="entity-page entity-admin-page">
      <span className="entity-section-label">
        <Settings size={14} />
        System & Team
      </span>
      <PageHeading
        title="Administration"
        description="Manage users, roles, usage limits and protected operational records."
        action={
          <div className="entity-admin-heading-actions">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search members or roles..."
            />
            <Button onClick={() => setEditor({ open: true, value: null })}>
              <Plus size={18} />
              Invite member
            </Button>
          </div>
        }
      />
      <div className="entity-admin-tabbar" role="tablist" aria-label="Administration sections">
        {['Users', 'Roles', 'Usage', 'Audit'].map((name) => (
          <button
            key={name}
            role="tab"
            aria-selected={tab === name}
            className={tab === name ? 'active' : ''}
            onClick={() => setTab(name)}
          >
            {name}
            {name === 'Users' && <span>{users.length}</span>}
          </button>
        ))}
        {tab === 'Users' && (
          <button
            className="entity-admin-filter"
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            aria-label="Filter team members"
          >
            <SlidersHorizontal size={16} />
          </button>
        )}
      </div>
      {tab === 'Users' && (
        <>
          {showFilters && (
            <FilterPanel
              onReset={() => {
                setRoleFilter('All roles')
                setStatusFilter('All statuses')
              }}
            >
              <Field label="Role">
                <Select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
                  {['All roles', 'Admin', 'Editor', 'Reviewer'].map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Status">
                <Select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  {['All statuses', 'Active', 'Invited', 'Suspended'].map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </Select>
              </Field>
            </FilterPanel>
          )}
          <div className="entity-member-list">
            {filtered.map((user) => (
              <div className="entity-member-row" key={user.id}>
                <span className={`entity-member-avatar entity-member-${users.indexOf(user) % 5}`}>
                  {user.name
                    .split(/[\s,]+/)
                    .filter(Boolean)
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join('')}
                </span>
                <button
                  className="entity-member-name"
                  onClick={() => setEditor({ open: true, value: user })}
                >
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                </button>
                <span className="entity-role-pill">{user.role}</span>
                <Badge
                  tone={
                    user.status === 'Active'
                      ? 'green'
                      : user.status === 'Invited'
                        ? 'amber'
                        : 'gray'
                  }
                >
                  {user.status}
                </Badge>
                <EntityMenu
                  label={user.name}
                  onEdit={() => setEditor({ open: true, value: user })}
                  onDelete={() =>
                    setDeleting({
                      name: user.name,
                      action: () => {
                        if (
                          user.role === 'Admin' &&
                          users.filter(
                            (member) => member.role === 'Admin' && member.status === 'Active',
                          ).length <= 1 &&
                          user.status === 'Active'
                        ) {
                          notify(
                            'Keep at least one active administrator in the workspace.',
                            'error',
                          )
                          return
                        }
                        deleteUser(user.id)
                        log(`Removed ${user.name} from the workspace`)
                        notify('Member removed.')
                      },
                    })
                  }
                />
              </div>
            ))}
          </div>
          {!filtered.length && (
            <EmptyState
              title="No team members found"
              description="Try another search or change the role and status filters."
            />
          )}
        </>
      )}
      {tab === 'Roles' && (
        <div className="entity-role-grid">
          {roles
            .filter((role) =>
              `${role.name} ${role.description}`.toLowerCase().includes(search.toLowerCase()),
            )
            .map((role) => (
              <article className="entity-role-card" key={role.name}>
                <ShieldCheck size={26} />
                <h2>{role.name}</h2>
                <p>{role.description}</p>
                <Badge tone="green">
                  {users.filter((user) => user.role === role.name).length} members
                </Badge>
                <ul>
                  {role.permissions.map((permission) => (
                    <li key={permission}>
                      <Check size={15} />
                      {permission}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          <p className="entity-tab-notice">
            These are demo role definitions. Production permissions must be enforced by the backend.
          </p>
        </div>
      )}
      {tab === 'Usage' && (
        <div className="entity-usage-panel">
          <div>
            <h2>Workspace usage</h2>
            <Badge tone="green">Enterprise demo</Badge>
          </div>
          <p>
            Live counts from this browser’s demo workspace. Paid quotas and billing require a
            connected backend.
          </p>
          {[
            { name: 'Brands', value: brands.length, limit: 6 },
            { name: 'Products', value: products.length, limit: 50 },
            { name: 'Customer profiles', value: audiences.length, limit: 20 },
            { name: 'Saved content', value: contents.length, limit: 100 },
            { name: 'Team members', value: users.length, limit: 20 },
          ].map((item) => (
            <div className="entity-usage-meter" key={item.name}>
              <span>
                {item.name}
                <strong>
                  {item.value} / {Math.max(item.limit, item.value)}
                </strong>
              </span>
              <progress max={Math.max(item.limit, item.value)} value={item.value} />
            </div>
          ))}
        </div>
      )}
      {tab === 'Audit' && (
        <div className="entity-audit-panel">
          <h2>Workspace member activity</h2>
          <DemoNotice text="This is a local demo activity log, not a secure compliance or operational audit trail." />
          {audit.filter((event) => event.message.toLowerCase().includes(search.toLowerCase()))
            .length ? (
            <ol>
              {audit
                .filter((event) => event.message.toLowerCase().includes(search.toLowerCase()))
                .map((event) => (
                  <li key={event.id}>
                    <span className="entity-audit-dot" />
                    <span>
                      {event.message}
                      <small>{new Date(event.date).toLocaleString()}</small>
                    </span>
                  </li>
                ))}
            </ol>
          ) : (
            <EmptyState
              title="No activity yet"
              description="Member additions, edits, and removals made here will appear in this local log."
            />
          )}
        </div>
      )}
      <ImportBanner
        icon={<KeyRound size={25} />}
        title="Need single sign-on (SSO) or custom SAML configuration?"
        description="Enforce Okta, Azure AD, or Google Workspace single sign-on for all workspace team accounts."
        action="Configure SSO"
        onClick={() => setSso(true)}
      />
      <MemberEditor
        member={editor.value}
        open={editor.open}
        users={users}
        onClose={() => setEditor({ open: false, value: null })}
        onSave={(user) => {
          if (
            editor.value?.role === 'Admin' &&
            editor.value.status === 'Active' &&
            (user.role !== 'Admin' || user.status !== 'Active') &&
            users.filter((member) => member.role === 'Admin' && member.status === 'Active')
              .length <= 1
          ) {
            notify('Keep at least one active administrator in the workspace.', 'error')
            return
          }
          saveUser(user)
          log(`${editor.value ? 'Updated' : 'Added'} ${user.name} (${user.role})`)
          notify(editor.value ? 'Member updated.' : 'Demo invitation created. No email was sent.')
        }}
      />
      <DeleteConfirmation target={deleting} onClose={() => setDeleting(null)} />
      <Modal
        open={sso}
        title="Single sign-on"
        onClose={() => setSso(false)}
        footer={<Button onClick={() => setSso(false)}>Got it</Button>}
      >
        <DemoNotice text="SSO is not connected in this frontend demo." />
        <p className="entity-modal-description">
          Connect your backend to an identity provider before enabling organization-wide sign-in.
          Your integration will need an identity provider metadata URL, a verified organization
          domain, a service provider entity ID, and a callback URL.
        </p>
        <div className="entity-sso-providers">
          {['Okta', 'Microsoft Entra ID', 'Google Workspace'].map((provider) => (
            <span key={provider}>
              <KeyRound size={17} />
              {provider}
              <span>Not connected</span>
            </span>
          ))}
        </div>
      </Modal>
    </div>
  )
}

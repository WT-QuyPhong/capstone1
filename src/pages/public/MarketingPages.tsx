import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowDown,
  ArrowRight,
  AudioLines,
  BookOpen,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  CirclePlay,
  Clock3,
  Code2,
  Copy,
  FileText,
  Figma,
  FolderOpen,
  Gauge,
  Github,
  History,
  Image,
  Layers3,
  Linkedin,
  Mail,
  MessageSquare,
  Network,
  PencilLine,
  Plus,
  Puzzle,
  RefreshCw,
  Rocket,
  Search,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Slack,
  Sparkles,
  Terminal,
  Triangle,
  Users,
  WandSparkles,
  Workflow,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { Modal } from '../../components/ui'
import { useToast } from '../../contexts/ToastContext'
import './marketing.css'

type Detail = { title: string; intro: string; points?: string[]; footer?: ReactNode }
function DetailModal({ detail, onClose }: { detail: Detail | null; onClose: () => void }) {
  return (
    <Modal open={!!detail} title={detail?.title || ''} onClose={onClose}>
      <div className="mkt-dialog-content">
        <p>{detail?.intro}</p>
        {detail?.points && (
          <ul>
            {detail.points.map((p) => (
              <li key={p}>
                <CheckCircle2 size={17} />
                {p}
              </li>
            ))}
          </ul>
        )}
        {detail?.footer || (
          <div className="mkt-demo-note">
            <Sparkles size={16} />
            Interactive preview. No external service is connected.
          </div>
        )}
      </div>
    </Modal>
  )
}
function Eyebrow({ children, icon: Icon = Sparkles }: { children: ReactNode; icon?: LucideIcon }) {
  return (
    <span className="mkt-eyebrow">
      <Icon size={13} />
      {children}
    </span>
  )
}
function IconTile({ icon: Icon, tone = 'green' }: { icon: LucideIcon; tone?: string }) {
  return (
    <span className={`mkt-icon-tile mkt-icon-${tone}`}>
      <Icon size={22} strokeWidth={1.8} />
    </span>
  )
}
function SectionTitle({
  label,
  title,
  description,
}: {
  label?: string
  title: string
  description?: string
}) {
  return (
    <div className="mkt-section-heading">
      <div>
        {label && <span className="mkt-kicker">{label}</span>}
        <h2>{title}</h2>
      </div>
      {description && <p>{description}</p>}
    </div>
  )
}
function CheckText({ children }: { children: ReactNode }) {
  return (
    <span>
      <CheckCircle2 size={16} />
      {children}
    </span>
  )
}
function BottomCta({ features = false }: { features?: boolean }) {
  return (
    <section className={`mkt-bottom-cta ${features ? 'mkt-glow-cta' : ''}`}>
      {features ? (
        <span className="mkt-cta-symbol">
          <Sparkles size={25} fill="currentColor" />
        </span>
      ) : (
        <span className="mkt-short-rule" />
      )}
      <h2>
        {features
          ? 'Ready to supercharge your content engine?'
          : 'Ready to build content your audience loves?'}
      </h2>
      <p>
        {features
          ? 'Join over 2,400+ marketing and creative teams accelerating high-velocity publishing with ContentCraft.'
          : 'Join 2,400+ forward-thinking teams using ContentCraft.'}
      </p>
      <Link to="/register" className="mkt-button">
        Get started for free – No credit card required <ArrowRight size={17} />
      </Link>
      {features ? (
        <small>Full 14-day Pro trial access • 2-minute instant onboarding</small>
      ) : (
        <div className="mkt-check-line">
          <CheckText>14-day full access</CheckText>
          <CheckText>Instant setup</CheckText>
          <CheckText>Cancel anytime</CheckText>
        </div>
      )}
    </section>
  )
}

const draftSamples = [
  '“Saigon mornings never wait. As each drop of raw espresso lands on clay surfaces, you aren’t just brewing coffee—you’re awakening the focus to master the day.”',
  '“Meet your new morning ritual: slow-crafted cold brew, bold Vietnamese character, and a little space to make the day your own.”',
  '“From the first pour to your next big idea. Discover an artisanal cold brew made for the rhythm of Saigon.”',
]

export function FeaturesPage() {
  const [detail, setDetail] = useState<Detail | null>(null)
  const [draft, setDraft] = useState(0)
  const { notify } = useToast()
  const showCapability = (title: string) =>
    setDetail({
      title,
      intro:
        'Connect research, creation, review, and publishing in one shared ContentCraft workspace.',
      points: [
        'Use a shared brand voice and product context.',
        'Create a draft, review it with your team, and keep a version history.',
        'Explore the working interface in the demo workspace.',
      ],
      footer: (
        <Link to="/dashboard" className="mkt-button">
          Open demo workspace <ArrowRight size={16} />
        </Link>
      ),
    })
  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draftSamples[draft])
      notify('Example draft copied.')
    } catch {
      notify('Clipboard unavailable. You can select and copy the example text.', 'error')
    }
  }
  const steps = [
    {
      number: '01',
      icon: Search,
      title: 'Research Context',
      body: 'Synthesize competitor assets, extract audience personas, and anchor brand parameters directly from Context Hub.',
      action: 'Explore data ingestion',
    },
    {
      number: '02',
      icon: Sparkles,
      title: 'Generate Draft',
      body: 'Scale concepts into cohesive cross-channel campaigns: SEO articles, nurturing emails, and high-impact social copy.',
      action: 'Instant generation',
    },
    {
      number: '03',
      icon: Image,
      title: 'Review With Team',
      body: 'Collaborate in real-time with inline annotations, client review portals, and enterprise-grade role permissions.',
      action: 'Conflict-free versioning',
    },
    {
      number: '04',
      icon: Rocket,
      title: 'Publish & Measure',
      body: 'Push directly to headless CMS and social channels via webhooks while tracking engagement and retention curves.',
      action: 'Real-time metrics',
    },
  ]
  return (
    <div className="mkt-page mkt-features">
      <section className="mkt-hero mkt-feature-hero">
        <Eyebrow icon={ChevronRight}>CAPABILITIES & CORE SUITE</Eyebrow>
        <h1>Everything you need to craft high-converting content with AI</h1>
        <p>
          Explore the comprehensive workspace engineered for modern marketers,
          <br className="mkt-desktop-break" /> writers, and growth teams to research, generate,
          review, and measure
          <br className="mkt-desktop-break" /> omnichannel campaigns.
        </p>
        <div className="mkt-hero-actions">
          <Link to="/register" className="mkt-button">
            Start free trial <Zap size={17} />
          </Link>
          <button
            className="mkt-button mkt-button-secondary"
            onClick={() =>
              setDetail({
                title: 'Your ContentCraft walkthrough',
                intro:
                  'Take a self-guided tour of the interactive demo. Create a brand, explore the AI Content Studio, and review sample analytics at your own pace.',
                points: [
                  'No meeting or payment is required.',
                  'Demo actions stay in your browser.',
                  'Live AI generation and external publishing are not connected.',
                ],
                footer: (
                  <Link className="mkt-button" to="/dashboard">
                    Start interactive demo <ArrowRight size={16} />
                  </Link>
                ),
              })
            }
          >
            <CirclePlay size={18} />
            Book interactive demo
          </button>
        </div>
        <div className="mkt-check-line mkt-feature-checks">
          <CheckText>Native Multi-Language & English Support</CheckText>
          <CheckText>100% Brand Voice Consistency</CheckText>
          <CheckText>No credit card required</CheckText>
        </div>
      </section>
      <section className="mkt-container mkt-capabilities">
        <SectionTitle
          label="CAPABILITY SUITE"
          title="Architected for depth & velocity"
          description="A unified workspace connecting strategic intelligence to omnichannel publishing, preserving brand equity at scale."
        />
        <div className="mkt-capability-grid">
          <article className="mkt-capability-card mkt-studio-card">
            <div className="mkt-card-title">
              <IconTile icon={PencilLine} />
              <div>
                <span className="mkt-kicker">CORE CAPABILITY</span>
                <h3>AI Content Studio</h3>
              </div>
              <span className="mkt-pill">Multi-Model Orchestration</span>
            </div>
            <p>
              Deep multi-model text generation tuned for brand voice, multi-lingual tone calibration
              (Vietnamese & English), and automated draft versioning.
            </p>
            <div className="mkt-editor-preview">
              <div className="mkt-editor-bar">
                <span className="mkt-window-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span>Workspace / Campaign_Autumn_Launch.cc</span>
                <b>Live Calibrated: VN-South</b>
                <span>v2.4 (Saved)</span>
              </div>
              <div className="mkt-prompt-preview">
                <WandSparkles size={18} />
                <div>
                  <small>Executive Prompt • Brand Voice: Friendly Authority</small>
                  <p>
                    "Draft a product launch opening statement for artisanal cold brew coffee,
                    capturing the tactile morning energy of Saigon."
                  </p>
                </div>
                <span>0.3s ago</span>
              </div>
              <div className="mkt-generated-preview">
                <div>
                  <strong>
                    <Sparkles size={14} />
                    Optimized Generation Draft (Vietnamese Dialect Naturalized)
                  </strong>
                  <span>
                    <button onClick={copyDraft} aria-label="Copy example draft">
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={() => setDraft((draft + 1) % draftSamples.length)}
                      aria-label="Generate another example draft"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </span>
                </div>
                <p>{draftSamples[draft]}</p>
                <footer>
                  <span>Length: 46 words</span>
                  <span>Sentiment Score: 94% Calm</span>
                  <span>Estimated Conversion Rate: +38%</span>
                </footer>
              </div>
            </div>
          </article>
          <article className="mkt-capability-card mkt-context-card">
            <IconTile icon={Workflow} tone="sage" />
            <span className="mkt-kicker">SINGLE SOURCE OF TRUTH</span>
            <h3>Brand & Product Context Hub</h3>
            <p>
              Centralized knowledge engine linking brand personas, target demographics (B2B, Gen Z,
              Parents), product specs, and visual style kits.
            </p>
            <div className="mkt-personas">
              {[
                ['Z', 'Gen Z Urban Creatives', 'Witty, Dynamic, Authentic'],
                ['B2B', 'B2B Enterprise Decision Makers', 'Analytical, Clear, ROI-Focused'],
                ['P', 'Modern Tech-Savvy Parents', 'Empathetic, Reassuring'],
              ].map(([initial, name, tone], i) => (
                <div key={name}>
                  <span className={`mkt-avatar mkt-avatar-${i}`}>{initial}</span>
                  <div>
                    <strong>{name}</strong>
                    <small>Tone: {tone}</small>
                  </div>
                  <CheckCircle2 size={15} fill="#3c7843" color="white" />
                </div>
              ))}
            </div>
            <div className="mkt-context-footer">
              <small>14 product specs synchronized</small>
              <Link to="/dashboard">
                Manage knowledge base <ArrowRight size={12} />
              </Link>
            </div>
          </article>
          <article className="mkt-capability-card mkt-small-capability">
            <IconTile icon={Camera} />
            <span className="mkt-kicker">MULTIMODAL PRODUCTION</span>
            <h3>Image & Visual Studio</h3>
            <p>
              1:1 diffusion engine tuned for commercial product photography, social banners, and
              clean lifestyle scenes with custom seed control.
            </p>
            <div className="mkt-image-preview">
              <img
                src="/assets/demo-image.svg"
                alt="Product photography preview in the image studio"
              />
              <span>Seed: 4921098</span>
              <footer>
                <b>
                  <i />
                  4K Commercial Ready
                </b>
                <small>Aspect 1:1 · 16:9 · 9:16</small>
              </footer>
            </div>
          </article>
          <article className="mkt-capability-card mkt-small-capability">
            <IconTile icon={AudioLines} tone="sage" />
            <span className="mkt-kicker">PERFORMANCE & COMPLIANCE</span>
            <h3>Omnichannel Analytics & Feedback</h3>
            <p>
              Real-time engagement tracking, approval ratios, and audit logs to verify compliance
              before publishing across platforms.
            </p>
            <div className="mkt-metrics-preview">
              <label>
                Brand Voice Compliance <b>99.4%</b>
              </label>
              <div>
                <i style={{ width: '99.4%' }} />
              </div>
              <label>
                First-Round Approval Rate <b>88.2%</b>
              </label>
              <div>
                <i style={{ width: '88.2%' }} />
              </div>
              <footer>
                Automated QA:{' '}
                <strong>
                  <Check size={12} />
                  Ready for distribution
                </strong>
              </footer>
            </div>
          </article>
          <article className="mkt-capability-card mkt-small-capability">
            <IconTile icon={Users} />
            <span className="mkt-kicker">REAL-TIME COLLABORATION</span>
            <h3>Collaborative Approval Workflow</h3>
            <p>
              Multi-seat team workspace with role-based permissions (Admins, Editors, Reviewers),
              audit trail, and instant rollback.
            </p>
            <div className="mkt-approval-preview">
              <div>
                <b>Role permissions:</b>
                <span>
                  <i>AD</i>
                  <i>ED</i>
                  <i>REV</i>
                </span>
              </div>
              <p>
                <History size={15} />
                Draft #18 approved <b>Approved</b>
              </p>
              <footer>
                Instant changelog tracked{' '}
                <button onClick={() => showCapability('Version history')}>
                  View rollback history <ArrowRight size={11} />
                </button>
              </footer>
            </div>
          </article>
        </div>
      </section>
      <section className="mkt-container mkt-workflow-section">
        <div className="mkt-centered-heading">
          <span className="mkt-kicker">END-TO-END WORKFLOW</span>
          <h2>From Idea to Approved Campaign in 4 Steps</h2>
          <p>
            Streamline the creative journey from raw source briefs to high-converting omnichannel
            campaigns.
          </p>
        </div>
        <div className="mkt-workflow-grid">
          {steps.map(({ number, icon: Icon, title, body, action }) => (
            <article key={number}>
              <div>
                <strong>{number}</strong>
                <span>
                  <Icon size={18} />
                </span>
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
              <button onClick={() => showCapability(title)}>
                {action} <ArrowRight size={14} />
              </button>
            </article>
          ))}
        </div>
      </section>
      <div className="mkt-container">
        <BottomCta features />
      </div>
      <DetailModal detail={detail} onClose={() => setDetail(null)} />
    </div>
  )
}

type Integration = {
  name: string
  category: string
  description: string
  icon: LucideIcon
  color: string
}
const integrations: Integration[] = [
  {
    name: 'HubSpot',
    category: 'CRMs & Analytics',
    description:
      'Sync leads, target buyer personas, and publish blog drafts directly into your CMS.',
    icon: Network,
    color: 'coral',
  },
  {
    name: 'Figma',
    category: 'Design & Assets',
    description:
      'Import brand guidelines, color tokens, and asset references into the AI Image Studio.',
    icon: Figma,
    color: 'mint',
  },
  {
    name: 'Slack',
    category: 'Team Chat',
    description:
      'Receive real-time approval requests, draft version alerts, and team review notifications.',
    icon: Slack,
    color: 'purple',
  },
  {
    name: 'Notion',
    category: 'CMS & Publishing',
    description:
      'Push structured editorial calendars and content briefs seamlessly to company wikis.',
    icon: FileText,
    color: 'gray',
  },
  {
    name: 'Google Drive & Workspace',
    category: 'Design & Assets',
    description:
      'Auto-backup approved marketing copy, CSV product catalogs, and raw visual outputs.',
    icon: FolderOpen,
    color: 'blue',
  },
  {
    name: 'WordPress & Ghost',
    category: 'CMS & Publishing',
    description: '1-click publishing for SEO-optimized articles, metadata, and featured imagery.',
    icon: BookOpen,
    color: 'sky',
  },
  {
    name: 'Shopify',
    category: 'CRMs & Analytics',
    description: 'Import product catalogs and generate promotional campaign copy in seconds.',
    icon: ShoppingBag,
    color: 'lime',
  },
  {
    name: 'LinkedIn & X (Twitter)',
    category: 'Team Chat',
    description: 'Schedule omnichannel social updates with tailored audience tone settings.',
    icon: Share2,
    color: 'gray',
  },
]
const integrationCategories = [
  'All',
  'CMS & Publishing',
  'Design & Assets',
  'CRMs & Analytics',
  'Team Chat',
]

export function IntegrationsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [detail, setDetail] = useState<Detail | null>(null)
  const [requestOpen, setRequestOpen] = useState(false)
  const [request, setRequest] = useState('')
  const { notify } = useToast()
  const filtered = integrations.filter(
    (app) =>
      (category === 'All' || app.category === category) &&
      `${app.name} ${app.description}`.toLowerCase().includes(query.toLowerCase()),
  )
  const showApi = () =>
    setDetail({
      title: 'ContentCraft API — developer preview',
      intro:
        'This design preview shows how a future API can connect content generation and publishing. The example endpoint is illustrative and is not a live API.',
      points: [
        'POST /v1/content/generate — submit a brief and brand context.',
        'Webhooks — receive generation and approval status updates.',
        'OAuth 2.0 and scoped access — proposed integration architecture.',
      ],
    })
  return (
    <div className="mkt-page mkt-integrations">
      <section className="mkt-hero mkt-integrations-hero">
        <Eyebrow icon={Zap}>Seamless Ecosystem</Eyebrow>
        <h1>Connect ContentCraft to your favorite marketing & productivity tools</h1>
        <p>
          Supercharge your existing stack. Sync brand catalogs, export copy instantly to CMS
          platforms, and streamline team notifications with 1-click native integrations.
        </p>
        <div className="mkt-catalog-controls">
          <label className="mkt-search">
            <Search size={18} />
            <input
              aria-label="Search integrations"
              placeholder="Search 50+ integrations..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query ? (
              <button aria-label="Clear integration search" onClick={() => setQuery('')}>
                <X size={15} />
              </button>
            ) : (
              <span>⌘ K</span>
            )}
          </label>
          <div className="mkt-filter-tabs" aria-label="Integration categories">
            {integrationCategories.map((item) => (
              <button
                key={item}
                aria-pressed={category === item}
                className={category === item ? 'is-active' : ''}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="mkt-container mkt-integration-catalog">
        <div className="mkt-catalog-heading">
          <h2>
            <i />
            Available Integrations ({filtered.length}
            {!query && category === 'All' ? ' Featured' : ''})
          </h2>
          <span>
            <CheckCircle2 size={15} />
            Verified Zero-latency Webhooks
          </span>
        </div>
        <div className="mkt-integrations-grid">
          {filtered.map((app) => (
            <article className="mkt-integration-card" key={app.name}>
              <div className="mkt-integration-top">
                <IconTile icon={app.icon} tone={app.color} />
                <span className="mkt-pill">{app.category}</span>
              </div>
              <h3>{app.name}</h3>
              <p>{app.description}</p>
              <div className="mkt-integration-actions">
                <button
                  onClick={() =>
                    setDetail({
                      title: `${app.name} integration`,
                      intro: app.description,
                      points: [
                        'Preview the proposed workflow and permission scope.',
                        'Keep brand context and campaign content together.',
                        'This demo does not access your external account.',
                      ],
                    })
                  }
                >
                  Learn more
                </button>
                <button
                  className="mkt-button mkt-button-outline"
                  onClick={() =>
                    setDetail({
                      title: `Connect ${app.name}`,
                      intro: `The ${app.name} connector is a demonstration. No authorization window will open and no external account will be connected.`,
                      points: [
                        'A live integration would ask for your explicit authorization.',
                        'You would choose a workspace and review the requested permissions.',
                        'You can explore the ContentCraft demo workspace now.',
                      ],
                      footer: (
                        <Link to="/dashboard" className="mkt-button">
                          Open demo workspace <ArrowRight size={15} />
                        </Link>
                      ),
                    })
                  }
                >
                  Connect
                </button>
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="mkt-empty">
            <Search size={30} />
            <h3>No integrations found</h3>
            <p>Try a different name or choose another category.</p>
            <button
              className="mkt-button mkt-button-secondary"
              onClick={() => {
                setQuery('')
                setCategory('All')
              }}
            >
              Clear filters
            </button>
          </div>
        )}
        <section className="mkt-api-section">
          <div>
            <Eyebrow icon={Code2}>Developer First Platform</Eyebrow>
            <h2>REST API & Webhooks for Custom Enterprise Workflows</h2>
            <p>
              Programmatically orchestrate AI drafting, run automated brand-safety evaluations, and
              push assets to your custom internal systems with low latency and 99.99% uptime
              guarantees.
            </p>
            <div className="mkt-api-benefits">
              <div>
                <Check size={20} />
                <span>
                  <strong>OAuth 2.0 & JWT</strong>
                  <small>Bank-grade authentication</small>
                </span>
              </div>
              <div>
                <Check size={20} />
                <span>
                  <strong>Realtime Webhooks</strong>
                  <small>Payload dispatch &lt; 200ms</small>
                </span>
              </div>
            </div>
            <button className="mkt-button mkt-button-dark" onClick={showApi}>
              Read developer docs <ArrowRight size={16} />
            </button>
          </div>
          <div className="mkt-code-preview">
            <header>
              <span className="mkt-window-dots">
                <i />
                <i />
                <i />
              </span>
              <span>POST /v1/content/generate</span>
              <b>cURL</b>
            </header>
            <pre>
              <span># Generate tailored blog post via ContentCraft API</span>
              {
                '\ncurl -X POST https://api.contentcraft.ai/v1/content/generate \\\n  -H "Authorization: Bearer <YOUR_API_KEY>" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "model": "craft-editorial-v2",\n    "prompt": "Announce launch of Q3 enterprise analytics",\n    "tone": "confident_minimalist",\n    "output_target": {\n      "platform": "hubspot_cms",\n      "publish_state": "draft"\n    }\n  }\''
              }
            </pre>
            <span className="mkt-code-caption">Illustrative API preview</span>
          </div>
        </section>
        <section className="mkt-request-section">
          <IconTile icon={Puzzle} />
          <h2>Missing an app you use every day?</h2>
          <p>
            Request an integration or build with our open API. Our engineering and partner ecosystem
            teams roll out new native connectors every two weeks.
          </p>
          <div className="mkt-hero-actions">
            <button className="mkt-button" onClick={() => setRequestOpen(true)}>
              Request an integration
            </button>
            <button
              className="mkt-button mkt-button-secondary"
              onClick={() =>
                setDetail({
                  title: 'Partner program preview',
                  intro:
                    'Build better content workflows together. The proposed partner program connects technology platforms, implementation teams, and content agencies.',
                  points: [
                    'Technology integrations and developer support.',
                    'Shared workflow templates and product feedback.',
                    'This demo form does not submit a partnership application.',
                  ],
                })
              }
            >
              Join Partner Program
            </button>
          </div>
        </section>
      </section>
      <DetailModal detail={detail} onClose={() => setDetail(null)} />
      <Modal
        open={requestOpen}
        title="Request an integration"
        onClose={() => setRequestOpen(false)}
      >
        <form
          className="mkt-dialog-content mkt-form"
          onSubmit={(e) => {
            e.preventDefault()
            if (!request.trim()) return
            notify(`Demo request saved for ${request.trim()}. No request was sent.`)
            setRequestOpen(false)
            setRequest('')
          }}
        >
          <p>Tell us which app you would like to see. This saves a demo confirmation only.</p>
          <label>
            App name
            <input
              required
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              placeholder="e.g. Mailchimp"
              maxLength={80}
            />
          </label>
          <button className="mkt-button" type="submit">
            Save demo request <ArrowRight size={16} />
          </button>
        </form>
      </Modal>
    </div>
  )
}

const audiences = [
  {
    icon: PencilLine,
    tag: 'Editorial Focus',
    title: 'Content Marketers & Writers',
    body: 'Accelerate drafting without sacrificing tone of voice or narrative nuance. Multi-channel templates tuned to your brand.',
    action: 'Explore writer workflows',
    points: [
      'Turn research and briefs into a structured first draft.',
      'Apply a consistent tone across every channel.',
      'Review and improve drafts with your team.',
    ],
  },
  {
    icon: Building2,
    tag: 'Multi-Tenant',
    title: 'Growth & Marketing Agencies',
    body: 'Manage multiple client workspaces with dedicated style guides, approval workflows, and rapid output delivery.',
    action: 'Explore agency features',
    points: [
      'Keep client brand guidelines and product context separate.',
      'Move campaigns through a shared review workflow.',
      'Build repeatable content templates for your team.',
    ],
  },
  {
    icon: ShoppingBag,
    tag: 'High Velocity',
    title: 'E-commerce & Retail Brands',
    body: 'Transform SKU databases into compelling product stories, lifestyle captions, and seasonal campaigns in seconds.',
    action: 'Explore retail cataloging',
    points: [
      'Organize product specifications in one place.',
      'Create product-led campaign briefs and captions.',
      'Reuse approved messaging across campaigns.',
    ],
  },
  {
    icon: ShieldCheck,
    tag: 'Governance & Security',
    title: 'Enterprise Brand Teams',
    body: 'Enforce brand governance, multi-seat compliance, custom API integrations, and single sign-on security.',
    action: 'Explore enterprise security',
    points: [
      'Define workspace roles and review responsibilities.',
      'Keep reusable brand context and approved content together.',
      'Preview governance controls in the demo workspace.',
    ],
  },
]

export function BuiltForPage() {
  const [detail, setDetail] = useState<Detail | null>(null)
  return (
    <div className="mkt-page mkt-built-for">
      <section className="mkt-hero mkt-built-hero">
        <Eyebrow icon={CheckCircle2}>Tailored Solutions</Eyebrow>
        <h1>Engineered for teams that craft content with intent</h1>
        <p>
          Whether you are scaling agency throughput or driving enterprise brand governance,
          ContentCraft adapts to your workflow.
        </p>
        <div className="mkt-hero-actions">
          <Link to="/register" className="mkt-button">
            Start free trial <ArrowRight size={17} />
          </Link>
          <a href="#use-cases" className="mkt-button mkt-button-secondary">
            Explore use cases <ArrowDown size={15} />
          </a>
        </div>
      </section>
      <section className="mkt-container mkt-audiences-section" id="use-cases">
        <SectionTitle
          label="SPECIALIZED CAPABILITIES"
          title="Built for how you deliver"
          description="Precision architectures tailored to unique operational demands, voice requirements, and governance layers."
        />
        <div className="mkt-audience-grid">
          {audiences.map(({ icon, tag, title, body, action, points }) => (
            <article className="mkt-audience-card" key={title}>
              <IconTile
                icon={icon}
                tone={tag === 'High Velocity' || tag === 'Editorial Focus' ? 'sage' : 'green'}
              />
              <span className="mkt-pill">{tag}</span>
              <h3>{title}</h3>
              <p>{body}</p>
              <button
                onClick={() =>
                  setDetail({
                    title,
                    intro: body,
                    points,
                    footer: (
                      <Link className="mkt-button" to="/dashboard">
                        Explore the workspace <ArrowRight size={15} />
                      </Link>
                    ),
                  })
                }
              >
                {action} <ArrowRight size={15} />
              </button>
            </article>
          ))}
        </div>
        <div className="mkt-benchmark-grid">
          {[
            {
              icon: Gauge,
              tag: 'Speed Benchmark',
              value: '10× Faster',
              label: 'Campaign turnaround',
              body: 'Condense weeks of ideation and cross-channel copywriting into structured, review-ready briefs in minutes.',
            },
            {
              icon: Users,
              tag: 'Tone Precision',
              value: '100% Brand voice',
              label: 'Absolute consistency',
              body: 'Custom neural parameters retain syntax, vocabulary constraints, and regulatory rules across every department.',
            },
            {
              icon: Layers3,
              tag: 'Ease of Adoption',
              value: 'Zero training',
              label: 'Required for team members',
              body: 'Frictionless natural language inputs, intuitive stationery-inspired interfaces, and plug-and-play templates.',
            },
          ].map(({ icon: Icon, tag, value, label, body }) => (
            <article key={tag}>
              <span className="mkt-pill mkt-pill-green">
                <Icon size={15} />
                {tag}
              </span>
              <h2>{value}</h2>
              <h3>{label}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <BottomCta />
      </section>
      <DetailModal detail={detail} onClose={() => setDetail(null)} />
    </div>
  )
}

type Resource = {
  title: string
  type: string
  category: string
  description: string
  duration: string
  action: string
  image: string
  points: string[]
}
const resourceItems: Resource[] = [
  {
    title: 'The 2025 Brand Voice Calibration Manual',
    type: 'Playbook',
    category: 'Best Practices',
    description:
      'Learn how to train multi-model prompts with specific brand adjectives, syntax rules, and dialect markers.',
    duration: '6 min read',
    action: 'Read guide',
    image: '/assets/resource-guide.svg',
    points: [
      'Start with three voice attributes and three things your brand never says.',
      'Write a short reference paragraph that demonstrates your tone.',
      'Review a sample draft against your voice attributes before scaling to other channels.',
    ],
  },
  {
    title: 'Omnichannel Launch Campaign Kit',
    type: 'Templates',
    category: 'Prompt Library',
    description:
      'Pre-built prompt chains and layout briefs for social ads, email sequences, and blog announcements.',
    duration: '12 templates',
    action: 'Explore kit',
    image: '/assets/resource-campaign.svg',
    points: [
      'Campaign brief: audience, product benefit, proof point, and call to action.',
      'Social prompt: turn the core message into three short channel-specific variations.',
      'Email prompt: create an opening, product story, and one clear next action.',
    ],
  },
  {
    title: 'From Draft to Approval: Multi-Seat Workflows',
    type: 'Webinar',
    category: 'Case Studies',
    description:
      'Watch how fast-growing agency teams collaborate, version-control drafts, and automate approvals.',
    duration: '24 min video',
    action: 'Watch masterclass',
    image: '/assets/resource-team.svg',
    points: [
      'Assign an editor and a reviewer before a draft is created.',
      'Record specific comments against the current version.',
      'Approve the final content only after brand voice and factual checks. This preview contains a written lesson, not a hosted video.',
    ],
  },
  {
    title: 'Write better briefs in five minutes',
    type: 'Guide',
    category: 'Best Practices',
    description:
      'A practical framework for transforming a rough idea into a useful creative brief.',
    duration: '5 min read',
    action: 'Read guide',
    image: '/assets/resource-guide.svg',
    points: [
      'Describe the audience and the problem in a single sentence.',
      'Choose one main message and a measurable outcome.',
      'Share the channel, tone, constraints, and required proof points.',
    ],
  },
  {
    title: 'A practical prompt library for content teams',
    type: 'Templates',
    category: 'Prompt Library',
    description: 'Reusable prompts for research, product stories, and editorial reviews.',
    duration: '8 templates',
    action: 'Explore prompts',
    image: '/assets/resource-campaign.svg',
    points: [
      'Research: list the questions an audience asks before choosing this product.',
      'Draft: explain one benefit using a specific example.',
      'Review: identify vague claims and propose more precise language.',
    ],
  },
  {
    title: 'One workspace, a consistent brand story',
    type: 'Case study',
    category: 'Case Studies',
    description: 'An illustrated demo of a small team planning its first cross-channel campaign.',
    duration: '7 min read',
    action: 'Read story',
    image: '/assets/resource-team.svg',
    points: [
      'Collect the product facts and voice guidelines in one workspace.',
      'Build the campaign around one audience need.',
      'Review the email, social, and website messages together for consistency.',
    ],
  },
]

export function ResourcesPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [archive, setArchive] = useState(false)
  const [detail, setDetail] = useState<Detail | null>(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const { notify } = useToast()
  const visible = resourceItems.filter(
    (item, index) =>
      (archive || query || category !== 'All' || index < 3) &&
      (category === 'All' || category === item.category) &&
      `${item.title} ${item.description} ${item.type}`.toLowerCase().includes(query.toLowerCase()),
  )
  function subscribe(e: FormEvent) {
    e.preventDefault()
    setSubscribed(true)
    try {
      localStorage.setItem('contentcraft-demo-newsletter', email)
    } catch {
      /* Demo confirmation also works without storage. */
    }
    notify('Demo subscription saved in this browser. No email was sent.')
  }
  return (
    <div className="mkt-page mkt-resources">
      <section className="mkt-hero mkt-resources-hero">
        <Eyebrow icon={CheckCircle2}>KNOWLEDGE & GUIDANCE</Eyebrow>
        <h1>Master modern content craft with curated resources</h1>
        <p>
          Guides, prompts, playbooks, and video tutorials designed to help you get the most out of
          your AI marketing workspace.
        </p>
        <div className="mkt-catalog-controls">
          <form
            className="mkt-search"
            onSubmit={(e) => {
              e.preventDefault()
              document
                .getElementById('resource-results')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          >
            <Search size={18} />
            <input
              placeholder="Search guides, templates, or playbooks..."
              aria-label="Search resources"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="mkt-search-submit">
              Search
            </button>
          </form>
          <div className="mkt-filter-tabs" aria-label="Resource categories">
            {['All', 'Prompt Library', 'Best Practices', 'Case Studies'].map((item) => (
              <button
                key={item}
                aria-pressed={category === item}
                className={item === category ? 'is-active' : ''}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="mkt-container mkt-resource-section" id="resource-results">
        <div className="mkt-resource-heading">
          <div>
            <h2>{archive ? 'Resource archive' : 'Featured Highlights'}</h2>
            <p>Carefully engineered materials for strategic content execution</p>
          </div>
          <button onClick={() => setArchive(!archive)}>
            {archive ? 'Show featured' : 'Browse archive'} <ArrowRight size={15} />
          </button>
        </div>
        <div className="mkt-resources-grid">
          {visible.map((resource) => (
            <article className="mkt-resource-card" key={resource.title}>
              <div className="mkt-resource-image">
                <img src={resource.image} alt={`${resource.type} illustration`} />
                <span className="mkt-pill mkt-pill-green">{resource.type}</span>
              </div>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <footer>
                <span>
                  {resource.type === 'Webinar' ? (
                    <CirclePlay size={15} />
                  ) : resource.type === 'Templates' ? (
                    <FolderOpen size={15} />
                  ) : (
                    <Clock3 size={15} />
                  )}
                  {resource.duration}
                </span>
                <button
                  onClick={() =>
                    setDetail({
                      title: resource.title,
                      intro: resource.description,
                      points: resource.points,
                      footer: (
                        <div className="mkt-demo-note">
                          <BookOpen size={16} />
                          Demo resource preview • {resource.duration}
                        </div>
                      ),
                    })
                  }
                >
                  {resource.action} <ArrowRight size={15} />
                </button>
              </footer>
            </article>
          ))}
        </div>
        {visible.length === 0 && (
          <div className="mkt-empty">
            <Search size={30} />
            <h3>No matching resources</h3>
            <p>Try another phrase or reset your filters.</p>
            <button
              className="mkt-button mkt-button-secondary"
              onClick={() => {
                setQuery('')
                setCategory('All')
              }}
            >
              Clear filters
            </button>
          </div>
        )}
        <div className="mkt-resource-support">
          <article>
            <IconTile icon={Users} tone="sage" />
            <h2>Need tailored team training?</h2>
            <p>
              Book a 1-on-1 walkthrough with our prompt engineering specialists to design tailored
              models and custom workflows for your enterprise.
            </p>
            <button
              className="mkt-button mkt-button-secondary"
              onClick={() =>
                setDetail({
                  title: 'Team training preview',
                  intro:
                    'Create a useful onboarding session around your team’s actual work. This preview provides a suggested agenda; no meeting is booked.',
                  points: [
                    '10 minutes: set up your brand, products, and target audience.',
                    '15 minutes: turn a shared brief into a content draft.',
                    '10 minutes: review, approve, and measure a sample campaign.',
                  ],
                  footer: (
                    <Link to="/dashboard" className="mkt-button">
                      Try the workspace <ArrowRight size={15} />
                    </Link>
                  ),
                })
              }
            >
              Request workshop
            </button>
          </article>
          <article>
            <IconTile icon={Terminal} tone="sage" />
            <h2>Developer documentation</h2>
            <p>
              Explore our REST APIs, webhooks, and headless CMS integrations to inject automated
              generative pipelines directly into your software stack.
            </p>
            <Link className="mkt-button mkt-button-secondary" to="/integrations">
              View API docs
            </Link>
          </article>
        </div>
        <section className="mkt-newsletter">
          <IconTile icon={Mail} />
          <h2>Stay updated with the latest in AI marketing</h2>
          <p>
            Join 28,000+ marketing leaders receiving our bi-weekly breakdown of prompt
            architectures, algorithmic updates, and workflow benchmarks.
          </p>
          {subscribed ? (
            <div className="mkt-newsletter-success" role="status">
              <CheckCircle2 size={24} />
              <strong>You're on the demo list.</strong>
              <span>{email} was saved in this browser. No email will be sent.</span>
              <button
                onClick={() => {
                  setSubscribed(false)
                  setEmail('')
                }}
                className="mkt-text-button"
              >
                Use another email
              </button>
            </div>
          ) : (
            <form onSubmit={subscribe}>
              <input
                type="email"
                required
                aria-label="Your work email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="mkt-button" type="submit">
                Subscribe
              </button>
            </form>
          )}
          <small>
            {subscribed
              ? 'Local demo confirmation only.'
              : 'Demo subscription • stored in this browser; no email is sent.'}
          </small>
        </section>
      </section>
      <DetailModal detail={detail} onClose={() => setDetail(null)} />
    </div>
  )
}

export function GetStartedPage() {
  const [email, setEmail] = useState('')
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const navigate = useNavigate()
  const { notify } = useToast()
  const apps = [
    { name: 'Notion', mark: 'N', cls: 'notion' },
    { name: 'Facebook', mark: 'f', cls: 'facebook' },
    { name: 'WordPress', mark: 'W', cls: 'wordpress' },
    { name: 'Canva', mark: 'C', cls: 'canva' },
    { name: 'Figma', icon: Figma, cls: 'figma' },
    { name: 'Shopify', icon: ShoppingBag, cls: 'shopify' },
    { name: 'Slack', icon: Slack, cls: 'slack' },
    { name: 'Zapier', icon: Plus, cls: 'zapier' },
    { name: 'Google Drive', icon: Triangle, cls: 'drive' },
    { name: 'GitHub', icon: Github, cls: 'github' },
    { name: 'X', icon: X, cls: 'twitter' },
    { name: 'HubSpot', icon: Network, cls: 'hubspot' },
    { name: 'AI models', icon: Sparkles, cls: 'openai' },
    { name: 'LinkedIn', icon: Linkedin, cls: 'linkedin' },
    { name: 'Email', icon: Mail, cls: 'email' },
  ]
  return (
    <div className="mkt-page mkt-get-started">
      <section className="mkt-launch-hero">
        <div className="mkt-floating-apps" aria-label="Explore integrations">
          {apps.map(({ name, mark, icon: Icon, cls }) => (
            <Link
              to="/integrations"
              aria-label={`Explore ${name} integration`}
              className={`mkt-floating-app mkt-app-${cls}`}
              key={name}
            >
              {Icon ? <Icon size={25} strokeWidth={2} /> : <strong>{mark}</strong>}
            </Link>
          ))}
        </div>
        <div className="mkt-launch-content">
          <Eyebrow>Next-gen AI marketing platform</Eyebrow>
          <h1>
            Create smarter.
            <br />
            Grow faster.
          </h1>
          <p>[Your dedicated AI marketing studio.]</p>
          <form
            className="mkt-launch-form"
            onSubmit={(e) => {
              e.preventDefault()
              navigate(`/register?email=${encodeURIComponent(email)}`)
            }}
          >
            <label>
              <Mail size={21} />
              <input
                type="email"
                aria-label="Your email address"
                placeholder="Enter your email address..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <button className="mkt-button" type="submit">
              Get started free <ArrowRight size={17} />
            </button>
          </form>
          <small>Start 14-day free trial • No credit card required • Cancel anytime</small>
          <div className="mkt-launch-proof">
            <span>
              <Zap size={19} />
              10× Faster workflow
            </span>
            <span>
              <CheckCircle2 size={19} />
              12,000+ Creators
            </span>
            <span>
              <ShieldCheck size={19} />
              Enterprise-grade security
            </span>
          </div>
        </div>
        <button className="mkt-feedback-tab" onClick={() => setFeedbackOpen(true)}>
          <MessageSquare size={19} />
          Feedback
        </button>
      </section>
      <Modal open={feedbackOpen} title="Share your feedback" onClose={() => setFeedbackOpen(false)}>
        <form
          className="mkt-dialog-content mkt-form"
          onSubmit={(e) => {
            e.preventDefault()
            if (!feedback.trim()) return
            notify('Demo feedback saved. Nothing was sent to an external service.')
            setFeedbackOpen(false)
            setFeedback('')
          }}
        >
          <p>Help shape the ContentCraft experience. This is a local demonstration form.</p>
          <label>
            Your feedback
            <textarea
              required
              placeholder="What could make your workflow better?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              maxLength={2000}
            />
          </label>
          <button type="submit" className="mkt-button">
            Save demo feedback <ArrowRight size={16} />
          </button>
        </form>
      </Modal>
    </div>
  )
}

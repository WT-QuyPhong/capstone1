import { Component, Suspense, lazy, useEffect, type ErrorInfo, type ReactNode } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { BrandMark, LoadingState } from './components/ui'
import DashboardLayout from './layouts/DashboardLayout'
import PublicLayout from './layouts/PublicLayout'
import { ROUTES } from './routes/paths'

const AuthPage = lazy(() => import('./pages/auth/AuthPage'))
const FeaturesPage = lazy(() =>
  import('./pages/public/MarketingPages').then((m) => ({ default: m.FeaturesPage })),
)
const IntegrationsPage = lazy(() =>
  import('./pages/public/MarketingPages').then((m) => ({ default: m.IntegrationsPage })),
)
const BuiltForPage = lazy(() =>
  import('./pages/public/MarketingPages').then((m) => ({ default: m.BuiltForPage })),
)
const ResourcesPage = lazy(() =>
  import('./pages/public/MarketingPages').then((m) => ({ default: m.ResourcesPage })),
)
const GetStartedPage = lazy(() =>
  import('./pages/public/MarketingPages').then((m) => ({ default: m.GetStartedPage })),
)
const ProductsPage = lazy(() =>
  import('./pages/dashboard/EntityPages').then((m) => ({ default: m.ProductsPage })),
)
const BrandsPage = lazy(() =>
  import('./pages/dashboard/EntityPages').then((m) => ({ default: m.BrandsPage })),
)
const AudiencesPage = lazy(() =>
  import('./pages/dashboard/EntityPages').then((m) => ({ default: m.AudiencesPage })),
)
const AdminPage = lazy(() =>
  import('./pages/dashboard/EntityPages').then((m) => ({ default: m.AdminPage })),
)
const DashboardPage = lazy(() =>
  import('./pages/dashboard/StudioPages').then((m) => ({ default: m.DashboardPage })),
)
const ContentStudioPage = lazy(() =>
  import('./pages/dashboard/StudioPages').then((m) => ({ default: m.ContentStudioPage })),
)
const ImageStudioPage = lazy(() =>
  import('./pages/dashboard/StudioPages').then((m) => ({ default: m.ImageStudioPage })),
)
const HistoryPage = lazy(() =>
  import('./pages/dashboard/StudioPages').then((m) => ({ default: m.HistoryPage })),
)
const AnalyticsPage = lazy(() =>
  import('./pages/dashboard/StudioPages').then((m) => ({ default: m.AnalyticsPage })),
)

function NotFound() {
  return (
    <main className="not-found" id="main-content">
      <BrandMark />
      <h1>Page not found.</h1>
      <p>This page may have moved. Let’s get you back to a place where you can create.</p>
      <Link className="cc-button cc-button-primary" to="/">
        <ArrowLeft size={17} /> Back to ContentCraft
      </Link>
    </main>
  )
}
class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ContentCraft render error:', error, info.componentStack)
  }
  render() {
    return this.state.failed ? (
      <main className="not-found">
        <BrandMark />
        <h1>Let’s try that again.</h1>
        <p>The workspace could not load this view. Your saved data remains in this browser.</p>
        <button className="cc-button cc-button-primary" onClick={() => window.location.assign('/')}>
          Reload ContentCraft
        </button>
      </main>
    ) : (
      this.props.children
    )
  }
}
function RouteEffects() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    const names: Record<string, string> = {
      '/': 'Features',
      '/features': 'Features',
      '/integrations': 'Integrations',
      '/built-for': 'Built For',
      '/resources': 'Resources',
      '/get-started': 'Create smarter',
      '/login': 'Sign in',
      '/register': 'Create account',
      '/dashboard': 'Dashboard',
      '/dashboard/products': 'Products',
      '/dashboard/brands': 'Brands',
      '/dashboard/audiences': 'Target Customers',
      '/dashboard/content-studio': 'AI Content Studio',
      '/dashboard/image-studio': 'Image Studio',
      '/dashboard/history': 'Content history',
      '/dashboard/analytics': 'Analytics',
      '/dashboard/admin': 'Administration',
    }
    document.title = `${names[pathname] || 'Page not found'} · ContentCraft`
  }, [pathname])
  return null
}
export default function App() {
  return (
    <ErrorBoundary>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <RouteEffects />
      <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<FeaturesPage />} />
            <Route path="features" element={<FeaturesPage />} />
            <Route path="integrations" element={<IntegrationsPage />} />
            <Route path="built-for" element={<BuiltForPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="get-started" element={<GetStartedPage />} />
          </Route>
          <Route path={ROUTES.login} element={<AuthPage key="login" mode="login" />} />
          <Route path={ROUTES.register} element={<AuthPage key="register" mode="register" />} />
          <Route path={ROUTES.dashboard} element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="brands" element={<BrandsPage />} />
            <Route path="audiences" element={<AudiencesPage />} />
            <Route path="content-studio" element={<ContentStudioPage />} />
            <Route path="image-studio" element={<ImageStudioPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="admin" element={<AdminPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

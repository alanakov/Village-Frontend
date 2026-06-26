import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'

const Home     = lazy(() => import('@/pages/public/Home').then(m => ({ default: m.Home })))
const Products = lazy(() => import('@/pages/public/Products').then(m => ({ default: m.Products })))
const Culture  = lazy(() => import('@/pages/public/Culture').then(m => ({ default: m.Culture })))
const NotFound = lazy(() => import('@/pages/public/NotFound').then(m => ({ default: m.NotFound })))

const AdminLogin          = lazy(() => import('@/pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })))
const AdminRegister       = lazy(() => import('@/pages/admin/AdminRegister').then(m => ({ default: m.AdminRegister })))
const AdminForgotPassword = lazy(() => import('@/pages/admin/AdminForgotPassword').then(m => ({ default: m.AdminForgotPassword })))
const AdminResetPassword  = lazy(() => import('@/pages/admin/AdminResetPassword').then(m => ({ default: m.AdminResetPassword })))

const AdminDashboard    = lazy(() => import('@/pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })))
const AdminProductMgmt  = lazy(() => import('@/pages/admin/AdminProductManagement').then(m => ({ default: m.AdminProductManagement })))
const AdminCategoryMgmt = lazy(() => import('@/pages/admin/AdminCategoryManagement').then(m => ({ default: m.AdminCategoryManagement })))
const AdminAnalytics    = lazy(() => import('@/pages/admin/AdminAnalytics').then(m => ({ default: m.AdminAnalytics })))
const AdminContent      = lazy(() => import('@/pages/admin/AdminContentManagement').then(m => ({ default: m.AdminContentManagement })))
const AdminProfile      = lazy(() => import('@/pages/admin/AdminProfile').then(m => ({ default: m.AdminProfile })))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[var(--muted-foreground)] font-ui">Carregando...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: 'DM Sans, sans-serif',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#4b7357', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#CD5C5C', secondary: '#fff' } },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/"         element={<Home />} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/cultura"  element={<Culture />} />
          </Route>

          <Route path="/admin"                 element={<AdminLogin />} />
          <Route path="/admin/cadastro"        element={<AdminRegister />} />
          <Route path="/admin/recuperar-senha" element={<AdminForgotPassword />} />
          <Route path="/admin/redefinir-senha" element={<AdminResetPassword />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard"  element={<AdminDashboard />} />
            <Route path="products"   element={<AdminProductMgmt />} />
            <Route path="categories" element={<AdminCategoryMgmt />} />
            <Route path="analytics"  element={<AdminAnalytics />} />
            <Route path="content"    element={<AdminContent />} />
            <Route path="profile"    element={<AdminProfile />} />
          </Route>

          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
          <Route path="*"        element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

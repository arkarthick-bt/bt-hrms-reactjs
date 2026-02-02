import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth, usePermissions } from '../contexts'
import { MainLayout } from '../components'

type Props = {
  children: React.ReactElement
  permission?: string | string[]
}

const ProtectedRoute: React.FC<Props> = ({ children, permission }) => {
  const { isAuthenticated, loading } = useAuth()
  const { hasPermission } = usePermissions()

  if (loading) return null;

  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Not authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(permission)) {
    console.log('[ProtectedRoute] No permission, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('[ProtectedRoute] Authenticated, rendering content');
  return <MainLayout>{children}</MainLayout>;
}

export default ProtectedRoute

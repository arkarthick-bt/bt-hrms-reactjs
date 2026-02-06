import React from 'react'
import { BrowserRouter, Routes as SwitchRoutes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import ProtectedRoute from './ProtectedRoute'
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import RolesList from '../pages/RolesList'
import RolePermissions from '../pages/RolePermissions'
import EmployeeModule from '../pages/EmployeeModule'
import EmployeeDetails from '../pages/EmployeeDetails'
import Profile from '../pages/Profile'
import OnboardEmployee from '../pages/OnboardEmployee'
import OnboardIntern from '../pages/OnboardIntern'
import CompleteOnboarding from '../pages/CompleteOnboarding'


const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <SwitchRoutes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/employees" element={<ProtectedRoute><EmployeeModule /></ProtectedRoute>} />
      <Route path="/employees/:id" element={<ProtectedRoute><EmployeeDetails /></ProtectedRoute>} />
      <Route path="/roles" element={<ProtectedRoute><RolesList /></ProtectedRoute>} />
      <Route path="/roles/:roleId/permissions" element={<ProtectedRoute><RolePermissions /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/employees/add" element={<ProtectedRoute><OnboardEmployee /></ProtectedRoute>} />
      <Route path="/employees/intern-add" element={<ProtectedRoute><OnboardIntern /></ProtectedRoute>} />
      <Route path="/onboarding/complete" element={<ProtectedRoute><CompleteOnboarding /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </SwitchRoutes>
  </BrowserRouter>
)

export default AppRoutes

import React from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCardBody,
  CButton,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts'
import { PermissionGate } from '../components'
import SpotlightCard from '../components/reactbits/SpotlightCard'
import ShinyText from '../components/reactbits/ShinyText'
import TargetCursor from '../components/reactbits/TargetCursor'


const Home: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const processes = [
    {
      title: 'Dashboard',
      description: 'View analytics, insights, and key performance metrics.',
      permission: 'dashboard.view',
      colorVar: '--mod-primary',
      rgbVar: '--mod-primary-rgb',
      icon: '📊',
      path: '/dashboard',
    },
    {
      title: 'Employee Directory',
      description: 'Search and connect with colleagues across the organization.',
      permission: 'employee.view',
      colorVar: '--mod-secondary',
      rgbVar: '--mod-secondary-rgb',
      icon: '👥',
      path: '/employees',
    },
    {
      title: 'Leave Management',
      description: 'Apply for leaves, track status, and view leave balance.',
      permission: 'leave.view',
      colorVar: '--mod-accent',
      rgbVar: '--mod-accent-rgb',
      icon: '📅',
      path: '/leave',
    },
    {
      title: 'Payroll & Salary',
      description: 'View payslips, tax sheets, and salary history.',
      permission: 'payroll.view',
      colorVar: '--mod-primary',
      rgbVar: '--mod-primary-rgb',
      icon: '💰',
      path: '/payroll',
    },
    {
      title: 'Attendance Tracker',
      description: 'Log daily attendance and check monthly trends.',
      permission: 'attendance.view',
      colorVar: '--mod-secondary',
      rgbVar: '--mod-secondary-rgb',
      icon: '⏱️',
      path: '/attendance',
    },
    {
      title: 'Performance & Reviews',
      description: 'Track your goals and view performance feedback.',
      permission: 'performance.view',
      colorVar: '--mod-accent',
      rgbVar: '--mod-accent-rgb',
      icon: '📈',
      path: '/performance',
    },
    {
      title: 'Company Policies',
      description: 'Read and download company handbooks and policies.',
      permission: 'policies.view',
      colorVar: '--mod-primary',
      rgbVar: '--mod-primary-rgb',
      icon: '📜',
      path: '/policies',
    },
    {
      title: 'Roles & Permissions',
      description: 'Manage user roles and permissions.',
      permission: 'role.view',
      colorVar: '--mod-secondary',
      rgbVar: '--mod-secondary-rgb',
      icon: '🔒',
      path: '/roles',
    },
  ]

  return (
    <div className="min-vh-100 py-4">
      <CContainer className="position-relative">
        {/* 🎯 Target Cursor - Only for Home Screen */}
        <TargetCursor
          spinDuration={2}
          hideDefaultCursor
          parallaxOn
          hoverDuration={0.2}
        />

        {/* Header */}
        <div className="mb-5 fade-in ">
          <h2 className="fw-bold mb-1" style={{ color: 'var(--primary)' }}>
            <ShinyText text="Welcome to BonTon Softwares" speed={7} />
          </h2>
          <p className="text-muted">
            Manage your employee activities and HR processes efficiently.
          </p>
        </div>

        {/* Cards */}
        <CRow className="g-4 fade-in">
          {processes.map((process) => (
            <PermissionGate key={process.path} permission={process.permission}>
              <CCol xs={12} sm={6} lg={4}>
                <SpotlightCard 
                  className="h-100 border-0 shadow-sm overflow-hidden"
                  spotlightColor={`rgba(var(${process.rgbVar}), 0.15)`}
                >
                  {/* Card Header - Interactive part for cursor */}
                  <div
                    className="p-4 d-flex align-items-center justify-content-between cursor-target"
                    style={{ 
                      borderBottom: '1px solid rgba(0,0,0,0.05)',
                      backgroundColor: `rgba(var(${process.rgbVar}), 0.1)`
                    }}
                  >
                    <div
                      className="rounded-circle text-white d-flex align-items-center justify-content-center shadow-sm"
                      style={{
                        width: '48px',
                        height: '48px',
                        fontSize: '1.5rem',
                        backgroundColor: `var(${process.colorVar})`,
                        boxShadow: `0 4px 12px rgba(var(${process.rgbVar}), 0.3)`
                      }}
                    >
                      {process.icon}
                    </div>
                    <h5
                      className="mb-0 fw-bold text-end"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {process.title}
                    </h5>
                  </div>

                  {/* Card Body */}
                  <CCardBody className="d-flex flex-column cursor-target p-4">
                    <p className="text-muted small mb-4 flex-grow-1">
                      {process.description}
                    </p>

                    <CButton
                      className="w-100 py-2 fw-semibold cursor-target module-btn"
                      style={{ 
                        borderRadius: '8px',
                        backgroundColor: `var(${process.colorVar})`,
                        boxShadow: `0 4px 12px rgba(var(${process.rgbVar}), 0.2)`
                      }}
                      onClick={() => navigate(process.path)}
                    >
                      Open Module
                    </CButton>
                  </CCardBody>
                </SpotlightCard>
              </CCol>
            </PermissionGate>
          ))}
        </CRow>
      </CContainer>
    </div>
  )
}

export default Home

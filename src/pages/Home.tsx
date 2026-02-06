import React from 'react'
import {
  CContainer,
  CRow,
  CCol,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts'
import { PermissionGate } from '../components'
import SpotlightCard from '../components/reactbits/SpotlightCard'
import ShinyText from '../components/reactbits/ShinyText'
import TargetCursor from '../components/reactbits/TargetCursor'
import { motion } from 'framer-motion'

const Home: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const processes = [
    {
      title: 'DASHBOARD',
      description: 'VIEW ANALYTICS, INSIGHTS, AND KEY PERFORMANCE METRICS.',
      permission: 'dashboard.view',
      icon: '📊',
      path: '/dashboard',
    },
    {
      title: 'EMPLOYEE DIRECTORY',
      description: 'SEARCH AND CONNECT WITH COLLEAGUES ACROSS THE ORGANIZATION.',
      permission: 'employee.view',
      icon: '👥',
      path: '/employees',
    },
    {
      title: 'LEAVE MANAGEMENT',
      description: 'APPLY FOR LEAVES, TRACK STATUS, AND VIEW LEAVE BALANCE.',
      permission: 'leave.view',
      icon: '📅',
      path: '/leave',
    },
    {
      title: 'PAYROLL & SALARY',
      description: 'VIEW PAYSLIPS, TAX SHEETS, AND SALARY HISTORY.',
      permission: 'payroll.view',
      icon: '💰',
      path: '/payroll',
    },
    {
      title: 'ATTENDANCE TRACKER',
      description: 'LOG DAILY ATTENDANCE AND CHECK MONTHLY TRENDS.',
      permission: 'attendance.view',
      icon: '⏱️',
      path: '/attendance',
    },
    {
      title: 'PERFORMANCE & REVIEWS',
      description: 'TRACK YOUR GOALS AND VIEW PERFORMANCE FEEDBACK.',
      permission: 'performance.view',
      icon: '📈',
      path: '/performance',
    },
    {
      title: 'COMPANY POLICIES',
      description: 'READ AND DOWNLOAD COMPANY HANDBOOKS AND POLICIES.',
      permission: 'policies.view',
      icon: '📜',
      path: '/policies',
    },
    {
      title: 'ROLES & PERMISSIONS',
      description: 'MANAGE USER ROLES AND PERMISSIONS.',
      permission: 'role.view',
      icon: '🔒',
      path: '/roles',
    },
  ]

  return (
    <div className="home-page-wrapper min-vh-100 py-5">
      {/* 🌌 Atmospheric Mesh Background */}
      <div className="mesh-gradient-bg" />
      
      <CContainer fluid className="position-relative px-md-5">
        {/* 🎯 Target Cursor */}
        {/* <TargetCursor
          spinDuration={2}
          hideDefaultCursor
          parallaxOn
          hoverDuration={0.2}
        /> */}

        {/* 🌟 Hero Section */}
        <header className="mb-5 fade-in px-3">
          <div className="d-flex align-items-center mb-2">
            <div className="greeting-line me-3" />
            <span className="text-uppercase fw-bold letter-spacing-2 text-primary small">
              {getTimeGreeting()}, {user?.name?.split(' ')[0] || 'User'}
            </span>
          </div>
          <h1 className="display-4 fw-black mb-1 hero-title">
            <ShinyText text="BONTON SYSTEM" speed={7} />
          </h1>
          <p className="text-muted lead max-w-md">
            Your unified command center for organizational excellence and efficient HR management.
          </p>
        </header>

        {/* 🚀 Modules Bento-style Grid */}
        <CRow className="g-4 fade-in">
          {processes.map((process, idx) => (
            <PermissionGate key={process.path} permission={process.permission}>
              <CCol xs={12} sm={6} lg={4} xl={3}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <SpotlightCard 
                    className="h-100 border-0 shadow-lg overflow-hidden glass-module-card"
                    spotlightColor="rgba(var(--mod-primary-rgb), 0.1)"
                  >
                    <div className="module-content p-4 d-flex flex-column h-100 cursor-target" onClick={() => navigate(process.path)}>
                      <div className="d-flex justify-content-between align-items-start mb-4">
                        <div className="module-icon shadow-sm">
                          {process.icon}
                        </div>
                        <div className="arrow-indicator">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                          </svg>
                        </div>
                      </div>

                      <h4 className="fw-black mb-2 module-name">
                        {process.title}
                      </h4>
                      <p className="text-muted small mb-0 flex-grow-1 letter-spacing-05 lh-base">
                        {process.description}
                      </p>
                    </div>
                  </SpotlightCard>
                </motion.div>
              </CCol>
            </PermissionGate>
          ))}
        </CRow>
      </CContainer>

      <style>{`
        .home-page-wrapper {
          position: relative;
          overflow: hidden;
        }

        .mesh-gradient-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          background: 
            radial-gradient(circle at 0% 0%, rgba(var(--mod-primary-rgb), 0.05) 0%, transparent 50%),
            radial-gradient(circle at 100% 0%, rgba(var(--mod-secondary-rgb), 0.05) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(var(--mod-accent-rgb), 0.05) 0%, transparent 50%),
            radial-gradient(circle at 0% 100%, rgba(var(--mod-primary-rgb), 0.05) 0%, transparent 50%);
          filter: blur(80px);
        }

        .greeting-line {
          width: 24px;
          height: 2px;
          background: var(--gradient-primary);
          border-radius: 2px;
        }

        .hero-title {
          font-weight: 900;
          letter-spacing: -2px;
          text-transform: uppercase;
        }

        .max-w-md { max-width: 600px; }

        .glass-module-card {
          background: var(--surface);
          border: 1px solid var(--border) !important;
          border-radius: 24px;
          transition: all 0.3s ease;
        }

        html[data-theme='dark'] .glass-module-card {
           background: rgba(255, 255, 255, 0.03);
           border-color: rgba(255, 255, 255, 0.05) !important;
        }

        .glass-module-card:hover {
          background: var(--surface-hover);
          border-color: rgba(var(--mod-primary-rgb), 0.2) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
        }

        .module-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          transition: all 0.3s ease;
        }

        .glass-module-card:hover .module-icon {
          transform: scale(1.1) rotate(-5deg);
        }

        .arrow-indicator {
          opacity: 0;
          transform: translate(-10px, 10px);
          transition: all 0.3s ease;
          color: var(--primary);
        }

        .glass-module-card:hover .arrow-indicator {
          opacity: 1;
          transform: translate(0, 0);
        }

        .module-name {
          letter-spacing: -0.5px;
          color: var(--text-primary);
          font-weight: 900;
        }

        .fw-black { font-weight: 900; }
        .letter-spacing-2 { letter-spacing: 2px; }
        .letter-spacing-05 { letter-spacing: 0.5px; }
        .x-small { font-size: 0.7rem; }
        .border-top-light { border-top: 1px solid var(--border-light); }
      `}</style>
    </div>
  )
}

export default Home

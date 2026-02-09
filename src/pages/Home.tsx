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

  // Layout configuration for the Bento Grid
  // span: 'col-span-md-2' makes the card span 2 columns on medium+ screens
  const modules = [
    {
      title: 'DASHBOARD',
      description: 'EXECUTIVE OVERVIEW OF ORGANIZATIONAL HEALTH AND KPIS.',
      permission: 'dashboard.view',
      icon: '📊',
      path: '/dashboard',
      span: 'grid-col-2',
      variant: 'primary'
    },
    {
      title: 'EMPLOYEE DIRECTORY',
      description: 'ACCESS COMPREHENSIVE TALENT REGISTRY AND HIERARCHY.',
      permission: 'employee.view',
      icon: '👥',
      path: '/employees',
      span: 'grid-col-2', 
      variant: 'success'
    },
    {
      title: 'ATTENDANCE',
      description: 'MONITOR WORKFORCE AVAILABILITY AND TRENDS.',
      permission: 'attendance.view',
      icon: '⏱️',
      path: '/attendance',
    },
    {
      title: 'LEAVE',
      description: 'OVERSEE LEAVE UTILIZATION AND RESOURCE PLANNING.',
      permission: 'leave.view',
      icon: '📅',
      path: '/leave',
    },
    {
      title: 'PAYROLL',
      description: 'ANALYZE COMPENSATION AND FINANCIAL DISTRIBUTION.',
      permission: 'payroll.view',
      icon: '💰',
      path: '/payroll',
    },
    {
      title: 'PROJECTS',
      description: 'EVALUATE PORTFOLIO PERFORMANCE AND MILESTONES.',
      permission: 'projects.view',
      icon: '🚀',
      path: '/projects',
    },
    {
      title: 'RECRUITMENT',
      description: 'STRATEGIC TALENT ACQUISITION AND PIPELINE OVERSIGHT.',
      permission: 'recruitment.view',
      icon: '🤝',
      path: '/recruitment',
      span: 'grid-col-2',
    },
    {
      title: 'PERFORMANCE',
      description: 'ASSESS ORGANIZATIONAL MERIT AND GROWTH.',
      permission: 'performance.view',
      icon: '📈',
      path: '/performance',
    },
    {
      title: 'ASSETS',
      description: 'CAPITAL RESOURCE ALLOCATION & TRACKING.',
      permission: 'assets.view',
      icon: '💻',
      path: '/assets',
    },
    {
      title: 'SUPPORT',
      description: 'MONITOR SLA AND EMPLOYEE SATISFACTION.',
      permission: 'helpdesk.view',
      icon: '🎧',
      path: '/help-desk',
    },
    {
      title: 'POLICIES',
      description: 'GOVERNANCE DOCUMENTATION REPOSITORY.',
      permission: 'policies.view',
      icon: '📜',
      path: '/policies',
    },
    {
      title: 'COMPLIANCE',
      description: 'REGULATORY ADHERENCE AND LEGAL FRAMEWORKS.',
      permission: 'compliance.view',
      icon: '⚖️',
      path: '/compliance',
    },
    {
      title: 'ACCESS CONTROL',
      description: 'SYSTEM SECURITY AND ROLE GOVERNANCE.',
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
        <TargetCursor
          spinDuration={2}
          hideDefaultCursor
          parallaxOn
        />

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

        {/* 🚀 Modules Bento Grid */}
        <div className="bento-grid fade-in">
          {modules.map((module, idx) => (
            <PermissionGate key={module.path} permission={module.permission}>
              <motion.div
                className={`bento-item ${module.span || ''}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <SpotlightCard 
                  className={`h-100 border-0 shadow-lg overflow-hidden glass-module-card ${module.variant ? `variant-${module.variant}` : ''}`}
                  spotlightColor="rgba(var(--mod-primary-rgb), 0.1)"
                >
                  <div className="module-content p-4 d-flex flex-column h-100 cursor-target" onClick={() => navigate(module.path)}>
                    <div className="d-flex justify-content-between align-items-start mb-4">
                      <div className="module-icon shadow-sm">
                        {module.icon}
                      </div>
                      <div className="arrow-indicator">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7"></line>
                          <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                      </div>
                    </div>

                    <h4 className="fw-black mb-2 module-name">
                      {module.title}
                    </h4>
                    <p className="text-muted small mb-0 flex-grow-1 letter-spacing-05 lh-base text-truncate-2">
                      {module.description}
                    </p>
                  </div>
                </SpotlightCard>
              </motion.div>
            </PermissionGate>
          ))}
        </div>
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

        /* 🚀 Bento Grid Layout */
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1.5rem;
          padding: 0 1rem;
        }

        @media (min-width: 768px) {
          .bento-grid {
            grid-template-columns: repeat(2, 1fr);
          }
           /* Spanning logic for medium screens */
          .grid-col-2 {
            grid-column: span 2;
          }
        }

        @media (min-width: 1200px) {
          .bento-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          /* Spanning logic for large screens */
          .grid-col-2 {
            grid-column: span 2;
          }
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
          position: relative;
        }
        
        /* Variants for important cards */
        .variant-primary {
           background: linear-gradient(145deg, rgba(var(--cui-primary-rgb), 0.03) 0%, var(--surface) 100%);
           border-color: rgba(var(--cui-primary-rgb), 0.1) !important;
        }

        .variant-success {
           background: linear-gradient(145deg, rgba(var(--cui-success-rgb), 0.03) 0%, var(--surface) 100%);
           border-color: rgba(var(--cui-success-rgb), 0.1) !important;
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
          background: var(--surface);
          border: 1px solid var(--border-light);
        }

        .glass-module-card:hover .module-icon {
          transform: scale(1.1) rotate(-5deg);
          border-color: var(--primary);
          color: var(--primary);
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
          font-size: 1.1rem;
        }

        .fw-black { font-weight: 900; }
        .letter-spacing-2 { letter-spacing: 2px; }
        .letter-spacing-05 { letter-spacing: 0.5px; }
        .text-truncate-2 {
           display: -webkit-box;
           -webkit-line-clamp: 2;
           -webkit-box-orient: vertical;  
           overflow: hidden;
        }
        .border-top-light { border-top: 1px solid var(--border-light); }
      `}</style>
    </div>
  )
}

export default Home

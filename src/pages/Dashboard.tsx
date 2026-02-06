import React, { useEffect, useState } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilPeople,
  cilUser,
  cilContact,
  cilChartLine,
  cilBriefcase,
  cilHistory,
  cilBirthdayCake,
  cilBell,
  cilSearch,
} from '@coreui/icons';
import { motion } from 'framer-motion';
import ShinyText from '../components/reactbits/ShinyText';
import SpotlightCard from '../components/reactbits/SpotlightCard';
import { get } from '../apiHelpers';
import { API_BASE_URL, API_ENDPOINTS } from '../config/config';

interface DashboardStats {
  summary: any;
  workforce: any;
  events: any;
  recruitment: any;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchDesignation, setSearchDesignation] = useState('');

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      try {
        console.log('[Dashboard] Fetching all modules...');
        const [summaryRes, workforceRes, eventsRes, recruitmentRes] = await Promise.all([
          get(API_BASE_URL + API_ENDPOINTS.DASHBOARD.SUMMARY).catch(err => ({ error: err })),
          get(API_BASE_URL + API_ENDPOINTS.DASHBOARD.WORKFORCE).catch(err => ({ error: err })),
          get(API_BASE_URL + API_ENDPOINTS.DASHBOARD.EVENTS).catch(err => ({ error: err })),
          get(API_BASE_URL + API_ENDPOINTS.DASHBOARD.RECRUITMENT).catch(() => ({ status: 'success', data: { funnel: [], vacancies: [] } }))
        ]);

        console.log('[Dashboard] Raw responses:', { summaryRes, workforceRes, eventsRes, recruitmentRes });

        const isSuccess = (res: any) => res && (res.status === 'success' || res.status === true || res.success === true || (res.data && !res.error));

        if (isSuccess(summaryRes) && isSuccess(workforceRes) && isSuccess(eventsRes)) {
          const extract = (res: any) => res.data || res;
          
          setStats({
            summary: extract(summaryRes),
            workforce: extract(workforceRes),
            events: extract(eventsRes),
            recruitment: extract(recruitmentRes) || { funnel: [], vacancies: [] }
          });
        } else {
          const failed = [];
          if (!isSuccess(summaryRes)) failed.push('Summary');
          if (!isSuccess(workforceRes)) failed.push('Workforce');
          if (!isSuccess(eventsRes)) failed.push('Events');
          
          console.error('[Dashboard] Modules failed:', failed);
          setError(`Modules failed to synchronize: ${failed.join(', ')}`);
        }
      } catch (err: any) {
        console.error('[Dashboard] Global error:', err);
        setError(err.message || 'An error occurred while fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark-deep">
        <CSpinner color="primary" variant="grow" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <CContainer className="py-5 text-center">
        <div className="p-5 glass-card">
          <CIcon icon={cilBell} size="3xl" className="text-danger mb-3" />
          <h3>System Outage</h3>
          <p className="text-muted">{error || 'Data could not be synchronized'}</p>
        </div>
      </CContainer>
    );
  }

  const { summary, workforce, events, recruitment } = stats;

  const summaryCards = [
    {
      title: 'Active Workforce',
      value: summary.employees.active,
      subValue: `${summary.employees.total} Total Registered`,
      icon: cilPeople,
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
    },
    {
      title: 'Intern Pool',
      value: summary.interns.active,
      subValue: `${summary.interns.converted} Converted to Employee`,
      icon: cilUser,
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
    }
  ];

  return (
    <div className="dashboard-container py-4">
      <CContainer fluid>
        {/* Modern Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 d-flex justify-content-between align-items-end"
        >
          <div>
            <h1 className="fw-bold mb-1">
              <ShinyText text="System Summary" speed={7} />
            </h1>
            <p className="text-muted mb-0">Unified organizational intelligence platform</p>
          </div>
          <div className="d-none d-md-block">
             <CBadge color="primary" className="p-2 px-3 rounded-pill glass-badge">
               <CIcon icon={cilHistory} className="me-2" />
               Live Update: {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(new Date())}
             </CBadge>
          </div>
        </motion.div>

        {/* Modular Summary Cards */}
        <CRow className="g-3 mb-4">
          {summaryCards.map((card, idx) => (
            <CCol xs={12} sm={6} lg={3} key={idx}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <SpotlightCard className="stat-card border-0 shadow-sm">
                  <CCardBody className="p-4 d-flex align-items-center">
                    <div className="icon-box me-3" style={{ background: card.gradient }}>
                      <CIcon icon={card.icon} size="xl" className="text-white" />
                    </div>
                    <div>
                      <div className="text-muted small fw-semibold text-uppercase letter-spacing-1">{card.title}</div>
                      <div className="h2 fw-bold mb-0 mt-1">{card.value}</div>
                      <div className="text-muted x-small">{card.subValue}</div>
                    </div>
                  </CCardBody>
                </SpotlightCard>
              </motion.div>
            </CCol>
          ))}
        </CRow>

        <CRow className="g-4">
          {/* Workforce Distribution - Professional Breakdown */}
          <CCol lg={8}>
            <div className="d-flex flex-column gap-4">
              {/* Grades Distribution (Higher Level View) */}
              <CCard className="glass-card shadow-sm">
                <CCardHeader className="border-0 bg-transparent py-4 px-4 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <CIcon icon={cilChartLine} className="me-2 text-primary" />
                    <h5 className="mb-0 fw-bold">Management Hierarchy (Grades)</h5>
                  </div>
                  <CBadge color="info-subtle" className="text-info rounded-pill">Total Active: {workforce.grades.reduce((a: any, b: any) => a + b.count, 0)}</CBadge>
                </CCardHeader>
                <CCardBody className="px-4 pb-4">
                  <div className="row g-4">
                    {workforce.grades.filter((g: any) => g.count > 0).map((grade: any, idx: number) => (
                      <CCol md={6} key={idx}>
                         <div className="grade-box p-3 rounded-4 transition-base border-light-subtle">
                           <div className="d-flex justify-content-between align-items-center mb-2">
                             <span className="fw-bold small text-uppercase letter-spacing-1">{grade.label}</span>
                             <span className="fw-bold h5 mb-0" style={{ color: `hsl(${210 + (idx * 30)}, 70%, 50%)` }}>{grade.count}</span>
                           </div>
                           <div className="progress" style={{ height: '8px', borderRadius: '10px', background: 'rgba(0,0,0,0.05)' }}>
                             <motion.div 
                               className="progress-bar rounded-pill"
                               initial={{ width: 0 }}
                               animate={{ width: `${(grade.count / (workforce.grades.reduce((a: any, b: any) => a + b.count, 1))) * 100}%` }}
                               style={{ background: `linear-gradient(90deg, hsl(${210 + (idx * 30)}, 70%, 50%), hsl(${230 + (idx * 30)}, 70%, 60%))` }}
                             />
                           </div>
                         </div>
                      </CCol>
                    ))}
                  </div>
                </CCardBody>
              </CCard>

              {/* Designations Distribution (Enhanced View) */}
              <CCard className="glass-card shadow-sm border-0">
                <CCardHeader className="border-0 bg-transparent py-4 px-4">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <div className="d-flex align-items-center">
                      <div className="icon-badge me-3">
                        <CIcon icon={cilBriefcase} size="lg" className="text-primary" />
                      </div>
                      <div>
                        <h5 className="mb-0 fw-bold">Functional Breakdown</h5>
                        <small className="text-muted">Role-based workforce distribution</small>
                      </div>
                    </div>
                    <div className="search-role">
                      <div className="position-relative">
                        <CIcon icon={cilSearch} className="position-absolute translate-middle-y top-50 start-0 ms-3 text-muted" size="sm" />
                        <input 
                          type="text" 
                          className="form-control form-control-sm ps-5 rounded-pill border-light-subtle bg-surface-hover" 
                          placeholder="Search roles..."
                          value={searchDesignation}
                          onChange={(e) => setSearchDesignation(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CCardHeader>
                <CCardBody className="px-4 pb-4">
                  <div className="designation-grid scroll-shadow" style={{ maxHeight: '420px', overflowY: 'auto', overflowX: 'hidden' }}>
                    <div className="row g-3">
                      {workforce.designations
                        .filter((d: any) => d.count > 0 && d.label.toLowerCase().includes(searchDesignation.toLowerCase()))
                        .sort((a: any, b: any) => b.count - a.count)
                        .map((dest: any, idx: number) => {
                          const isTop = idx < 3 && searchDesignation === '';
                          return (
                            <CCol xs={12} key={idx}>
                              <motion.div 
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`designation-item p-3 rounded-4 transition-base ${isTop ? 'top-role' : 'normal-role'}`}
                              >
                                <div className="d-flex align-items-center">
                                  <div className="role-avatar-mesh me-3" style={{ '--mesh-color': `hsl(${180 + (idx * 25)}, 80%, 60%)` } as any}>
                                    {dest.label[0]}
                                  </div>
                                  <div className="flex-grow-1">
                                    <div className={`fw-bold ${isTop ? 'text-primary' : 'small'}`}>{dest.label}</div>
                                    <div className="progress mt-2" style={{ height: '4px', background: 'rgba(0,0,0,0.05)' }}>
                                      <motion.div 
                                        className="progress-bar rounded-pill"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(dest.count / (workforce.designations.reduce((a: any, b: any) => a + b.count, 1))) * 100}%` }}
                                        style={{ background: `hsl(${180 + (idx * 25)}, 70%, 50%)` }}
                                      />
                                    </div>
                                  </div>
                                  <div className="ms-4 text-end">
                                    <div className="fw-black h5 mb-0">{dest.count}</div>
                                    <div className="x-small text-muted font-monospace">{((dest.count / workforce.designations.reduce((a: any, b: any) => a + b.count, 0)) * 100).toFixed(1)}%</div>
                                  </div>
                                </div>
                              </motion.div>
                            </CCol>
                          );
                        })}
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            </div>
          </CCol>

          {/* Events & Notifications */}
          <CCol lg={4}>
            <div className="d-flex flex-column gap-4">
              
              {/* Birthdays (Timeline Modern View) */}
              <CCard className="border-0 glass-card">
                 <CCardHeader className="border-0 bg-transparent py-4 d-flex align-items-center">
                    <div className="icon-badge warning me-3">
                      <CIcon icon={cilBirthdayCake} className="text-warning" />
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold">Birthdays</h5>
                      <small className="text-muted">Celebrations this month</small>
                    </div>
                 </CCardHeader>
                 <CCardBody className="p-0">
                    <div className="birthday-timeline">
                      {events.upcomingBirthdays.length > 0 ? (
                        events.upcomingBirthdays.sort((a: any, b: any) => new Date(a.date).getDate() - new Date(b.date).getDate()).map((b: any, idx: number) => {
                          const bDate = new Date(b.date);
                          const isToday = bDate.getDate() === new Date().getDate();
                          return (
                            <div key={idx} className={`birthday-node p-3 px-4 d-flex align-items-center ${isToday ? 'today-highlight' : ''}`}>
                               <div className="node-date me-4">
                                  <div className="date-num fw-black">{bDate.getDate()}</div>
                                  <div className="date-mon x-small text-uppercase">{new Intl.DateTimeFormat('en-US', { month: 'short' }).format(bDate)}</div>
                               </div>
                               <div className="node-avatar-mesh me-3" style={{ '--mesh-color': `hsla(${idx * 45}, 70%, 60%, 0.7)` } as any}>
                                 {b.name[0]}
                               </div>
                               <div>
                                 <div className="fw-bold small">{b.name}</div>
                                 <div className="text-muted x-small">{b.code}</div>
                               </div>
                               {isToday && (
                                 <div className="ms-auto">
                                   <CBadge color="danger" shape="rounded-pill" className="pulse">TODAY</CBadge>
                                 </div>
                               )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-5 text-center text-muted small italic">No birthdays on the horizon</div>
                      )}
                    </div>
                 </CCardBody>
              </CCard>

              {/* Probation Ending Soon */}
              <CCard className="border-0 glass-card alert-card">
                 <CCardHeader className="border-0 bg-transparent py-3 d-flex align-items-center">
                    <CIcon icon={cilChartLine} className="me-2 text-danger" />
                    <h5 className="mb-0 fw-bold">Probation Watch</h5>
                 </CCardHeader>
                 <CCardBody className="p-3">
                    {events.probationEnding.length > 0 ? (
                      events.probationEnding.map((p: any, idx: number) => (
                        <div key={idx} className="probation-alert mb-2 p-3 rounded-4 d-flex justify-content-between align-items-center">
                          <div>
                             <div className="small fw-bold">{p.name}</div>
                             <div className="x-small text-muted">{p.code}</div>
                          </div>
                          <div className="text-end">
                            <div className="x-small text-danger fw-bold">Ending Soon</div>
                            <div className="small text-muted">
                              {new Intl.DateTimeFormat('en-GB').format(new Date(p.date))}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-3 text-muted x-small">No upcoming completions</div>
                    )}
                 </CCardBody>
              </CCard>

              {/* Recent Joiners */}
              <CCard className="border-0 glass-card">
                 <CCardHeader className="border-0 bg-transparent py-3 d-flex align-items-center">
                    <CIcon icon={cilContact} className="me-2 text-primary" />
                    <h5 className="mb-0 fw-bold">New Hires</h5>
                 </CCardHeader>
                 <CCardBody className="p-0">
                    <div className="joiner-list">
                      {events.recentJoiners.map((j: any, idx: number) => (
                        <div key={idx} className="joiner-item p-3 border-bottom-light d-flex align-items-center">
                           <div className="avatar-initials me-3">
                             {j.name.split(' ').map((n: string) => n[0]).join('')}
                           </div>
                           <div>
                             <div className="fw-bold small">{j.name}</div>
                             <div className="text-muted x-small">{j.designation}</div>
                           </div>
                           <div className="ms-auto x-small text-muted text-end">
                             {new Intl.DateTimeFormat('en-GB').format(new Date(j.date))}
                           </div>
                        </div>
                      ))}
                    </div>
                 </CCardBody>
              </CCard>

            </div>
          </CCol>
        </CRow>
      </CContainer>

      <style>{`
        .dashboard-container {
          background-color: var(--background);
          min-height: 100vh;
        }

        .stat-card {
          border-radius: 20px;
          background: var(--surface);
          border: 1px solid var(--border-light) !important;
        }

        .icon-box {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        .glass-card {
          background: var(--surface);
          border-radius: 28px;
          border: 1px solid var(--border-light) !important;
          box-shadow: 0 10px 40px rgba(0,0,0,0.02);
        }

        .dept-row {
          background: rgba(var(--cui-primary-rgb), 0.02);
          border: 1px solid transparent;
        }

        .dept-row:hover {
          background: rgba(var(--cui-primary-rgb), 0.05);
          border-color: rgba(var(--cui-primary-rgb), 0.1);
        }

        .mini-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .event-avatar {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: white;
        }

        .birthday-bg {
          background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
        }

        .avatar-initials {
          width: 38px;
          height: 38px;
          background: var(--surface-hover);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: var(--primary);
          font-size: 0.85rem;
          border: 1px solid var(--border-light);
        }

        .probation-alert {
          background: rgba(239, 68, 68, 0.05);
          border: 1px dashed rgba(239, 68, 68, 0.2);
        }

        .icon-badge {
          width: 42px;
          height: 42px;
          background: rgba(var(--cui-primary-rgb), 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-badge.warning {
          background: rgba(245, 158, 11, 0.15);
        }

        .designation-item {
          background: var(--surface-hover);
          border: 1px solid var(--border-light);
          transition: all 0.2s ease;
        }

        .designation-item.top-role {
          background: rgba(var(--cui-primary-rgb), 0.03);
          border-color: rgba(var(--cui-primary-rgb), 0.15);
        }

        .designation-item:hover {
          transform: translateX(4px);
          border-color: var(--primary);
        }

        .role-avatar-mesh {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: white;
          background: linear-gradient(135deg, var(--mesh-color), #000000);
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        /* Birthday Timeline */
        .birthday-node {
          border-bottom: 1px solid var(--border-light);
          position: relative;
        }

        .today-highlight {
           background: linear-gradient(90deg, rgba(239, 68, 68, 0.05) 0%, transparent 100%);
           border-left: 4px solid #EF4444;
        }

        .node-date {
          text-align: center;
          min-width: 40px;
        }

        .date-num {
          font-size: 1.25rem;
          line-height: 1;
          color: var(--text-primary);
        }

        .date-mon {
          color: var(--text-muted);
          font-weight: 600;
        }

        .node-avatar-mesh {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          background: var(--mesh-color);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }

        .pulse {
          animation: pulse 2s infinite ease-in-out;
        }

        .grade-box {
          background: rgba(var(--cui-primary-rgb), 0.02);
          border: 1px solid var(--border-light);
        }

        .dest-icon {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: white;
          font-size: 1rem;
        }

        .border-bottom-light {
          border-bottom: 1px solid var(--border-light);
        }

        .x-small { font-size: 0.75rem; }
        .letter-spacing-1 { letter-spacing: 1px; }
      `}</style>
    </div>
  );
};

export default Dashboard;

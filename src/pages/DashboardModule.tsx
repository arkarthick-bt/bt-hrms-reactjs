import React, { useState } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilPeople,
  cilCalendar,
  cilClock,
  cilChart,
  cilArrowTop,
  cilArrowBottom,
} from '@coreui/icons';
import ShinyText from '../components/reactbits/ShinyText';
import SpotlightCard from '../components/reactbits/SpotlightCard';

const DashboardModule: React.FC = () => {
  const stats = [
    {
      title: 'Total Employees',
      value: '156',
      change: '+12%',
      trend: 'up',
      icon: cilPeople,
      color: 'primary',
      bgGradient: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
    },
    {
      title: 'Present Today',
      value: '142',
      change: '+5%',
      trend: 'up',
      icon: cilClock,
      color: 'success',
      bgGradient: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    },
    {
      title: 'On Leave',
      value: '8',
      change: '-2%',
      trend: 'down',
      icon: cilCalendar,
      color: 'warning',
      bgGradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
    },
    {
      title: 'Pending Approvals',
      value: '14',
      change: '+3',
      trend: 'up',
      icon: cilChart,
      color: 'danger',
      bgGradient: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
    },
  ];

  const recentActivities = [
    { user: 'John Doe', action: 'Applied for leave', time: '2 hours ago', type: 'leave' },
    { user: 'Jane Smith', action: 'Submitted timesheet', time: '3 hours ago', type: 'timesheet' },
    { user: 'Mike Johnson', action: 'Updated profile', time: '5 hours ago', type: 'profile' },
    { user: 'Sarah Williams', action: 'Requested approval', time: '6 hours ago', type: 'approval' },
  ];

  const upcomingEvents = [
    { title: 'Team Meeting', date: 'Today, 3:00 PM', type: 'meeting' },
    { title: 'Project Deadline', date: 'Tomorrow', type: 'deadline' },
    { title: 'Company Holiday', date: 'Feb 15, 2026', type: 'holiday' },
    { title: 'Performance Review', date: 'Feb 20, 2026', type: 'review' },
  ];

  return (
    <div className="dashboard-module min-vh-100 py-4">
      <CContainer fluid>
        {/* Header */}
        <div className="module-header mb-4">
          <h2 className="fw-bold mb-1">
            <ShinyText text="Analytics Dashboard" speed={7} />
          </h2>
          <p className="text-muted mb-0">Overview of your organization's key metrics</p>
        </div>

        {/* Stats Cards */}
        <CRow className="mb-4 g-3">
          {stats.map((stat, index) => (
            <CCol xs={12} sm={6} lg={3} key={index}>
              <SpotlightCard className="stat-card border-0">
                <CCardBody className="p-0">
                  <div className="stat-header" style={{ background: stat.bgGradient }}>
                    <div className="stat-icon-wrapper">
                      <CIcon icon={stat.icon} size="xl" className="text-white" />
                    </div>
                  </div>
                  <div className="stat-content">
                    <div className="stat-label">{stat.title}</div>
                    <div className="stat-value">{stat.value}</div>
                    <div className={`stat-change ${stat.trend}`}>
                      <CIcon 
                        icon={stat.trend === 'up' ? cilArrowTop : cilArrowBottom} 
                        size="sm" 
                        className="me-1"
                      />
                      {stat.change} from last month
                    </div>
                  </div>
                </CCardBody>
              </SpotlightCard>
            </CCol>
          ))}
        </CRow>

        <CRow className="g-4">
          {/* Recent Activities */}
          <CCol xs={12} lg={6}>
            <CCard className="activity-card border-0">
              <CCardHeader className="bg-transparent border-0 pb-0">
                <h5 className="fw-bold mb-0">Recent Activities</h5>
              </CCardHeader>
              <CCardBody>
                <div className="activity-list">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-avatar">
                        {activity.user.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div className="activity-details">
                        <div className="activity-user">{activity.user}</div>
                        <div className="activity-action">{activity.action}</div>
                      </div>
                      <div className="activity-time">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CCardBody>
            </CCard>
          </CCol>

          {/* Upcoming Events */}
          <CCol xs={12} lg={6}>
            <CCard className="events-card border-0">
              <CCardHeader className="bg-transparent border-0 pb-0">
                <h5 className="fw-bold mb-0">Upcoming Events</h5>
              </CCardHeader>
              <CCardBody>
                <div className="events-list">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="event-item">
                      <div className={`event-indicator ${event.type}`}></div>
                      <div className="event-details">
                        <div className="event-title">{event.title}</div>
                        <div className="event-date">{event.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>

      <style>{`
        .dashboard-module {
          background: var(--background);
        }

        .module-header {
          animation: fadeIn 0.6s ease-out;
        }

        /* Stats Cards */
        .stat-card {
          background: var(--surface);
          border-radius: 16px;
          box-shadow: var(--shadow-md);
          overflow: hidden;
          transition: all var(--transition-base);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .stat-header {
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .stat-header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }

        .stat-icon-wrapper {
          position: relative;
          z-index: 1;
        }

        .stat-content {
          padding: 1.5rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-muted);
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .stat-change {
          font-size: 0.8125rem;
          font-weight: 600;
          display: flex;
          align-items: center;
        }

        .stat-change.up {
          color: #10B981;
        }

        .stat-change.down {
          color: #EF4444;
        }

        /* Activity Card */
        .activity-card,
        .events-card {
          background: var(--surface);
          border-radius: 16px;
          box-shadow: var(--shadow-md);
          height: 100%;
        }

        .activity-card .card-header,
        .events-card .card-header {
          padding: 1.5rem 1.5rem 1rem;
        }

        .activity-list,
        .events-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 12px;
          background: var(--surface-hover);
          transition: all var(--transition-fast);
        }

        .activity-item:hover {
          background: var(--border);
          transform: translateX(4px);
        }

        .activity-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--gradient-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
          flex-shrink: 0;
        }

        .activity-details {
          flex: 1;
        }

        .activity-user {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.9375rem;
          margin-bottom: 2px;
        }

        .activity-action {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        .activity-time {
          font-size: 0.75rem;
          color: var(--text-muted);
          white-space: nowrap;
        }

        /* Events */
        .event-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 12px;
          background: var(--surface-hover);
          transition: all var(--transition-fast);
        }

        .event-item:hover {
          background: var(--border);
          transform: translateX(4px);
        }

        .event-indicator {
          width: 4px;
          height: 40px;
          border-radius: 2px;
          flex-shrink: 0;
        }

        .event-indicator.meeting {
          background: #2563EB;
        }

        .event-indicator.deadline {
          background: #EF4444;
        }

        .event-indicator.holiday {
          background: #10B981;
        }

        .event-indicator.review {
          background: #F59E0B;
        }

        .event-details {
          flex: 1;
        }

        .event-title {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.9375rem;
          margin-bottom: 2px;
        }

        .event-date {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .stat-value {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardModule;

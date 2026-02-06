import React from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CAvatar,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave, cilUser, cilEnvelopeClosed, cilPhone, cilMap, cilLockLocked } from '@coreui/icons';
import ProfileCard from '../components/ProfileCard';
import { useAuth } from '../contexts';
import ShinyText from '../components/reactbits/ShinyText';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="profile-page min-vh-100 py-5" style={{ background: 'var(--background)' }}>
      <CContainer>
        <div className="mb-5 d-flex align-items-center justify-content-between">
          <div>
            <h1 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              <ShinyText text="Profile Settings" speed={7} />
            </h1>
            <p className="text-muted mb-0">Manage your personal information and account security.</p>
          </div>
          <CButton color="primary" className="btn-save px-4 py-2">
            <CIcon icon={cilSave} className="me-2" />
            Save Changes
          </CButton>
        </div>

        <CRow className="g-4">
          {/* Left Column - Profile Card Preview */}
          <CCol lg={4}>
            <div className="sticky-top" style={{ top: '100px', zIndex: 10 }}>
              <ProfileCard
                name={user?.displayName}
                title={user?.designation || "System Administrator"}
                handle={user?.username}
                status="Active Now"
                behindGlowColor="var(--primary)"
                innerGradient="linear-gradient(145deg, var(--surface) 0%, var(--surface-hover) 100%)"
              />
              
              <CCard className="mt-4 border-0 shadow-sm" style={{ borderRadius: '20px', background: 'var(--surface)' }}>
                <CCardBody className="p-4">
                  <h5 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>Account Stats</h5>
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Joined Date</span>
                      <span className="fw-semibold">Jan 15, 2024</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Last Active</span>
                      <span className="fw-semibold">2 hours ago</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Permissions</span>
                      <span className="badge bg-primary-subtle text-primary px-3 rounded-pill">Admin</span>
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            </div>
          </CCol>

          {/* Right Column - Forms */}
          <CCol lg={8}>
            <div className="d-flex flex-column gap-4">
              {/* Personal Information */}
              <CCard className="border-0 shadow-sm" style={{ borderRadius: '24px', background: 'var(--surface)' }}>
                <CCardBody className="p-4 p-md-5">
                  <div className="d-flex align-items-center mb-4">
                    <div className="icon-wrapper me-3">
                      <CIcon icon={cilUser} size="lg" className="text-primary" />
                    </div>
                    <h4 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>Personal Details</h4>
                  </div>
                  
                  <CRow className="g-4">
                    <CCol md={6}>
                      <CFormLabel className="fw-semibold small text-muted">Full Name</CFormLabel>
                      <CFormInput 
                        placeholder="Your full name" 
                        defaultValue={user?.displayName || ''}
                        className="custom-input"
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel className="fw-semibold small text-muted">Email Address</CFormLabel>
                      <CFormInput 
                        type="email" 
                        placeholder="email@example.com" 
                        defaultValue={user?.email || ''}
                        className="custom-input"
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel className="fw-semibold small text-muted">Phone Number</CFormLabel>
                      <CFormInput 
                        placeholder="+1 (234) 567-890" 
                        className="custom-input"
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel className="fw-semibold small text-muted">Designation</CFormLabel>
                      <CFormInput 
                        placeholder="Software Engineer" 
                        className="custom-input"
                      />
                    </CCol>
                    <CCol xs={12}>
                      <CFormLabel className="fw-semibold small text-muted">Bio</CFormLabel>
                      <CFormTextarea 
                        rows={4} 
                        placeholder="Tell us about yourself..." 
                        className="custom-input"
                      />
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>

              {/* Security Settings */}
              <CCard className="border-0 shadow-sm" style={{ borderRadius: '24px', background: 'var(--surface)' }}>
                <CCardBody className="p-4 p-md-5">
                  <div className="d-flex align-items-center mb-4">
                    <div className="icon-wrapper me-3" style={{ backgroundColor: 'rgba(var(--cui-danger-rgb, 239, 68, 68), 0.1)' }}>
                      <CIcon icon={cilLockLocked} size="lg" className="text-danger" />
                    </div>
                    <h4 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>Security & Password</h4>
                  </div>
                  
                  <CRow className="g-4">
                    <CCol md={12}>
                      <CFormLabel className="fw-semibold small text-muted">Current Password</CFormLabel>
                      <CFormInput 
                        type="password"
                        placeholder="Enter current password" 
                        className="custom-input"
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel className="fw-semibold small text-muted">New Password</CFormLabel>
                      <CFormInput 
                        type="password"
                        placeholder="Enter new password" 
                        className="custom-input"
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel className="fw-semibold small text-muted">Confirm New Password</CFormLabel>
                      <CFormInput 
                        type="password"
                        placeholder="Confirm new password" 
                        className="custom-input"
                      />
                    </CCol>
                  </CRow>

                  <div className="mt-4 pt-2">
                    <CButton variant="outline" color="primary" className="px-4 rounded-pill fw-bold">
                      Update Password
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </div>
          </CCol>
        </CRow>
      </CContainer>

      <style>{`
        .profile-page {
          animation: fadeIn 0.8s ease-out;
        }

        .icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--primary-light);
          background-color: rgba(var(--cui-primary-rgb, 37, 99, 235), 0.1);
        }

        .custom-input {
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background-color: var(--surface-hover) !important;
          transition: all 0.3s ease;
        }

        .custom-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(var(--mod-primary-rgb), 0.12) !important;
          background-color: var(--surface) !important;
        }

        .btn-save {
          border-radius: 12px;
          font-weight: 600;
          box-shadow: var(--shadow);
          transition: all 0.3s ease;
        }

        .btn-save:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Profile;

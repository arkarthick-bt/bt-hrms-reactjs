import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  CContainer,
  CRow,
  CCol,
  CButton,
  CSpinner,
  CBadge,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilArrowLeft, 
  cilEnvelopeClosed, 
  cilPhone, 
  cilLocationPin, 
  cilBriefcase,
  cilCreditCard,
  cilUser,
  cilCalendar
} from '@coreui/icons';
import { get } from '../apiHelpers/api';
import { API_BASE_URL, API_ENDPOINTS } from '../config/config';
import ShinyText from '../components/reactbits/ShinyText';
import SpotlightCard from '../components/reactbits/SpotlightCard';
import EmployeeUpdateModal from '../components/EmployeeUpdateModal';
import { cilPencil } from '@coreui/icons';

interface Address {
  id: string;
  addressType: string;
  name: string;
  street: string;
  zipCode: string;
  residenceIn: string;
  city: any;
  state: { name: string } | null;
  country: { name: string } | null;
  district: { name: string } | null;
}

interface Designation {
  name: string;
  gradeId: string;
}

interface Grade {
  title: string;
  code: string;
}

interface DetailedEmployee {
  id: string;
  firstName: string;
  lastName: string | null;
  employeeCode?: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  dateOfJoining?: string;
  createdAt?: string;
  collegeName?: string;
  degree?: string;
  currentYear?: number;
  designation?: Designation | null;
  department?: any;
  grade?: Grade | null;
  addresses?: Address[];
  employeeDetails?: Array<{
    pan: string;
    aadhar: string;
    bankAccountNumber: string | null;
    bankName: string | null;
  }>;
  periods?: Array<{
    startDate: string;
    endDate: string | null;
    projectTitle: string | null;
    stipend: number | null;
    remarks: string | null;
    department: { name: string } | null;
    mentor: { firstName: string, lastName: string } | null;
  }>;
  employeeStatutory?: Array<{
    pfRegistered: boolean;
    pfNumber: string | null;
    uanNumber: string | null;
    esiNumber: string | null;
  }>;
  employmentStatus?: Array<{
    probationStartDate: string | null;
    probationEndDate: string | null;
    probationPeriod: number | null;
    offerLetterDate: string | null;
    probationLetter: boolean;
    letterGiven: boolean;
    remarks: string | null;
  }>;
  isActive: boolean;
}

const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type') || 'employee';

  const [employee, setEmployee] = useState<DetailedEmployee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

  const fetchEmployeeDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const endpoint = type === 'intern' ? API_ENDPOINTS.INTERNS.GET : API_ENDPOINTS.EMPLOYEES.GET;
      const url = `${API_BASE_URL}${endpoint.replace(':id', id)}`;
      const response = await get<any>(url);
      
      const dataKey = type === 'intern' ? 'intern' : 'employee';
      if (response && response.success && response.data && response.data[dataKey]) {
        setEmployee(response.data[dataKey]);
      } else {
        setError(`${type === 'intern' ? 'Intern' : 'Employee'} not found or invalid data received.`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch employee details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: 'var(--background)' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center" style={{ background: 'var(--background)' }}>
        <h3 className="text-danger mb-3">Error</h3>
        <p className="text-muted mb-4">{error || 'Employee not found'}</p>
        <CButton color="primary" onClick={() => navigate('/employees')}>
          Back to List
        </CButton>
      </div>
    );
  }

  const getInitials = (first: string, last: string | null) => {
    const f = first?.[0] || '';
    const l = last?.[0] || '';
    return (f + l).toUpperCase() || 'U';
  };

  const primaryAddress = employee.addresses?.find(a => a.addressType === 'PERMANENT') || employee.addresses?.[0];

  return (
    <div className="min-vh-100 py-4 employee-details-container" style={{ background: 'var(--background)', textTransform: 'uppercase' }}>
      <CContainer>
        {/* Header */}
        <div className="mb-4 d-flex align-items-center">
          <CButton 
            variant="ghost" 
            color="primary" 
            onClick={() => navigate(-1)}
            className="me-3 rounded-circle p-2 shadow-sm bg-surface"
          >
            <CIcon icon={cilArrowLeft} size="lg" />
          </CButton>
          <div>
            <h2 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
              <ShinyText text={type === 'intern' ? "INTERN PROFILE" : "EMPLOYEE PROFILE"} speed={7} />
            </h2>
            <p className="text-muted mb-0 small">View detailed information</p>
          </div>
          {type === 'employee' && (
            <div className="ms-auto">
              <CButton 
                color="primary" 
                className="px-4 py-2 fw-bold shadow-sm d-flex align-items-center"
                style={{ borderRadius: '12px' }}
                onClick={() => setUpdateModalVisible(true)}
              >
                <CIcon icon={cilPencil} className="me-2" />
                EDIT PROFILE
              </CButton>
            </div>
          )}
        </div>

        <CRow className="g-4">
          {/* Left Column: Basic Info */}
          <CCol xs={12} lg={4}>
            <SpotlightCard className="h-100 border-0 shadow-sm overflow-hidden" style={{ background: 'var(--surface)' }}>
              <div className="p-4 text-center">
                  <div 
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle shadow-lg"
                  style={{ 
                    width: '120px', 
                    height: '120px', 
                    background: type === 'intern' ? 'var(--gradient-success)' : 'var(--gradient-primary)',
                    fontSize: '2.5rem',
                    color: '#fff',
                    fontWeight: 'bold'
                  }}
                >
                  {getInitials(employee.firstName, employee.lastName)}
                </div>
                
                <h4 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {employee.firstName} {employee.lastName}
                </h4>
                <p className="text-primary fw-semibold mb-2">{employee.designation?.name || 'No Designation'}</p>
                {/* <div className="mb-4">
                  <CBadge color={employee.isActive ? 'success' : 'secondary'} shape="rounded-pill">
                    {employee.isActive ? 'Active' : 'Inactive'}
                  </CBadge>
                </div> */}

                <div className="text-start p-3 rounded-3 mb-3 bg-surface-hover">
                  {type === 'employee' ? (
                    <>
                      <div className="d-flex align-items-center mb-2">
                        <CIcon icon={cilBriefcase} className="me-3 text-muted" />
                        <div>
                          <small className="d-block text-muted" style={{ fontSize: '0.75rem' }}>Employee ID</small>
                          <span className="fw-semibold" style={{ color: 'var(--text-primary)' }}>{employee.employeeCode || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <CIcon icon={cilCalendar} className="me-3 text-muted" />
                        <div>
                          <small className="d-block text-muted" style={{ fontSize: '0.75rem' }}>Date of Joining</small>
                          <span className="fw-semibold" style={{ color: 'var(--text-primary)' }}>
                            {employee.dateOfJoining ? new Date(employee.dateOfJoining).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <CIcon icon={cilUser} className="me-3 text-muted" />
                        <div>
                          <small className="d-block text-muted" style={{ fontSize: '0.75rem' }}>Grade</small>
                          <span className="fw-semibold" style={{ color: 'var(--text-primary)' }}>
                            {employee.grade?.title ? `${employee.grade.title} (${employee.grade.code})` : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="d-flex align-items-center mb-2">
                        <CIcon icon={cilBriefcase} className="me-3 text-muted" />
                        <div>
                          <small className="d-block text-muted" style={{ fontSize: '0.75rem' }}>College / University</small>
                          <span className="fw-semibold" style={{ color: 'var(--text-primary)' }}>{employee.collegeName || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <CIcon icon={cilCalendar} className="me-3 text-muted" />
                        <div>
                          <small className="d-block text-muted" style={{ fontSize: '0.75rem' }}>Internship Start Date</small>
                          <span className="fw-semibold" style={{ color: 'var(--text-primary)' }}>
                            {employee.periods?.[0]?.startDate ? new Date(employee.periods[0].startDate).toLocaleDateString() : (employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'N/A')}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <CIcon icon={cilLocationPin} className="me-3 text-muted" />
                        <div>
                          <small className="d-block text-muted" style={{ fontSize: '0.75rem' }}>Project Title</small>
                          <span className="fw-semibold" style={{ color: 'var(--text-primary)' }}>{employee.periods?.[0]?.projectTitle || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <CIcon icon={cilUser} className="me-3 text-muted" />
                        <div>
                          <small className="d-block text-muted" style={{ fontSize: '0.75rem' }}>Current Mentor</small>
                          <span className="fw-semibold" style={{ color: 'var(--text-primary)' }}>
                            {employee.periods?.[0]?.mentor ? `${employee.periods[0].mentor.firstName} ${employee.periods[0].mentor.lastName || ''}` : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </SpotlightCard>
          </CCol>

          {/* Right Column: Details */}
          <CCol xs={12} lg={8}>
            <CRow className="g-4">
              {/* Education section for Interns */}
              {type === 'intern' && (
                <CCol xs={12}>
                  <SpotlightCard className="border-0 shadow-sm" style={{ background: 'var(--surface)' }}>
                    <div className="p-4">
                      <h5 className="mb-4 border-bottom pb-2 fw-bold" style={{ color: 'var(--text-primary)' }}>
                        Education Background
                      </h5>
                      <CRow className="g-3">
                        <CCol md={6}>
                          <div className="p-3 rounded-3 bg-surface-hover">
                            <small className="d-block text-muted">Degree / Course</small>
                            <span className="fw-semibold">{employee.degree || 'N/A'}</span>
                          </div>
                        </CCol>
                        <CCol md={6}>
                          <div className="p-3 rounded-3 bg-surface-hover">
                            <small className="d-block text-muted">Current Year</small>
                            <span className="fw-semibold">{employee.currentYear ? `Year ${employee.currentYear}` : 'N/A'}</span>
                          </div>
                        </CCol>
                      </CRow>
                    </div>
                  </SpotlightCard>
                </CCol>
              )}
              {/* Contact Information */}
              <CCol xs={12}>
                <SpotlightCard className="border-0 shadow-sm" style={{ background: 'var(--surface)' }}>
                  <div className="p-4">
                    <h5 className="mb-4 border-bottom pb-2 fw-bold" style={{ color: 'var(--text-primary)' }}>
                      Contact Information
                    </h5>
                    <CRow className="g-3">
                      <CCol md={6}>
                        <div className="p-3 rounded-3 bg-surface-hover h-100">
                          <div className="d-flex align-items-center mb-2">
                            <CIcon icon={cilEnvelopeClosed} className="me-2 text-primary" />
                            <span className="text-muted small">Email Address</span>
                          </div>
                          <div className="text-break" style={{ color: 'var(--text-primary)' }}>
                            {employee.email}
                          </div>
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <div className="p-3 rounded-3 bg-surface-hover h-100">
                          <div className="d-flex align-items-center mb-2">
                            <CIcon icon={cilPhone} className="me-2 text-primary" />
                            <span className="text-muted small">Phone Number</span>
                          </div>
                          <div className="fw-semibold" style={{ color: 'var(--text-primary)' }}>
                            {employee.phone}
                          </div>
                        </div>
                      </CCol>
                      {type === 'employee' && (
                        <CCol xs={12}>
                          <div className="p-3 rounded-3 bg-surface-hover h-100">
                            <div className="d-flex align-items-center mb-2">
                              <CIcon icon={cilLocationPin} className="me-2 text-primary" />
                              <span className="text-muted small">Primary Address</span>
                            </div>
                            <div className="fw-semibold" style={{ color: 'var(--text-primary)' }}>
                              {primaryAddress ? (
                                <>
                                  {primaryAddress.name}, {primaryAddress.street}, <br />
                                  {primaryAddress.district?.name}, {primaryAddress.state?.name}, {primaryAddress.country?.name} - {primaryAddress.zipCode}
                                </>
                              ) : (
                                <span className="text-muted fst-italic">No address details available</span>
                              )}
                            </div>
                          </div>
                        </CCol>
                      )}
                    </CRow>
                  </div>
                </SpotlightCard>
              </CCol>

              {/* Personal & Statutory Details */}
              <CCol xs={12}>
                <SpotlightCard className="border-0 shadow-sm" style={{ background: 'var(--surface)' }}>
                  <div className="p-4">
                    <h5 className="mb-4 border-bottom pb-2 fw-bold" style={{ color: 'var(--text-primary)' }}>
                      Personal & Statutory Details
                    </h5>
                    <CRow className="g-3">
                      <CCol md={6}>
                         <div className="mb-3">
                            <label className="small text-muted mb-1">Date of Birth</label>
                            <div className="fw-semibold" style={{ color: 'var(--text-primary)' }}>
                              {employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : 'N/A'}
                            </div>
                         </div>
                      </CCol>
                      <CCol md={6}>
                         {/* Placeholder for Marital Status or Gender if available later */}
                      </CCol>
                      
                      <CCol xs={12}>
                         <hr className="text-muted my-2" />
                      </CCol>
                    </CRow>
                      
                    {type === 'employee' && employee.employeeDetails?.[0] && (
                        <CRow className="g-3 mt-1">
                          <CCol md={6}>
                            <div className="d-flex align-items-center rounded-3 bg-surface-hover p-3">
                              <CIcon icon={cilCreditCard} className="me-3 text-secondary" size="xl" />
                              <div>
                                <small className="d-block text-muted">PAN Number</small>
                                <span className="fw-bold font-monospace" style={{ color: 'var(--text-primary)' }}>
                                  {employee.employeeDetails[0].pan || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </CCol>
                          <CCol md={6}>
                            <div className="d-flex align-items-center rounded-3 bg-surface-hover p-3">
                              <CIcon icon={cilCreditCard} className="me-3 text-secondary" size="xl" />
                              <div>
                                <small className="d-block text-muted">Aadhar Number</small>
                                <span className="fw-bold font-monospace" style={{ color: 'var(--text-primary)' }}>
                                  {employee.employeeDetails[0].aadhar || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </CCol>
                        </CRow>
                    )}
                    
                    {type === 'intern' && (
                        <CRow className="g-3 mt-1">
                           <CCol xs={12}>
                             <p className="text-muted small mb-0">Note: Intern details are restricted. Financial & Statutory data is collected during conversion.</p>
                           </CCol>
                        </CRow>
                    )}
                  </div>
                </SpotlightCard>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CContainer>

      {/* Employee Update Modal */}
      {id && type === 'employee' && (
        <EmployeeUpdateModal 
            visible={updateModalVisible}
            onClose={() => setUpdateModalVisible(false)}
            employeeId={id}
            employeeData={employee}
            onSuccess={() => {
                setUpdateModalVisible(false);
                fetchEmployeeDetails();
            }}
        />
      )}
      
      <style>{`
        .bg-surface {
          background-color: var(--surface) !important;
        }
        .bg-surface-hover {
          background-color: var(--surface-hover) !important;
        }
      `}</style>
    </div>
  );
};

export default EmployeeDetails;

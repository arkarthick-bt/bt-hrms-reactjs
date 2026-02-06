import React, { useState } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CSpinner,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilSave, cilUser, cilSchool, cilCalendar, cilBriefcase } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { post } from '../apiHelpers/api';
import { API_BASE_URL, API_ENDPOINTS } from '../config/config';
import ShinyText from '../components/reactbits/ShinyText';
import { useAuth } from '../contexts';
import ModernSelect from '../components/ModernSelect';

import { useMasterData } from '../hooks/useMasterData';
import { sanitizeName, sanitizeNumeric, validateEmail } from '../utils/validation';

const OnboardIntern: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { masterData, fetchMaster, fetchEmployees, loading: mastersLoading } = useMasterData();

  // Form State matching the backend structure
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    collegeName: '',
    degree: '',
    currentYear: '',
    gender: '',
    dateOfBirth: '',
    period: {
      startDate: '',
      endDate: '',
      departmentId: '',
      mentorId: '',
      stipend: '',
      projectTitle: '',
      remarks: '',
    }
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});


  const handleRootChange = (field: string, value: any) => {
    let sanitizedValue = value;
    let error = '';

    if (field === 'firstName' || field === 'lastName') {
      sanitizedValue = sanitizeName(value);
    } else if (field === 'phone') {
      sanitizedValue = sanitizeNumeric(value).slice(0, 10);
      if (sanitizedValue.length > 0 && sanitizedValue.length < 10) {
        error = 'Phone number must be 10 digits';
      }
    } else if (field === 'email') {
      if (value && !validateEmail(value)) {
        error = 'Invalid email address';
      }
    }

    setFormErrors(prev => ({ ...prev, [field]: error }));

    setFormData((prev) => ({
      ...prev,
      [field]: sanitizedValue,
    }));
  };

  const handlePeriodChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      period: {
        ...prev.period,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const requiredFields = [
        { val: formData.firstName, label: 'First Name' },
        { val: formData.email, label: 'Email' },
        { val: formData.period.startDate, label: 'Start Date' },
      ];

      const missing = requiredFields.filter(f => !f.val);
      if (missing.length > 0) {
        setError(`Please fill in all mandatory fields: ${missing.map(m => m.label).join(', ')}`);
        setLoading(false);
        window.scrollTo(0, 0);
        return;
      }

      // Check for validation errors
      const hasErrors = Object.values(formErrors).some(err => err !== '');
      if (hasErrors) {
        setError('Please fix the validation errors before submitting');
        setLoading(false);
        window.scrollTo(0, 0);
        return;
      }

      // Prepare payload to match Joi schema
      const payload = {
        ...formData,
        currentYear: formData.currentYear ? parseInt(formData.currentYear) : undefined,
        period: {
          ...formData.period,
          stipend: formData.period.stipend ? parseFloat(formData.period.stipend) : undefined,
        },
        createdBy: currentUser?.id || 'system',
      };

      const response = await post<any>(API_BASE_URL + API_ENDPOINTS.INTERNS.REGISTER, payload);

      if (response && response.success) {
        navigate('/employees?view=interns');
      } else {
        setError(response?.message || 'Failed to register intern');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during intern registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboard-page min-vh-100 py-4" style={{ background: 'var(--background)' }}>
      <CContainer>
        {/* Header */}
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <CButton
              variant="ghost"
              color="primary"
              onClick={() => navigate('/employees')}
              className="me-3 rounded-circle p-2 shadow-sm bg-surface"
              style={{ background: 'var(--surface)' }}
            >
              <CIcon icon={cilArrowLeft} size="lg" />
            </CButton>
            <div>
              <h2 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                <ShinyText text="Register New Intern" speed={7} />
              </h2>
              <p className="text-muted mb-0 small">Create a record for a new internship candidate</p>
            </div>
          </div>
          <CButton 
            color="success" 
            className="px-4 py-2 fw-bold rounded-pill shadow text-white"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CSpinner size="sm" className="me-2" /> : <CIcon icon={cilSave} className="me-2" />}
            Register Intern
          </CButton>
        </div>

        {error && (
          <CCard className="mb-4 border-0 bg-danger text-white shadow-sm">
            <CCardBody className="py-2 px-3 small">{error}</CCardBody>
          </CCard>
        )}

        <CForm onSubmit={handleSubmit}>
          <CRow className="g-4">
            {/* Section 1: Personal Details */}
            <CCol xs={12} lg={4}>
              <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '20px', background: 'var(--surface)' }}>
                <CCardBody className="p-4">
                  <div className="d-flex align-items-center mb-4">
                    <div className="icon-wrapper bg-success-subtle me-3">
                      <CIcon icon={cilUser} size="lg" className="text-success" />
                    </div>
                    <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>Personal Details</h5>
                  </div>

                  <div className="mb-3">
                    <CFormLabel className="small text-muted fw-semibold">First Name <span className="text-danger">*</span></CFormLabel>
                    <CFormInput
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={(e) => handleRootChange('firstName', e.target.value)}
                      required
                      className="custom-input"
                    />
                    {formErrors.firstName && <div className="text-danger x-small mt-1">{formErrors.firstName}</div>}
                  </div>
                  <div className="mb-3">
                    <CFormLabel className="small text-muted fw-semibold">Last Name</CFormLabel>
                    <CFormInput
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={(e) => handleRootChange('lastName', e.target.value)}
                      className="custom-input"
                    />
                    {formErrors.lastName && <div className="text-danger x-small mt-1">{formErrors.lastName}</div>}
                  </div>
                  <div className="mb-3">
                    <CFormLabel className="small text-muted fw-semibold">Email Address <span className="text-danger">*</span></CFormLabel>
                    <CFormInput
                      type="email"
                      placeholder="intern.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleRootChange('email', e.target.value)}
                      required
                      className="custom-input"
                    />
                    {formErrors.email && <div className="text-danger x-small mt-1">{formErrors.email}</div>}
                  </div>
                  <div className="mb-3">
                    <CFormLabel className="small text-muted fw-semibold">Phone Number</CFormLabel>
                    <CFormInput
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={(e) => handleRootChange('phone', e.target.value)}
                      className="custom-input"
                      maxLength={10}
                    />
                    {formErrors.phone && <div className="text-danger x-small mt-1">{formErrors.phone}</div>}
                  </div>
                  <div className="mb-3">
                    <CFormLabel className="small text-muted fw-semibold">Gender</CFormLabel>
                    <CFormSelect
                      value={formData.gender}
                      onChange={(e) => handleRootChange('gender', e.target.value)}
                      className="custom-input"
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </CFormSelect>
                  </div>
                  <div className="mb-0">
                    <CFormLabel className="small text-muted fw-semibold">Date of Birth</CFormLabel>
                    <CFormInput
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleRootChange('dateOfBirth', e.target.value)}
                      className="custom-input"
                    />
                  </div>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Section 2: Education & Period */}
            <CCol xs={12} lg={8}>
              <CCard className="border-0 shadow-sm mb-4" style={{ borderRadius: '20px', background: 'var(--surface)' }}>
                <CCardBody className="p-4">
                  <div className="d-flex align-items-center mb-4">
                    <div className="icon-wrapper bg-info-subtle me-3">
                      <CIcon icon={cilSchool} size="lg" className="text-info" />
                    </div>
                    <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>Education Background</h5>
                  </div>

                  <CRow className="g-3">
                    <CCol md={12}>
                      <CFormLabel className="small text-muted fw-semibold">College / University Name</CFormLabel>
                      <CFormInput
                        placeholder="E.g. National Institute of Technology"
                        value={formData.collegeName}
                        onChange={(e) => handleRootChange('collegeName', e.target.value)}
                        className="custom-input"
                      />
                    </CCol>
                    <CCol md={8}>
                      <CFormLabel className="small text-muted fw-semibold">Degree / Course</CFormLabel>
                      <CFormInput
                        placeholder="E.g. B.Tech in Computer Science"
                        value={formData.degree}
                        onChange={(e) => handleRootChange('degree', e.target.value)}
                        className="custom-input"
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel className="small text-muted fw-semibold">Current Year</CFormLabel>
                      <CFormInput
                        type="number"
                        placeholder="3"
                        value={formData.currentYear}
                        onChange={(e) => handleRootChange('currentYear', e.target.value)}
                        className="custom-input"
                      />
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>

              <CCard className="border-0 shadow-sm" style={{ borderRadius: '20px', background: 'var(--surface)' }}>
                <CCardBody className="p-4">
                  <div className="d-flex align-items-center mb-4">
                    <div className="icon-wrapper bg-warning-subtle me-3">
                      <CIcon icon={cilCalendar} size="lg" className="text-warning" />
                    </div>
                    <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>Internship Period & Stipend</h5>
                  </div>

                  <CRow className="g-3">
                    <CCol md={6}>
                      <CFormLabel className="small text-muted fw-semibold">Start Date <span className="text-danger">*</span></CFormLabel>
                      <CFormInput
                        type="date"
                        value={formData.period.startDate}
                        onChange={(e) => handlePeriodChange('startDate', e.target.value)}
                        required
                        className="custom-input"
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel className="small text-muted fw-semibold">End Date (Optional)</CFormLabel>
                      <CFormInput
                        type="date"
                        value={formData.period.endDate}
                        onChange={(e) => handlePeriodChange('endDate', e.target.value)}
                        className="custom-input"
                      />
                    </CCol>
                    <CCol md={6}>
                      <ModernSelect
                        label="Department"
                        value={formData.period.departmentId}
                        options={(masterData['departments'] || []).map(d => ({ id: d.id, name: d.name || d.title }))}
                        onChange={(val) => handlePeriodChange('departmentId', val)}
                        onOpen={() => fetchMaster('departments')}
                        onSearch={(q) => fetchMaster('departments', q)}
                        loading={mastersLoading['departments']}
                        required={true}
                        
                      />
                    </CCol>
                    <CCol md={6}>
                      <ModernSelect
                        label="Assigned Mentor"
                        value={formData.period.mentorId}
                        options={(masterData['employees'] || []).map(e => ({ id: e.id, name: `${e.firstName} ${e.lastName || ''}`.trim() }))}
                        onChange={(val) => handlePeriodChange('mentorId', val)}
                        onOpen={() => fetchEmployees()}
                        onSearch={(q) => fetchEmployees(q)}
                        loading={mastersLoading['employees']}
                        placeholder="Select Mentor"
                        required={true}
                      />
                    </CCol>


                    <CCol md={4}>
                      <CFormLabel className="small text-muted fw-semibold">Stipend Amount</CFormLabel>
                      <CFormInput
                        type="number"
                        placeholder="15000"
                        value={formData.period.stipend}
                        onChange={(e) => handlePeriodChange('stipend', e.target.value)}
                        className="custom-input"
                      />
                    </CCol>
                    <CCol md={8}>
                      <CFormLabel className="small text-muted fw-semibold">Project Title</CFormLabel>
                      <CFormInput
                        placeholder="E.g. AI-driven HRM Optimization"
                        value={formData.period.projectTitle}
                        onChange={(e) => handlePeriodChange('projectTitle', e.target.value)}
                        className="custom-input"
                      />
                    </CCol>
                    <CCol md={12}>
                      <CFormLabel className="small text-muted fw-semibold">Additional Remarks</CFormLabel>
                      <CFormTextarea
                        rows={3}
                        placeholder="Notes about internship goals, expectations, etc."
                        value={formData.period.remarks}
                        onChange={(e) => handlePeriodChange('remarks', e.target.value)}
                        className="custom-input"
                      />
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CForm>
      </CContainer>

      <style>{`
        .icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .custom-input {
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background-color: var(--surface-hover) !important;
          transition: all 0.2s ease;
        }
        .custom-input:focus {
          border-color: var(--success);
          background-color: var(--surface) !important;
          box-shadow: 0 0 0 3px rgba(25, 135, 84, 0.1);
        }
        .onboard-page {
           animation: fadeIn 0.6s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Premium Date Picker Styling */
        input[type="date"] {
          position: relative;
          color: var(--text-primary);
          padding-right: 40px !important;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          background: transparent;
          bottom: 0;
          color: transparent;
          cursor: pointer;
          height: auto;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: auto;
          z-index: 1;
        }
        input[type="date"]::after {
          content: '📅';
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          font-size: 1.1rem;
          opacity: 0.7;
          filter: grayscale(1);
        }
        input[type="date"]:hover::after {
          opacity: 1;
          filter: none;
        }
        
        .x-small { font-size: 0.75rem; }
      `}</style>
    </div>
  );
};

export default OnboardIntern;

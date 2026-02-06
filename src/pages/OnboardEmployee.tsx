import React, { useState, useEffect } from 'react';
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
  CFormCheck,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilSave, cilUser, cilBriefcase, cilHistory } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { post, get } from '../apiHelpers/api';
import { API_BASE_URL, API_ENDPOINTS } from '../config/config';
import ShinyText from '../components/reactbits/ShinyText';
import { useAuth } from '../contexts';
import ModernSelect from '../components/ModernSelect';

import { useMasterData } from '../hooks/useMasterData';
import { sanitizeName, sanitizeNumeric, validateEmail, validatePhone } from '../utils/validation';

const OnboardEmployee: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { masterData, fetchMaster, fetchEmployees, loading: mastersLoading } = useMasterData();

  // Form State
  const [hasProbation, setHasProbation] = useState(true);
  const [formData, setFormData] = useState({
    employee: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      divisionId: '',
      departmentId: '',
      gradeId: '',
      designationId: '',
      employmentTypeId: '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
      dateOfJoining: '',
      reportingManagerId: '',
      mentorId: '',
      salary: '',
    },
    employmentStatus: {
      probationStartDate: '',
      probationEndDate: '',
      probationPeriod: '',
      offerLetterDate: '',
      remarks: '',
    },
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});


  const handleInputChange = (section: string, field: string, value: any) => {
    let sanitizedValue = value;
    let error = '';

    // Field-specific validation and sanitization
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

    setFormErrors(prev => ({
      ...prev,
      [`${section}.${field}`]: error
    }));

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev as any)[section],
        [field]: sanitizedValue,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { employee, employmentStatus } = formData;

      const requiredFields = [
        { val: employee.firstName, label: 'First Name' },
        { val: employee.email, label: 'Email' },
        { val: employee.dateOfJoining, label: 'Date of Joining' },
        { val: employee.divisionId, label: 'Division' },
        { val: employee.departmentId, label: 'Department' },
        { val: employee.gradeId, label: 'Grade' },
        { val: employee.designationId, label: 'Designation' },
        { val: employee.employmentTypeId, label: 'Employment Type' },
        { val: employee.reportingManagerId, label: 'Reporting Manager' },
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

      const cleanEmployee = {
        firstName: employee.firstName,
        lastName: employee.lastName || undefined,
        email: employee.email || undefined,
        phone: employee.phone || undefined,
        divisionId: employee.divisionId || undefined,
        departmentId: employee.departmentId || undefined,
        gradeId: employee.gradeId || undefined,
        designationId: employee.designationId || undefined,
        employmentTypeId: employee.employmentTypeId || undefined,
        dateOfBirth: employee.dateOfBirth || undefined,
        gender: employee.gender || undefined,
        maritalStatus: employee.maritalStatus || undefined,
        dateOfJoining: employee.dateOfJoining,
        reportingManagerId: employee.reportingManagerId || undefined,
        mentorId: employee.mentorId || undefined,
        salary: employee.salary ? parseFloat(employee.salary) : undefined,
      };

      const hasStatusData = hasProbation || employmentStatus.offerLetterDate || employmentStatus.remarks;
      
      const cleanEmploymentStatus = hasStatusData ? {
        probationStartDate: hasProbation && employmentStatus.probationStartDate ? employmentStatus.probationStartDate : undefined,
        probationEndDate: hasProbation && employmentStatus.probationEndDate ? employmentStatus.probationEndDate : undefined,
        probationPeriod: hasProbation && employmentStatus.probationPeriod ? parseInt(employmentStatus.probationPeriod) : undefined,
        offerLetterDate: employmentStatus.offerLetterDate || undefined,
        remarks: employmentStatus.remarks || undefined,
      } : undefined;

      const payload = {
        employee: cleanEmployee,
        employmentStatus: cleanEmploymentStatus,
        createdBy: currentUser?.id || 'SYSTEM',
      };

      const response = await post<any>(API_BASE_URL + API_ENDPOINTS.EMPLOYEES.CREATE, payload);

      if (response && response.success) {
        navigate('/employees');
      } else {
        setError(response?.message || 'Failed to create employee');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating employee');
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
                <ShinyText text="Add New Employee" speed={7} />
              </h2>
              <p className="text-muted mb-0 small">Create a complete employee profile and system account</p>
            </div>
          </div>
          <CButton 
            color="primary" 
            className="px-4 py-2 fw-bold rounded-pill shadow"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CSpinner size="sm" className="me-2" /> : <CIcon icon={cilSave} className="me-2" />}
            Create Profile
          </CButton>
        </div>

        {error && (
          <CCard className="mb-4 border-0 bg-danger text-white shadow-sm">
            <CCardBody className="py-2 px-3 small">{error}</CCardBody>
          </CCard>
        )}

        <CForm onSubmit={handleSubmit}>
          <CRow className="g-4">
            {/* Section 1: Personal Information */}
            <CCol xs={12} lg={4}>
              <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '20px', background: 'var(--surface)' }}>
                <CCardBody className="p-4">
                  <div className="d-flex align-items-center mb-4">
                    <div className="icon-wrapper bg-primary-subtle me-3">
                      <CIcon icon={cilUser} size="lg" className="text-primary" />
                    </div>
                    <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>Personal Information</h5>
                  </div>

                  <div className="mb-3">
                    <CFormLabel className="small text-muted fw-semibold">First Name <span className="text-danger">*</span></CFormLabel>
                    <CFormInput
                      placeholder="John"
                      value={formData.employee.firstName}
                      onChange={(e) => handleInputChange('employee', 'firstName', e.target.value)}
                      required
                      className="custom-input"
                    />
                    {formErrors['employee.firstName'] && <div className="text-danger x-small mt-1">{formErrors['employee.firstName']}</div>}
                  </div>
                  <div className="mb-3">
                    <CFormLabel className="small text-muted fw-semibold">Last Name</CFormLabel>
                    <CFormInput
                      placeholder="Doe"
                      value={formData.employee.lastName}
                      onChange={(e) => handleInputChange('employee', 'lastName', e.target.value)}
                      className="custom-input"
                    />
                    {formErrors['employee.lastName'] && <div className="text-danger x-small mt-1">{formErrors['employee.lastName']}</div>}
                  </div>
                  <div className="mb-3">
                    <CFormLabel className="small text-muted fw-semibold">Phone</CFormLabel>
                    <CFormInput
                      placeholder="9876543210"
                      value={formData.employee.phone}
                      onChange={(e) => handleInputChange('employee', 'phone', e.target.value)}
                      className="custom-input"
                      maxLength={10}
                    />
                    {formErrors['employee.phone'] && <div className="text-danger x-small mt-1">{formErrors['employee.phone']}</div>}
                  </div>
                  <div className="mb-3">
                    <CFormLabel className="small text-muted fw-semibold">Date of Birth</CFormLabel>
                    <CFormInput
                      type="date"
                      value={formData.employee.dateOfBirth}
                      onChange={(e) => handleInputChange('employee', 'dateOfBirth', e.target.value)}
                      className="custom-input"
                    />
                  </div>
                  <div className="mb-3">
                    <CFormLabel className="small text-muted fw-semibold">Gender</CFormLabel>
                    <CFormSelect
                      value={formData.employee.gender}
                      onChange={(e) => handleInputChange('employee', 'gender', e.target.value)}
                      className="custom-input"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </CFormSelect>
                  </div>
                  <div className="mb-0">
                    <CFormLabel className="small text-muted fw-semibold">Marital Status</CFormLabel>
                    <CFormSelect
                      value={formData.employee.maritalStatus}
                      onChange={(e) => handleInputChange('employee', 'maritalStatus', e.target.value)}
                      className="custom-input"
                    >
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </CFormSelect>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Section 2: Official Employee Details */}
            <CCol xs={12} lg={8}>
              <CCard className="border-0 shadow-sm mb-4" style={{ borderRadius: '20px', background: 'var(--surface)' }}>
                <CCardBody className="p-4">
                  <div className="d-flex align-items-center mb-4">
                    <div className="icon-wrapper bg-info-subtle me-3">
                      <CIcon icon={cilBriefcase} size="lg" className="text-info" />
                    </div>
                    <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>Official Details</h5>
                  </div>

                  <CRow className="g-3">
                    <CCol md={6}>
                      <CFormLabel className="small text-muted fw-semibold">Email Address <span className="text-danger">*</span></CFormLabel>
                      <CFormInput
                        type="email"
                        placeholder="john.doe@bonton.com"
                        value={formData.employee.email}
                        onChange={(e) => handleInputChange('employee', 'email', e.target.value)}
                        required
                        className="custom-input"
                      />
                      {formErrors['employee.email'] && <div className="text-danger x-small mt-1">{formErrors['employee.email']}</div>}
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel className="small text-muted fw-semibold">Date of Joining <span className="text-danger">*</span></CFormLabel>
                      <CFormInput
                        type="date"
                        value={formData.employee.dateOfJoining}
                        onChange={(e) => handleInputChange('employee', 'dateOfJoining', e.target.value)}
                        required
                        className="custom-input"
                      />
                    </CCol>
                    <CCol md={4}>
                      <ModernSelect
                        label="Division"
                        value={formData.employee.divisionId}
                        options={(masterData['divisions'] || []).map(d => ({ id: d.id, name: d.name || d.title }))}
                        onChange={(val) => handleInputChange('employee', 'divisionId', val)}
                        onOpen={() => fetchMaster('divisions')}
                        onSearch={(q) => fetchMaster('divisions', q)}
                        loading={mastersLoading['divisions']}
                        required
                      />
                    </CCol>
                    <CCol md={4}>
                      <ModernSelect
                        label="Department"
                        value={formData.employee.departmentId}
                        options={(masterData['departments'] || []).map(d => ({ id: d.id, name: d.name || d.title }))}
                        onChange={(val) => handleInputChange('employee', 'departmentId', val)}
                        onOpen={() => fetchMaster('departments')}
                        onSearch={(q) => fetchMaster('departments', q)}
                        loading={mastersLoading['departments']}
                        required
                      />
                    </CCol>
                    <CCol md={4}>
                      <ModernSelect
                        label="Grade"
                        value={formData.employee.gradeId}
                        options={(masterData['grades'] || []).map(g => ({ id: g.id, name: g.name || g.title }))}
                        onChange={(val) => handleInputChange('employee', 'gradeId', val)}
                        onOpen={() => fetchMaster('grades')}
                        onSearch={(q) => fetchMaster('grades', q)}
                        loading={mastersLoading['grades']}
                        required
                      />
                    </CCol>
                    <CCol md={4}>
                      <ModernSelect
                        label="Designation"
                        value={formData.employee.designationId}
                        options={(masterData['designations'] || []).map(d => ({ id: d.id, name: d.name || d.title }))}
                        onChange={(val) => handleInputChange('employee', 'designationId', val)}
                        onOpen={() => fetchMaster('designations')}
                        onSearch={(q) => fetchMaster('designations', q)}
                        loading={mastersLoading['designations']}
                        required
                      />
                    </CCol>
                    <CCol md={4}>
                      <ModernSelect
                        label="Employment Type"
                        value={formData.employee.employmentTypeId}
                        options={(masterData['employmentTypes'] || []).map(t => ({ id: t.id, name: t.name || t.title }))}
                        onChange={(val) => handleInputChange('employee', 'employmentTypeId', val)}
                        onOpen={() => fetchMaster('employmentTypes')}
                        onSearch={(q) => fetchMaster('employmentTypes', q)}
                        loading={mastersLoading['employmentTypes']}
                        required
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel className="small text-muted fw-semibold mb-2">Annual Salary</CFormLabel>
                      <CFormInput
                        type="number"
                        placeholder="750000"
                        value={formData.employee.salary}
                        onChange={(e) => handleInputChange('employee', 'salary', e.target.value)}
                        className="custom-input"
                        style={{ height: '44px' }}
                      />
                    </CCol>
                    <CCol md={6}>
                      <ModernSelect
                        label="Reporting Manager"
                        value={formData.employee.reportingManagerId}
                        options={(masterData['employees'] || []).map(e => ({ id: e.id, name: `${e.firstName} ${e.lastName || ''}`.trim() }))}
                        onChange={(val) => handleInputChange('employee', 'reportingManagerId', val)}
                        onOpen={() => fetchEmployees()}
                        onSearch={(q) => fetchEmployees(q)}
                        loading={mastersLoading['employees']}
                        placeholder="Select Manager"
                        required
                      />
                    </CCol>
                    <CCol md={6}>
                      <ModernSelect
                        label="Assign Mentor"
                        value={formData.employee.mentorId}
                        options={(masterData['employees'] || []).map(e => ({ id: e.id, name: `${e.firstName} ${e.lastName || ''}`.trim() }))}
                        onChange={(val) => handleInputChange('employee', 'mentorId', val)}
                        onOpen={() => fetchEmployees()}
                        onSearch={(q) => fetchEmployees(q)}
                        loading={mastersLoading['employees']}
                        placeholder="Select Mentor"
                      />
                    </CCol>


                  </CRow>
                </CCardBody>
              </CCard>

              {/* Section 3: Employment Status/Probation */}
              <CCard className="border-0 shadow-sm" style={{ borderRadius: '20px', background: 'var(--surface)' }}>
                <CCardBody className="p-4">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="d-flex align-items-center">
                      <div className="icon-wrapper bg-warning-subtle me-3">
                        <CIcon icon={cilHistory} size="lg" className="text-warning" />
                      </div>
                      <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>Probation & Remarks</h5>
                    </div>
                    <CFormCheck 
                      // type="switch" 
                      label="Probation Applicable" 
                      id="probationSwitch"
                      checked={hasProbation}
                      onChange={(e) => setHasProbation(e.target.checked)}
                    />
                  </div>

                  <CRow className="g-3">
                    <CCol md={4} className={!hasProbation ? 'opacity-50' : ''}>
                      <CFormLabel className="small text-muted fw-semibold">Probation Start</CFormLabel>
                      <CFormInput
                        type="date"
                        value={formData.employmentStatus.probationStartDate}
                        onChange={(e) => handleInputChange('employmentStatus', 'probationStartDate', e.target.value)}
                        className="custom-input"
                        disabled={!hasProbation}
                      />
                    </CCol>
                    <CCol md={4} className={!hasProbation ? 'opacity-50' : ''}>
                      <CFormLabel className="small text-muted fw-semibold">Probation End</CFormLabel>
                      <CFormInput
                        type="date"
                        value={formData.employmentStatus.probationEndDate}
                        onChange={(e) => handleInputChange('employmentStatus', 'probationEndDate', e.target.value)}
                        className="custom-input"
                        disabled={!hasProbation}
                      />
                    </CCol>
                    <CCol md={4} className={!hasProbation ? 'opacity-50' : ''}>
                      <CFormLabel className="small text-muted fw-semibold">Period (Months)</CFormLabel>
                      <CFormInput
                        type="number"
                        placeholder="6"
                        value={formData.employmentStatus.probationPeriod}
                        onChange={(e) => handleInputChange('employmentStatus', 'probationPeriod', e.target.value)}
                        className="custom-input"
                        disabled={!hasProbation}
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel className="small text-muted fw-semibold">Offer Letter Date</CFormLabel>
                      <CFormInput
                        type="date"
                        value={formData.employmentStatus.offerLetterDate}
                        onChange={(e) => handleInputChange('employmentStatus', 'offerLetterDate', e.target.value)}
                        className="custom-input"
                      />
                    </CCol>
                    <CCol md={8}>
                      <CFormLabel className="small text-muted fw-semibold">Remarks</CFormLabel>
                      <CFormTextarea
                        rows={1}
                        placeholder="Additional notes..."
                        value={formData.employmentStatus.remarks}
                        onChange={(e) => handleInputChange('employmentStatus', 'remarks', e.target.value)}
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
          border-color: var(--primary);
          background-color: var(--surface) !important;
          box-shadow: 0 0 0 3px rgba(var(--mod-primary-rgb), 0.1);
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

export default OnboardEmployee;

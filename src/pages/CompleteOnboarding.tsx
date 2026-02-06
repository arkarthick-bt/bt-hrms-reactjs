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
  CSpinner,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheckAlt, cilPlus, cilTrash, cilUser, cilLocationPin, cilSchool, cilBriefcase } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { put } from '../apiHelpers/api';
import { API_BASE_URL, API_ENDPOINTS } from '../config/config';
import { useAuth } from '../contexts';
import ShinyText from '../components/reactbits/ShinyText';

const CompleteOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    employee: {
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
    },
    employeeDetails: {
      pan: '',
      aadhar: '',
      bankAccountNumber: '',
      ifscCode: '',
      bankName: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
    },
    addresses: [
      { addressType: 'PERMANENT', name: '', street: '', area: '', cityId: '', stateId: '', countryId: '', zipCode: '', isPrimary: true }
    ],
    educations: [
      { qualificationId: '', schoolOrCollege: '', fieldOfStudy: '', startDate: '', endDate: '', grade: '', marksPercentage: '' }
    ],
    experiences: [
      { companyName: '', designation: '', jobDescription: '', startDate: '', endDate: '', isCurrentJob: false }
    ],
  });

  const handleInputChange = (section: string, field: string, value: any, index?: number) => {
    if (index !== undefined) {
      setFormData((prev) => {
        const list = Array.from((prev as any)[section]);
        (list[index] as any)[field] = value;
        return { ...prev, [section]: list };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...(prev as any)[section],
          [field]: value,
        },
      }));
    }
  };

  const addItem = (section: string, template: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...(prev as any)[section], template],
    }));
  };

  const removeItem = (section: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [section]: (prev as any)[section].filter((_: any, i: number) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        employeeId: user?.employeeId, // Assuming employeeId is in user object
        ...formData,
        educations: formData.educations.map(edu => ({
          ...edu,
          marksPercentage: edu.marksPercentage ? parseFloat(edu.marksPercentage) : undefined
        })),
        updatedBy: user?.id || 'system',
      };

      const response = await put<any>(API_BASE_URL + API_ENDPOINTS.EMPLOYEES.ONBOARDING_UPDATE, payload);

      if (response && response.success) {
        navigate('/profile');
      } else {
        setError(response?.message || 'Failed to update profile');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-completion py-5" style={{ background: 'var(--background)' }}>
      <CContainer>
        <div className="text-center mb-5">
          <h1 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            <ShinyText text="Complete Your Profile" speed={7} />
          </h1>
          <p className="text-muted">Welcome to the team! Please provide your personal details to complete onboarding.</p>
        </div>

        {error && (
          <CCard className="mb-4 border-0 bg-danger text-white shadow-sm">
            <CCardBody className="py-2 px-3 small">{error}</CCardBody>
          </CCard>
        )}

        <CForm onSubmit={handleSubmit}>
          <div className="d-flex flex-column gap-5">
            {/* 1. Basic Personal Info */}
            <section>
              <CRow>
                <CCol lg={4}>
                  <div className="sticky-top" style={{ top: '100px' }}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="icon-badge me-3"><CIcon icon={cilUser} /></div>
                      <h4 className="fw-bold mb-0">Personal Info</h4>
                    </div>
                    <p className="text-muted small">Your basic personal details for HR records.</p>
                  </div>
                </CCol>
                <CCol lg={8}>
                  <CCard className="border-0 shadow-sm" style={{ borderRadius: '24px', background: 'var(--surface)' }}>
                    <CCardBody className="p-4 p-md-5">
                      <CRow className="g-4">
                        <CCol md={6}>
                          <CFormLabel className="small fw-semibold text-muted">Date of Birth</CFormLabel>
                          <CFormInput 
                            type="date"
                            value={formData.employee.dateOfBirth}
                            onChange={(e) => handleInputChange('employee', 'dateOfBirth', e.target.value)}
                            required
                            className="custom-input"
                          />
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel className="small fw-semibold text-muted">Gender</CFormLabel>
                          <CFormSelect
                            value={formData.employee.gender}
                            onChange={(e) => handleInputChange('employee', 'gender', e.target.value)}
                            required
                            className="custom-input"
                          >
                            <option value="">Select Gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                          </CFormSelect>
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel className="small fw-semibold text-muted">Marital Status</CFormLabel>
                          <CFormSelect
                            value={formData.employee.maritalStatus}
                            onChange={(e) => handleInputChange('employee', 'maritalStatus', e.target.value)}
                            className="custom-input"
                          >
                            <option value="">Select Status</option>
                            <option value="SINGLE">Single</option>
                            <option value="MARRIED">Married</option>
                            <option value="DIVORCED">Divorced</option>
                          </CFormSelect>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </section>

            {/* 2. Statutory & Bank Details */}
            <section>
              <CRow>
                <CCol lg={4}>
                  <div className="sticky-top" style={{ top: '100px' }}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="icon-badge me-3 bg-info-subtle text-info"><CIcon icon={cilLocationPin} /></div>
                      <h4 className="fw-bold mb-0">Statutory & Bank</h4>
                    </div>
                    <p className="text-muted small">Used for payroll and legal compliance.</p>
                  </div>
                </CCol>
                <CCol lg={8}>
                  <CCard className="border-0 shadow-sm" style={{ borderRadius: '24px', background: 'var(--surface)' }}>
                    <CCardBody className="p-4 p-md-5">
                      <h6 className="fw-bold mb-4 text-primary">Identity</h6>
                      <CRow className="g-4 mb-5">
                        <CCol md={6}>
                          <CFormLabel className="small fw-semibold text-muted">PAN Number</CFormLabel>
                          <CFormInput 
                            placeholder="ABCDE1234F"
                            value={formData.employeeDetails.pan}
                            onChange={(e) => handleInputChange('employeeDetails', 'pan', e.target.value)}
                            className="custom-input"
                          />
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel className="small fw-semibold text-muted">Aadhar Number</CFormLabel>
                          <CFormInput 
                            placeholder="1234 5678 9012"
                            value={formData.employeeDetails.aadhar}
                            onChange={(e) => handleInputChange('employeeDetails', 'aadhar', e.target.value)}
                            className="custom-input"
                          />
                        </CCol>
                      </CRow>

                      <h6 className="fw-bold mb-4 text-primary">Bank Account</h6>
                      <CRow className="g-4 mb-5">
                        <CCol md={6}>
                          <CFormLabel className="small fw-semibold text-muted">Bank Name</CFormLabel>
                          <CFormInput 
                            placeholder="HDFC Bank"
                            value={formData.employeeDetails.bankName}
                            onChange={(e) => handleInputChange('employeeDetails', 'bankName', e.target.value)}
                            className="custom-input"
                          />
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel className="small fw-semibold text-muted">Account Number</CFormLabel>
                          <CFormInput 
                            placeholder="50100..."
                            value={formData.employeeDetails.bankAccountNumber}
                            onChange={(e) => handleInputChange('employeeDetails', 'bankAccountNumber', e.target.value)}
                            className="custom-input"
                          />
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel className="small fw-semibold text-muted">IFSC Code</CFormLabel>
                          <CFormInput 
                            placeholder="HDFC000..."
                            value={formData.employeeDetails.ifscCode}
                            onChange={(e) => handleInputChange('employeeDetails', 'ifscCode', e.target.value)}
                            className="custom-input"
                          />
                        </CCol>
                      </CRow>

                      <h6 className="fw-bold mb-4 text-primary">Emergency Contact</h6>
                      <CRow className="g-4">
                        <CCol md={6}>
                          <CFormLabel className="small fw-semibold text-muted">Contact Name</CFormLabel>
                          <CFormInput 
                            placeholder="E.g. Jane Doe"
                            value={formData.employeeDetails.emergencyContactName}
                            onChange={(e) => handleInputChange('employeeDetails', 'emergencyContactName', e.target.value)}
                            className="custom-input"
                          />
                        </CCol>
                        <CCol md={6}>
                          <CFormLabel className="small fw-semibold text-muted">Contact Phone</CFormLabel>
                          <CFormInput 
                            placeholder="+1..."
                            value={formData.employeeDetails.emergencyContactPhone}
                            onChange={(e) => handleInputChange('employeeDetails', 'emergencyContactPhone', e.target.value)}
                            className="custom-input"
                          />
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </section>

            {/* 3. Education */}
            <section>
              <CRow>
                <CCol lg={4}>
                  <div className="sticky-top" style={{ top: '100px' }}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="icon-badge me-3 bg-success-subtle text-success"><CIcon icon={cilSchool} /></div>
                      <h4 className="fw-bold mb-0">Education</h4>
                    </div>
                    <p className="text-muted small">Degrees, certifications, and schools.</p>
                  </div>
                </CCol>
                <CCol lg={8}>
                  {formData.educations.map((edu, idx) => (
                    <CCard key={idx} className="border-0 shadow-sm mb-4" style={{ borderRadius: '24px', background: 'var(--surface)' }}>
                      <CCardBody className="p-4 p-md-5">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <h6 className="fw-bold mb-0">Education #{idx+1}</h6>
                          {formData.educations.length > 1 && (
                            <CButton color="danger" variant="ghost" className="rounded-circle p-2" onClick={() => removeItem('educations', idx)}>
                              <CIcon icon={cilTrash} />
                            </CButton>
                          )}
                        </div>
                        <CRow className="g-4">
                          <CCol md={12}>
                            <CFormLabel className="small fw-semibold text-muted">School/College</CFormLabel>
                            <CFormInput 
                              placeholder="University of Science"
                              value={edu.schoolOrCollege}
                              onChange={(e) => handleInputChange('educations', 'schoolOrCollege', e.target.value, idx)}
                              className="custom-input"
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormLabel className="small fw-semibold text-muted">Field of Study</CFormLabel>
                            <CFormInput 
                              placeholder="Computer Science"
                              value={edu.fieldOfStudy}
                              onChange={(e) => handleInputChange('educations', 'fieldOfStudy', e.target.value, idx)}
                              className="custom-input"
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormLabel className="small fw-semibold text-muted">Qualification ID</CFormLabel>
                            <CFormInput 
                              placeholder="E.g. BACHELORS"
                              value={edu.qualificationId}
                              onChange={(e) => handleInputChange('educations', 'qualificationId', e.target.value, idx)}
                              className="custom-input"
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormLabel className="small fw-semibold text-muted">Start Date</CFormLabel>
                            <CFormInput 
                              type="date"
                              value={edu.startDate}
                              onChange={(e) => handleInputChange('educations', 'startDate', e.target.value, idx)}
                              className="custom-input"
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormLabel className="small fw-semibold text-muted">End Date</CFormLabel>
                            <CFormInput 
                              type="date"
                              value={edu.endDate}
                              onChange={(e) => handleInputChange('educations', 'endDate', e.target.value, idx)}
                              className="custom-input"
                            />
                          </CCol>
                        </CRow>
                      </CCardBody>
                    </CCard>
                  ))}
                  <CButton variant="outline" color="primary" className="rounded-pill px-4 w-100 py-3 border-dashed" 
                    onClick={() => addItem('educations', { qualificationId: '', schoolOrCollege: '', fieldOfStudy: '', startDate: '', endDate: '', grade: '', marksPercentage: '' })}>
                    <CIcon icon={cilPlus} className="me-2" /> Add Education
                  </CButton>
                </CCol>
              </CRow>
            </section>

             {/* Footer Action */}
             <div className="mt-5 pt-4 border-top d-flex justify-content-center">
                <CButton 
                  color="primary" 
                  size="lg" 
                  className="px-5 py-3 fw-bold rounded-pill shadow-lg"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <CSpinner size="sm" className="me-2" /> : <CIcon icon={cilCheckAlt} className="me-2" />}
                  Complete My Onboarding
                </CButton>
             </div>
          </div>
        </CForm>
      </CContainer>

      <style>{`
        .icon-badge {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: var(--primary-light);
          background-color: rgba(var(--cui-primary-rgb), 0.1);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .custom-input {
          padding: 12px 16px;
          border-radius: 14px;
          border: 1px solid var(--border);
          background-color: var(--surface-hover) !important;
          transition: all 0.3s ease;
        }
        .custom-input:focus {
           background-color: var(--surface) !important;
           border-color: var(--primary);
           box-shadow: 0 0 0 4px rgba(var(--mod-primary-rgb), 0.1);
        }
        .border-dashed {
           border-style: dashed !important;
        }
      `}</style>
    </div>
  );
};

export default CompleteOnboarding;

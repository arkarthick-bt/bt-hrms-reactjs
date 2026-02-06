import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CForm,
  CFormInput,
  CFormLabel,
  CFormCheck,
  CFormTextarea,
  CRow,
  CCol,
  CSpinner,
  CBadge,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilSave, 
  cilUser, 
  cilLocationPin, 
  cilSchool, 
  cilBriefcase, 
  cilShieldAlt, 
  cilCheckCircle,
  cilPlus
} from '@coreui/icons';
import { post } from '../apiHelpers/api';
import { API_BASE_URL, API_ENDPOINTS } from '../config/config';
import { useAuth } from '../contexts';
import ModernSelect from './ModernSelect';
import { useMasterData } from '../hooks/useMasterData';

interface EmployeeUpdateModalProps {
  visible: boolean;
  onClose: () => void;
  employeeId: string;
  employeeData: any;
  onSuccess: () => void;
}

const EmployeeUpdateModal: React.FC<EmployeeUpdateModalProps> = ({ 
  visible, 
  onClose, 
  employeeId, 
  employeeData,
  onSuccess 
}) => {
  const { user: currentUser } = useAuth();
  const { masterData, loading: mastersLoading, fetchMaster } = useMasterData();
  const [activeTab, setActiveTab] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States (KEEP EXISTING STATE LOGIC)
  const [detailsForm, setDetailsForm] = useState({
    bankAccountNumber: employeeData?.employeeDetails?.[0]?.bankAccountNumber || '',
    ifscCode: employeeData?.employeeDetails?.[0]?.ifscCode || '',
    bankName: employeeData?.employeeDetails?.[0]?.bankName || '',
    emergencyContactName: employeeData?.employeeDetails?.[0]?.emergencyContactName || '',
    emergencyContactPhone: employeeData?.employeeDetails?.[0]?.emergencyContactPhone || '',
  });

  const [statutoryForm, setStatutoryForm] = useState({
    pan: employeeData?.employeeDetails?.[0]?.pan || '',
    aadhar: employeeData?.employeeDetails?.[0]?.aadhar || '',
    pfRegistered: employeeData?.employeeStatutory?.[0]?.pfRegistered || false,
    pfNumber: employeeData?.employeeStatutory?.[0]?.pfNumber || '',
    uanNumber: employeeData?.employeeStatutory?.[0]?.uanNumber || '',
    esiNumber: employeeData?.employeeStatutory?.[0]?.esiNumber || '',
  });

  const [statusForm, setStatusForm] = useState({
    probationStartDate: employeeData?.employmentStatus?.[0]?.probationStartDate?.split('T')[0] || '',
    probationEndDate: employeeData?.employmentStatus?.[0]?.probationEndDate?.split('T')[0] || '',
    probationPeriod: employeeData?.employmentStatus?.[0]?.probationPeriod || 0,
    offerLetterDate: employeeData?.employmentStatus?.[0]?.offerLetterDate?.split('T')[0] || '',
    probationLetter: employeeData?.employmentStatus?.[0]?.probationLetter || false,
    letterGiven: employeeData?.employmentStatus?.[0]?.letterGiven || false,
    remarks: employeeData?.employmentStatus?.[0]?.remarks || '',
  });

  const [addresses, setAddresses] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);

  // Sub-forms for Add/Edit
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [editingEducation, setEditingEducation] = useState<any>(null);
  const [editingExperience, setEditingExperience] = useState<any>(null);

  // Re-sync if employeeData changes
  useEffect(() => {
    if (visible && employeeData) {
      const details = employeeData.employeeDetails?.[0] || {};
      const stat = employeeData.employeeStatutory?.[0] || {};
      
      setDetailsForm({
        bankAccountNumber: details.bankAccountNumber || '',
        ifscCode: details.ifscCode || '',
        bankName: details.bankName || '',
        emergencyContactName: details.emergencyContactName || '',
        emergencyContactPhone: details.emergencyContactPhone || '',
      });

      setStatutoryForm({
        pan: details.pan || stat.pan || '',
        aadhar: details.aadhar || stat.aadhar || '',
        pfRegistered: stat.pfRegistered || false,
        pfNumber: stat.pfNumber || '',
        uanNumber: stat.uanNumber || '',
        esiNumber: stat.esiNumber || '',
      });

      const status = employeeData.employmentStatus?.[0] || {};
      setStatusForm({
        probationStartDate: status.probationStartDate?.split('T')[0] || '',
        probationEndDate: status.probationEndDate?.split('T')[0] || '',
        probationPeriod: status.probationPeriod || 0,
        offerLetterDate: status.offerLetterDate?.split('T')[0] || '',
        probationLetter: status.probationLetter || false,
        letterGiven: status.letterGiven || false,
        remarks: status.remarks || '',
      });

      setAddresses(employeeData.addresses || []);
      setEducation(employeeData.education || []);
      setExperience(employeeData.experience || []);
    }
  }, [visible, employeeData]);

  // Validation
  const validate = (type: string, data: any) => {
    switch(type) {
      case 'statutory':
        if (data.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.pan)) return "Invalid PAN format";
        if (data.aadhar && !/^[0-9]{12}$/.test(data.aadhar)) return "Aadhar must be 12 digits";
        break;
      case 'address':
        if (!data.name || !data.addressType || !data.street || !data.cityId || !data.stateId || !data.pincode || !data.district) return "All address fields are required";
        break;
      case 'education':
        if (!data.degree || !data.institution || !data.yearOfPassing) return "Degree, Institution and Year are required";
        break;
      case 'experience':
        if (!data.companyName || !data.designation || !data.startDate) return "Company, Designation and Start Date are required";
        break;
    }
    return null;
  };

  const handleUpdate = async (type: 'details' | 'address' | 'education' | 'experience' | 'statutory' | 'status', data: any, id?: string) => {
    const validationError = validate(type, data);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        employeeId,
        type,
        data: id ? { ...data, id } : data,
        createdBy: currentUser?.id || 'system',
      };
      const url = API_BASE_URL + API_ENDPOINTS.EMPLOYEES.UPSERT_ADDON;
      const res = await post<any>(url, payload);
      
      if (res && res.success) {
        if (type === 'address') setEditingAddress(null);
        if (type === 'education') setEditingEducation(null);
        if (type === 'experience') setEditingExperience(null);
        onSuccess();
      } else {
        setError(res?.message || `Failed to update ${type}`);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during update');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchMaster('states');
      fetchMaster('cities');
      fetchMaster('districts');
    }
  }, [visible, fetchMaster]);

  // Completion Logic
  const calculateCompletion = () => {
    const stats = {
      details: [detailsForm.bankAccountNumber, detailsForm.ifscCode, detailsForm.emergencyContactName].filter(Boolean).length / 3,
      statutory: [statutoryForm.pan, statutoryForm.aadhar, statutoryForm.pfNumber, statutoryForm.uanNumber].filter(v => v || !statutoryForm.pfRegistered).length / 4,
      status: [statusForm.probationStartDate, statusForm.offerLetterDate].filter(Boolean).length / 2,
      address: addresses.length > 0 ? 1 : 0,
      education: education.length > 0 ? 1 : 0,
      experience: experience.length > 0 ? 1 : 0,
    };
    return stats;
  };

  const sectionStats = calculateCompletion();

  const navItems = [
    { id: 1, label: 'Profile & Bank', icon: cilUser, color: 'primary', progress: sectionStats.details },
    { id: 2, label: 'Statutory', icon: cilShieldAlt, color: 'warning', progress: sectionStats.statutory },
    { id: 3, label: 'Employment', icon: cilCheckCircle, color: 'success', progress: sectionStats.status },
    { id: 4, label: 'Addresses', icon: cilLocationPin, color: 'info', progress: sectionStats.address },
    { id: 5, label: 'Education', icon: cilSchool, color: 'danger', progress: sectionStats.education },
    { id: 6, label: 'Experience', icon: cilBriefcase, color: 'dark', progress: sectionStats.experience },
  ];

  const totalProgress = Math.round((Object.values(sectionStats).reduce((a, b) => a + b, 0) / 6) * 100);

  return (
    <CModal visible={visible} onClose={onClose} size="xl" backdrop="static" alignment="center" className="premium-modal">
      <div className="modal-glass-container">
        <div className="mesh-gradient-bg" />
        
        <CModalHeader closeButton className="border-0 px-4 pt-4 pb-0 position-relative z-1">
          <CModalTitle className="d-flex align-items-center w-100">
              <div className="title-icon-box me-3">
                <CIcon icon={cilUser} size="lg" />
              </div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-end mb-1">
                    <div>
                        <h4 className="fw-black mb-0 letter-spacing-1 text-uppercase">Profile Studio</h4>
                        <div className="text-muted small fw-bold">
                            {employeeData?.firstName} {employeeData?.lastName} • <span className="text-primary">{employeeData?.employeeCode || 'ID: PENDING'}</span>
                        </div>
                    </div>
                    <div className="text-end">
                        <div className="small fw-black text-uppercase mb-1 opacity-50">Discovery Progress</div>
                        <div className="d-flex align-items-center gap-2">
                             <div className="progress-track-mini">
                                <div className="progress-fill-mini" style={{ width: `${totalProgress}%` }} />
                             </div>
                             <span className="fw-black small">{totalProgress}%</span>
                        </div>
                    </div>
                </div>
              </div>
          </CModalTitle>
        </CModalHeader>

        <CModalBody className="p-4 position-relative z-1">
          {error && (
              <div className="alert-glass mb-4 slide-in">
                  <span className="text-danger fw-bold">{error}</span>
              </div>
          )}

          <CRow className="g-4">
            <CCol md={3}>
              <div className="nav-sidebar glass-panel">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    className={`nav-sidebar-link ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <div className="nav-icon-wrapper" style={{ '--icon-color': `var(--cui-${item.color})` } as React.CSSProperties}>
                      <CIcon icon={item.icon} />
                      {item.progress === 1 && <div className="completion-dot shadow-sm" />}
                    </div>
                    <div className="flex-grow-1">
                        <div className="item-label">{item.label}</div>
                        <div className="progress-dot-bar">
                            <div className="progress-dot-fill" style={{ width: `${item.progress * 100}%`, backgroundColor: `var(--cui-${item.color})` }} />
                        </div>
                    </div>
                    {activeTab === item.id && <div className="active-glow" />}
                  </button>
                ))}
              </div>
            </CCol>

            <CCol md={9}>
              <div className="content-glass-panel border-0 h-100 min-vh-60">
                <div className="p-4">
                  <CTabContent>
                    {/* DETAILS TAB */}
                    <CTabPane visible={activeTab === 1} className="fade-in">
                      <div className="section-header mb-4">
                        <h5 className="fw-black text-primary mb-1">PERSONAL & BANKING</h5>
                        <p className="text-muted small">Manage identifiers and payroll accounts</p>
                      </div>
                      <CRow className="g-4">
                        <CCol xs={12} className="mt-4">
                             <div className="sub-section-divider d-flex align-items-center gap-3">
                                 <span className="fw-black small text-primary">BANKING DETAILS</span>
                                 <div className="flex-grow-1 border-top opacity-10" />
                             </div>
                        </CCol>
                        {[
                          { label: 'Bank Name', value: detailsForm.bankName, field: 'bankName', placeholder: 'HDFC Bank' },
                          { label: 'Account Number', value: detailsForm.bankAccountNumber, field: 'bankAccountNumber', placeholder: '50100...' },
                          { label: 'IFSC Code', value: detailsForm.ifscCode, field: 'ifscCode', placeholder: 'HDFC0001234', uppercase: true },
                        ].map((input, idx) => (
                          <CCol md={4} key={idx}>
                            <div className="premium-input-group">
                              <CFormLabel className="form-label-custom">{input.label}</CFormLabel>
                              <CFormInput 
                                  value={input.value} 
                                  onChange={e => setDetailsForm(prev => ({...prev, [input.field]: input.uppercase ? e.target.value.toUpperCase() : e.target.value}))}
                                  placeholder={input.placeholder}
                                  className="form-input-custom"
                              />
                            </div>
                          </CCol>
                        ))}

                        <CCol xs={12} className="mt-4">
                             <div className="sub-section-divider d-flex align-items-center gap-3">
                                 <span className="fw-black small text-primary">EMERGENCY CONTACT</span>
                                 <div className="flex-grow-1 border-top opacity-10" />
                             </div>
                        </CCol>
                        <CCol md={6}>
                             <div className="premium-input-group">
                                <CFormLabel className="form-label-custom">Contact Name</CFormLabel>
                                <CFormInput value={detailsForm.emergencyContactName} onChange={e => setDetailsForm(prev => ({...prev, emergencyContactName: e.target.value}))} className="form-input-custom" />
                             </div>
                        </CCol>
                        <CCol md={6}>
                             <div className="premium-input-group">
                                <CFormLabel className="form-label-custom">Contact Phone</CFormLabel>
                                <CFormInput value={detailsForm.emergencyContactPhone} onChange={e => setDetailsForm(prev => ({...prev, emergencyContactPhone: e.target.value}))} className="form-input-custom" />
                             </div>
                        </CCol>

                        <CCol xs={12} className="mt-4 pt-4 border-top">
                          <CButton className="btn-modern btn-primary-glow px-5 shadow-lg" onClick={() => handleUpdate('details', detailsForm)} disabled={submitting}>
                              {submitting ? <CSpinner size="sm" /> : <CIcon icon={cilSave} className="me-2" />}
                              Commit All Details
                          </CButton>
                        </CCol>
                      </CRow>
                    </CTabPane>

                    {/* STATUTORY TAB */}
                    <CTabPane visible={activeTab === 2} className="fade-in">
                      <div className="section-header mb-4">
                        <h5 className="fw-black text-warning mb-1">STATUTORY BENEFITS</h5>
                        <p className="text-muted small">Manage PF, UAN and ESI registrations</p>
                      </div>
                         <CRow className="g-4">
                           <CCol xs={12}>
                                <div className="sub-section-divider d-flex align-items-center gap-3">
                                    <span className="fw-black small text-warning">GOVERNMENT IDENTIFIERS</span>
                                    <div className="flex-grow-1 border-top opacity-10" />
                                </div>
                           </CCol>
                           <CCol md={6}>
                              <CFormLabel className="form-label-custom">PAN Number</CFormLabel>
                              <CFormInput 
                                  value={statutoryForm.pan} 
                                  onChange={e => setStatutoryForm(prev => ({...prev, pan: e.target.value.toUpperCase()}))}
                                  placeholder="ABCDE1234F"
                                  className="form-input-custom"
                              />
                           </CCol>
                           <CCol md={6}>
                              <CFormLabel className="form-label-custom">Aadhar Number</CFormLabel>
                              <CFormInput 
                                  value={statutoryForm.aadhar} 
                                  onChange={e => setStatutoryForm(prev => ({...prev, aadhar: e.target.value}))}
                                  placeholder="1234 5678 9012"
                                  className="form-input-custom"
                              />
                           </CCol>

                           <CCol xs={12} className="mt-4">
                                <div className="sub-section-divider d-flex align-items-center gap-3">
                                    <span className="fw-black small text-warning">PROVIDENT FUND & ESI</span>
                                    <div className="flex-grow-1 border-top opacity-10" />
                                </div>
                           </CCol>
                           <CCol md={12}>
                              <CFormCheck 
                                  label="Employee is PF Registered" 
                                  className="form-check-custom mb-3"
                                  checked={statutoryForm.pfRegistered}
                                  onChange={e => setStatutoryForm(prev => ({...prev, pfRegistered: e.target.checked}))}
                              />
                           </CCol>
                           <CCol md={6}>
                              <CFormLabel className="form-label-custom">PF Number</CFormLabel>
                              <CFormInput 
                                  value={statutoryForm.pfNumber} 
                                  onChange={e => setStatutoryForm(prev => ({...prev, pfNumber: e.target.value}))}
                                  disabled={!statutoryForm.pfRegistered}
                                  className="form-input-custom"
                              />
                           </CCol>
                           <CCol md={6}>
                              <CFormLabel className="form-label-custom">UAN Number</CFormLabel>
                              <CFormInput 
                                  value={statutoryForm.uanNumber} 
                                  onChange={e => setStatutoryForm(prev => ({...prev, uanNumber: e.target.value}))}
                                  disabled={!statutoryForm.pfRegistered}
                                  className="form-input-custom"
                              />
                           </CCol>
                           <CCol md={12}>
                              <CFormLabel className="form-label-custom">ESI Number</CFormLabel>
                              <CFormInput 
                                  value={statutoryForm.esiNumber} 
                                  onChange={e => setStatutoryForm(prev => ({...prev, esiNumber: e.target.value}))}
                                  className="form-input-custom"
                              />
                           </CCol>
                         </CRow>
                      <CButton className="btn-modern btn-warning-glow" onClick={() => handleUpdate('statutory', statutoryForm)} disabled={submitting}>
                          <CIcon icon={cilSave} className="me-2" /> Update Statutory
                      </CButton>
                    </CTabPane>

                    {/* STATUS TAB */}
                    <CTabPane visible={activeTab === 3} className="fade-in">
                       <div className="section-header mb-4">
                        <h5 className="fw-black text-success mb-1">EMPLOYMENT LIFECYCLE</h5>
                        <p className="text-muted small">Manage probation and document status</p>
                      </div>
                      <CRow className="g-4">
                        <CCol md={6}>
                           <CFormLabel className="form-label-custom">Probation Range</CFormLabel>
                           <div className="d-flex gap-2">
                             <CFormInput type="date" value={statusForm.probationStartDate} onChange={e => setStatusForm(prev => ({...prev, probationStartDate: e.target.value}))} className="form-input-custom" />
                             <CFormInput type="date" value={statusForm.probationEndDate} onChange={e => setStatusForm(prev => ({...prev, probationEndDate: e.target.value}))} className="form-input-custom" />
                           </div>
                        </CCol>
                        <CCol md={6}>
                           <CFormLabel className="form-label-custom">Offer Letter Date</CFormLabel>
                           <CFormInput type="date" value={statusForm.offerLetterDate} onChange={e => setStatusForm(prev => ({...prev, offerLetterDate: e.target.value}))} className="form-input-custom" />
                        </CCol>
                        <CCol md={12}>
                           <div className="glass-inner-card p-3 d-flex gap-5">
                              <CFormCheck label="Probation Issued" checked={statusForm.probationLetter} onChange={e => setStatusForm(prev => ({...prev, probationLetter: e.target.checked}))} className="form-check-custom" />
                              <CFormCheck label="Appointment Given" checked={statusForm.letterGiven} onChange={e => setStatusForm(prev => ({...prev, letterGiven: e.target.checked}))} className="form-check-custom" />
                           </div>
                        </CCol>
                        <CCol md={12}>
                           <CFormLabel className="form-label-custom">Lifecycle Remarks</CFormLabel>
                           <CFormTextarea value={statusForm.remarks} onChange={e => setStatusForm(prev => ({...prev, remarks: e.target.value}))} rows={3} className="form-input-custom" />
                        </CCol>
                        <CCol xs={12} className="mt-4">
                          <CButton className="btn-modern btn-success-glow" onClick={() => handleUpdate('status', statusForm)} disabled={submitting}>
                              <CIcon icon={cilSave} className="me-2" /> Finalize Status
                          </CButton>
                        </CCol>
                      </CRow>
                    </CTabPane>

                    {/* ADDRESSES TAB */}
                    <CTabPane visible={activeTab === 4} className="fade-in">
                      <div className="section-header d-flex justify-content-between align-items-center mb-4">
                        <div>
                          <h5 className="fw-black text-info mb-1">ADDRESS MANAGEMENT</h5>
                          <p className="text-muted small">Manage permanent and correspondence addresses</p>
                        </div>
                        {!editingAddress && (
                          <CButton color="info" className="btn-modern btn-info-glow text-white" size="sm" onClick={() => setEditingAddress({ name: '', addressType: 'PRESENT', street: '', cityId: '', stateId: '', pincode: '', district: '' })}>
                            <CIcon icon={cilPlus} className="me-2" /> Add New
                          </CButton>
                        )}
                      </div>

                      {editingAddress ? (
                        <div className="glass-inner-card p-4 slide-in">
                          <CRow className="g-4">
                            <CCol md={6}>
                              <ModernSelect 
                                label="Address Type"
                                value={editingAddress.addressType} 
                                options={[{ id: 'PERMANENT', name: 'Permanent' }, { id: 'PRESENT', name: 'Present' }]} 
                                onChange={(v: any) => setEditingAddress({ ...editingAddress, addressType: v })}
                              />
                            </CCol>
                            <CCol md={6}>
                              <CFormLabel className="form-label-custom">Door No</CFormLabel>
                              <CFormInput value={editingAddress.name} onChange={e => setEditingAddress({ ...editingAddress, name: e.target.value })} className="form-input-custom" placeholder="e.g. Home" />
                            </CCol>
                            <CCol md={6}>
                              <CFormLabel className="form-label-custom">Street</CFormLabel>
                              <CFormInput value={editingAddress.street} onChange={e => setEditingAddress({ ...editingAddress, street: e.target.value })} className="form-input-custom" />
                            </CCol>
                            <CCol md={6}>
                              <ModernSelect 
                                label="State"
                                value={editingAddress.stateId} 
                                options={(masterData['states'] || []).map(s => ({ id: s.id, name: s.name }))} 
                                onChange={(v: any) => setEditingAddress({ ...editingAddress, stateId: v })}
                              />
                            </CCol>
                            <CCol md={6}>
                              <ModernSelect 
                                label="City"
                                value={editingAddress.cityId} 
                                options={(masterData['cities'] || [])
                                  .filter(c => !editingAddress.stateId || c.stateId === editingAddress.stateId)
                                  .map(c => ({ id: c.id, name: c.name }))} 
                                onChange={(v: any) => setEditingAddress({ ...editingAddress, cityId: v })}
                              />
                            </CCol>
                            <CCol md={6}>
                              <ModernSelect 
                                label="District"
                                value={editingAddress.districtId || editingAddress.district} 
                                options={(masterData['districts'] || [])
                                  .filter(d => !editingAddress.stateId || d.stateId === editingAddress.stateId)
                                  .map(d => ({ id: d.id, name: d.name }))} 
                                onChange={(v: any) => setEditingAddress({ ...editingAddress, districtId: v, district: v })}
                              />
                            </CCol>
                            <CCol md={6}>
                              <CFormLabel className="form-label-custom">Pin Code</CFormLabel>
                              <CFormInput value={editingAddress.pincode} onChange={e => setEditingAddress({ ...editingAddress, pincode: e.target.value })} className="form-input-custom" />
                            </CCol>
                            <CCol xs={12} className="mt-5 pt-3 border-top d-flex justify-content-between align-items-center">
                              <CButton variant="ghost" color="secondary" className="btn-modern px-4" onClick={() => setEditingAddress(null)}>
                                Discard Changes
                              </CButton>
                              <CButton className="btn-modern bg-dark text-white px-5" onClick={() => handleUpdate('address', editingAddress, editingAddress.id)} disabled={submitting}>
                                {submitting ? <CSpinner size="sm" /> : <CIcon icon={cilSave} className="me-2" />}
                                Save Address
                              </CButton>
                            </CCol>
                          </CRow>
                        </div>
                      ) : (
                        <div className="address-list">
                          {addresses.length === 0 ? (
                            <div className="empty-state-glass p-5 rounded-4 text-center">
                              <CIcon icon={cilLocationPin} size="3xl" className="mb-3 opacity-20" />
                              <p className="text-muted mb-0">No addresses added yet.</p>
                            </div>
                          ) : (
                            addresses.map((addr, idx) => (
                              <div key={idx} className="glass-inner-card p-3 mb-3 d-flex justify-content-between align-items-center">
                                <div>
                                  <div className="d-flex align-items-center gap-2 mb-1">
                                    <CBadge color="info">{addr.addressType}</CBadge>
                                    <span className="fw-black small text-uppercase">{addr.name}</span>
                                  </div>
                                  <div className="fw-bold">{addr.street}</div>
                                  <div className="small text-muted">
                                    {addr.city?.name || addr.city}
                                    { (addr.city?.name || addr.city) && (addr.district?.name || addr.district) ? ', ' : '' }
                                    {addr.district?.name || addr.district}
                                    { ((addr.city?.name || addr.city) || (addr.district?.name || addr.district)) && (addr.state?.name || addr.state) ? ', ' : '' }
                                    {addr.state?.name || addr.state} - {addr.pincode || addr.zipCode}
                                  </div>
                                </div>
                                <CButton variant="ghost" size="sm" onClick={() => {
                                  setEditingAddress({
                                    ...addr,
                                    stateId: addr.stateId || addr.state?.id || addr.state_id,
                                    cityId: addr.cityId || addr.city?.id || addr.city_id
                                  });
                                }}>Edit</CButton>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </CTabPane>

                    {/* EDUCATION TAB */}
                    <CTabPane visible={activeTab === 5} className="fade-in">
                       <div className="section-header d-flex justify-content-between align-items-center mb-4">
                        <div>
                          <h5 className="fw-black text-danger mb-1">ACADEMIC HISTORY</h5>
                          <p className="text-muted small">Manage degrees and certifications</p>
                        </div>
                        {!editingEducation && (
                          <CButton color="danger" className="btn-modern btn-danger-glow text-white" size="sm" onClick={() => setEditingEducation({ degree: '', fieldOfStudy: '', institution: '', yearOfPassing: '', percentage: '' })}>
                            <CIcon icon={cilPlus} className="me-2" /> Add New
                          </CButton>
                        )}
                      </div>

                      {editingEducation ? (
                        <div className="glass-inner-card p-4 slide-in">
                          <CRow className="g-4">
                            <CCol md={6}>
                              <CFormLabel className="form-label-custom">Degree</CFormLabel>
                              <CFormInput value={editingEducation.degree} onChange={e => setEditingEducation({ ...editingEducation, degree: e.target.value })} className="form-input-custom" placeholder="B.Tech, MBA etc." />
                            </CCol>
                            <CCol md={6}>
                              <CFormLabel className="form-label-custom">Field of Study</CFormLabel>
                              <CFormInput value={editingEducation.fieldOfStudy} onChange={e => setEditingEducation({ ...editingEducation, fieldOfStudy: e.target.value })} className="form-input-custom" placeholder="Computer Science" />
                            </CCol>
                            <CCol md={12}>
                              <CFormLabel className="form-label-custom">Institution / College</CFormLabel>
                              <CFormInput value={editingEducation.institution} onChange={e => setEditingEducation({ ...editingEducation, institution: e.target.value })} className="form-input-custom" />
                            </CCol>
                            <CCol md={6}>
                              <CFormLabel className="form-label-custom">Year of Passing</CFormLabel>
                              <CFormInput type="number" value={editingEducation.yearOfPassing} onChange={e => setEditingEducation({ ...editingEducation, yearOfPassing: e.target.value })} className="form-input-custom" />
                            </CCol>
                            <CCol md={6}>
                              <CFormLabel className="form-label-custom">Percentage / CGPA</CFormLabel>
                              <CFormInput value={editingEducation.percentage} onChange={e => setEditingEducation({ ...editingEducation, percentage: e.target.value })} className="form-input-custom" />
                            </CCol>
                            <CCol xs={12} className="mt-5 pt-3 border-top d-flex justify-content-between align-items-center">
                              <CButton variant="ghost" color="secondary" className="btn-modern px-4" onClick={() => setEditingEducation(null)}>
                                Discard Changes
                              </CButton>
                              <CButton className="btn-modern bg-dark text-white px-5" onClick={() => handleUpdate('education', editingEducation, editingEducation.id)} disabled={submitting}>
                                {submitting ? <CSpinner size="sm" /> : <CIcon icon={cilSave} className="me-2" />}
                                Save Education
                              </CButton>
                            </CCol>
                          </CRow>
                        </div>
                      ) : (
                        <div className="education-list">
                          {education.length === 0 ? (
                            <div className="empty-state-glass p-5 rounded-4 text-center">
                              <CIcon icon={cilSchool} size="3xl" className="mb-3 opacity-20" />
                              <p className="text-muted mb-0">No education records found.</p>
                            </div>
                          ) : (
                            education.map((edu, idx) => (
                              <div key={idx} className="glass-inner-card p-3 mb-3 d-flex justify-content-between align-items-center">
                                <div>
                                  <div className="fw-bold">{edu.degree} in {edu.fieldOfStudy}</div>
                                  <div className="small text-muted">{edu.institution} | Class of {edu.yearOfPassing}</div>
                                  {edu.percentage && <CBadge color="secondary" className="mt-1">{edu.percentage}</CBadge>}
                                </div>
                                <CButton variant="ghost" size="sm" onClick={() => setEditingEducation(edu)}>Edit</CButton>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </CTabPane>

                    {/* EXPERIENCE TAB */}
                    <CTabPane visible={activeTab === 6} className="fade-in">
                       <div className="section-header d-flex justify-content-between align-items-center mb-4">
                        <div>
                          <h5 className="fw-black text-dark mb-1">WORK EXPERIENCE</h5>
                          <p className="text-muted small">Manage past employment history</p>
                        </div>
                        {!editingExperience && (
                          <CButton color="dark" className="btn-modern bg-dark text-white" size="sm" onClick={() => setEditingExperience({ companyName: '', designation: '', startDate: '', endDate: '', location: '', ctc: '' })}>
                            <CIcon icon={cilPlus} className="me-2" /> Add New
                          </CButton>
                        )}
                      </div>

                      {editingExperience ? (
                        <div className="glass-inner-card p-4 slide-in">
                          <CRow className="g-4">
                            <CCol md={6}>
                              <CFormLabel className="form-label-custom">Company Name</CFormLabel>
                              <CFormInput value={editingExperience.companyName} onChange={e => setEditingExperience({ ...editingExperience, companyName: e.target.value })} className="form-input-custom" />
                            </CCol>
                            <CCol md={6}>
                              <CFormLabel className="form-label-custom">Designation</CFormLabel>
                              <CFormInput value={editingExperience.designation} onChange={e => setEditingExperience({ ...editingExperience, designation: e.target.value })} className="form-input-custom" />
                            </CCol>
                            <CCol md={6}>
                              <CFormLabel className="form-label-custom">Start Date</CFormLabel>
                              <CFormInput type="date" value={editingExperience.startDate?.split('T')[0]} onChange={e => setEditingExperience({ ...editingExperience, startDate: e.target.value })} className="form-input-custom" />
                            </CCol>
                            <CCol md={6}>
                              <CFormLabel className="form-label-custom">End Date</CFormLabel>
                              <CFormInput type="date" value={editingExperience.endDate?.split('T')[0]} onChange={e => setEditingExperience({ ...editingExperience, endDate: e.target.value })} className="form-input-custom" placeholder="Leave blank if Current" />
                            </CCol>
                            <CCol md={6}>
                              <CFormLabel className="form-label-custom">Location</CFormLabel>
                              <CFormInput value={editingExperience.location} onChange={e => setEditingExperience({ ...editingExperience, location: e.target.value })} className="form-input-custom" />
                            </CCol>
                            <CCol md={6}>
                              <CFormLabel className="form-label-custom">Last CTC (Annual)</CFormLabel>
                              <CFormInput value={editingExperience.ctc} onChange={e => setEditingExperience({ ...editingExperience, ctc: e.target.value })} className="form-input-custom" />
                            </CCol>
                            <CCol xs={12} className="mt-5 pt-3 border-top d-flex justify-content-between align-items-center">
                              <CButton variant="ghost" color="secondary" className="btn-modern px-4" onClick={() => setEditingExperience(null)}>
                                Discard Changes
                              </CButton>
                              <CButton className="btn-modern bg-dark text-white px-5" onClick={() => handleUpdate('experience', editingExperience, editingExperience.id)} disabled={submitting}>
                                {submitting ? <CSpinner size="sm" /> : <CIcon icon={cilSave} className="me-2" />}
                                Save Experience
                              </CButton>
                            </CCol>
                          </CRow>
                        </div>
                      ) : (
                        <div className="experience-list">
                          {experience.length === 0 ? (
                            <div className="empty-state-glass p-5 rounded-4 text-center">
                              <CIcon icon={cilBriefcase} size="3xl" className="mb-3 opacity-20" />
                              <p className="text-muted mb-0">No experience records found.</p>
                            </div>
                          ) : (
                            experience.map((exp, idx) => (
                              <div key={idx} className="glass-inner-card p-3 mb-3 d-flex justify-content-between align-items-center">
                                <div>
                                  <div className="fw-bold">{exp.designation}</div>
                                  <div className="text-primary fw-bold small">{exp.companyName}</div>
                                  <div className="small text-muted">
                                    {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                                  </div>
                                </div>
                                <CButton variant="ghost" size="sm" onClick={() => setEditingExperience(exp)}>Edit</CButton>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </CTabPane>
                  </CTabContent>
                </div>
              </div>
            </CCol>
          </CRow>
        </CModalBody>
      </div>
      
      <style>{`
        .premium-modal .modal-content {
          background: transparent;
          border: none;
          box-shadow: none;
        }

        .modal-glass-container {
          background: var(--surface);
          backdrop-filter: blur(25px) saturate(200%);
          border: 1px solid rgba(var(--cui-border-color-rgb), 0.3);
          border-radius: 32px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 40px 100px rgba(0,0,0,0.2);
        }

        .mesh-gradient-bg {
          position: absolute;
          top: -20%;
          left: -10%;
          width: 140%;
          height: 140%;
          background: radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.08) 0%, transparent 40%),
                      radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 40%),
                      radial-gradient(circle at 50% 50%, rgba(217, 70, 239, 0.05) 0%, transparent 60%);
          z-index: 0;
          pointer-events: none;
        }

        .title-icon-box {
          width: 48px;
          height: 48px;
          background: var(--cui-primary);
          color: white;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px rgba(var(--cui-primary-rgb), 0.2);
        }

        .nav-sidebar {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 12px;
        }

        .glass-panel {
          background: var(--surface-hover);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(var(--cui-border-color-rgb), 0.5);
          border-radius: 24px;
        }

        .nav-sidebar-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 20px;
          border: none;
          background: transparent;
          border-radius: 16px;
          color: var(--cui-text-muted);
          font-weight: 800;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: left;
          overflow: hidden;
        }

        .nav-sidebar-link:hover {
          background: var(--surface-hover);
          color: var(--cui-text-emphasis);
        }

        .nav-sidebar-link.active {
          background: var(--surface);
          color: var(--cui-primary);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .nav-icon-wrapper {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: rgba(var(--icon-color, --cui-primary-rgb), 0.15);
          color: var(--icon-color);
          font-size: 1.1rem;
        }

        .active-glow {
          position: absolute;
          left: 0;
          top: 20%;
          height: 60%;
          width: 4px;
          background: var(--cui-primary);
          border-radius: 0 4px 4px 0;
          box-shadow: 0 0 10px var(--cui-primary);
        }

        .content-glass-panel {
          background: var(--surface);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(var(--cui-border-color-rgb), 0.5) !important;
          border-radius: 24px;
          max-height: 75vh;
          overflow-y: auto;
        }

        .form-label-custom {
          font-weight: 900;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--cui-text-muted);
          margin-bottom: 6px;
          display: block;
          transition: color 0.3s ease;
        }

        .premium-input-group:focus-within .form-label-custom {
          color: var(--cui-primary);
        }

        .form-input-custom {
          background: rgba(var(--cui-tertiary-bg-rgb), 0.4) !important;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(var(--cui-border-color-rgb), 0.5) !important;
          color: var(--cui-text-emphasis) !important;
          border-radius: 12px !important;
          padding: 14px 18px !important;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }

        .form-input-custom::placeholder {
          color: var(--cui-text-muted);
          opacity: 0.5;
          font-weight: 500;
        }

        .form-input-custom:focus {
          border-color: var(--cui-primary) !important;
          box-shadow: 0 0 0 4px rgba(var(--cui-primary-rgb), 0.15), 
                      0 8px 24px rgba(var(--cui-primary-rgb), 0.12) !important;
          background: var(--surface) !important;
          transform: translateY(-2px);
        }

        .glass-inner-card {
           background: rgba(var(--cui-tertiary-bg-rgb), 0.3);
           backdrop-filter: blur(12px);
           border: 1px solid rgba(var(--cui-border-color-rgb), 0.4);
           border-radius: 24px;
           box-shadow: 0 4px 20px rgba(0,0,0,0.05);
           transition: all 0.3s ease;
        }

        .glass-inner-card:hover {
           border-color: rgba(var(--cui-primary-rgb), 0.3);
           box-shadow: 0 8px 32px rgba(0,0,0,0.08);
        }

        .btn-modern {
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1px;
          border: none;
          transition: all 0.3s ease;
        }

        .btn-primary-glow {
          background: var(--cui-primary);
          color: white;
          box-shadow: 0 10px 25px rgba(var(--cui-primary-rgb), 0.25);
        }

        .btn-primary-glow:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(var(--cui-primary-rgb), 0.35);
        }

        .btn-warning-glow {
          background: #f59e0b;
          color: white;
          box-shadow: 0 10px 25px rgba(245, 158, 11, 0.25);
        }

        .btn-success-glow {
           background: #10b981;
           color: white;
           box-shadow: 0 10px 25px rgba(16, 185, 129, 0.25);
        }

        .fade-in {
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .alert-glass {
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.2);
          padding: 12px 20px;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .empty-state-glass {
           background: var(--surface-hover);
           border: 2px dashed rgba(var(--cui-border-color-rgb), 0.2);
        }

        .form-check-custom label {
          font-weight: 800;
          color: var(--cui-text-emphasis);
        }

        .progress-track-mini {
          width: 120px;
          height: 6px;
          background: rgba(var(--cui-border-color-rgb), 0.1);
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill-mini {
          height: 100%;
          background: linear-gradient(90deg, var(--cui-primary), var(--cui-info));
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .completion-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background: var(--cui-success);
          border-radius: 50%;
          border: 2px solid var(--surface);
        }

        .progress-dot-bar {
          width: 100%;
          height: 3px;
          background: rgba(var(--cui-border-color-rgb), 0.1);
          border-radius: 2px;
          margin-top: 6px;
          overflow: hidden;
        }

        .progress-dot-fill {
          height: 100%;
          transition: width 0.4s ease;
        }

        .item-label {
          font-weight: 850;
          font-size: 0.75rem;
          color: var(--cui-text-emphasis);
        }

        .sub-section-divider .fw-black {
          font-size: 0.65rem;
          letter-spacing: 2px;
          opacity: 0.7;
        }

        /* Responsive refinements */
        @media (max-width: 992px) {
          .nav-sidebar {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 20px;
          }
          .nav-sidebar-link {
            flex: 0 0 auto;
            min-width: 140px;
          }
        }
      `}</style>
    </CModal>
  );
};

export default EmployeeUpdateModal;

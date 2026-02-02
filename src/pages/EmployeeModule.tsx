import React, { useState } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CFormInput,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CSpinner,
  CAvatar,
  CPagination,
  CPaginationItem,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilPeople,
  cilUserPlus,
  cilSearch,
  cilFilter,
  cilOptions,
  cilPhone,
  cilEnvelopeClosed,
} from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import ShinyText from '../components/reactbits/ShinyText';

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: 'active' | 'inactive' | 'on-leave';
  avatar?: string;
  joinDate: string;
}

const EmployeeModule: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - Replace with actual API call
  const mockEmployees: Employee[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@bonton.com',
      phone: '+1 234 567 8900',
      department: 'Engineering',
      position: 'Senior Developer',
      status: 'active',
      joinDate: '2023-01-15',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@bonton.com',
      phone: '+1 234 567 8901',
      department: 'HR',
      position: 'HR Manager',
      status: 'active',
      joinDate: '2022-06-20',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.j@bonton.com',
      phone: '+1 234 567 8902',
      department: 'Sales',
      position: 'Sales Executive',
      status: 'on-leave',
      joinDate: '2023-03-10',
    },
  ];

  const filteredEmployees = mockEmployees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'success', label: 'Active' },
      inactive: { color: 'secondary', label: 'Inactive' },
      'on-leave': { color: 'warning', label: 'On Leave' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <CBadge color={config.color} className="status-badge">{config.label}</CBadge>;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="employee-module min-vh-100 py-4">
      <CContainer fluid>
        {/* Header */}
        <div className="module-header mb-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <h2 className="fw-bold mb-1 module-title">
                <ShinyText text="Employee Directory" speed={7} />
              </h2>
              <p className="text-muted mb-0">Manage your team members and their information</p>
            </div>
            <CButton 
              color="primary" 
              className="add-btn"
              onClick={() => navigate('/employees/add')}
            >
              <CIcon icon={cilUserPlus} className="me-2" />
              Add Employee
            </CButton>
          </div>
        </div>

        {/* Stats Cards */}
        <CRow className="mb-4 g-3">
          <CCol xs={12} sm={6} lg={3}>
            <CCard className="stat-card border-0">
              <CCardBody>
                <div className="stat-icon bg-primary-subtle">
                  <CIcon icon={cilPeople} size="xl" className="text-primary" />
                </div>
                <div className="stat-content">
                  <div className="stat-value">156</div>
                  <div className="stat-label">Total Employees</div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs={12} sm={6} lg={3}>
            <CCard className="stat-card border-0">
              <CCardBody>
                <div className="stat-icon bg-success-subtle">
                  <span className="stat-emoji">✅</span>
                </div>
                <div className="stat-content">
                  <div className="stat-value">142</div>
                  <div className="stat-label">Active</div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs={12} sm={6} lg={3}>
            <CCard className="stat-card border-0">
              <CCardBody>
                <div className="stat-icon bg-warning-subtle">
                  <span className="stat-emoji">🏖️</span>
                </div>
                <div className="stat-content">
                  <div className="stat-value">8</div>
                  <div className="stat-label">On Leave</div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs={12} sm={6} lg={3}>
            <CCard className="stat-card border-0">
              <CCardBody>
                <div className="stat-icon bg-info-subtle">
                  <span className="stat-emoji">👥</span>
                </div>
                <div className="stat-content">
                  <div className="stat-value">12</div>
                  <div className="stat-label">Departments</div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* Main Content */}
        <CCard className="main-card border-0">
          <CCardBody className="p-0">
            {/* Toolbar */}
            <div className="toolbar">
              <div className="search-box">
                <CIcon icon={cilSearch} className="search-icon" />
                <CFormInput
                  type="text"
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="d-flex gap-2">
                <CButton variant="outline" color="secondary" className="filter-btn">
                  <CIcon icon={cilFilter} className="me-2" />
                  Filter
                </CButton>
                <CButton variant="outline" color="secondary" className="filter-btn">
                  <CIcon icon={cilOptions} />
                </CButton>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="text-center py-5">
                <CSpinner color="primary" />
                <p className="mt-3 text-muted">Loading employees...</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <CTable hover className="employee-table mb-0">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Employee</CTableHeaderCell>
                        <CTableHeaderCell>Contact</CTableHeaderCell>
                        <CTableHeaderCell>Department</CTableHeaderCell>
                        <CTableHeaderCell>Position</CTableHeaderCell>
                        <CTableHeaderCell>Join Date</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {paginatedEmployees.map((employee) => (
                        <CTableRow 
                          key={employee.id}
                          className="employee-row"
                          onClick={() => navigate(`/employees/${employee.id}`)}
                        >
                          <CTableDataCell>
                            <div className="d-flex align-items-center">
                              <div className="employee-avatar">
                                {getInitials(employee.name)}
                              </div>
                              <div className="ms-3">
                                <div className="employee-name">{employee.name}</div>
                                <div className="employee-id">EMP-{String(employee.id).padStart(4, '0')}</div>
                              </div>
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="contact-info">
                              <div className="d-flex align-items-center mb-1">
                                <CIcon icon={cilEnvelopeClosed} size="sm" className="me-2 text-muted" />
                                <span className="contact-text">{employee.email}</span>
                              </div>
                              <div className="d-flex align-items-center">
                                <CIcon icon={cilPhone} size="sm" className="me-2 text-muted" />
                                <span className="contact-text">{employee.phone}</span>
                              </div>
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="department-badge">{employee.department}</div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <span className="position-text">{employee.position}</span>
                          </CTableDataCell>
                          <CTableDataCell>
                            <span className="date-text">{new Date(employee.joinDate).toLocaleDateString()}</span>
                          </CTableDataCell>
                          <CTableDataCell>
                            {getStatusBadge(employee.status)}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton 
                              size="sm" 
                              variant="ghost" 
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/employees/${employee.id}`);
                              }}
                            >
                              View
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination-wrapper">
                    <CPagination className="mb-0">
                      <CPaginationItem
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </CPaginationItem>
                      {[...Array(totalPages)].map((_, i) => (
                        <CPaginationItem
                          key={i + 1}
                          active={currentPage === i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </CPaginationItem>
                      ))}
                      <CPaginationItem
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Next
                      </CPaginationItem>
                    </CPagination>
                  </div>
                )}
              </>
            )}
          </CCardBody>
        </CCard>
      </CContainer>

      <style>{`
        .employee-module {
          background: var(--background);
        }

        .module-header {
          animation: fadeIn 0.6s ease-out;
        }

        .module-title {
          color: var(--text-primary);
          font-size: 2rem;
        }

        .add-btn {
          font-weight: 600;
          padding: 0.625rem 1.5rem;
          border-radius: 10px;
          box-shadow: var(--shadow);
          transition: all var(--transition-base);
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        /* Stats Cards */
        .stat-card {
          background: var(--surface);
          border-radius: 16px;
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-base);
          overflow: hidden;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .stat-card .card-body {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-emoji {
          font-size: 24px;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        /* Main Card */
        .main-card {
          background: var(--surface);
          border-radius: 16px;
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }

        /* Toolbar */
        .toolbar {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          flex: 1;
          min-width: 250px;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-input {
          padding-left: 2.75rem;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--surface-hover);
          color: var(--text-primary);
          transition: all var(--transition-fast);
        }

        .search-input:focus {
          background: var(--surface);
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .filter-btn {
          border-radius: 10px;
          font-weight: 500;
        }

        /* Table */
        .employee-table {
          color: var(--text-primary);
        }

        .employee-table thead th {
          background: var(--surface-hover);
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 1rem 1.5rem;
          border: none;
        }

        .employee-table tbody td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border);
          vertical-align: middle;
        }

        .employee-row {
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .employee-row:hover {
          background: var(--surface-hover);
        }

        .employee-avatar {
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

        .employee-name {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.9375rem;
          margin-bottom: 2px;
        }

        .employee-id {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .contact-info {
          font-size: 0.8125rem;
        }

        .contact-text {
          color: var(--text-secondary);
        }

        .department-badge {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          background: var(--surface-hover);
          color: var(--text-primary);
          font-size: 0.8125rem;
          font-weight: 500;
        }

        .position-text {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .date-text {
          color: var(--text-muted);
          font-size: 0.8125rem;
        }

        .status-badge {
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.75rem;
        }

        /* Pagination */
        .pagination-wrapper {
          padding: 1.5rem;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            max-width: 100%;
          }

          .employee-table {
            font-size: 0.875rem;
          }

          .employee-table thead th,
          .employee-table tbody td {
            padding: 0.75rem 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default EmployeeModule;

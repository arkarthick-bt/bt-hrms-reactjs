import React, { useState } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CFormInput,
  CBadge,
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
import { useNavigate, useSearchParams } from 'react-router-dom';
import ShinyText from '../components/reactbits/ShinyText';
import { get } from '../apiHelpers/api';
import { API_BASE_URL, API_ENDPOINTS } from '../config/config';
import DataTable from '../components/DataTable';
import { ColumnDef } from "@tanstack/react-table";

interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string;
  designationId: string;
  dateOfJoining?: string;
  createdAt?: string;
  isActive: boolean;
  periods?: any[];
}

const EmployeeModule: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Persistent state derived from URL
  const currentPage = parseInt(searchParams.get('page') || '1');
  const itemsPerPage = parseInt(searchParams.get('limit') || '10');
  const view = (searchParams.get('view') as 'employees' | 'interns') || 'employees';
  const query = searchParams.get('q') || '';

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState(query);

  // Helper to update search params
  const updateParams = (newParams: Record<string, string | number | undefined | null>) => {
    const current = Object.fromEntries(searchParams.entries());
    const nextParams: Record<string, string> = { ...current };

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        delete nextParams[key];
      } else {
        nextParams[key] = String(value);
      }
    });

    setSearchParams(nextParams);
  };

  // Sync internal search field with URL if URL changes externally
  React.useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  // Debounce searchQuery local state to URL q param
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== query) {
        updateParams({ q: searchQuery, page: 1 });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPage, query, itemsPerPage, view]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
       const skip = (currentPage - 1) * itemsPerPage;
       const endpoint = view === 'interns' 
         ? API_BASE_URL + API_ENDPOINTS.INTERNS.LIST 
         : API_BASE_URL + API_ENDPOINTS.EMPLOYEES.LIST;

       const response = await get<any>(endpoint, {
          query: {
             q: query,
             take: itemsPerPage,
             skip,
             type: view === 'interns' ? 'INTERN' : 'REGULAR'
          }
       });
      
      if (response && response.success && response.data) {
        const listData = view === 'interns' ? response.data.interns : response.data.employee;
        setEmployees(listData || []);
        setTotalPages(response.data.count || 0);
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Define columns for TanStack table
  const columns: ColumnDef<Employee>[] = [
    {
      header: 'Employee',
      accessorKey: 'firstName',
      cell: ({ row }) => {
        const emp = row.original;
        return (
          <div 
            className="d-flex align-items-center cursor-pointer" 
            onClick={(e) => {
               e.stopPropagation(); 
               navigate(`/employees/${emp.id}?type=${view === 'interns' ? 'intern' : 'employee'}`);
            }}
          >
            <div 
              className="rounded-3 d-flex align-items-center justify-content-center text-white fw-bold me-3 shadow-sm"
              style={{ 
                width: '42px', 
                height: '42px', 
                background: view === 'interns' ? 'var(--gradient-success)' : 'var(--gradient-primary)',
                fontSize: '0.9rem'
              }}
            >
              {getInitials(emp.firstName)}
            </div>
            <div>
              <div className="fw-semibold text-truncate text-primary">{emp.firstName} {emp.lastName || ''}</div>
              {emp.employeeCode ? (
                <div className="small text-muted">ID: {emp.employeeCode}</div>
              ) : (
                <div className="small text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>UNASSIGNED</div>
              )}
            </div>
          </div>
        );
      }
    },
    {
      header: 'Contact',
      accessorKey: 'email',
      cell: ({ row }) => {
        const emp = row.original;
        return (
          <div className="d-flex flex-column gap-1">
            <div className="d-flex align-items-center text-muted small">
                <CIcon icon={cilEnvelopeClosed} className="me-2" size="sm" />
                <span className="text-truncate" style={{ maxWidth: '180px' }}>{emp.email}</span>
            </div>
            <div className="d-flex align-items-center text-muted small">
                <CIcon icon={cilPhone} className="me-2" size="sm" />
                <span>{emp.phone || '-'}</span>
            </div>
          </div>
        )
      }
    },
    {
      header: 'Position',
      accessorKey: 'designationId',
      cell: ({ row }) => {
        const emp = row.original;
        return (
          <div>
            <div className="fw-medium text-capitalize">{emp.designationId?.replace(/_/g, ' ') || (view === 'interns' ? 'Intern' : 'N/A')}</div>
            
          </div>
        )
      }
    },
    {
      header: 'Joined',
      accessorKey: 'dateOfJoining',
      cell: ({ row }) => {
        const emp = row.original;
        const date = emp.dateOfJoining || emp.createdAt;
        return (
          <span className="text-muted small fw-medium">
            {date ? new Date(date).toLocaleDateString() : 'N/A'}
          </span>
        );
      }
    },
    {
      header: 'Status',
      accessorKey: 'isActive',
      cell: ({ row }) => (
        <CBadge 
          color={row.original.isActive ? 'success' : 'secondary'} 
          className="px-2 py-1"
          shape="rounded-pill"
        >
          {row.original.isActive ? 'Active' : 'Inactive'}
        </CBadge>
      )
    }
  ];

  return (
    <div className="employee-module min-vh-100 py-4">
      <CContainer fluid>
        {/* Header */}
        <div className="module-header mb-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <h2 className="fw-bold mb-1 module-title">
                <ShinyText text={(view === 'interns' ? "Intern Directory" : "Employee Directory").toUpperCase()} speed={7} />
              </h2>
              <p className="text-muted mb-0">Manage your {view} and their information</p>
            </div>
            <div className="d-flex gap-2">
              <CButton 
                color="primary" 
                variant="outline"
                className="add-btn d-flex align-items-center"
                onClick={() => navigate('/employees/intern-add')}
              >
                <CIcon icon={cilUserPlus} className="me-2" />
                Intern Onboard
              </CButton>
              <CButton 
                color="primary" 
                className="add-btn d-flex align-items-center shadow"
                onClick={() => navigate('/employees/add')}
              >
                <CIcon icon={cilUserPlus} className="me-2" />
                Add Employee
              </CButton>
            </div>
          </div>
        </div>

        {/* 🚀 Directory Insight Strip (Modern Replacement for Cards) */}
        <div className="directory-insight-banner p-5 mb-5 rounded-4 glass-card border-0 position-relative overflow-hidden">
          <div className="mesh-accent" />
          <CRow className="align-items-center position-relative z-1">
            <CCol md={4} className="border-end-light pe-md-5 mb-4 mb-md-0">
              <div className="d-flex align-items-center">
                <div className="total-icon-box me-4">
                  <CIcon icon={cilPeople} customClassName="nav-icon" style={{ width: '32px', height: '32px' }} />
                </div>
                <div>
                   <h1 className="fw-black mb-0 lh-1 display-5">{totalPages}</h1>
                   <div className="text-muted small letter-spacing-1 fw-bold mt-1">TOTAL {view.toUpperCase()}</div>
                </div>
              </div>
            </CCol>
            
            <CCol md={8} className="ps-md-5">
              <div className="d-flex gap-5 justify-content-between flex-wrap">
                <div className="status-item flex-grow-1">
                   <div className="d-flex align-items-center mb-2">
                      <div className="status-dot bg-success pulse me-2" />
                      <span className="small fw-bold text-muted letter-spacing-1">ACTIVE</span>
                   </div>
                   <div className="display-6 mb-0 fw-black">{Math.floor(totalPages)}</div>
                </div>
                <div className="status-item flex-grow-1 border-start ps-4">
                   <div className="d-flex align-items-center mb-2">
                      <div className="status-dot bg-warning me-2" />
                      <span className="small fw-bold text-muted letter-spacing-1">ON LEAVE</span>
                   </div>
                   <div className="display-6 mb-0 fw-black">0</div>
                </div>
                <div className="status-item flex-grow-1 border-start ps-4">
                   <div className="d-flex align-items-center mb-2">
                      <div className="status-dot bg-danger me-2" />
                      <span className="small fw-bold text-muted letter-spacing-1">RETIRED</span>
                   </div>
                   <div className="display-6 mb-0 fw-black">0</div>
                </div>
              </div>
            </CCol>
          </CRow>
        </div>

        {/* Main Content */}
        <CCard className="main-card border-0 shadow-sm" style={{ borderTop: `4px solid ${view === 'interns' ? '#198754' : '#2563EB'}` }}>
          <CCardBody className="p-0">
            {/* Toolbar */}
            <div className="toolbar bg-white d-flex align-items-center justify-content-between">
              {/* Tab Switcher */}
              <div className="tab-switcher bg-light p-1 rounded-3 d-flex gap-1 shadow-sm">
                <button 
                  className={`tab-btn ${view === 'employees' ? 'active' : ''}`}
                  onClick={() => updateParams({ view: 'employees', page: 1 })}
                >
                  Employees
                </button>
                <button 
                  className={`tab-btn ${view === 'interns' ? 'active' : ''}`}
                  onClick={() => updateParams({ view: 'interns', page: 1 })}
                >
                  Interns
                </button>
              </div>

              <div className="search-box">
                <CIcon icon={cilSearch} className="search-icon" />
                <CFormInput
                  type="text"
                  placeholder={`SEARCH ${view.toUpperCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            {/* Table */}
            <DataTable
              columns={columns}
              data={employees}
              loading={loading}
              manualPagination={true}
              pagination={{
                 pageIndex: currentPage - 1,
                 pageSize: itemsPerPage
              }}
              rowCount={totalPages}
              onPaginationChange={(updater : any) => {
                 if (typeof updater === 'function') {
                    const nextState = updater({
                        pageIndex: currentPage - 1,
                        pageSize: itemsPerPage
                    });
                    updateParams({ 
                      page: nextState.pageIndex + 1, 
                      limit: nextState.pageSize 
                    });
                 }
              }}
              onRowClick={(emp : any) => navigate(`/employees/${emp.id}?type=${view === 'interns' ? 'intern' : 'employee'}`)}
            />
          </CCardBody>
        </CCard>
      </CContainer>

      <style>{`
        .employee-module {
          background: var(--background);
          text-transform: uppercase;
        }

        .module-header {
          animation: fadeIn 0.6s ease-out;
        }

        .module-title {
          color: var(--text-primary);
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: -1px;
        }

        /* 🚀 Directory Insight Banner */
        .directory-insight-banner {
          background: var(--surface);
          border: 1px solid var(--border-light) !important;
          z-index: 10;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .banner-elevated {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.18), 
                      0 15px 35px -5px rgba(var(--cui-primary-rgb), 0.12) !important;
        }

        .mesh-accent {
          position: absolute;
          top: -100%;
          right: -20%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(var(--cui-primary-rgb), 0.08) 0%, transparent 70%);
          filter: blur(60px);
          z-index: 0;
           animation: pulse-mesh 10s infinite alternate;
        }

        @keyframes pulse-mesh {
          0% { transform: scale(1) translate(0, 0); opacity: 0.5; }
          100% { transform: scale(1.2) translate(-20px, 20px); opacity: 0.8; }
        }

        .total-icon-box {
          width: 64px;
          height: 64px;
          background: var(--primary);
          color: white;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 24px rgba(var(--cui-primary-rgb), 0.25);
        }

        .border-end-light {
           border-right: 1px solid var(--border-light);
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        @keyframes status-pulse {
          0% { box-shadow: 0 0 0 0 rgba(25, 135, 84, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(25, 135, 84, 0); }
          100% { box-shadow: 0 0 0 0 rgba(25, 135, 84, 0); }
        }

        .pulse {
          animation: status-pulse 2s infinite;
        }

        .letter-spacing-1 { letter-spacing: 1px; }

        .add-btn {
          font-weight: 700;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        /* Tab Switcher */
        .tab-switcher {
          border: 1px solid var(--border-light);
          padding: 4px;
        }

        .tab-btn {
          padding: 10px 24px;
          border: none;
          background: transparent;
          border-radius: 10px;
          font-weight: 800;
          font-size: 0.75rem;
          color: var(--text-muted);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: 0.5px;
        }

        .tab-btn.active {
          background: white;
          color: var(--primary);
          box-shadow: var(--shadow-sm);
        }

        /* Main Card */
        .main-card {
          background: var(--surface);
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.03);
          overflow: hidden;
        }

        /* Toolbar */
        .toolbar {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--border-light);
        }

        .search-box {
          position: relative;
          min-width: 300px;
        }

        .search-icon {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--primary);
          opacity: 0.5;
        }

        .search-input {
          padding: 0.75rem 1.25rem 0.75rem 3.25rem;
          border-radius: 14px;
          border: 1px solid var(--border-light);
          background: var(--background);
          font-weight: 600;
          font-size: 0.85rem;
        }

        .search-input:focus {
          background: white;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(var(--cui-primary-rgb), 0.1);
        }

        .fw-black { font-weight: 900; }
        .x-small { font-size: 0.7rem; }
      `}</style>
    </div>
  );
};

export default EmployeeModule;

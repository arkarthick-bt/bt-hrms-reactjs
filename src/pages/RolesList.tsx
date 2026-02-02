import React, { useEffect, useState } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CSpinner,
  CButton,
  CFormInput,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilSearch } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { get } from '../apiHelpers'
import { API_BASE_URL, API_ENDPOINTS } from '../config/config'
import ShinyText from '../components/reactbits/ShinyText'

interface Role {
  id: number
  name: string
  code?: string
  isActive?: boolean
}

const RolesList: React.FC = () => {
  const navigate = useNavigate()
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Search and Pagination state
  const [searchQuery, setSearchQuery] = useState('')
  const [take] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true)
      try {
        const skip = (currentPage - 1) * take
        const response = await get(API_BASE_URL + API_ENDPOINTS.ROLES.LIST, {
          query: {
            q: searchQuery,
            take,
            skip,
          }
        })
        
        if (response && response.data) {
          setRoles(Array.isArray(response.data.roles) ? response.data.roles : [])
          setTotalCount(response.data.count || 0)
        } else if (Array.isArray(response)) {
          setRoles(response)
          setTotalCount(response.length)
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch roles')
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchRoles()
    }, 300) // Simple debounce

    return () => clearTimeout(timer)
  }, [searchQuery, currentPage, take])

  const totalPages = Math.ceil(totalCount / take)

  return (
    <div className="min-vh-100 py-4 bg-light">
      <CContainer>
        <div className="mb-4 d-flex align-items-center">
          <CButton 
            variant="ghost" 
            color="primary" 
            onClick={() => navigate('/')}
            className="me-3 rounded-circle p-2"
          >
            <CIcon icon={cilArrowLeft} size="lg" />
          </CButton>
          <div>
            <h2 className="fw-bold mb-0" style={{ color: 'var(--bonton-deep-blue)' }}>
              <ShinyText text="Roles & Permissions" speed={7} />
            </h2>
            <p className="text-muted mb-0">Manage and view system roles and their access levels.</p>
          </div>
        </div>

        <CRow>
          <CCol xs={12}>
            <CCard className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: '15px' }}>
              <CCardHeader className="bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0 fw-bold">System Roles</h5>
                  <span className="text-muted small">Total: {totalCount}</span>
                </div>
                <div style={{ width: '250px' }}>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-light border-end-0">
                      <CIcon icon={cilSearch} />
                    </span>
                    <CFormInput
                      placeholder="Search roles..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="bg-light border-start-0 ps-0 shadow-none focus-none"
                    />
                  </div>
                </div>
              </CCardHeader>
              <CCardBody className="p-0">
                {loading ? (
                  <div className="text-center py-5">
                    <CSpinner color="primary" />
                    <p className="mt-2 text-muted">Loading roles...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-5 text-danger">
                    <p>{error}</p>
                  </div>
                ) : (
                  <CTable align="middle" className="mb-0 border-top" hover responsive>
                    <CTableHead color="light">
                      <CTableRow>
                        <CTableHeaderCell className="ps-4">#</CTableHeaderCell>
                        <CTableHeaderCell>Role Name</CTableHeaderCell>
                        <CTableHeaderCell>Code</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {roles.length > 0 ? (
                        roles.map((role, index) => (
                          <CTableRow 
                            key={role.id || index} 
                            onClick={() => navigate(`/roles/${role.id}/permissions`)}
                            style={{ cursor: 'pointer' }}
                          >
                            <CTableDataCell className="ps-4 text-muted small">
                              {(currentPage - 1) * take + index + 1}
                            </CTableDataCell>
                            <CTableDataCell>
                              <div className="fw-bold text-dark">{role.name}</div>
                            </CTableDataCell>
                            <CTableDataCell>
                              <span className="text-muted small">
                                {role.code || 'N/A'}
                              </span>
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <CBadge
                                color={role.isActive ? 'success' : 'secondary'}
                                shape="pill"
                                className="px-3"
                              >
                                {role.isActive === true ? 'Active' : 'Inactive'}
                              </CBadge>
                            </CTableDataCell>
                          </CTableRow>
                        ))
                      ) : (
                        <CTableRow>
                          <CTableDataCell colSpan={4} className="text-center py-4 text-muted">
                            No roles found in the system.
                          </CTableDataCell>
                        </CTableRow>
                      )}
                    </CTableBody>
                  </CTable>
                )}
              </CCardBody>
              {totalCount > take && (
                <div className="p-3 bg-white border-top d-flex justify-content-center">
                  <CPagination align="center" className="mb-0">
                    <CPaginationItem 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      style={{ cursor: 'pointer' }}
                    >
                      Previous
                    </CPaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <CPaginationItem
                        key={i + 1}
                        active={currentPage === i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        style={{ cursor: 'pointer' }}
                      >
                        {i + 1}
                      </CPaginationItem>
                    ))}
                    <CPaginationItem
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      style={{ cursor: 'pointer' }}
                    >
                      Next
                    </CPaginationItem>
                  </CPagination>
                </div>
              )}
            </CCard>
          </CCol>
        </CRow>

      </CContainer>
    </div>
  )
}

export default RolesList

import React, { useEffect, useState } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CFormInput,
  CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilSearch, cilShieldAlt } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { get } from '../apiHelpers/api'
import { API_BASE_URL, API_ENDPOINTS } from '../config/config'
import ShinyText from '../components/reactbits/ShinyText'
import DataTable from '../components/DataTable'
import { ColumnDef } from "@tanstack/react-table"

interface Role {
  id: string
  name: string
  code?: string
  isActive?: boolean
}

interface RoleResponse {
  roles: Role[]
  count: number
}

const RolesList: React.FC = () => {
  const navigate = useNavigate()
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Search and Pagination state
  const [searchQuery, setSearchQuery] = useState('')
  const [take, setTake] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true)
      try {
        const skip = (currentPage - 1) * take
        // Using "any" for response type to accommodate flexibility, though RoleResponse is defined
        const response = await get<any>(API_BASE_URL + API_ENDPOINTS.ROLES.LIST, {
          query: {
            q: searchQuery,
            take,
            skip,
          }
        })
        
        // Handle API response structure
        if (response && response.data) {
           const data = response.data;
           setRoles(Array.isArray(data.roles) ? data.roles : []);
           
           // User specified that count is like totalPages in the new API
           // We'll trust this, but also fallback to calculation if it looks like a large number (total items)
           // checking if count is total items (likely) or total pages
           // Assuming count is total items for consistency with server-side pagination logic
           setTotalPages(data.count || 0); 
        } else if (Array.isArray(response)) {
           // Fallback for array response
           setRoles(response);
           setTotalPages(response.length);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch roles')
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchRoles()
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, currentPage, take])

  const columns: ColumnDef<Role>[] = [
    {
      id: 'index',
      header: '#',
      enableSorting: false,
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination?.pageIndex || 0;
        const pageSize = table.getState().pagination?.pageSize || 10;
        return <span className="text-muted small">{(pageIndex * pageSize) + row.index + 1}</span>
      }
    },
    {
      accessorKey: 'name',
      header: 'Role Name',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="fw-bold" style={{ color: 'var(--text-primary)' }}>{row.original.name}</div>
      )
    },
    {
      accessorKey: 'code',
      header: 'Code',
      enableSorting: true,
      cell: ({ row }) => (
         <span className="font-monospace text-muted small bg-light px-2 py-1 rounded">
            {row.original.code || 'N/A'}
         </span>
      )
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      enableSorting: true,
      cell: ({ row }) => (
          <CBadge
              color={row.original.isActive ? 'success' : 'secondary'}
              shape="rounded-pill"
              className="px-3"
          >
              {row.original.isActive ? 'Active' : 'Inactive'}
          </CBadge>
      )
    }
  ];

  return (
    <div className="min-vh-100 py-4" style={{ background: 'var(--background)' }}>
      <CContainer>
        <div className="mb-4 d-flex align-items-center">
          <CButton 
            variant="ghost" 
            color="primary" 
            onClick={() => navigate('/')}
            className="me-3 rounded-circle p-2 shadow-sm bg-surface"
            style={{ backgroundColor: 'var(--surface)' }}
          >
            <CIcon icon={cilArrowLeft} size="lg" />
          </CButton>
          <div>
            <h2 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
              <ShinyText text="Roles & Permissions" speed={7} />
            </h2>
            <p className="text-muted mb-0">Manage and view system roles and their access levels.</p>
          </div>
        </div>

        <CRow>
          <CCol xs={12}>
            <CCard className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: '16px', background: 'var(--surface)' }}>
              <CCardBody className="p-0">
                <DataTable
                  columns={columns}
                  data={roles}
                  loading={loading}
                  searchable
                  searchPlaceholder="Search roles..."
                  onSearch={(value) => {
                    setSearchQuery(value)
                    setCurrentPage(1)
                  }}
                  manualPagination={true}
                  rowCount={totalPages}
                  pagination={{
                    pageIndex: currentPage - 1,
                    pageSize: take
                  }}
                  onPaginationChange={(updater) => {
                    if (typeof updater === 'function') {
                      const nextState = updater({
                        pageIndex: currentPage - 1,
                        pageSize: take
                      });
                      setCurrentPage(nextState.pageIndex + 1);
                      setTake(nextState.pageSize);
                    }
                  }}
                  onRowClick={(role) => navigate(`/roles/${role.id}/permissions`)}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}
export default RolesList


import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CSpinner,
  CButton,
  CFormCheck,
  CToaster,
  CToast,
  CToastBody,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilSave, cilCheckCircle, cilLockLocked } from '@coreui/icons'
import { get, post } from '../apiHelpers'
import { API_BASE_URL, API_ENDPOINTS } from '../config/config'
import ShinyText from '../components/reactbits/ShinyText'
import SpotlightCard from '../components/reactbits/SpotlightCard'
import { useAuth } from '../contexts'

interface PermissionItem {
  name: string
  permission: boolean
}

interface MenuPermission {
  menuId: string
  menuName: string
  permission: PermissionItem[]
  subMenu: MenuPermission[]
}

const RolePermissions: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>()
  const navigate = useNavigate()
  const { user, refreshScopes } = useAuth()
  const [menuData, setMenuData] = useState<MenuPermission[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ show: boolean; message: string; color: string }>({
    show: false,
    message: '',
    color: 'success'
  })

  useEffect(() => {
    fetchPermissions()
  }, [roleId])

  const fetchPermissions = async () => {
    if (!roleId) return
    setLoading(true)
    try {
      const url = (API_BASE_URL + API_ENDPOINTS.ROLES.GET_PERMISSIONS).replace(':roleId', roleId)
      const response = await get(url)
      
      if (response && response.data) {
        setMenuData(response.data)
      } else {
        setError('No data received from server')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch permissions')
    } finally {
      setLoading(false)
    }
  }

  const handlePermissionChange = (menuId: string, permissionName: string, checked: boolean) => {
    // Helper to recursively update permission
    const updatePermissions = (menus: MenuPermission[]): MenuPermission[] => {
      return menus.map(menu => {
        if (menu.menuId === menuId) {
          return {
            ...menu,
            permission: menu.permission.map(p => 
              p.name === permissionName ? { ...p, permission: checked } : p
            )
          }
        }
        if (menu.subMenu && menu.subMenu.length > 0) {
          return { ...menu, subMenu: updatePermissions(menu.subMenu) }
        }
        return menu
      })
    }

    setMenuData(updatePermissions(menuData))
  }

  const handleSave = async () => {
    if (!roleId) return
    setSaving(true)
    try {
      // Prepare payload to match Joi schema provided: 
      // { roleId: string, menus: [ { menuId: string, permission: [...], subMenu: [...] } ] }
      const payload = {
        roleId: String(roleId), // Ensure it's a string
        menus: menuData.map(menu => ({
          menuId: menu.menuId,
          // Top-level permissions (optional per schema, but good to send empty if none)
          permission: (menu.permission || []).map(p => ({
            name: p.name,
            permission: p.permission
          })),
          // Submenus
          subMenu: (menu.subMenu || []).map(sub => ({
            menuId: sub.menuId,
            // Submenu permissions are REQUIRED per Joi schema's .required()
            permission: (sub.permission || []).map(p => ({
              name: p.name,
              permission: p.permission
            }))
          }))
        }))
      }

      await post(API_BASE_URL + API_ENDPOINTS.ROLES.ASSIGN_PERMISSIONS, payload)
      
      // Check if the updated role is the current user's role
      const isOwnRole = user?.roleId === roleId || user?.role?.id === roleId
      
      if (isOwnRole) {
        // Refresh scopes immediately for the current user
        await refreshScopes()
        setToast({
          show: true,
          message: '✅ Permissions updated! Your access has been refreshed automatically.',
          color: 'success'
        })
      } else {
        setToast({
          show: true,
          message: 'Role permissions updated successfully',
          color: 'success'
        })
      }
      
      // Navigate back to roles screen after success
      setTimeout(() => {
        navigate('/roles')
      }, 2000)
    } catch (err: any) {
      setToast({
        show: true,
        message: typeof err === 'string' ? err : (err.message || 'Failed to update permissions'),
        color: 'danger'
      })
    } finally {
      setSaving(false)
    }
  }

  const renderMenuCard = (menu: MenuPermission, depth = 0) => {
    const hasSubMenus = menu.subMenu && menu.subMenu.length > 0
    
    // If it has submenus, we don't show the main menu's permissions (as per request)
    // But we still need to render the container and recursively render submenus
    
    return (
      <div key={menu.menuId} className={`mb-4 ${depth > 0 ? 'ms-4 border-start ps-3' : ''}`}>
        <div className="d-flex align-items-center mb-3">
          <div 
            className="rounded-circle me-2"
            style={{ 
              width: '12px', 
              height: '12px',
              border: '2px solid var(--primary)',
              backgroundColor: 'rgba(var(--mod-primary-rgb), 0.2)',
              boxShadow: '0 0 10px rgba(var(--mod-primary-rgb), 0.3)'
            }}
          >
          </div>
          <h6 className="mb-0 fw-bold text-uppercase tracking-wider" style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>
            {menu.menuName}
          </h6>
        </div>

        {(!hasSubMenus && menu.permission.length > 0) && (
          <CRow className="g-3 px-2">
            {menu.permission.map((p) => (
              <CCol xs={6} md={3} key={`${menu.menuId}-${p.name}`}>
                <div 
                  onClick={() => handlePermissionChange(menu.menuId, p.name, !p.permission)}
                  className={`p-3 rounded-3 border transition-all cursor-pointer d-flex align-items-center justify-content-between permission-card ${
                    p.permission 
                      ? 'bg-success bg-opacity-10 border-success text-success' 
                      : 'bg-danger bg-opacity-10 border-danger text-danger'
                  }`}
                  style={{
                    boxShadow: p.permission ? '0 4px 12px rgba(16, 185, 129, 0.1)' : '0 4px 12px rgba(239, 68, 68, 0.1)',
                  }}
                >
                  <div className="d-flex align-items-center">
                    <div 
                      className={`rounded-circle d-flex align-items-center justify-content-center me-2 ${
                        p.permission ? 'bg-success text-white' : 'bg-danger text-white'
                      }`}
                      style={{ width: '20px', height: '20px', fontSize: '0.7rem' }}
                    >
                      <CIcon icon={p.permission ? cilCheckCircle : cilLockLocked} />
                    </div>
                    <span className="text-capitalize fw-bold small">{p.name}</span>
                  </div>
                  <div 
                    className={`status-dot ${p.permission ? 'bg-success' : 'bg-danger'}`}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      boxShadow: `0 0 8px ${p.permission ? '#10B981' : '#EF4444'}`
                    }}
                  />
                </div>
              </CCol>
            ))}
          </CRow>
        )}

        {hasSubMenus && (
          <div className="mt-2">
            {menu.subMenu.map(sub => renderMenuCard(sub, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-vh-100 py-4" style={{ backgroundColor: 'var(--background)' }}>
      <CContainer>
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <CButton 
              variant="ghost" 
              color="primary" 
              onClick={() => navigate('/roles')}
              className="me-3 rounded-circle p-2 shadow-sm bg-white"
            >
              <CIcon icon={cilArrowLeft} size="lg" />
            </CButton>
            <div>
              <h2 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                <ShinyText text="Configure Access" speed={7} />
              </h2>
              <p className="text-muted mb-0 small">Define which modules and actions this role can access.</p>
            </div>
          </div>
          
          <CButton 
            color="primary" 
            className="px-4 py-2 fw-bold shadow-sm d-flex align-items-center"
            style={{ borderRadius: '10px' }}
            disabled={loading || saving}
            onClick={handleSave}
          >
            {saving ? (
              <CSpinner size="sm" className="me-2" />
            ) : (
              <CIcon icon={cilSave} className="me-2" />
            )}
            Save Changes
          </CButton>
        </div>

        <CRow>
          <CCol xs={12}>
            {loading ? (
              <div className="text-center py-5">
                <CSpinner color="primary" variant="grow" />
                <p className="mt-3 text-muted">Analyzing permissions architecture...</p>
              </div>
            ) : error ? (
              <div className="text-center py-5">
                <div className="mb-3 text-danger fs-1">⚠️</div>
                <h5 className="text-dark">Connection Error</h5>
                <p className="text-muted">{error}</p>
                <CButton color="primary" variant="outline" onClick={fetchPermissions}>
                  Retry Connection
                </CButton>
              </div>
            ) : (
              <div className="fade-in">
                {menuData.map(menu => (
                  <SpotlightCard 
                    key={menu.menuId} 
                    className="mb-4 border-0 shadow-sm overflow-hidden"
                    style={{ borderRadius: '16px', backgroundColor: 'var(--surface)' }}
                  >
                    <div className="p-4">
                      {renderMenuCard(menu)}
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            )}
          </CCol>
        </CRow>

        {/* Action Bar Mobile */}
        <div className="d-md-none position-fixed bottom-0 start-0 w-100 p-3 bg-white border-top shadow-lg" style={{ zIndex: 1000 }}>
          <CButton 
            color="primary" 
            className="w-100 py-3 fw-bold shadow"
            disabled={loading || saving}
            onClick={handleSave}
          >
            {saving ? <CSpinner size="sm" className="me-2" /> : <CIcon icon={cilSave} className="me-2" />}
            Save Permissions
          </CButton>
        </div>
      </CContainer>

      <CToaster placement="top-end" className="p-3">
        {toast.show && (
          <CToast 
            color={toast.color} 
            visible 
            autohide 
            onClose={() => setToast({ ...toast, show: false })} 
            className="border-0 shadow-lg text-white"
          >
            <div className="d-flex">
              <div className="p-3">
                <CIcon icon={cilCheckCircle} size="xl" className="text-white" />
              </div>
              <CToastBody className="fw-bold align-self-center">
                {toast.message}
              </CToastBody>
            </div>
          </CToast>
        )}
      </CToaster>

      <style>{`
        .permission-card {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
        }
        .permission-card:hover {
          transform: translateY(-3px) scale(1.02);
        }
        .permission-card:active {
          transform: scale(0.98);
        }
        .hover-border:hover {
          border-color: var(--cui-primary) !important;
        }
        .transition-all {
          transition: all 0.2s ease-in-out;
        }
        .tracking-wider {
          letter-spacing: 0.05em;
        }
        .focus-none:focus {
          box-shadow: none !important;
        }
        .fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default RolePermissions

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CToast,
  CToastBody,
  CToaster,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilLockLocked, cilLowVision } from '@coreui/icons'
import { API_BASE_URL } from '../config/config'
import { useAuth } from '../contexts'
import ShinyText from '../components/reactbits/ShinyText'
import SpotlightCard from '../components/reactbits/SpotlightCard'
import LiquidEther from '../components/reactbits/LiquidEther'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const { login, loading: authLoading, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await login(API_BASE_URL + '/auth/login', {
        username: email,
        password,
      })
    } catch (err: any) {
      setError(err?.message || 'Invalid username or password')
    }
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      const name = user.name || user.username
      setToastMessage(name ? `Welcome back, ${name}` : 'Login successful')
      setShowToast(true)

      const t = setTimeout(() => {
        setShowToast(false)
        navigate('/', { replace: true })
      }, 1200)

      return () => clearTimeout(t)
    }
  }, [isAuthenticated, user, navigate])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        background: '#0F172A', // base dark color
        mixBlendMode: 'normal',
      }}
    >
      {/* 🔮 Liquid Ether Background */}
      <LiquidEther
        colors={['#5227FF', '#FF9FFC', '#B19EEF']}
        mouseForce={20}
        cursorSize={100}
        isViscous
        viscous={30}
        iterationsViscous={32}
        iterationsPoisson={32}
        resolution={0.5}
        isBounce={false}
        autoDemo
        autoSpeed={0.5}
        autoIntensity={2.2}
        takeoverDuration={0.25}
        autoResumeDelay={3000}
        autoRampDuration={0.6}

      />

      {/* 🧩 Login UI Layer */}
      <CContainer
        fluid
        className="d-flex align-items-center justify-content-center"
        style={{ position: 'absolute', inset: 0, zIndex: 2 }}
      >
        <CRow className="w-100 justify-content-center">
          <CCol md={6} lg={5} xl={4}>
            <SpotlightCard className="p-4 p-md-5 bg-white border-0 shadow-lg">
              <div className="text-center mb-4">
                <h4 className="fw-bold">
                  <ShinyText text="BonTon Softwares" speed={5} />
                </h4>
                <p className="text-muted small">HRMS Employee Login</p>
              </div>

              <CForm onSubmit={handleLogin}>
                {error && (
                  <CAlert color="danger" className="py-2 small border-0 bg-danger bg-opacity-10 text-danger">
                    {error}
                  </CAlert>
                )}

                {/* Username */}
                <div className="mb-3">
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={authLoading}
                      required
                    />
                  </CInputGroup>
                </div>

                {/* Password */}
                <div className="mb-4">
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={authLoading}
                      required
                    />
                    <CInputGroupText
                      role="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: 'pointer' }}
                    >
                      <CIcon icon={cilLowVision} />
                    </CInputGroupText>
                  </CInputGroup>
                </div>

                <CButton
                  type="submit"
                  color="primary"
                  className="w-100 fw-bold"
                  disabled={authLoading}
                >
                  {authLoading ? 'Signing in...' : 'Sign In'}
                </CButton>
              </CForm>
            </SpotlightCard>
          </CCol>
        </CRow>
      </CContainer>

      <CToaster placement="top-end" className="p-3">
        {showToast && (
          <CToast color="success" visible autohide className="border-0 shadow">
            <CToastBody className="fw-bold text-white">{toastMessage}</CToastBody>
          </CToast>
        )}
      </CToaster>
    </div>
  )
}

export default Login

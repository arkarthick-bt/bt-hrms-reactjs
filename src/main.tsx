import React from 'react'
import ReactDOM from 'react-dom/client'
import '@coreui/coreui/dist/css/coreui.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App'
import { AuthProvider, PermissionProvider, ThemeProvider } from './contexts'

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <PermissionProvider>
          <App />
        </PermissionProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)

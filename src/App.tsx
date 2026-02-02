import React, { useEffect, useState } from 'react'
import { AppRoutes } from './routes'
import BlurText from './components/reactbits/BlurText'

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  if (showSplash) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <BlurText
          text="BonTon HRMS"
          animateBy="letters"
          direction="top"
          delay={80}
          className="fs-1 fw-black"
        />
      </div>
    )
  }

  return <AppRoutes />
}

export default App

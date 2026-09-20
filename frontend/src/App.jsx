import { useState } from 'react'
import './App.css'

import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem('access_token'))
  )

  return (
    <div className="app">
      {isLoggedIn ? (
        <DashboardPage
          onLogout={() => setIsLoggedIn(false)}
        />
      ) : (
        <LoginPage
          onLogin={() => setIsLoggedIn(true)}
        />
      )}
    </div>
  )
}

export default App
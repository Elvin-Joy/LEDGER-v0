import { useState } from 'react'
import Login from '../components/Auth/Login'
import Register from '../components/Auth/Register'

function LoginPage({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false)

  return (
    <>
      {isRegistering ? (
        <Register
          onSwitchToLogin={() => setIsRegistering(false)}
        />
      ) : (
        <Login
          onLogin={onLogin}
          onSwitchToRegister={() => setIsRegistering(true)}
        />
      )}
    </>
  )
}

export default LoginPage
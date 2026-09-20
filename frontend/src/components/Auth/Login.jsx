import { useState } from 'react'
import { Mail, Lock } from 'lucide-react'
import { loginUser } from '../../services/authService'

function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async () => {
    if (!email || !password) {
      alert('Please enter email and password')
      return
    }

    try {
      await loginUser(email, password)

      setPassword('')
      onLogin()
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="auth-card">
        <h2>LedgerAI</h2>
        <p className="auth-tagline">AI-powered expense tracker</p>
        <p className="auth-welcome">Welcome</p>
        

        <div className="auth-input-wrapper">
        <Mail size={18} />
        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        </div>

        <div className="auth-input-wrapper">
        <Lock size={18} />
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        </div>

      <button type="button" onClick={handleSubmit}>
        Login
      </button>

      <p>Don't have an account?</p>

      <button type="button" className="auth-secondary-button" onClick={onSwitchToRegister}>
        Create an account
      </button>
    </div>
  )
}

export default Login
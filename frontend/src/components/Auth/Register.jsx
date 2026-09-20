import { useState } from 'react'
import { registerUser } from '../../services/authService'

function Register({ onSwitchToLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async () => {
    if (!email || !password) {
      alert('Please enter email and password')
      return
    }

    try {
      await registerUser(email, password)

      alert('Registration successful!')

      setEmail('')
      setPassword('')

      onSwitchToLogin()
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="auth-card">
      <h2>Create Account</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="button" onClick={handleSubmit}>
        Register
      </button>

      <p>Already have an account?</p>

      <button type="button" onClick={onSwitchToLogin}>
        Login instead
      </button>
    </div>
  )
}

export default Register
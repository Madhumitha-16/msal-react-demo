import { useEffect, useState } from 'react'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated, useMsal } from '@azure/msal-react'
import './App.css'

const loginRequest = { scopes: ['User.Read'] }

function HomePage({ account, onLogout }) {
  return (
    <main className="home-page">
      <header className="topbar"><a className="brand" href="/"><span className="brand-mark">M</span> MSAL / React</a><button type="button" className="secondary-button" onClick={onLogout}>Sign out</button></header>
      <section className="home-content">
        <div className="eyebrow">Authenticated successfully</div>
        <h1>Welcome home,<br /><em>{account?.name || 'Microsoft user'}.</em></h1>
        <p className="hero-copy">You are signed in with your Microsoft account and ready to continue.</p>
        <div className="home-card"><span className="label">Signed-in account</span><strong>{account?.username}</strong></div>
      </section>
    </main>
  )
}

function App() {
  const { instance, accounts } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const isConfigured = Boolean(import.meta.env.VITE_CLIENT_ID)
  const account = accounts[0]

  useEffect(() => {
    if (account) instance.setActiveAccount(account)
  }, [account, instance])

  if (isAuthenticated) {
    return <HomePage account={account} onLogout={() => instance.logoutPopup({ account })} />
  }

  const handleLogin = async () => {
    setError('')
    setIsLoading(true)
    try {
      await instance.loginPopup(loginRequest)
    } catch (loginError) {
      setError(loginError.message || 'Sign-in could not be completed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="shell">
      <header className="topbar"><a className="brand" href="/"><span className="brand-mark">M</span> MSAL / React</a><span className={`status ${isAuthenticated ? 'online' : ''}`}><span className="status-dot" />{isAuthenticated ? 'Session active' : 'Ready to authenticate'}</span></header>
      <section className="hero">
        <div className="eyebrow">Microsoft identity platform</div>
        <h1>Sign in once.<br /><em>Build with confidence.</em></h1>
        <p className="hero-copy">A small, practical playground for testing MSAL authentication flows in a React app.</p>
        {!isConfigured && <div className="notice" role="status"><strong>Configuration needed</strong><span>Add <code>VITE_CLIENT_ID</code> to your <code>.env</code> file, then restart Vite.</span></div>}
        <div className="auth-area">
          <UnauthenticatedTemplate><div className="auth-card"><div className="card-icon">&rarr;</div><div><h2>Continue with Microsoft</h2><p>Use a work, school, or personal Microsoft account.</p></div><button type="button" className="primary-button" onClick={handleLogin} disabled={!isConfigured || isLoading}>{isLoading ? 'Opening sign-in...' : 'Sign in'} <span aria-hidden="true">&rarr;</span></button></div></UnauthenticatedTemplate>
          <AuthenticatedTemplate><div className="profile-card"><div className="profile-heading"><div className="avatar">{(account?.name || account?.username || '?').charAt(0).toUpperCase()}</div><div><span className="label">Authenticated account</span><h2>{account?.name || 'Microsoft user'}</h2><p>{account?.username}</p></div></div><div className="account-details"><span>Authority</span><strong>{import.meta.env.VITE_TENANT_ID ? 'Configured tenant' : 'Common tenant'}</strong></div><button type="button" className="secondary-button" onClick={() => instance.logoutPopup({ account })}>Sign out</button></div></AuthenticatedTemplate>
        </div>
        {error && <p className="error" role="alert">{error}</p>}
      </section>
      <section className="details" aria-label="Authentication details"><div><span className="label">Flow</span><strong>Popup</strong></div><div><span className="label">Scope</span><strong>User.Read</strong></div><div><span className="label">Cache</span><strong>Session storage</strong></div><div><span className="label">Library</span><strong>msal-react</strong></div></section>
    </main>
  )
}

export default App

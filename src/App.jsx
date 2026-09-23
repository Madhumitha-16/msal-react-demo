import { useEffect, useState } from 'react'
import axios from 'axios'
import { UnauthenticatedTemplate, useIsAuthenticated, useMsal } from '@azure/msal-react'
import './App.css'

const apiScope = import.meta.env.VITE_API_SCOPE
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const loginRequest = { scopes: apiScope ? [apiScope] : [] }

function HomePage({ account, onLogout, onCallApi, apiResponse, apiError, isApiLoading }) {
  return (
    <main className="home-page">
      <header className="topbar"><a className="brand" href="/"><span className="brand-mark">M</span> MSAL / React</a><button type="button" className="secondary-button" onClick={onLogout}>Sign out</button></header>
      <section className="home-content">
        <div className="eyebrow">Authenticated successfully</div>
        <h1>Welcome home,<br /><em>{account?.name || 'Microsoft user'}.</em></h1>
        <p className="hero-copy">You are signed in with your Microsoft account and ready to continue.</p>
        <div className="home-card"><span className="label">Signed-in account</span><strong>{account?.username}</strong></div>
        <button type="button" className="primary-button" onClick={onCallApi} disabled={isApiLoading}>{isApiLoading ? 'Calling Spring API...' : 'Call Spring API'} <span aria-hidden="true">&rarr;</span></button>
        {apiResponse && <pre className="api-response">{JSON.stringify(apiResponse, null, 2)}</pre>}
        {apiError && <p className="error" role="alert">{apiError}</p>}
      </section>
    </main>
  )
}

function App() {
  const { instance, accounts } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isApiLoading, setIsApiLoading] = useState(false)
  const [apiResponse, setApiResponse] = useState(null)
  const [apiError, setApiError] = useState('')
  const isConfigured = Boolean(import.meta.env.VITE_CLIENT_ID)
  const account = accounts[0]

  useEffect(() => {
    if (account) instance.setActiveAccount(account)
  }, [account, instance])

  if (isAuthenticated) {
    const handleCallApi = async () => {
      setApiError('')
      setApiResponse(null)
      setIsApiLoading(true)

      try {
        if (!apiScope || !apiBaseUrl) throw new Error('Set VITE_API_SCOPE and VITE_API_BASE_URL in .env.')

        let tokenResponse
        try {
          tokenResponse = await instance.acquireTokenSilent({ scopes: [apiScope], account })
        } catch {
          tokenResponse = await instance.acquireTokenPopup({ scopes: [apiScope], account })
        }

        const response = await axios.get(`${apiBaseUrl}/api/me`, {
          headers: { Authorization: `Bearer ${tokenResponse.accessToken}` },
        })
        console.log('Spring API response:', tokenResponse.accessToken)
        setApiResponse(response.data)
      } catch (apiRequestError) {
        const backendMessage = typeof apiRequestError?.response?.data === 'string'
          ? apiRequestError.response.data
          : apiRequestError?.response?.data?.message
        const backendSuffix = backendMessage ? `: ${backendMessage}` : '.'
        let errorMessage = apiRequestError.message || 'The Spring API request failed.'
        if (apiRequestError?.response) {
          errorMessage = `Spring API returned HTTP ${apiRequestError.response.status}${backendSuffix}`
        }

        setApiError(errorMessage)
      } finally {
        setIsApiLoading(false)
      }
    }

    const handleLogout = async () => {
      sessionStorage.removeItem('msal.server.accessToken')
      await instance.logoutPopup({ account });
    }

    return <HomePage account={account} onLogout={handleLogout} onCallApi={handleCallApi} apiResponse={apiResponse} apiError={apiError} isApiLoading={isApiLoading} />
  }

  const handleLogin = async () => {
    setError('')
    setIsLoading(true)
    try {
      await instance.loginPopup(loginRequest);
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
        <h1>Sign in once.<br /></h1>
        <p className="hero-copy">A small, practical playground for testing MSAL authentication flows in a React app.</p>
        {!isConfigured && <div className="notice"><strong>Configuration needed</strong><span>Add <code>VITE_CLIENT_ID</code> to your <code>.env</code> file, then restart Vite.</span></div>}
        <div className="auth-area">
          
          <UnauthenticatedTemplate>
            <div className="auth-card"><div className="card-icon">&rarr;</div>
            <div><h2>Continue with Microsoft</h2><p>Use a work, school, or personal Microsoft account.</p></div>
            <button type="button" className="primary-button" onClick={handleLogin} disabled={!isConfigured || isLoading}>{isLoading ? 'Opening sign-in...' : 'Sign in'} 
            <span aria-hidden="true">&rarr;</span></button></div>
          </UnauthenticatedTemplate>

        </div>
        {error && <p className="error" role="alert">{error}</p>}
      </section>
      <section className="details" aria-label="Authentication details"><div><span className="label">Flow</span><strong>Popup</strong></div><div><span className="label">Scope</span><strong>Spring API</strong></div><div><span className="label">Cache</span><strong>Session storage</strong></div><div><span className="label">Library</span><strong>msal-react</strong></div></section>
    </main>
  )
}

export default App

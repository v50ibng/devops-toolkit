import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import JWTTools from './pages/JWTTools.jsx'
import SSLTools from './pages/SSLTools.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="ssl">
          <Route index element={<Navigate replace to="extract-ca" />} />
          <Route path=":toolId" element={<SSLTools />} />
        </Route>
        <Route path="jwt">
          <Route index element={<Navigate replace to="decode" />} />
          <Route path=":toolId" element={<JWTTools />} />
        </Route>
        <Route path="*" element={<Navigate replace to="/" />} />
      </Route>
    </Routes>
  )
}

export default App

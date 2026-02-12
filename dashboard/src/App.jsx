import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ServerDashboard from './pages/ServerDashboard.jsx'
import AnimeBackground from './components/AnimeBackground.jsx'
import ScrollWidgets from './components/ScrollWidgets.jsx'

function App() {
  const location = useLocation()
  const isServerDashboard = location.pathname.startsWith('/dashboard/')
    && location.pathname.split('/').length > 2
    && location.pathname.split('/')[2]?.length > 0

  return (
    <div className="relative min-h-screen bg-dark overflow-hidden">
      {!isServerDashboard && <AnimeBackground />}
      <ScrollWidgets />

      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:guildId" element={<ServerDashboard />} />
        </Routes>
      </div>
    </div>
  )
}

export default App

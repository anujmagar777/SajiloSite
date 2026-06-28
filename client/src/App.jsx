import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Generate from './pages/Generate'
import LiveSite from './pages/LiveSite'
import { useSelector } from 'react-redux'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import WebsiteEditor from './pages/Editor'

export const serverUrl = "http://localhost:8000"
function App() {
  const { loading } = useGetCurrentUser()
  const { userData } = useSelector(state => state.user)
  if (loading) {
    return null
  }
  return (
    <BrowserRouter>
      <Routes>
          <Route path = '/' element={<Home/>}/>
          <Route path = '/dashboard' element={userData?<Dashboard/>:<Navigate to={"/"}/>}/>
          <Route path = '/generate' element={userData?<Generate/>:<Navigate to={"/"}/>}/>
          <Route path = '/editor/:id' element={userData?<WebsiteEditor/>:<Navigate to={"/"}/>}/>
          <Route path = '/site/:id' element={<LiveSite/>}/>
      </Routes> 
    </BrowserRouter>

  )
}

export default App
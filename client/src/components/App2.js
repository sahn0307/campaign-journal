import { BrowserRouter as Router } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'
import '../styles/style.scss'
import { useState , useEffect} from 'react'
import AppRoutes from './AppRoutes'

function App2() {
  const [mode, setMode] = useState('light')

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'))
  }

  return (
    <Router>
      <div className={`App ${mode}-mode`}>
        <NavBar mode={mode} toggleMode={toggleMode} />
        <AppRoutes /> 
        {/* <Footer /> */}
      </div>
    </Router>
  )
}

export default App2
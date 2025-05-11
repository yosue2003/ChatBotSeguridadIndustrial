import ChatPage from './pages/chatPage'
import { ThemeProvider } from './context/themeContext'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <ChatPage/>
    </ThemeProvider>
  )
}

export default App

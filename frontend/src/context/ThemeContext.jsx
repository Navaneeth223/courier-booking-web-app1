import { createContext, useContext, useState, useEffect } from 'react'

const ThemeCtx = createContext()

export function useTheme() {
  return useContext(ThemeCtx)
}

export default function ThemeContext({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'
  })

  useEffect(() => {
    document.body.className = `${theme}-mode`
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeCtx.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeCtx.Provider>
  )
}

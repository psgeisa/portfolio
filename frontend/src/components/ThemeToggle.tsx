import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [light, setLight] = useState(() => localStorage.getItem('theme') === 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('light', light)
    localStorage.setItem('theme', light ? 'light' : 'dark')
  }, [light])

  return (
    <button
      type="button"
      onClick={() => setLight((prev) => !prev)}
      aria-label="Alternar tema"
      className="fixed right-4 top-4 z-50 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2.5 text-slate-300 backdrop-blur-sm transition-colors hover:border-emerald-400/40 hover:text-emerald-300"
    >
      {light ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}

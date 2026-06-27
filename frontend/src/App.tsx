import { useEffect, useState } from 'react'
import HomeExperience, { type PerfilData } from './components/home/HomeExperience'
import { apiFetch } from './lib/api'
import './App.css'

function App() {
  const [dados, setDados] = useState<PerfilData | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [ativo, setAtivo] = useState('sobre')

  useEffect(() => {
    apiFetch('/api/perfil')
      .then((res) => {
        if (!res.ok) throw new Error('Falha ao carregar perfil')
        return res.json()
      })
      .then(setDados)
      .catch(() => setErro('Não foi possível carregar os dados.'))
  }, [])

  if (erro) return <main className="loading">{erro}</main>
  if (!dados) return <main className="loading">Carregando...</main>

  return <HomeExperience dados={dados} ativo={ativo} onAtivoChange={setAtivo} />
}

export default App

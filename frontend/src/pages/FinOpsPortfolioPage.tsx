import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import FinOpsContent from '../components/finops/FinOpsContent'

export default function FinOpsPortfolioPage() {
  return (
    <div className="min-h-screen bg-[#0a0c10] font-sans text-slate-100">
      <div className="mx-auto max-w-6xl px-6 pt-6 sm:px-10 lg:px-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-emerald-300"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>
      </div>
      <FinOpsContent />
    </div>
  )
}

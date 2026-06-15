import type { LucideIcon } from 'lucide-react'
import {
  Eye,
  BrainCircuit,
  MessageSquareCode,
  ShieldCheck,
  Database,
  FileSpreadsheet,
  AlertTriangle,
  Activity,
  Compass,
  Layers,
  LineChart,
  Workflow,
  Sparkles,
  Lock,
  ClipboardList,
  RefreshCw,
  Code2,
  Server,
  GitBranch,
  TrendingUp,
  LayoutGrid,
} from 'lucide-react'

export const iconMap: Record<string, LucideIcon> = {
  Eye,
  BrainCircuit,
  MessageSquareCode,
  ShieldCheck,
  Database,
  FileSpreadsheet,
  AlertTriangle,
  Activity,
  Compass,
  Layers,
  LineChart,
  Workflow,
  Sparkles,
  Lock,
  ClipboardList,
  RefreshCw,
  Code2,
  Server,
  GitBranch,
  TrendingUp,
  LayoutGrid,
}

export function resolveIcon(name: string | undefined, fallback: LucideIcon): LucideIcon {
  if (!name) return fallback
  return iconMap[name] ?? fallback
}

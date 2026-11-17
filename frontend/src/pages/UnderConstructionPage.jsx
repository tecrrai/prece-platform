import { Construction } from 'lucide-react'
import { PageHeading, SectionCard } from '@/components/WorkspaceUI'

export default function UnderConstructionPage() {
  return <>
    <PageHeading eyebrow="PRECE" title="Esta página está em construção" description="Estamos preparando esta área da plataforma. Volte em breve para conferir as novidades." />
    <SectionCard>
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-prece-cream text-prece-green-ink"><Construction className="h-8 w-8" aria-hidden="true" /></span>
        <p className="max-w-lg text-sm leading-6 text-neutral-600">Enquanto isso, você pode continuar usando as páginas disponíveis no menu.</p>
      </div>
    </SectionCard>
  </>
}

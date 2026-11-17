import Header from '@/components/Header'

/** Telas ainda nao prototipadas (Tarefas, Materiais, Grupos...). */
export default function PlaceholderPage({ titulo }) {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-16">
      <Header />
      <h1 className="text-2xl font-bold text-prece-red">{titulo}</h1>
      <p className="mt-2 text-neutral-600">Esta tela ainda será construída.</p>
    </div>
  )
}

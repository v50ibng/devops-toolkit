function ToolCard({ title, description, children }) {
  return (
    <section className="glass-panel rounded-3xl p-6 transition hover:-translate-y-1">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-100 light:text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-400 light:text-slate-600">{description}</p>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  )
}

export default ToolCard

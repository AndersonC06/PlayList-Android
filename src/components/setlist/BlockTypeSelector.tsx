const TYPES = [
  { id: 'intro', label: 'Intro', color: '#06b6d4' },
  { id: 'estrofe', label: 'Estrofe', color: '#10b981' },
  { id: 'refrao', label: 'Refrão', color: '#ef4444' },
  { id: 'ponte', label: 'Ponte', color: '#f59e0b' }
];

export default function BlockTypeSelector({ onAdd }: { onAdd: (type: any, title: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {TYPES.map(t => (
        <button
          key={t.id}
          type="button"
          onClick={() => onAdd(t.id, t.label.toUpperCase())}
          className="bg-card hover:bg-secondary border border-border rounded-lg p-3 text-sm font-semibold transition-colors"
          style={{ borderBottomColor: t.color, borderBottomWidth: '4px' }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

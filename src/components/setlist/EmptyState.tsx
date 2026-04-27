import { Inbox } from 'lucide-react';

export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border border-dashed border-border rounded-xl bg-card/50">
      <Inbox className="mb-4 opacity-40" size={48} />
      <p>{message}</p>
    </div>
  );
}

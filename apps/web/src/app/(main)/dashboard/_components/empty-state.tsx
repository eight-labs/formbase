import { PackageOpen, Rabbit } from 'lucide-react';
import { match } from 'ts-pattern';

export type EmptyFormStateProps = {
  status: 'form' | 'submission';
};

export const EmptyFormState = ({ status }: EmptyFormStateProps) => {
  const {
    title,
    message,
    icon: Icon,
  } = match(status)
    .with('form', () => ({
      title: 'No Forms Available',
      message:
        "You haven't created any forms yet. Your forms will appear once you've created them.",
      icon: Rabbit,
    }))
    .with('submission', () => ({
      title: 'No Submissions Available',
      message:
        "You haven't received any submissions yet. Your submissions will appear once you've received them.",
      icon: PackageOpen,
    }))
    .otherwise(() => ({
      title: 'Nothing to do here!',
      message: "You're all caught up!",
      icon: Rabbit,
    }));

  return (
    <div className="mt-40 flex h-60 flex-col items-center justify-center gap-y-4 text-muted-foreground/90">
      <Icon className="h-32 w-32" strokeWidth={1.5} />

      <div className="text-center">
        <h3 className="text-lg font-semibold">{title}</h3>

        <p className="mt-2 max-w-[50ch]">{message}</p>
      </div>
    </div>
  );
};

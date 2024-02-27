import { Rabbit } from "lucide-react";

export const EmptyFormState = () => {
  return (
    <div className="mt-40 flex h-60 flex-col items-center justify-center gap-y-4 text-muted-foreground/60">
      <Rabbit className="h-32 w-32" strokeWidth={1.5} />

      <div className="text-center">
        <h3 className="text-lg font-semibold">No Forms Available</h3>

        <p className="mt-2">
          You haven't created any forms yet. Your forms will appear once you've
          created them.
        </p>
      </div>
    </div>
  );
};

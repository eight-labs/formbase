import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrashIcon } from "@radix-ui/react-icons";

export function DeleteFormDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group rounded-md bg-gray-100 p-2 hover:cursor-pointer dark:bg-gray-900">
          <TrashIcon className="h-4 w-4 duration-300 group-hover:text-red-500 dark:text-white" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this form?</DialogTitle>
          <DialogDescription>
            This will delete all associated submissions and cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-3 flex w-full gap-4">
          <Button variant="outline" className="w-full">
            Cancel
          </Button>
          <Button variant="destructive" className="w-full">
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

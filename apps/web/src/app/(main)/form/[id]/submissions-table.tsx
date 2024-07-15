'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import type {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';

import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Trash2, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { type FormData } from '@formbase/db/schema';
import { Button } from '@formbase/ui/primitives/button';
import { Checkbox } from '@formbase/ui/primitives/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@formbase/ui/primitives/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@formbase/ui/primitives/table';
import { cn } from '@formbase/ui/utils/cn';
import { formatFileName } from '@formbase/utils';

import { api } from '~/lib/trpc/react';

import { ImagePreviewDialog } from './image-preview-dialog';

type SubmissionsTableProps = {
  formKeys: string[];
  submissions: FormData[];
};

export function SubmissionsTable({
  submissions,
  formKeys,
}: SubmissionsTableProps) {
  const router = useRouter();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const formKeysArray = formKeys.filter((key) => key.length > 0);

  const { mutateAsync: deleteFormSubmission } =
    api.formData.delete.useMutation();

  const handleFormSubmissionDelete = async ({
    submissionId,
  }: {
    submissionId: string;
  }) => {
    await deleteFormSubmission(
      {
        id: submissionId,
      },
      {
        onSuccess: () => {
          router.refresh();

          toast.success('Submission has been deleted', {
            icon: <TrashIcon className="h-4 w-4" />,
          });
        },
      },
    );
  };

  const columns: Array<ColumnDef<FormData>> = [
    {
      id: 'select',
      header: ({ table }) => {
        return (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
            }}
            aria-label="Select all"
          />
        );
      },
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: unknown) => {
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    ...formKeysArray.map((submission: string) => {
      if (submission === 'image' || submission === 'file') {
        return {
          accessorKey: submission,
          header: () => {
            return (
              <Button
                variant="ghost"
                className="px-0 py-0 capitalize hover:bg-transparent"
              >
                {submission}
                <CaretSortIcon className="ml-2 h-4 w-4" />
              </Button>
            );
          },
          cell: ({ row }: { row: Row<FormData> }) => {
            const data = row.original.data as Record<string, unknown> | null;
            if (!data?.[submission]) {
              return null;
            }

            const fileUrl = data[submission] as string;
            const fileName = formatFileName(fileUrl);

            return (
              <div className="flex items-center">
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mr-2 underline hover:no-underline"
                >
                  {fileName}
                </a>
                {submission === 'image' && (
                  <ImagePreviewDialog fileName={fileName} imageUrl={fileUrl} />
                )}
              </div>
            );
          },
        };
      }

      return {
        accessorKey: submission,
        header: () => {
          return (
            <Button
              variant="ghost"
              className="px-0 py-0 capitalize hover:bg-transparent"
            >
              {submission}
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }: { row: Row<FormData> }) => {
          const data = row.original.data as Record<
            string,
            string | undefined
          > | null;

          if (!data) {
            return null;
          }

          return <div>{data[submission]}</div>;
        },
      };
    }),

    {
      accessorKey: 'createdAt',
      header: () => {
        return (
          <Button
            variant="ghost"
            className="px-0 py-0 capitalize hover:bg-transparent"
          >
            Created At
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      sortingFn: (a, b) => {
        const dateA = new Date(a.original.createdAt);
        const dateB = new Date(b.original.createdAt);
        return dateA.getTime() - dateB.getTime();
      },
      cell: ({ row }: { row: Row<FormData> }) => {
        const date = new Date(row.original.createdAt);
        const dateString = date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });

        const timeString = date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });

        return <div>{dateString + ', ' + timeString}</div>;
      },
    },

    {
      id: 'actions',
      enableHiding: false,
      size: 20,
      cell: ({ row }: { row: Row<FormData> }) => {
        const submissionId = row.original.id;

        if (!submissionId) {
          return null;
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[1rem] p-0">
              <DropdownMenuItem
                className="focus:bg-destructive/5 focus:text-destructive-foreground"
                onClick={() => handleFormSubmissionDelete({ submissionId })}
              >
                <span className="flex items-center gap-2 p-1 py-0.5 text-destructive">
                  <Trash2 className="size-4 " />
                  Delete
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: submissions,
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableSortingRemoval: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="mt-6 w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn({
                    'bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700':
                      row.original.isSpam,
                  })}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

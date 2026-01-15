'use client';

import { ArrowDownToLine, FileDown } from 'lucide-react';
import { toast } from 'sonner';

import { type FormData } from '@formbase/db/schema';
import { Button } from '@formbase/ui/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@formbase/ui/primitives/dropdown-menu';

type ExportSubmissionsDropDownButtonProps = {
  submissions: FormData[];
  formKeys: string[];
  formTitle: string;
  honeypotField: string;
};

const createCSVContent = (
  submissions: FormData[],
  formKeys: string[],
  honeypotField: string,
): string => {
  const filteredKeys = formKeys.filter((key) => key !== honeypotField);
  const allKeys = [...filteredKeys, 'isSpam'];

  let csvContent = 'data:text/csv;charset=utf-8,';
  const header = allKeys.join(',') + '\n';
  csvContent += header;

  submissions.forEach((submission) => {
    if (submission.data && typeof submission.data === 'object') {
      const dataValues = filteredKeys.map(
        (key) => (submission.data as Record<string, unknown>)[key] ?? '',
      );
      const row = [...dataValues, submission.isSpam].join(',');
      csvContent += row + '\n';
    }
  });

  return csvContent;
};

const createJSONContent = (
  submissions: FormData[],
  honeypotField: string,
): string => {
  const jsonContent = JSON.stringify(
    submissions.map((submission) => {
      const data =
        submission.data && typeof submission.data === 'object'
          ? { ...(submission.data as Record<string, unknown>) }
          : {};
      delete data[honeypotField];
      return {
        ...data,
        isSpam: submission.isSpam,
      };
    }),
    null,
    2,
  );

  return `data:application/json;charset=utf-8,${jsonContent}`;
};

const triggerDownload = (content: string, fileName: string): void => {
  const encodedUri = encodeURI(content);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};

export function ExportSubmissionsDropDownButton({
  submissions,
  formKeys,
  formTitle,
  honeypotField,
}: ExportSubmissionsDropDownButtonProps) {
  const handleDownloadAsCSV = () => {
    const csvContent = createCSVContent(submissions, formKeys, honeypotField);
    triggerDownload(csvContent, `${formTitle}_submissions.csv`);
    toast('Submissions exported as CSV', {
      icon: <FileDown className="h-4 w-4" />,
    });
  };

  const handleDownloadAsJSON = () => {
    const jsonContent = createJSONContent(submissions, honeypotField);
    triggerDownload(jsonContent, `${formTitle}_submissions.json`);
    toast('Submissions exported as JSON', {
      icon: <FileDown className="h-4 w-4" />,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleDownloadAsCSV}>
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDownloadAsJSON}>
            Export as JSON
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

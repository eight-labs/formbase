"use client";

import { ArrowDownToLine, FileDown } from "lucide-react";
import { toast } from "sonner";

import { Button } from "src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";

export function ExportSubmissionsDropDownButton({
  submissions,
  formKeys: formKeysArray,
  formTitle,
}: {
  submissions: unknown[];
  // formKeys: string;
  formKeys: string[];
  formTitle: string;
}) {
  // const formKeysArray = formKeys.split("~?").filter((key) => key.length > 0);

  const handleLinkElementCreationAndClick = (
    content: string,
    fileName: string,
  ) => {
    const encodedUri = encodeURI(content);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  const handleDownloadAsCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    const header = formKeysArray.join(",") + "\n";
    csvContent += header;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    submissions.forEach((submission: any) => {
      const row = formKeysArray
        .map((key) => submission["data"][key] || "")
        .join(",");
      csvContent += row + "\n";
    });

    handleLinkElementCreationAndClick(
      csvContent,
      `${formTitle}_submissions.csv`,
    );

    toast("Submissions exported as CSV", {
      icon: <FileDown className="h-4 w-4" />,
    });
  };

  const handleDownloadAsJSON = () => {
    const jsonContent = JSON.stringify(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      submissions.map((submission: any) => submission.data),
      null,
      2,
    );
    handleLinkElementCreationAndClick(
      `data:application/json;charset=utf-8,${jsonContent}`,
      `${formTitle}_submissions.json`,
    );

    toast("Submissions exported as JSON", {
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

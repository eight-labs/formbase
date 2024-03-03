"use client";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

type FormAnalyticsProps = {
  formSubmissions: {
    data: unknown;
    createdAt: Date;
  }[];
};

type ChartData = {
  date: string;
  count: number;
}[];

const transformFormSubmissionsToChartData = (
  formSubmissions: FormAnalyticsProps["formSubmissions"],
) => {
  const submissions = formSubmissions.reduce(
    (acc, submission) => {
      const date = submission.createdAt.toISOString().split("T")[0]!;
      if (acc[date]) {
        acc[date] += 1;
      } else {
        acc[date] = 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(submissions).map(([date, count]) => ({
    date,
    count,
  }));
};

const filterDataByTimePeriod = (timePeriod: string, data: ChartData) => {
  const currentDate = new Date();

  const getMonthDiff = (months: number) => {
    return currentDate.getMonth() - months;
  };

  const filterByMonth = (months: number) => {
    return data.filter((d) => {
      const submissionMonth = new Date(d.date).getMonth();
      return submissionMonth === getMonthDiff(months);
    });
  };

  switch (timePeriod) {
    case "this-month":
      return filterByMonth(0);
    case "last-month":
      return filterByMonth(1);
    case "last-3-months":
      return filterByMonth(3);

    default:
      return data;
  }
};

const FormAnalytics = ({ formSubmissions }: FormAnalyticsProps) => {
  const data = transformFormSubmissionsToChartData(formSubmissions);
  const [dataItems, setDataItems] = useState<ChartData>(
    data.filter((d) => {
      const submissionMonth = new Date(d.date).getMonth();
      return submissionMonth === new Date().getMonth();
    }),
  );

  const handleFilterChange = (value: string) => {
    const newFilteredData = filterDataByTimePeriod(value, data);
    if (newFilteredData) {
      setDataItems(newFilteredData);
    }
  };

  return (
    <div className="mt-8 h-full w-full">
      <div className="mb-8 flex items-center justify-between">
        Overview of your form submissions
        <SelectTimePeriod onFilterChange={handleFilterChange} />
      </div>
      <ResponsiveContainer width="100%" aspect={2}>
        <LineChart
          width={500}
          height={300}
          data={dataItems}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            label="Submissions"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FormAnalytics;

const timePeriodOptions = [
  {
    value: "this-month",
    label: "This month",
  },
  {
    value: "last-month",
    label: "Last month",
  },
  {
    value: "last-3-months",
    label: "Last 3 months",
  },
];

function SelectTimePeriod({
  onFilterChange,
}: {
  onFilterChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("this-month");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? timePeriodOptions.find((timePeriod) => timePeriod.value === value)
                ?.label
            : "Select time period"}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search period filter..." className="h-9" />
          <CommandEmpty>No such filter</CommandEmpty>
          <CommandGroup>
            {timePeriodOptions.map((timePeriod) => (
              <CommandItem
                key={timePeriod.value}
                value={timePeriod.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                  onFilterChange(currentValue);
                }}
              >
                {timePeriod.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === timePeriod.value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

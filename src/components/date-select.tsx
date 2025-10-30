import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type DateSelectProps = {
  value: Date;
  onChange: (newDate: Date) => void;
  disabled?: boolean;
};

export const DateSelect: React.FC<DateSelectProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const day = value.getDate();
  const month = value.getMonth(); // 0-indexed
  const year = value.getFullYear();

  const currentYear = new Date().getFullYear();
  // e.g. offer last 100 years
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleChange = (part: "day" | "month" | "year", newValue: number) => {
    const newDate = new Date(value);
    if (part === "day") newDate.setDate(newValue);
    if (part === "month") newDate.setMonth(newValue);
    if (part === "year") newDate.setFullYear(newValue);

    // Ensure the day is valid for the new month/year
    const maxDay = new Date(
      newDate.getFullYear(),
      newDate.getMonth() + 1,
      0
    ).getDate();
    if (newDate.getDate() > maxDay) {
      newDate.setDate(maxDay);
    }

    onChange(newDate);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Day */}
      <Select
        value={String(day)}
        onValueChange={(val) => handleChange("day", parseInt(val))}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Day" />
        </SelectTrigger>
        <SelectContent>
          {days.map((d) => (
            <SelectItem key={d} value={String(d)}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Month */}
      <Select
        value={String(month)}
        onValueChange={(val) => handleChange("month", parseInt(val))}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((m) => (
            <SelectItem key={m} value={String(m)}>
              {new Date(0, m).toLocaleString("default", { month: "long" })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Year */}
      <Select
        value={String(year)}
        onValueChange={(val) => handleChange("year", parseInt(val))}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

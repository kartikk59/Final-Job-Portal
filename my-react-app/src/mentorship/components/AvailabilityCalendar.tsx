interface AvailabilityCalendarProps {
  availableDates: string[]; // array of "YYYY-MM-DD"
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function AvailabilityCalendar({
  availableDates,
  selectedDate,
  onSelectDate,
}: AvailabilityCalendarProps) {
  // Format dates for display
  const formatDateChip = (dateStr: string) => {
    // Parse parts manually to avoid timezone skew
    const [year, month, day] = dateStr.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
    const monthName = dateObj.toLocaleDateString("en-US", { month: "short" });

    return {
      dayName,
      dayNumber: day,
      monthName,
      formatted: `${dayName}, ${monthName} ${day}`,
    };
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
        1. Select Session Date
      </label>
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
        {availableDates.map((dateStr) => {
          const { dayName, dayNumber, monthName } = formatDateChip(dateStr);
          const isSelected = selectedDate === dateStr;

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onSelectDate(dateStr)}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-18 py-2.5 px-2 rounded-2xl border transition-all text-center cursor-pointer ${
                isSelected
                  ? "bg-[#FF7A00] text-white border-[#FF7A00] shadow-sm ring-2 ring-orange-500/20"
                  : "bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50/40"
              }`}
            >
              <span
                className={`text-[10px] uppercase font-bold tracking-wider ${
                  isSelected ? "text-orange-100" : "text-gray-400"
                }`}
              >
                {dayName}
              </span>
              <span className="text-lg font-extrabold leading-none my-1">
                {dayNumber}
              </span>
              <span
                className={`text-[11px] font-medium ${
                  isSelected ? "text-orange-100" : "text-gray-500"
                }`}
              >
                {monthName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface TimeSlotPickerProps {
  slots: string[];
  selectedTime: string;
  onSelectTime: (time: string) => void;
}

export function TimeSlotPicker({ slots, selectedTime, onSelectTime }: TimeSlotPickerProps) {
  if (slots.length === 0) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-xs text-gray-500">
        No slots available on this date. Please pick another date.
      </div>
    );
  }

  // Categorize slots by time of day for great UX
  const parseHour = (timeStr: string) => {
    const isPM = timeStr.includes("PM");
    const [h] = timeStr.replace(/(AM|PM)/, "").trim().split(":").map(Number);
    let hour = h;
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    return hour;
  };

  const morning = slots.filter((t) => parseHour(t) < 12);
  const afternoon = slots.filter((t) => parseHour(t) >= 12 && parseHour(t) < 17);
  const evening = slots.filter((t) => parseHour(t) >= 17);

  const renderSlotGroup = (title: string, groupSlots: string[]) => {
    if (groupSlots.length === 0) return null;
    return (
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
          {title}
        </span>
        <div className="flex flex-wrap gap-2">
          {groupSlots.map((time) => {
            const isSelected = selectedTime === time;
            return (
              <button
                key={time}
                type="button"
                onClick={() => onSelectTime(time)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#FF7A00] text-white border-[#FF7A00] shadow-xs ring-2 ring-orange-500/20"
                    : "bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
        2. Select Time Slot
      </label>
      <div className="space-y-3 bg-gray-50/60 p-3.5 rounded-2xl border border-gray-150">
        {renderSlotGroup("Morning", morning)}
        {renderSlotGroup("Afternoon", afternoon)}
        {renderSlotGroup("Evening", evening)}
      </div>
    </div>
  );
}

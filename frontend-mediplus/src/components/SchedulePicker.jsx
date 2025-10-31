/* eslint-disable no-unused-vars */
import { useMemo } from "react";
import { motion } from "framer-motion";
import { addDays, format, startOfWeek, isSameDay } from "date-fns";

export default function SchedulePicker({
    weekStart = new Date(),
    value, // { date: Date, time: "HH:mm" }
    onChange,
    slots = {}, // { 'YYYY-MM-DD': ['09:00','09:30',...] }
}) {
    const days = useMemo(() => {
        const start = startOfWeek(weekStart, { weekStartsOn: 1 });
        return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }, [weekStart]);

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-7 gap-2">
                {days.map((d) => (
                    <div key={d.toISOString()} className="text-center text-xs font-medium text-slate-500">
                        {format(d, "EEE")}
                        <div className="text-base text-slate-900 dark:text-slate-100">{format(d, "d")}</div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {days.map((d) => (
                    <DayColumn
                        key={d.toISOString()}
                        date={d}
                        slots={slots[format(d, "yyyy-MM-dd")] || []}
                        selected={value && isSameDay(value.date, d) ? value.time : null}
                        onSelect={(time) => onChange?.({ date: d, time })}
                    />
                ))}
            </div>
        </div>
    );
}

function DayColumn({ date, slots, selected, onSelect }) {
    if (!slots.length) {
        return (
            <div className="min-h-[260px] rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 grid place-items-center">
                Aucune dispo
            </div>
        );
    }
    return (
        <div className="min-h-[260px] p-2 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="grid gap-2">
                {slots.map((t) => (
                    <motion.button
                        key={t}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelect(t)}
                        className={`px-2 py-1 rounded-lg text-xs border transition ${selected === t
                                ? "bg-linear-to-r from-cyan-500 to-teal-500 text-white border-transparent"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                    >
                        {t}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

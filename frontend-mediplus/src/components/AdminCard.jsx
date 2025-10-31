export default function AdminCard({ title, value, icon }) {
    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-4">
            <div className="text-cyan-600 text-2xl">{icon}</div>
            <div>
                <div className="text-sm text-slate-500">{title}</div>
                <div className="text-lg font-semibold">{value}</div>
            </div>
        </div>
    );
}

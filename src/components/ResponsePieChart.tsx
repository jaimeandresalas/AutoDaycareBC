"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ResponseChartProps {
    pending: number;
    waitlisted: number;
    spotsAvailable: number;
    rejections: number;
    theme?: "muted" | "vibrant";
}

const MUTED_COLORS = {
    pending: "#94a3b8",       // slate-400
    waitlisted: "#60a5fa",    // blue-400
    spotsAvailable: "#14b8a6", // teal-500
    rejections: "#64748b",    // slate-500
};

const VIBRANT_COLORS = {
    pending: "#fbbf24",       // amber-400
    waitlisted: "#f97316",    // orange-500
    spotsAvailable: "#10b981", // emerald-500
    rejections: "#f43f5e",    // rose-500
};

export default function ResponsePieChart({ pending, waitlisted, spotsAvailable, rejections, theme = "muted" }: ResponseChartProps) {
    const colors = theme === "vibrant" ? VIBRANT_COLORS : MUTED_COLORS;

    const data = [
        { name: "Pending", value: pending, color: colors.pending },
        { name: "Waitlisted", value: waitlisted, color: colors.waitlisted },
        { name: "Spots Available", value: spotsAvailable, color: colors.spotsAvailable },
        { name: "No Space", value: rejections, color: colors.rejections },
    ].filter((d) => d.value > 0);

    const total = pending + waitlisted + spotsAvailable + rejections;

    if (total === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <p className="text-lg font-medium">No response data yet</p>
                <p className="text-sm mt-1">Send your first campaign to see analytics</p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={2}
                    stroke="hsl(var(--background))"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                    }}
                    labelFormatter={((value: unknown, name: unknown) => [
                        `${value as number} (${Math.round(((value as number) / total) * 100)}%)`,
                        name as string,
                    ])}
                />
                <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={10}
                    wrapperStyle={{ fontSize: "13px", paddingTop: "16px" }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

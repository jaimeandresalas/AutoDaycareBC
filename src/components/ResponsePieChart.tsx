"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ResponseChartProps {
    pending: number;
    waitlisted: number;
    spotsAvailable: number;
    rejections: number;
}

const COLORS = {
    pending: "#94a3b8",       // slate-400
    waitlisted: "#facc15",    // yellow-400
    spotsAvailable: "#22c55e", // green-500
    rejections: "#ef4444",    // red-500
};

const LABELS: Record<string, string> = {
    pending: "Pending",
    waitlisted: "Waitlisted",
    spotsAvailable: "Spots Available",
    rejections: "No Space",
};

export default function ResponsePieChart({ pending, waitlisted, spotsAvailable, rejections }: ResponseChartProps) {
    const data = [
        { name: "Pending", value: pending, color: COLORS.pending },
        { name: "Waitlisted", value: waitlisted, color: COLORS.waitlisted },
        { name: "Spots Available", value: spotsAvailable, color: COLORS.spotsAvailable },
        { name: "No Space", value: rejections, color: COLORS.rejections },
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
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        fontSize: "14px",
                    }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={((value: number, name: string) => [
                        `${value} (${Math.round((value / total) * 100)}%)`,
                        name,
                    ]) as any}
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

"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export interface AnalyticsPanel {
    title: string;
    description: string;
    data: { label: string; value: number }[];
}

export function AnalyticsCharts({ panels }: { panels: AnalyticsPanel[] }) {
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            {panels.map((panel) => (
                <Card key={panel.title}>
                    <CardHeader>
                        <CardTitle>{panel.title}</CardTitle>
                        <CardDescription>{panel.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div
                            role="img"
                            aria-label={`${panel.title} bar chart`}
                            className="h-64 w-full"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={panel.data}
                                    margin={{ top: 8, right: 8, bottom: 4, left: -20 }}
                                    accessibilityLayer
                                >
                                    <CartesianGrid
                                        vertical={false}
                                        strokeDasharray="3 3"
                                    />
                                    <XAxis
                                        dataKey="label"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12 }}
                                        interval={0}
                                    />
                                    <YAxis
                                        allowDecimals={false}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: "rgba(249, 115, 22, 0.08)" }}
                                        formatter={(value) => [value ?? 0, "Count"]}
                                    />
                                    <Bar
                                        dataKey="value"
                                        fill="#f97316"
                                        radius={[5, 5, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <ul className="sr-only">
                            {panel.data.map((point) => (
                                <li key={point.label}>
                                    {point.label}: {point.value}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

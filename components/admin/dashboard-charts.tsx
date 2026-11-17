"use client"

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

const axis = { stroke: "oklch(0.62 0.01 285)", fontSize: 11 }
const grid = "oklch(1 0 0 / 6%)"
const PRIMARY = "oklch(0.88 0.2 111)"
const BLUE = "oklch(0.6 0.2 250)"
const RED = "oklch(0.62 0.22 25)"

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-muted-foreground">{title}</h3>
      <div className="h-56 w-full">{children}</div>
    </div>
  )
}

const tooltipStyle = {
  background: "oklch(0.2 0.006 285)",
  border: "1px solid oklch(1 0 0 / 10%)",
  borderRadius: 10,
  fontSize: 12,
  color: "#fff",
}

export function VisitsChart({ data }: { data: { date: string; value: number }[] }) {
  return (
    <ChartCard title="Динамика посещений">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gVisits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.5} />
              <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
          <XAxis dataKey="date" tick={axis} tickLine={false} axisLine={false} />
          <YAxis tick={axis} tickLine={false} axisLine={false} width={40} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area
            type="monotone"
            dataKey="value"
            name="Посещения"
            stroke={PRIMARY}
            strokeWidth={2}
            fill="url(#gVisits)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function MoneyChart({
  data,
}: {
  data: { date: string; deposit: number; withdraw: number }[]
}) {
  return (
    <ChartCard title="Пополнения и выводы">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
          <XAxis dataKey="date" tick={axis} tickLine={false} axisLine={false} />
          <YAxis tick={axis} tickLine={false} axisLine={false} width={40} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line
            type="monotone"
            dataKey="deposit"
            name="Пополнения"
            stroke={PRIMARY}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="withdraw"
            name="Выводы"
            stroke={RED}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function OpeningsChart({ data }: { data: { date: string; value: number }[] }) {
  return (
    <ChartCard title="Открытий кейсов">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
          <XAxis dataKey="date" tick={axis} tickLine={false} axisLine={false} />
          <YAxis tick={axis} tickLine={false} axisLine={false} width={40} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(1 0 0 / 5%)" }} />
          <Bar dataKey="value" name="Открытия" fill={BLUE} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function TopCasesChart({ data }: { data: { name: string; openings: number }[] }) {
  return (
    <ChartCard title="ТОП-5 кейсов по открытиям">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 12, left: 8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={grid} horizontal={false} />
          <XAxis type="number" tick={axis} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            tick={axis}
            tickLine={false}
            axisLine={false}
            width={110}
          />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(1 0 0 / 5%)" }} />
          <Bar dataKey="openings" name="Открытия" fill={PRIMARY} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

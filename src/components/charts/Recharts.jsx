import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'

const TIP_STYLE = {
  background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
  fontSize: 12, boxShadow: '0 8px 24px rgba(15,23,42,.12)',
}

const GRID = '#eef1f6'

export const ChartLine = ({ data, xKey, series = [], height = 240 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
      <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={42} />
      <Tooltip contentStyle={TIP_STYLE} />
      {series.map((s, i) => (
        <Line
          key={s.key}
          type="monotone"
          dataKey={s.key}
          name={s.name}
          stroke={s.color || ['#0d6efd', '#20c997', '#f5a623', '#d63384'][i % 4]}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5 }}
        />
      ))}
    </LineChart>
  </ResponsiveContainer>
)

export const ChartArea = ({ data, xKey, series = [], height = 240 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
      <defs>
        {series.map((s) => (
          <linearGradient key={s.key} id={`grad_${s.key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.color || '#0d6efd'} stopOpacity={0.35} />
            <stop offset="100%" stopColor={s.color || '#0d6efd'} stopOpacity={0.02} />
          </linearGradient>
        ))}
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
      <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={42} />
      <Tooltip contentStyle={TIP_STYLE} />
      <Legend wrapperStyle={{ fontSize: 12 }} />
      {series.map((s) => (
        <Area
          key={s.key}
          type="monotone"
          dataKey={s.key}
          name={s.name}
          stroke={s.color || '#0d6efd'}
          strokeWidth={2}
          fill={`url(#grad_${s.key})`}
        />
      ))}
    </AreaChart>
  </ResponsiveContainer>
)

export const ChartBar = ({ data, xKey, series = [], stacked = false, height = 240, radius = [6, 6, 0, 0] }) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }} barSize={22}>
      <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
      <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={42} />
      <Tooltip contentStyle={TIP_STYLE} cursor={{ fill: 'rgba(13,110,253,0.06)' }} />
      <Legend wrapperStyle={{ fontSize: 12 }} />
      {series.map((s, i) => (
        <Bar
          key={s.key}
          dataKey={s.key}
          name={s.name}
          fill={s.color || ['#0d6efd', '#20c997', '#f5a623', '#d63384'][i % 4]}
          stackId={stacked ? 'stack' : undefined}
          radius={i === series.length - 1 ? radius : [0, 0, 0, 0]}
        />
      ))}
    </BarChart>
  </ResponsiveContainer>
)

export const ChartPie = ({ data, height = 240, donut = true, colors = ['#0d6efd', '#20c997', '#f5a623', '#d63384', '#6c5ce7', '#0aa2a0'] }) => (
  <ResponsiveContainer width="100%" height={height}>
    <PieChart>
      <Tooltip contentStyle={TIP_STYLE} />
      <Legend wrapperStyle={{ fontSize: 12 }} />
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        innerRadius={donut ? 55 : 0}
        outerRadius={90}
        paddingAngle={donut ? 3 : 0}
        label={({ percent }) => `${Math.round(percent * 100)}%`}
      >
        {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
      </Pie>
    </PieChart>
  </ResponsiveContainer>
)

export const ChartCombined = ({ data, xKey, bars = [], lines = [], height = 260 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
      <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={42} />
      <Tooltip contentStyle={TIP_STYLE} cursor={{ fill: 'rgba(13,110,253,0.06)' }} />
      <Legend wrapperStyle={{ fontSize: 12 }} />
      {bars.map((s) => (
        <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color || '#0d6efd'} barSize={18} radius={[6, 6, 0, 0]} />
      ))}
      {lines.map((s) => (
        <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color || '#f5a623'} strokeWidth={2.5} dot={false} />
      ))}
    </BarChart>
  </ResponsiveContainer>
)
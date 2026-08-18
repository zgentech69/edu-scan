'use client';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { format, parseISO } from 'date-fns';

interface ChartData {
  date: string;
  views: number;
}

export function ViewsChart({ data }: { data: ChartData[] }) {
  // Format the date to show just Month and Day, e.g. "Aug 15"
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: format(parseISO(item.date), 'MMM dd')
  }));

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-sand-900/40 italic">
        No traffic data available for the last 7 days.
      </div>
    );
  }

  return (
    <div className="w-full h-[350px] mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={formattedData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#b76e22" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#b76e22" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
          <XAxis 
            dataKey="formattedDate" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#7c7267', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#7c7267', fontSize: 12 }}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#f2eae1', 
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.4)',
              boxShadow: '4px 4px 10px rgba(0,0,0,0.05), -4px -4px 10px rgba(255,255,255,0.8)'
            }}
            itemStyle={{ color: '#b76e22', fontWeight: 'bold' }}
            cursor={{ stroke: 'rgba(0,0,0,0.05)', strokeWidth: 2 }}
          />
          <Area 
            type="monotone" 
            dataKey="views" 
            stroke="#b76e22" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorViews)" 
            activeDot={{ r: 6, fill: '#b76e22', stroke: '#f2eae1', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

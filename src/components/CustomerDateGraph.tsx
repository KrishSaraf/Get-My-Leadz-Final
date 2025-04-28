import { useMemo } from 'react';
import { Card } from './ui/Card';

interface Customer {
  created_at: string | null;
}

interface CustomerDateGraphProps {
  customers: Customer[];
}

export function CustomerDateGraph({ customers }: CustomerDateGraphProps) {
  const dateData = useMemo(() => {
    const dates = customers
      .filter(c => c.created_at)
      .map(c => new Date(c.created_at!).toLocaleDateString());
    
    const countByDate = dates.reduce((acc: Record<string, number>, date) => {
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(countByDate)
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
      .slice(-7); // Show last 7 dates
  }, [customers]);

  const maxCount = Math.max(...dateData.map(([_, count]) => count));
  const graphHeight = 100; // pixels

  return (
    <Card className="h-[200px] p-4">
      <h3 className="text-sm text-gray-600 mb-2">New Customers by Date</h3>
      <div className="flex items-end h-[120px] gap-2">
        {dateData.map(([date, count], index) => {
          const height = (count / maxCount) * graphHeight;
          return (
            <div
              key={date}
              className="flex-1 flex flex-col items-center"
            >
              <div 
                className="w-full bg-[#5B3CC4] rounded-t"
                style={{ height: `${height}px` }}
              />
              <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left whitespace-nowrap">
                {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
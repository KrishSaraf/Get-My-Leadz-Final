import { Card } from './ui/Card';

interface CustomerStatsProps {
  totalCustomers: number;
  totalRevenue: number;
}

export function CustomerStats({ totalCustomers, totalRevenue }: CustomerStatsProps) {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <p className="text-sm text-gray-600">Total Customers</p>
        <h3 className="text-2xl font-bold mt-2">{totalCustomers}</h3>
      </Card>
      
      <Card className="p-6">
        <p className="text-sm text-gray-600">Customer Revenue</p>
        <h3 className="text-2xl font-bold mt-2">${totalRevenue.toLocaleString()}</h3>
      </Card>
    </div>
  );
}
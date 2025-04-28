import { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface Customer {
  created_at: string | null;  // e.g. "27/1/2025"
  type?: string;
}

interface CustomerGrowthChartProps {
  customers: Customer[];
}

/**
 * Parse a date string in the format "DD/MM/YYYY" into a JavaScript Date.
 * Example: "27/1/2025" -> new Date(2025, 0, 27)
 */
function parseDDMMYYYY(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number);
  // Note: JavaScript months are 0-based, so subtract 1 from "month"
  return new Date(year, month - 1, day);
}

export function CustomerGrowthChart({ customers }: CustomerGrowthChartProps) {
  const [showModal, setShowModal] = useState(false);

  /**
   * We only want to consider:
   * 1) Customers with type == "existing"
   * 2) A valid created_at date (in DD/MM/YYYY format)
   * We'll then display cumulative growth from 2025-01-20 to 2025-03-20.
   */
  const data = useMemo(() => {
    // Hard-coded date range (can be dynamic if needed)
    const startDate = new Date('2025-01-20');
    const endDate = new Date('2025-03-20');

    // Filter for existing customers who have created_at, then convert to Date
    const existingCustomers = customers
      .filter((c) => c.type?.toLowerCase() === 'existing' && c.created_at)
      .sort((a, b) => {
        const dateA = parseDDMMYYYY(a.created_at!);
        const dateB = parseDDMMYYYY(b.created_at!);
        return dateA.getTime() - dateB.getTime();
      });

    // Count how many existed before the start date
    const initialCount = existingCustomers.filter((c) => {
      const created = parseDDMMYYYY(c.created_at!);
      return created < startDate;
    }).length;

    // Prepare a date -> # new customers map for each day in [startDate, endDate]
    const dateMap = new Map<string, number>();

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dateMap.set(d.toISOString().split('T')[0], 0);
    }

    // Count new signups on each valid date
    existingCustomers.forEach((customer) => {
      const created = parseDDMMYYYY(customer.created_at!);
      if (created >= startDate && created <= endDate) {
        const dateKey = created.toISOString().split('T')[0];
        dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1);
      }
    });

    // Convert the daily signups into a cumulative array
    let cumulativeCount = initialCount;
    return Array.from(dateMap.entries())
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([isoDate, newCount]) => {
        cumulativeCount += newCount;
        return {
          // For the X-axis, format date as "Jan 20"
          date: new Date(isoDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          }),
          customers: cumulativeCount
        };
      });
  }, [customers]);

  // For display: total existing customers (regardless of date range)
  const existingCustomersCount = customers.filter(
    (c) => c.type?.toLowerCase() === 'existing'
  ).length;

  /**
   * A small "mini" line chart for the preview card
   */
  const MiniChart = () => (
    <div className="h-[120px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="customers"
            stroke="#5B3CC4"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  /**
   * The full-size line chart, shown in a modal
   */
  const FullChart = () => (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickMargin={10}
            label={{
              value: 'Total Customers',
              angle: -90,
              position: 'insideLeft',
              offset: 0
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '8px'
            }}
          />
          <Line
            type="monotone"
            dataKey="customers"
            stroke="#5B3CC4"
            strokeWidth={2}
            dot={{ fill: '#5B3CC4', r: 4 }}
            activeDot={{ r: 6, fill: '#5B3CC4' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <>
      <Card
        className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setShowModal(true)}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm text-gray-600">Customer Growth</h3>
          <TrendingUp className="w-4 h-4 text-[#5B3CC4]" />
        </div>
        <div className="text-2xl font-bold mb-4">
          {existingCustomersCount}
        </div>
        <MiniChart />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Customer Growth Over Time"
      >
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              Total Customers: {existingCustomersCount}
            </h3>
            <p className="text-sm text-gray-600">
              Existing customer growth from Jan 20, 2025 to Mar 20, 2025
            </p>
          </div>
          <FullChart />
        </div>
      </Modal>
    </>
  );
}

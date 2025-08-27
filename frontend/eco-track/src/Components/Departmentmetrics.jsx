import { Card, CardContent } from "../Components/ui/Card";
import { ArrowRight, TrendingUp, Gauge, DollarSign, BarChart3 } from "lucide-react";
import { useNavigate } from 'react-router-dom'

export default function DepartmentMetrics() {
  const router = useNavigate();

  const metrics = [
    {
      title: "Consumption vs Target",
      value: "72%",
      link: "/department/dashboard/consumption",
      icon: Gauge,
      color: "text-[#24A47F]",
      description: "72% of the energy target achieved",
    },
    {
      title: "Equipment Efficiency",
      value: "88%",
      link: "/department/dashboard/equipment",
      icon: TrendingUp,
      color: "text-[#24A47F]",
      description: "Efficiency improved by 5% this month",
    },
    {
      title: "Cost Allocation",
      value: "$12,450",
      link: "/department/dashboard/cost",
      icon: DollarSign,
      color: "text-[#24A47F]",
      description: "Budget utilization at 65%",
    },
    {
      title: "Performance Benchmarks",
      value: "Top 20%",
      link: "/department/dashboard/benchmarks",
      icon: BarChart3,
      color: "text-[#24A47F]",
      description: "Above average compared to other departments",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card
            key={index}
            onClick={() => router.push(metric.link)}
            className="shadow-md hover:shadow-xl  transition-all duration-300 rounded-2xl cursor-pointer hover:scale-[1.02]"
          >
            <CardContent className="p-6 border border-green-500 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Icon className={`w-8 h-8 ${metric.color}`} />
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{metric.title}</h2>
              <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
              <p className="text-sm text-gray-500">{metric.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Target, Activity, Clock, CheckSquare } from 'lucide-react';
import { getAnalytics } from '../lib/api';

interface ProductivityMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
  color: string;
}

interface WeeklyData {
  day: string;
  tasks: number;
  hours: number;
  efficiency: number;
}

interface Category {
  name: string;
  percentage: number;
  color: string;
}

interface Insight {
  title: string;
  description: string;
  suggestion: string;
  impact: string;
}

const AnalyticsModule = () => {
  const [productivityMetrics, setProductivityMetrics] = useState<ProductivityMetric[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics();
        if (data) {
          // Map icon strings to actual icon components
          const iconMap: { [key: string]: React.ElementType } = {
            'CheckSquare': CheckSquare,
            'Clock': Clock,
            'TrendingUp': TrendingUp,
            'Target': Target,
            'Activity': Activity,
            'BarChart3': BarChart3
          };

          const mappedMetrics = (data.productivityMetrics || []).map((metric: any) => ({
            ...metric,
            icon: iconMap[metric.icon] || Activity
          }));

          setProductivityMetrics(mappedMetrics);
          setWeeklyData(data.weeklyData || []);
          setCategories(data.categories || []);
          setInsights(data.insights || []);
        }
      } catch (err) {
        console.error('Analytics fetch error:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Insights into your productivity patterns and trends</p>
      </div>

      {/* Productivity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {productivityMetrics.length > 0 ? (
          productivityMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    metric.color === 'green' ? 'bg-green-100' :
                    metric.color === 'blue' ? 'bg-blue-100' :
                    metric.color === 'purple' ? 'bg-purple-100' :
                    metric.color === 'orange' ? 'bg-orange-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      metric.color === 'green' ? 'text-green-600' :
                      metric.color === 'blue' ? 'text-blue-600' :
                      metric.color === 'purple' ? 'text-purple-600' :
                      metric.color === 'orange' ? 'text-orange-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {metric.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
                <p className="text-gray-600 text-sm">{metric.title}</p>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No productivity metrics available yet.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Performance Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Weekly Performance</h2>
          <div className="space-y-4">
            {weeklyData.map((data, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium text-gray-600">{data.day}</div>
                <div className="flex-1 flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Tasks: {data.tasks}</span>
                      <span>{data.efficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${data.efficiency}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 w-16">{data.hours}h</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Time Distribution</h2>
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{category.name}</span>
                  <span className="text-sm text-gray-600">{category.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${category.color}`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">AI-Powered Insights</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  insight.impact === 'High' ? 'bg-red-100 text-red-700' :
                  insight.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {insight.impact}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
              <p className="text-sm text-blue-700 font-medium">{insight.suggestion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Trends */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-gray-900">Productivity Trend</h3>
          </div>
          <div className="text-2xl font-bold text-green-600 mb-1">+15%</div>
          <p className="text-sm text-gray-600">vs last month</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Goals Achievement</h3>
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-1">8/10</div>
          <p className="text-sm text-gray-600">goals completed this month</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Consistency Score</h3>
          </div>
          <div className="text-2xl font-bold text-purple-600 mb-1">94%</div>
          <p className="text-sm text-gray-600">daily activity rate</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModule;


import React from 'react';
import { CheckSquare, Calendar, DollarSign, TrendingUp, Clock, Target, Plus } from 'lucide-react';

const DashboardOverview = () => {
  const stats = [
    {
      title: 'Tasks Completed',
      value: '24',
      change: '+12%',
      icon: CheckSquare,
      color: 'from-green-400 to-green-600',
      bgColor: 'from-green-50 to-green-100',
    },
    {
      title: 'Monthly Budget',
      value: '$2,450',
      change: '-8%',
      icon: DollarSign,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
    },
    {
      title: 'Meetings Today',
      value: '6',
      change: '+2',
      icon: Calendar,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
    },
    {
      title: 'Productivity Score',
      value: '87%',
      change: '+5%',
      icon: TrendingUp,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
    },
  ];

  const recentTasks = [
    { id: 1, title: 'Complete project proposal', status: 'completed', priority: 'high' },
    { id: 2, title: 'Review financial reports', status: 'in-progress', priority: 'medium' },
    { id: 3, title: 'Team standup meeting', status: 'pending', priority: 'low' },
    { id: 4, title: 'Update personal budget', status: 'pending', priority: 'high' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Client Meeting', time: '10:00 AM', date: 'Today' },
    { id: 2, title: 'Project Review', time: '2:30 PM', date: 'Today' },
    { id: 3, title: 'Team Planning', time: '9:00 AM', date: 'Tomorrow' },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Good morning! 👋
        </h1>
        <p className="text-gray-600">Here's your productivity overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                </div>
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tasks */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    task.status === 'completed' ? 'bg-green-500' :
                    task.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                  }`} />
                  <span className="text-gray-900 font-medium">{task.title}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.priority === 'high' ? 'bg-red-100 text-red-700' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Schedule</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View calendar
            </button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.time} • {event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-colors">
            <Plus className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-700">Add Task</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-colors">
            <Calendar className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-700">Schedule Event</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-colors">
            <DollarSign className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-700">Log Expense</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-colors">
            <Target className="w-8 h-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-700">Set Goal</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

import React, { useState, useEffect } from 'react';
import { CheckSquare, Calendar, DollarSign, TrendingUp, Clock, Target, Plus, X } from 'lucide-react';
import { getTasks, getSchedules, getFinances, getAnalytics, createTask, createScheduleEvent, createGoal } from '../lib/api';

const DashboardOverview = () => {
  const [tasks, setTasks] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [finances, setFinances] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuickTaskModal, setShowQuickTaskModal] = useState(false);
  const [showQuickScheduleModal, setShowQuickScheduleModal] = useState(false);
  const [showQuickGoalModal, setShowQuickGoalModal] = useState(false);
  const [quickTask, setQuickTask] = useState({
    title: '',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0]
  });
  const [quickSchedule, setQuickSchedule] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: '60',
    location: ''
  });
  const [quickGoal, setQuickGoal] = useState({
    title: '',
    category: 'Personal',
    targetValue: '',
    deadline: ''
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [tasksData, schedulesData, financesData, analyticsData] = await Promise.all([
          getTasks(),
          getSchedules(),
          getFinances(),
          getAnalytics()
        ]);
        
        setTasks(tasksData);
        setSchedules(schedulesData);
        setFinances(financesData);
        setAnalytics(analyticsData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Quick action handlers
  const handleQuickAddTask = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        title: quickTask.title,
        description: '',
        status: 'pending',
        priority: quickTask.priority,
        dueDate: new Date(quickTask.dueDate).toISOString(),
        category: 'Work'
      };
      
      await createTask(taskData);
      
      // Refresh tasks
      const updatedTasks = await getTasks();
      setTasks(updatedTasks);
      
      // Reset form and close modal
      setQuickTask({
        title: '',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0]
      });
      setShowQuickTaskModal(false);
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleQuickAddSchedule = async (e) => {
    e.preventDefault();
    try {
      const startDateTime = new Date(`${quickSchedule.date}T${quickSchedule.time}`);
      const endDateTime = new Date(startDateTime.getTime() + (parseInt(quickSchedule.duration) * 60000));
      
      const scheduleData = {
        title: quickSchedule.title,
        description: '',
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        location: quickSchedule.location,
        category: 'Event'
      };
      
      await createScheduleEvent(scheduleData);
      
      // Refresh schedules
      const updatedSchedules = await getSchedules();
      setSchedules(updatedSchedules);
      
      // Reset form and close modal
      setQuickSchedule({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        duration: '60',
        location: ''
      });
      setShowQuickScheduleModal(false);
    } catch (err) {
      setError('Failed to create event');
    }
  };

  const handleQuickAddGoal = async (e) => {
    e.preventDefault();
    try {
      const goalData = {
        title: quickGoal.title,
        description: '',
        targetValue: parseFloat(quickGoal.targetValue) || 100,
        currentValue: 0,
        category: quickGoal.category,
        deadline: quickGoal.deadline ? new Date(quickGoal.deadline).toISOString() : undefined
      };
      
      await createGoal(goalData);
      
      // Reset form and close modal
      setQuickGoal({
        title: '',
        category: 'Personal',
        targetValue: '',
        deadline: ''
      });
      setShowQuickGoalModal(false);
    } catch (err) {
      setError('Failed to create goal');
    }
  };

  const handleQuickActions = (action) => {
    switch (action) {
      case 'task':
        setShowQuickTaskModal(true);
        break;
      case 'schedule':
        setShowQuickScheduleModal(true);
        break;
      case 'expense':
        // Navigate to finance module
        window.location.hash = '#/dashboard?module=finance';
        break;
      case 'goal':
        setShowQuickGoalModal(true);
        break;
      default:
        break;
    }
  };

  // Calculate dynamic stats from real data
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const todayEvents = schedules.filter(event => {
    const eventDate = new Date(event.startTime);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  }).length;

  const stats = [
    {
      title: 'Tasks Completed',
      value: completedTasks.toString(),
      change: totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}%` : '0%',
      icon: CheckSquare,
      color: 'from-green-400 to-green-600',
      bgColor: 'from-green-50 to-green-100',
    },
    {
      title: 'Monthly Budget',
      value: finances && finances.length > 0 && finances[0].budgets ? 
        `$${finances[0].budgets.reduce((total, budget) => total + budget.budget, 0).toLocaleString()}` : 
        '$0',
      change: finances && finances.length > 0 && finances[0].budgets ? 
        `$${finances[0].budgets.reduce((total, budget) => total + budget.spent, 0).toLocaleString()} spent` : 
        'No data',
      icon: DollarSign,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
    },
    {
      title: 'Events Today',
      value: todayEvents.toString(),
      change: schedules.length > 0 ? `${schedules.length} total` : 'No events',
      icon: Calendar,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
    },
    {
      title: 'Productivity Score',
      value: analytics ? `${analytics.productivityScore || 0}%` : '0%',
      change: analytics ? `${analytics.tasksCompleted || 0} completed` : 'No data',
      icon: TrendingUp,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
    },
  ];

  // Get recent tasks (last 4)
  const recentTasks = tasks.slice(0, 4).map(task => ({
    id: task._id || task.id,
    title: task.title,
    status: task.status,
    priority: task.priority
  }));

  // Get upcoming events (next 3)
  const upcomingEvents = schedules
    .filter(event => new Date(event.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3)
    .map(event => ({
      id: event._id || event.id,
      title: event.title,
      time: new Date(event.startTime).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }),
      date: new Date(event.startTime).toDateString() === new Date().toDateString() ? 
        'Today' : 
        new Date(event.startTime).toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
    }));

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
                  stat.change.startsWith('+') ? 'text-green-600' : 
                  stat.change.includes('%') && !stat.change.startsWith('+') && !stat.change.startsWith('-') ? 'text-blue-600' :
                  'text-gray-600'
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
          <button 
            onClick={() => handleQuickActions('task')}
            className="flex flex-col items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-colors"
          >
            <Plus className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-700">Add Task</span>
          </button>
          <button 
            onClick={() => handleQuickActions('schedule')}
            className="flex flex-col items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-colors"
          >
            <Calendar className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-700">Schedule Event</span>
          </button>
          <button 
            onClick={() => handleQuickActions('expense')}
            className="flex flex-col items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-colors"
          >
            <DollarSign className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-700">Log Expense</span>
          </button>
          <button 
            onClick={() => handleQuickActions('goal')}
            className="flex flex-col items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-colors"
          >
            <Target className="w-8 h-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-700">Set Goal</span>
          </button>
        </div>
      </div>

      {/* Quick Add Task Modal */}
      {showQuickTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Quick Add Task</h2>
              <button
                onClick={() => setShowQuickTaskModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleQuickAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={quickTask.title}
                  onChange={(e) => setQuickTask({...quickTask, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What needs to be done?"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={quickTask.priority}
                    onChange={(e) => setQuickTask({...quickTask, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={quickTask.dueDate}
                    onChange={(e) => setQuickTask({...quickTask, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowQuickTaskModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Schedule Modal */}
      {showQuickScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Quick Add Event</h2>
              <button
                onClick={() => setShowQuickScheduleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleQuickAddSchedule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={quickSchedule.title}
                  onChange={(e) => setQuickSchedule({...quickSchedule, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Event title"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={quickSchedule.date}
                    onChange={(e) => setQuickSchedule({...quickSchedule, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={quickSchedule.time}
                    onChange={(e) => setQuickSchedule({...quickSchedule, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <select
                    value={quickSchedule.duration}
                    onChange={(e) => setQuickSchedule({...quickSchedule, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="30">30 min</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={quickSchedule.location}
                    onChange={(e) => setQuickSchedule({...quickSchedule, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowQuickScheduleModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Goal Modal */}
      {showQuickGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Quick Add Goal</h2>
              <button
                onClick={() => setShowQuickGoalModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleQuickAddGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  required
                  value={quickGoal.title}
                  onChange={(e) => setQuickGoal({...quickGoal, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What do you want to achieve?"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={quickGoal.category}
                    onChange={(e) => setQuickGoal({...quickGoal, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Value
                  </label>
                  <input
                    type="number"
                    value={quickGoal.targetValue}
                    onChange={(e) => setQuickGoal({...quickGoal, targetValue: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 1000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  value={quickGoal.deadline}
                  onChange={(e) => setQuickGoal({...quickGoal, deadline: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowQuickGoalModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Goal Modal */}
      {showQuickGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Set New Goal</h2>
              <button
                onClick={() => setShowQuickGoalModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleQuickAddGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  required
                  value={quickGoal.title}
                  onChange={(e) => setQuickGoal({...quickGoal, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What do you want to achieve?"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={quickGoal.category}
                    onChange={(e) => setQuickGoal({...quickGoal, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Health">Health</option>
                    <option value="Career">Career</option>
                    <option value="Financial">Financial</option>
                    <option value="Learning">Learning</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Value
                  </label>
                  <input
                    type="number"
                    value={quickGoal.targetValue}
                    onChange={(e) => setQuickGoal({...quickGoal, targetValue: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline (Optional)
                </label>
                <input
                  type="date"
                  value={quickGoal.deadline}
                  onChange={(e) => setQuickGoal({...quickGoal, deadline: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowQuickGoalModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Set Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;

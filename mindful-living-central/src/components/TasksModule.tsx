import React, { useState } from 'react';
import { Plus, Filter, Calendar, Flag, Clock, CheckSquare } from 'lucide-react';

const TasksModule = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Complete project proposal',
      description: 'Draft and finalize the Q2 project proposal for client review',
      status: 'completed',
      priority: 'high',
      dueDate: '2024-01-15',
      category: 'work'
    },
    {
      id: 2,
      title: 'Review financial reports',
      description: 'Analyze monthly expenses and update budget planning',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2024-01-20',
      category: 'finance'
    },
    {
      id: 3,
      title: 'Plan weekend trip',
      description: 'Research destinations and book accommodations',
      status: 'pending',
      priority: 'low',
      dueDate: '2024-01-25',
      category: 'personal'
    },
    {
      id: 4,
      title: 'Update portfolio website',
      description: 'Add recent projects and improve responsive design',
      status: 'pending',
      priority: 'high',
      dueDate: '2024-01-18',
      category: 'work'
    }
  ]);

  const [filter, setFilter] = useState('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-6">
          {['all', 'pending', 'in-progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <div key={task.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {task.status.replace('-', ' ')}
                </span>
              </div>
              <Flag className={`w-5 h-5 ${task.priority === 'high' ? 'text-red-500' : 'text-gray-300'}`} />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{task.dueDate}</span>
              </div>
              <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                {task.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Task Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {tasks.filter(t => t.status === 'pending').length}
              </p>
              <p className="text-gray-600">Pending Tasks</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {tasks.filter(t => t.status === 'in-progress').length}
              </p>
              <p className="text-gray-600">In Progress</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckSquare className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {tasks.filter(t => t.status === 'completed').length}
              </p>
              <p className="text-gray-600">Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksModule;

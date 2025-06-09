
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const ScheduleModule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // 'day', 'week', 'month'

  const events = [
    {
      id: 1,
      title: 'Team Standup',
      time: '09:00 AM',
      duration: '30 min',
      location: 'Conference Room A',
      attendees: 5,
      color: 'bg-blue-500',
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Project Review',
      time: '11:00 AM',
      duration: '1 hour',
      location: 'Online',
      attendees: 3,
      color: 'bg-green-500',
      type: 'review'
    },
    {
      id: 3,
      title: 'Lunch with Client',
      time: '12:30 PM',
      duration: '1.5 hours',
      location: 'Restaurant',
      attendees: 2,
      color: 'bg-purple-500',
      type: 'meal'
    },
    {
      id: 4,
      title: 'Design Workshop',
      time: '03:00 PM',
      duration: '2 hours',
      location: 'Design Studio',
      attendees: 8,
      color: 'bg-orange-500',
      type: 'workshop'
    },
    {
      id: 5,
      title: 'Gym Session',
      time: '06:00 PM',
      duration: '1 hour',
      location: 'Fitness Center',
      attendees: 1,
      color: 'bg-red-500',
      type: 'personal'
    }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Morning Yoga', time: '07:00 AM', date: 'Tomorrow' },
    { id: 2, title: 'Client Presentation', time: '10:00 AM', date: 'Tomorrow' },
    { id: 3, title: 'Team Lunch', time: '01:00 PM', date: 'Friday' },
    { id: 4, title: 'Weekend Planning', time: '09:00 AM', date: 'Saturday' }
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus className="w-5 h-5" />
              <span>Add Event</span>
            </button>
          </div>
        </div>

        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-white rounded-lg">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {currentDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric',
                day: 'numeric'
              })}
            </h2>
            <button className="p-2 hover:bg-white rounded-lg">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <div className="flex bg-white rounded-lg p-1">
            {['day', 'week', 'month'].map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(viewType)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === viewType
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Calendar View */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Time Grid Header */}
            <div className="grid grid-cols-8 bg-gray-50 border-b border-gray-200">
              <div className="p-4 text-sm font-medium text-gray-600">Time</div>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="p-4 text-center">
                  <div className="text-sm font-medium text-gray-600">{day}</div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    {Math.floor(Math.random() * 28) + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Grid Body */}
            <div className="max-h-96 overflow-y-auto">
              {timeSlots.map((time, timeIndex) => (
                <div key={time} className="grid grid-cols-8 border-b border-gray-100">
                  <div className="p-4 text-sm text-gray-600 bg-gray-50 border-r border-gray-200">
                    {time}
                  </div>
                  {[...Array(7)].map((_, dayIndex) => (
                    <div key={dayIndex} className="p-2 h-16 border-r border-gray-100 relative">
                      {/* Render events for specific time slots */}
                      {timeIndex < events.length && dayIndex === 1 && (
                        <div className={`${events[timeIndex].color} text-white p-1 rounded text-xs h-full flex items-center`}>
                          <span className="truncate">{events[timeIndex].title}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Events */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Events</h3>
            <div className="space-y-3">
              {events.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${event.color}`}></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming</h3>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.time}</p>
                  </div>
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {event.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600">Events</span>
                </div>
                <span className="font-semibold text-gray-900">23</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600">Hours</span>
                </div>
                <span className="font-semibold text-gray-900">45</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-600">Meetings</span>
                </div>
                <span className="font-semibold text-gray-900">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModule;

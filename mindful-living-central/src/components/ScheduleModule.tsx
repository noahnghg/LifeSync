import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getSchedules, createScheduleEvent } from '../lib/api';

interface Event {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  category?: string;
  description?: string;
}

interface UpcomingEvent {
  _id: string;
  title: string;
  startTime: string;
  location?: string;
}

const ScheduleModule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // 'day', 'week', 'month'
  const [events, setEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: '60',
    location: '',
    description: ''
  });

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await getSchedules();
        // The API returns an array of schedule events directly
        setEvents(data || []);
        
        // Process upcoming events (events in the future)
        const upcoming = data
          ?.filter((event: Event) => new Date(event.startTime) > new Date())
          ?.sort((a: Event, b: Event) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
          ?.slice(0, 5) || [];
        
        setUpcomingEvents(upcoming);
      } catch (err) {
        setError('Failed to load schedule');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const startDateTime = new Date(`${newEvent.date}T${newEvent.time}`);
      const endDateTime = new Date(startDateTime.getTime() + (parseInt(newEvent.duration) * 60000));
      
      const eventData = {
        title: newEvent.title,
        description: newEvent.description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        location: newEvent.location,
        category: 'Event'
      };
      
      await createScheduleEvent(eventData);
      
      // Refresh events
      const updatedEvents = await getSchedules();
      setEvents(updatedEvents || []);
      
      // Update upcoming events
      const upcoming = updatedEvents
        ?.filter((event: Event) => new Date(event.startTime) > new Date())
        ?.sort((a: Event, b: Event) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        ?.slice(0, 5) || [];
      setUpcomingEvents(upcoming);
      
      // Reset form and close modal
      setNewEvent({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        duration: '60',
        location: '',
        description: ''
      });
      setShowAddEventModal(false);
    } catch (err) {
      setError('Failed to create event');
    }
  };


  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading schedule...</p>
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
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowAddEventModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
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
                      {events
                        .filter(event => {
                          const eventStart = new Date(event.startTime);
                          const eventHour = eventStart.getHours();
                          const slotHour = parseInt(time.split(':')[0]);
                          return eventHour === slotHour;
                        })
                        .slice(0, 1) // Only show one event per slot for layout
                        .map(event => (
                          <div 
                            key={event._id} 
                            className="bg-blue-500 text-white p-1 rounded text-xs h-full flex items-center"
                          >
                            <span className="truncate">{event.title}</span>
                          </div>
                        ))
                      }
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
              {events
                .filter(event => {
                  const eventDate = new Date(event.startTime);
                  const today = new Date();
                  return eventDate.toDateString() === today.toDateString();
                })
                .slice(0, 3)
                .map((event) => (
                <div key={event._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(event.startTime).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit', 
                        hour12: true 
                      })}
                      {event.location && ` • ${event.location}`}
                    </p>
                  </div>
                </div>
              ))}
              {events.filter(event => {
                const eventDate = new Date(event.startTime);
                const today = new Date();
                return eventDate.toDateString() === today.toDateString();
              }).length === 0 && (
                <p className="text-gray-500 text-center py-4">No events today</p>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming</h3>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(event.startTime).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit', 
                        hour12: true 
                      })}
                      {event.location && ` • ${event.location}`}
                    </p>
                  </div>
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {new Date(event.startTime).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-gray-500 text-center py-4">No upcoming events</p>
              )}
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
                <span className="font-semibold text-gray-900">{events.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600">Today</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {events.filter(event => {
                    const eventDate = new Date(event.startTime);
                    const today = new Date();
                    return eventDate.toDateString() === today.toDateString();
                  }).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-600">Upcoming</span>
                </div>
                <span className="font-semibold text-gray-900">{upcomingEvents.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Event</h2>
              <button
                onClick={() => setShowAddEventModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Event description (optional)"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
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
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({...newEvent, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="30">30 min</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                    <option value="180">3 hours</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
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
    </div>
  );
};

export default ScheduleModule;

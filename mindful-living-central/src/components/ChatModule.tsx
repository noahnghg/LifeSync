import React, { useState, useRef } from 'react';
import { Send, Bot, User, Loader2, Calendar, CheckSquare, Clock, Paperclip, Image, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: FileAttachment[];
  actions?: Array<{
    type: 'task' | 'schedule' | 'reminder';
    data: any;
  }>;
}

const ChatModule = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI assistant. I can help you create tasks, schedule events, and manage your productivity. You can also share files and images with me for analysis or reference. Try asking me to 'add a task to review the quarterly report' or upload a document for me to analyze.",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const processUserMessage = async (userMessage: string) => {
    // Simulate AI processing and action extraction
    const actions = [];
    
    // Simple keyword detection for demo purposes
    if (userMessage.toLowerCase().includes('task') || userMessage.toLowerCase().includes('todo')) {
      actions.push({
        type: 'task',
        data: {
          title: extractTaskFromMessage(userMessage),
          priority: 'medium',
          dueDate: extractDateFromMessage(userMessage) || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      });
    }
    
    if (userMessage.toLowerCase().includes('schedule') || userMessage.toLowerCase().includes('meeting') || userMessage.toLowerCase().includes('appointment')) {
      actions.push({
        type: 'schedule',
        data: {
          title: extractEventFromMessage(userMessage),
          date: extractDateFromMessage(userMessage) || new Date().toISOString().split('T')[0],
          time: extractTimeFromMessage(userMessage) || '09:00'
        }
      });
    }
    
    if (userMessage.toLowerCase().includes('remind') || userMessage.toLowerCase().includes('reminder')) {
      actions.push({
        type: 'reminder',
        data: {
          title: extractReminderFromMessage(userMessage),
          time: extractTimeFromMessage(userMessage) || '09:00'
        }
      });
    }

    let responseContent = "I've processed your request. ";
    
    if (actions.length > 0) {
      responseContent += "Here's what I've created for you:\n\n";
      actions.forEach(action => {
        switch (action.type) {
          case 'task':
            responseContent += `✅ Created task: "${action.data.title}"\n`;
            break;
          case 'schedule':
            responseContent += `📅 Scheduled event: "${action.data.title}" for ${action.data.date} at ${action.data.time}\n`;
            break;
          case 'reminder':
            responseContent += `⏰ Set reminder: "${action.data.title}" at ${action.data.time}\n`;
            break;
        }
      });
    } else {
      responseContent = "I understand your message, but I couldn't identify any specific tasks or events to create. Try being more specific, like 'Create a task to finish the project report by Friday' or 'Schedule a team meeting for tomorrow at 3 PM'.";
    }

    return {
      content: responseContent,
      actions
    };
  };

  const extractTaskFromMessage = (message: string): string => {
    const taskPatterns = [
      /(?:add|create|make)\s+(?:a\s+)?task\s+(?:to\s+)?(.+?)(?:\s+by|\s+due|\s+for|$)/i,
      /(?:task|todo):\s*(.+?)(?:\s+by|\s+due|\s+for|$)/i,
      /(?:need to|have to|should)\s+(.+?)(?:\s+by|\s+due|\s+for|$)/i
    ];
    
    for (const pattern of taskPatterns) {
      const match = message.match(pattern);
      if (match) return match[1].trim();
    }
    
    return message.replace(/(?:add|create|make)\s+(?:a\s+)?task\s+(?:to\s+)?/i, '').trim();
  };

  const extractEventFromMessage = (message: string): string => {
    const eventPatterns = [
      /(?:schedule|book|set up)\s+(?:a\s+)?(?:meeting|appointment|event)\s+(?:with\s+)?(.+?)(?:\s+for|\s+on|\s+at|$)/i,
      /(?:meeting|appointment|event):\s*(.+?)(?:\s+for|\s+on|\s+at|$)/i
    ];
    
    for (const pattern of eventPatterns) {
      const match = message.match(pattern);
      if (match) return match[1].trim();
    }
    
    return message.replace(/(?:schedule|book|set up)\s+(?:a\s+)?/i, '').trim();
  };

  const extractReminderFromMessage = (message: string): string => {
    const reminderPatterns = [
      /(?:remind me to|reminder to|reminder:)\s*(.+?)(?:\s+at|\s+in|$)/i,
      /(?:set a reminder)\s+(?:to\s+)?(.+?)(?:\s+at|\s+in|$)/i
    ];
    
    for (const pattern of reminderPatterns) {
      const match = message.match(pattern);
      if (match) return match[1].trim();
    }
    
    return message.replace(/(?:remind me to|reminder to|set a reminder)\s+(?:to\s+)?/i, '').trim();
  };

  const extractDateFromMessage = (message: string): string | null => {
    const datePatterns = [
      /(?:on\s+)?(\d{4}-\d{2}-\d{2})/,
      /(?:on\s+)?(today|tomorrow|yesterday)/i,
      /(?:on\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
      /(?:on\s+)?(\d{1,2}\/\d{1,2}\/\d{4})/
    ];
    
    for (const pattern of datePatterns) {
      const match = message.match(pattern);
      if (match) {
        const dateStr = match[1].toLowerCase();
        if (dateStr === 'today') return new Date().toISOString().split('T')[0];
        if (dateStr === 'tomorrow') return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        return match[1];
      }
    }
    
    return null;
  };

  const extractTimeFromMessage = (message: string): string | null => {
    const timePatterns = [
      /(?:at\s+)?(\d{1,2}):(\d{2})\s*(am|pm)?/i,
      /(?:at\s+)?(\d{1,2})\s*(am|pm)/i
    ];
    
    for (const pattern of timePatterns) {
      const match = message.match(pattern);
      if (match) {
        let hour = parseInt(match[1]);
        const minute = match[2] || '00';
        const ampm = match[3] || match[2];
        
        if (ampm && ampm.toLowerCase() === 'pm' && hour !== 12) hour += 12;
        if (ampm && ampm.toLowerCase() === 'am' && hour === 12) hour = 0;
        
        return `${hour.toString().padStart(2, '0')}:${minute}`;
      }
    }
    
    return null;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      // Create a preview URL for the file
      const url = URL.createObjectURL(file);
      
      const attachment: FileAttachment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: url
      };
      
      setAttachments(prev => [...prev, attachment]);
    });
    
    // Reset the input
    if (event.target) {
      event.target.value = '';
    }
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments(prev => {
      const attachment = prev.find(a => a.id === attachmentId);
      if (attachment) {
        URL.revokeObjectURL(attachment.url);
      }
      return prev.filter(a => a.id !== attachmentId);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSendMessage = async () => {
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim() || (attachments.length > 0 ? 'Shared files' : ''),
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let responseContent = '';
      
      if (userMessage.attachments && userMessage.attachments.length > 0) {
        responseContent = `I've received ${userMessage.attachments.length} file(s). `;
        userMessage.attachments.forEach(attachment => {
          if (attachment.type.startsWith('image/')) {
            responseContent += `I can see the image "${attachment.name}". `;
          } else {
            responseContent += `I've noted the file "${attachment.name}". `;
          }
        });
        responseContent += 'How would you like me to help you with these files? ';
      }
      
      if (userMessage.content && userMessage.content !== 'Shared files') {
        const response = await processUserMessage(userMessage.content);
        responseContent += response.content;
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseContent,
          timestamp: new Date(),
          actions: response.actions,
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Show toast for successful actions
        if (response.actions.length > 0) {
          toast({
            title: "Actions Processed",
            description: `Successfully processed ${response.actions.length} action(s) from your message.`,
          });
        }
      } else {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseContent,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
            <p className="text-gray-600">Chat, share files, and boost your productivity</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`p-3 rounded-full shadow-sm ${message.role === 'user' ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-white border border-gray-200'}`}>
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div className={`rounded-2xl px-6 py-4 shadow-sm ${message.role === 'user' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'bg-white text-gray-900 border border-gray-100'}`}>
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {message.attachments.map((attachment) => (
                      <div key={attachment.id} className={`flex items-center space-x-3 p-3 rounded-lg ${message.role === 'user' ? 'bg-white/10' : 'bg-gray-50'}`}>
                        {attachment.type.startsWith('image/') ? (
                          <div className="flex items-center space-x-3">
                            <img src={attachment.url} alt={attachment.name} className="w-16 h-16 object-cover rounded-lg" />
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${message.role === 'user' ? 'text-white' : 'text-gray-900'}`}>{attachment.name}</p>
                              <p className={`text-xs ${message.role === 'user' ? 'text-white/70' : 'text-gray-500'}`}>{formatFileSize(attachment.size)}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${message.role === 'user' ? 'bg-white/20' : 'bg-gray-100'}`}>
                              <Paperclip className={`w-4 h-4 ${message.role === 'user' ? 'text-white' : 'text-gray-600'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${message.role === 'user' ? 'text-white' : 'text-gray-900'}`}>{attachment.name}</p>
                              <p className={`text-xs ${message.role === 'user' ? 'text-white/70' : 'text-gray-500'}`}>{formatFileSize(attachment.size)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                {message.actions && message.actions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {message.actions.map((action, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm bg-white/10 px-3 py-2 rounded-lg">
                        {action.type === 'task' && <CheckSquare className="w-4 h-4" />}
                        {action.type === 'schedule' && <Calendar className="w-4 h-4" />}
                        {action.type === 'reminder' && <Clock className="w-4 h-4" />}
                        <span className="capitalize font-medium">{action.type} created</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className={`text-xs mt-3 ${message.role === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="p-3 rounded-full bg-white border border-gray-200 shadow-sm">
                <Bot className="w-5 h-5 text-gray-600" />
              </div>
              <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                  <span className="text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-6 py-4 bg-white border-t border-gray-100">
          <div className="flex flex-wrap gap-3">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                {attachment.type.startsWith('image/') ? (
                  <img src={attachment.url} alt={attachment.name} className="w-12 h-12 object-cover rounded-lg" />
                ) : (
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Paperclip className="w-4 h-4 text-gray-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(attachment.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input */}
      <div className="bg-white border-t border-gray-200 p-6">
        <div className="flex items-end space-x-4">
          <div className="flex space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'file')}
              accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
            />
            <input
              ref={imageInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'image')}
              accept="image/*"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="h-12 w-12 p-0"
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => imageInputRef.current?.click()}
              disabled={isLoading}
              className="h-12 w-12 p-0"
            >
              <Image className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything, create tasks, or share files..."
              className="min-h-[48px] max-h-32 resize-none border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
          <Button 
            onClick={handleSendMessage} 
            disabled={(!input.trim() && attachments.length === 0) || isLoading}
            className="h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <div className="mt-3 text-xs text-gray-500 text-center">
          Try: "Create a task to review the quarterly report by Friday" • Upload images or documents for analysis
        </div>
      </div>
    </div>
  );
};

export default ChatModule;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CalendarCheck } from 'lucide-react';

interface Notification {
  type: 'warning' | 'success' | 'error';
  title: string;
  message: string;
  icon: React.ReactNode;
}

const notifications: Notification[] = [
  {
    type: 'warning',
    title: 'Limited Tables for Friday',
    message: 'Only 4 tables left for Friday evening. Consider adjusting reservation availability.',
    icon: <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
  },
  {
    type: 'success',
    title: 'Special Event Next Week',
    message: 'Wine tasting event scheduled for next Thursday. 25 attendees confirmed.',
    icon: <CalendarCheck className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
  },
  {
    type: 'error',
    title: 'Staff Meeting Reminder',
    message: 'Monthly staff meeting tomorrow at 2:00 PM. Please prepare menu suggestions.',
    icon: <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
  }
];

const Notifications = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Important Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <div 
              key={index} 
              className={`flex items-start ${
                index < notifications.length - 1 ? 'pb-4 border-b' : ''
              }`}
            >
              {notification.icon}
              <div>
                <h4 className="font-medium">{notification.title}</h4>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Notifications;

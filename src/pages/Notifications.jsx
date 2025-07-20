import { useState } from "react";
import { Bell, Check, Settings } from "lucide-react";
import { NotificationCard } from "../components/NotificationCard";
import Navbar from "../components/Navbar";

const avatar1 = "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face";
const avatar2 = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
const avatar3 = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face";
const avatar4 = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";

const initialNotifications = [
  {
    id: "1",
    type: "friend_request",
    user: {
      name: "Sarah Johnson",
      avatar: avatar1,
      username: "sarah.j"
    },
    timestamp: "2 minutes ago",
    isRead: false
  },
  {
    id: "2",
    type: "like",
    user: {
      name: "Alex Chen",
      avatar: avatar2,
      username: "alex.chen"
    },
    content: "Beautiful sunset at the beach! 🌅",
    timestamp: "1 hour ago",
    isRead: false
  },
  {
    id: "3",
    type: "like",
    user: {
      name: "Maya Patel",
      avatar: avatar3,
      username: "maya.p"
    },
    content: "Just finished my morning workout!",
    timestamp: "3 hours ago",
    isRead: true
  },
  {
    id: "4",
    type: "friend_request",
    user: {
      name: "David Wilson",
      avatar: avatar4,
      username: "david.w"
    },
    timestamp: "1 day ago",
    isRead: true
  },
  {
    id: "5",
    type: "like",
    user: {
      name: "Sarah Johnson",
      avatar: avatar1,
      username: "sarah.j"
    },
    content: "Coffee and coding session ☕",
    timestamp: "2 days ago",
    isRead: true
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    console.log("All notifications marked as read");
  };

  const handleAcceptFriend = (id) => {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      console.log(`Friend request accepted: ${notification.user.name}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleDeclineFriend = (id) => {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      console.log(`Friend request declined: ${notification.user.name}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  return (

    <div className="min-h-screen w-full overflow-x-hidden bg-black text-white">
        <Navbar />
      <div className="max-w-2xl mx-auto p-6 ">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-400">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm px-3 py-1.5 border border-white rounded-md flex items-center space-x-1 hover:bg-white hover:text-black transition"
              >
                <Check className="w-4 h-4" />
                <span>Mark all read</span>
              </button>
            )}
            
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications yet</h3>
              <p className="text-gray-500">
                When you get notifications, they'll show up here.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onAcceptFriend={handleAcceptFriend}
                onDeclineFriend={handleDeclineFriend}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              You're all caught up! 🎉
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

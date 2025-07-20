import { Heart, UserPlus, Clock ,Trash} from "lucide-react";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function NotificationCard({ 
  notification, 
  onMarkAsRead, 
  onAcceptFriend, 
  onDeclineFriend 
}) {
  const handleCardClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  const renderNotificationContent = () => {
    switch (notification.type) {
      case "like":
        return (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-900/20 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-400" fill="currentColor" />
            </div>
            <div className="flex space-x-4 min-w-0">
              <p className="text-sm">
                <span className="font-semibold text-white">
                  {notification.user.name}
                </span>
                <span className="text-gray-400"> liked your post</span>
                {notification.content && (
                  <span className="text-gray-400">: "{notification.content}"</span>
                )}
              </p>
              <button>
                <Trash className="w-4 h-4 text-gray-400 hover:text-red-500" />
              </button>
            </div>
          </div>
        );
      
      case "friend_request":
        return (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-900/20 rounded-full flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-semibold text-white">
                  {notification.user.name}
                </span>
                <span className="text-gray-400"> sent you a friend request</span>
              </p>
              <div className="flex space-x-2 mt-3">
                <button 
                  className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAcceptFriend?.(notification.id);
                  }}
                >
                  Accept
                </button>
                <button 
                  className="text-sm px-3 py-1 border border-gray-500 text-gray-300 rounded hover:bg-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeclineFriend?.(notification.id);
                  }}
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card
      className={`p-4 cursor-pointer dark:bg-none transition-all duration-200 border rounded-md ${
        !notification.isRead
          ? 'bg-gray-800 border-l-4 border-blue-500'
          : 'bg-gray-900 border-gray-700'
      } hover:bg-gray-800`}
      onClick={handleCardClick}
    >
      <div className="flex items-start space-x-3">
        <Avatar className="w-12 h-12 flex-shrink-0">
          <AvatarImage 
            src={notification.user.avatar} 
            alt={notification.user.name}
          />
          <AvatarFallback>
            {notification.user.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {renderNotificationContent()}
          
          <div className="flex items-center mt-2 text-xs text-gray-300">
            <Clock className="w-3 h-3 mr-1" />
            {notification.timestamp}
          </div>
        </div>

        {!notification.isRead && (
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
        )}
      </div>
    </Card>
  );
}

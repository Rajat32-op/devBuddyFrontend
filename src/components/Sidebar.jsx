import { Heart, MessageCircle, User, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { div } from "framer-motion/client";
import { useUser } from "../providers/getUser.jsx"; // Assuming this is the correct path to your user provider

const Sidebar = () => {
  const navigate = useNavigate();
  const {user,loading} = useUser(); 
  
  const activeFriends = [
    { name: "Alice Cooper", status: "online" },
    { name: "Bob Smith", status: "online" },
    { name: "Carol Johnson", status: "away" },
  ];
  if(loading){
    return(
      <div className="flex justify-center h-full gap-2 min-h-[200px]">
        <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></span>
        <span className="text-lg text-black">Loading...</span>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* User Profile */}
      <Card>
        <CardContent className="pt-6">
          
            
            <div className="flex items-center w-full justify-center">
              {user===null?(
                <button onClick={()=>{navigate('/login')}} className="bg-blue-600 text-xl w-[75%] text-white">Log In</button>
              ):(
                <button onClick={()=>{navigate('/profile')}} className="flex w-full items-center justify-start   space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
                <div  className="flex flex-col items-center justify-center">
                <h3 className="text-2xl">{user.name}</h3>
                <p>{"@"+user.username}</p>
                </div>
              </button>
              )}
              </div>
        </CardContent>
      </Card>

      {/* Navigation Menu */}
      <Card className="bg-blue-500">
        <CardHeader>
          <h3 className="font-semibold">Menu</h3>
        </CardHeader>
        <CardContent>
          <nav className="space-y-2 text-md">
            <button onClick={()=>{navigate('/profile')}}  className="w-full flex items-center gap-2">
              <User className="mr-2 h-5 w-5" />
              Profile
            </button>
            <button  className="w-full flex items-center gap-2">
              <Users className="mr-2 h-5 w-5" />
              Friends
            </button>
            <button onClick={()=>{navigate('/chat')}} className="w-full flex items-center gap-2">
              <MessageCircle className="mr-2 h-5 w-5" />
              Messages
            </button>
            <button onClick={()=>{navigate('/notifications')}} className="w-full flex items-center gap-2">
              <Heart className="mr-2 h-5 w-5" />
              Notifications
            </button>
          </nav>
        </CardContent>
      </Card>

      {/* Active Friends */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold">Active Now</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeFriends.map((friend) => (
              <div key={friend.name} className="flex items-center space-x-2">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {friend.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`
                      absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background
                      ${friend.status === "online" ? "bg-green-500" : "bg-yellow-500"}
                    `}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{friend.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {friend.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;

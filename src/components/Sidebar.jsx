import { Heart, MessageCircle, User, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const activeFriends = [
    { name: "Alice Cooper", status: "online" },
    { name: "Bob Smith", status: "online" },
    { name: "Carol Johnson", status: "away" },
  ];
  const navigate=useNavigate()

  return (
    <div className="space-y-6">
      {/* User Profile */}
      <Card>
        <CardContent className="pt-6">
          <button onClick={()=>{navigate('/profile')}} className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">John Developer</h3>
              <p className="text-sm text-muted-foreground">@johndev</p>
            </div>
          </button>
        </CardContent>
      </Card>

      {/* Navigation Menu */}
      <Card className="bg-blue-500">
        <CardHeader>
          <h3 className="font-semibold">Menu</h3>
        </CardHeader>
        <CardContent>
          <nav className="space-y-2 text-md">
            <button  className="w-full flex items-center gap-2">
              <User className="mr-2 h-5 w-5" />
              Profile
            </button>
            <button  className="w-full flex items-center gap-2">
              <Users className="mr-2 h-5 w-5" />
              Connections
            </button>
            <button  className="w-full flex items-center gap-2">
              <MessageCircle className="mr-2 h-5 w-5" />
              Messages
            </button>
            <button className="w-full flex items-center gap-2">
              <Heart className="mr-2 h-5 w-5" />
              Liked Posts
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

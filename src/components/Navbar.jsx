import { Heart, MessageCircle, User, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate=useNavigate()
  return (
    <nav className="border-b bg-zinc-900 text-white sticky z-50 backdrop-blur">
      <div className="mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Sidebar Button & Logo */}
          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <button className="lg:hidden p-2 rounded hover:bg-zinc-800">
                  <Users className="h-5 w-5 text-white" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-zinc-900 text-white w-72">
                <Sidebar />
              </SheetContent>
            </Sheet>

            <button onClick={()=>{navigate('/')}} className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Intellecta
            </button>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <input
              type="text"
              placeholder="Search developers, posts, or tags..."
              className="w-full px-4 py-2 border border-zinc-700 rounded-full bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded hover:bg-zinc-800">
              <Heart className="h-5 w-5 text-white" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            <button onClick={()=>{navigate('/chat')}} className="relative p-2 rounded hover:bg-zinc-800">
              <MessageCircle className="h-5 w-5 text-white" />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </button>

            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>
                <button onClick={()=>{navigate('/profile')}}>
                  <User className="h-4 w-4 text-white" />
                </button>
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

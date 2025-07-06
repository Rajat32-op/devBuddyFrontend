import { useState ,useEffect} from "react";
import {
  Search,
  MessageCircle,
  Trash2,
  Plus,
  ArrowLeft,
  Send,
  MoreVertical
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../components/ui/command";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
import Navbar from "../components/Navbar";

const Chat = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showChatList, setShowChatList] = useState(true);
  
  const [chats, setChats] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      username: "alicecodes",
      avatar: "/placeholder.svg",
      lastMessage: "That React hook looks great! 🚀",
      timestamp: "2 min ago",
      unreadCount: 2,
      isOnline: true
    },
    {
      id: 2,
      name: "Bob Smith",
      username: "bobdev",
      avatar: "/placeholder.svg",
      lastMessage: "Thanks for the code review",
      timestamp: "1 hour ago",
      unreadCount: 0,
      isOnline: false
    }
  ]);

  const [searchUsers] = useState([
    { id: 6, name: "Frank Miller", username: "frankcpp", avatar: "/placeholder.svg" },
    { id: 7, name: "Grace Lee", username: "gracego", avatar: "/placeholder.svg" },
  ]);

  const [messages] = useState([
    { id: 1, senderId: 1, text: "Hey! How's the React project going?", timestamp: "10:30 AM", isOwn: false },
    { id: 2, senderId: 2, text: "Going great! Just implemented the new hook", timestamp: "10:32 AM", isOwn: true },
  ]);

  const filteredUsers = searchUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteChat = (chatId) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (selectedChat?.id === chatId) {
      setSelectedChat(null);
      setShowChatList(true);
    }
  };

  const handleStartNewChat = (user) => {
    console.log(20);
    const newChat = {
      id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      lastMessage: "Start a conversation...",
      timestamp: "now",
      unreadCount: 0,
      isOnline: true
    };
   if(!chats.find(chat => chat.id === newChat.id))setChats(prev => [newChat, ...prev]);
    setSearchOpen(false);
    setSearchQuery("");
    setSelectedChat(newChat);
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowChatList(false);
    setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unreadCount: 0 } : c));
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending:", newMessage);
      setNewMessage("");
    }
  };

  const handleBackToList = () => {
    setShowChatList(true);
    setSelectedChat(null);
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white dark overflow-x-hidden">
        <Navbar />

        <div className="h-[calc(100vh-64px)] flex">
          {/* Left */}
          <div className={`${showChatList ? 'block' : 'hidden'} lg:block w-full lg:w-80 border-r border-gray-800`}>
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">Messages</h1>
                <button onClick={() => { setSearchOpen(true); console.log(searchOpen) }} className="text-sm border px-2 py-1 rounded flex items-center gap-1">
                  <Plus className="h-4 w-4" /> New
                </button>

              </div>
            </div>

            <div className="overflow-y-auto h-[calc(100%-80px)] p-2 space-y-1">
              {chats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => handleChatSelect(chat)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${selectedChat?.id === chat.id ? 'bg-zinc-800' : 'hover:bg-zinc-900'
                    }`}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {chat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-black rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold truncate">{chat.name}</h3>
                      <span className="text-xs text-zinc-400">{chat.timestamp}</span>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-zinc-400 truncate">{chat.lastMessage}</p>
                      {chat.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="text-zinc-500 hover:text-red-500"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-zinc-900 text-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete conversation with {chat.name}?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteChat(chat.id)}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className={`${!showChatList ? 'block' : 'hidden'} lg:block flex-1 flex flex-col`}>
            {selectedChat ? (
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
                  <button onClick={handleBackToList} className="lg:hidden text-white">
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedChat.avatar} />
                    <AvatarFallback>{selectedChat.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{selectedChat.name}</h3>
                    <p className="text-sm text-zinc-400">
                      {selectedChat.isOnline ? "Active now" : "Last seen recently"}
                    </p>
                  </div>
                  <button className="text-white">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.isOwn ? "bg-blue-500 text-white" : "bg-zinc-700 text-white"
                          }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs mt-1 text-zinc-300">{message.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-zinc-800">
                  <div className="flex items-center gap-2">
                    <input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1 bg-zinc-800 text-white px-4 py-2 rounded-full outline-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-zinc-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
                  <p className="text-zinc-400">Choose or start a conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/*Search new chat */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>

        <DialogContent >

          <DialogHeader>
            <DialogTitle>Start New Chat</DialogTitle>
            <DialogDescription className="text-sm text-zinc-400 pb-3">
              Type to search for users and start a new conversation.
            </DialogDescription>
          </DialogHeader>
          <Command className="bg-zinc-800 text-white border border-zinc-700 rounded">
            <CommandInput
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value) }}
              className="bg-zinc-700 text-white"
            />
            <CommandList>
              {filteredUsers.length===0?(<CommandEmpty>No users found.</CommandEmpty>):(

                <CommandGroup>
                {filteredUsers.map((user) => (
                  <CommandItem
                  key={user.id}
                  onClick={() => handleStartNewChat(user)}
                  className="cursor-pointer"
                  >
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-zinc-400">@{user.username}</p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Chat;

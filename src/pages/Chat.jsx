import { useState, useEffect, useCallback ,useRef} from "react";
import {
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
import { useNavigate } from "react-router-dom";
import { useUser } from "../providers/getUser.jsx";
import Particles from "../components/particle-bg.jsx";
import { debounce, method } from "lodash";

const Chat = () => {

  const { user, loading ,socket} = useUser();

  if (loading) {
    return (
      <div className="flex justify-center h-full gap-2 min-h-[200px]">
        <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></span>
        <span className="text-lg text-black">Loading...</span>
      </div>
    );
  }
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showChatList, setShowChatList] = useState(true);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([])

  useEffect(()=>{
    const fetchChats=async()=>{
      const response=await fetch('http://localhost:3000/get-chats',{
        credentials:'include'
      });
      if(response.ok){
        const data=await response.json();
        setChats(data);
      }
    }
    fetchChats();
  },[])

  const handleSearch = useCallback(debounce(async (searchName) => {
    setSearchOpen(true);
    const response = await fetch(`http://localhost:3000/search?q=${searchName}`, {
      credentials: 'include'
    });
    if (response.status === 200) {
      const data = await response.json();
      setFilteredUsers(data);
    }
  }, 1000), []);

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
    else {
      setSearchOpen(false);
    }
  }, [searchQuery]);

  const handleDeleteChat = async (chatId) => {
    const response = await fetch('http://localhost:3000/delete-chat', {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: chatId })
    })
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (selectedChat?.id === chatId) {
      setSelectedChat(null);
      setShowChatList(true);
    }
  };

  const handleStartNewChat = (usr) => {
    const newChat = {
      _id: usr._id,
      name: usr.name,
      username: usr.username,
      profilePicture: usr.profilePicture,
      lastMessage: "Start a conversation...",
      isGroup: false,
      timestamp: "now",
      unreadCount: 0,
      isOnline: false
    };
    if (!chats.find(chat => chat.id === newChat.id)) setChats(prev => [newChat, ...prev]);
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
    if (!newMessage.trim()) return;

    const isGroup = selectedChat.isGroup || false;
    const currentUserId = user._id;
    const receiverId = isGroup ? null : selectedChat._id;
    selectedChat.isOnline=true;
    const roomId = isGroup
      ? selectedChat._id
      : [currentUserId, receiverId].sort().join("-");
    socket.emit("sendMessage", {
      roomId,
      senderId: currentUserId,
      receiverId,
      message: newMessage.trim(),
      isGroup
    });
    setNewMessage("");
  };


  const handleBackToList = () => {
    setShowChatList(true);
    setSelectedChat(null);
  };

  useEffect(() => {
    if (!selectedChat) return;

    const isGroup = selectedChat.isGroup || false;
    const currentUserId = user?._id;

    const roomId = isGroup
      ? selectedChat.id
      : [currentUserId, selectedChat._id].sort().join("-");

    socket.emit("joinRoom", roomId);

    // Fetch old messages (REST)
    fetch(`http://localhost:3000/get-messages?roomId=${roomId}`,{
      credentials:'include'
    })
      .then(res => res.json())
      .then(data => setMessages(data));

    // Listen for new messages
    socket.on("receiveMessage", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    // Typing indicators
    socket.on("userTyping", ({ userId }) => {
      console.log(`${userId} is typing...`);
    });

    socket.on("userStoppedTyping", ({ userId }) => {
      console.log(`${userId} stopped typing`);
    });

    // Seen updates
    socket.on("messageSeenUpdate", ({ messageId, seenBy }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === messageId ? { ...msg, seenBy } : msg
        )
      );
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
      socket.off("messageSeenUpdate");
    };
  }, [selectedChat]);

  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white dark overflow-x-hidden">
        <Navbar />

        <div className="h-[calc(100vh-64px)] flex">
          {/* Left */}
          <div className={`${showChatList ? 'block' : 'hidden'} lg:block w-full lg:w-80 border-r border-gray-800`}>
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">Messages</h1>
                <button onClick={() => { setSearchOpen(true); }} className="text-sm border px-2 py-1 rounded flex items-center gap-1">
                  <Plus className="h-4 w-4" /> New
                </button>

              </div>
            </div>

            <div className="overflow-y-auto h-[calc(100%-80px)] p-2 space-y-1">
              {chats.map(chat => (
                <div
                  key={chat._id}
                  onClick={() => handleChatSelect(chat)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${selectedChat?.id === chat.id ? 'bg-zinc-800' : 'hover:bg-zinc-900'
                    }`}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={chat.profilePicture} />
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
          <div className={`${!showChatList ? 'block' : 'hidden'} lg:block flex-1 flex flex-col bg-gradient-to-br from-[#0d0f1c] via-[#111222] to-[#090b17]`}>
            {selectedChat ? (
              <div className="flex flex-col h-full relative">
                <div className="absolute inset-0 z-0 top-1/2 -translate-y-1/2">
                  <Particles
                    particleColors={['#042d65', '#042d65']}
                    particleCount={200}
                    particleSpread={10}
                    speed={0.1}
                    particleBaseSize={100}
                    moveParticlesOnHover={true}
                    alphaParticles={false}
                    disableRotation={false}
                  />
                </div>
                <div className="p-4 border-b border-zinc-800 z-10 flex items-center gap-3">
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
                      {selectedChat.isOnline ? "Active now" : "Offline"}
                    </p>
                  </div>
                  <button className="text-white">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>

                <div ref={chatRef} className="flex-1 overflow-y-auto z-10 p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${message.senderId === user._id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.senderId === user._id ? "bg-blue-500 text-white" : "bg-zinc-700 text-white"
                          }`}
                      >
                        <p className="text-sm">{message.message}</p>
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
              <div className="flex-1 h-full flex items-center justify-center  bg-gradient-to-br from-[#0d0f1c] via-[#111222] to-[#090b17] relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-[#3b82f680] opacity-20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="text-center relative z-10">
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
              {filteredUsers.length === 0 ? (<CommandEmpty>No users found.</CommandEmpty>) : (

                <CommandGroup>
                  {filteredUsers.map((user) => (
                    <CommandItem
                      key={user._id}
                      onClick={() => handleStartNewChat(user)}
                      className="cursor-pointer"
                    >
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={user.profilePicture} />
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

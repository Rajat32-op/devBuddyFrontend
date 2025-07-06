import { useState } from "react";
import { User } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";

const Profile = () => {
  const [userProfile] = useState({
    name: "John Developer",
    username: "johndev",
    avatar: "/placeholder.svg",
    bio: "Full-stack developer passionate about React, Node.js, and clean code. Building the future one line at a time.",
    postsCount: 127,
    friendsCount: 1200,
    followersCount: 2500,
    followingCount: 850,
    joined: "Joined March 2023",
  });

  const [userPosts] = useState([
    {
      id: 1,
      user: {
        name: "John Developer",
        username: "johndev",
        avatar: "/placeholder.svg",
      },
      content: {
        type: "code",
        text: "Working on a new authentication system with JWT tokens",
        code: `const authenticateUser = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    return user;
  } catch (error) {
    throw new Error('Invalid token');
  }
};`,
        language: "javascript",
      },
      likes: 42,
      comments: 15,
      timestamp: "1 day ago",
      tags: ["JavaScript", "Authentication", "JWT"],
    },
    {
      id: 2,
      user: {
        name: "John Developer",
        username: "johndev",
        avatar: "/placeholder.svg",
      },
      content: {
        type: "image",
        text: "Beautiful sunset from my office window while debugging 🌅",
        imageUrl:
          "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=500&h=300&fit=crop",
      },
      likes: 89,
      comments: 23,
      timestamp: "3 days ago",
      tags: ["Life", "Coding", "Sunset"],
    },
    {
      id: 3,
      user: {
        name: "John Developer",
        username: "johndev",
        avatar: "/placeholder.svg",
      },
      content: {
        type: "code",
        text: "Quick utility function for array manipulation",
        code: `const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

// Usage
const grouped = groupBy(users, 'role');`,
        language: "javascript",
      },
      likes: 34,
      comments: 8,
      timestamp: "1 week ago",
      tags: ["JavaScript", "Utilities", "Arrays"],
    },
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-black dark:text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Profile Picture */}
                <Avatar className="h-32 w-32 md:h-40 md:w-40">
                  <AvatarImage src={userProfile.avatar} />
                  <AvatarFallback className="text-2xl">
                    <User className="h-16 w-16" />
                  </AvatarFallback>
                </Avatar>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                    <div className="flex gap-2 justify-center">
                      <button className="px-3 py-1 border rounded text-sm">
                        Edit Profile
                      </button>
                      <button className="px-3 py-1 border rounded text-sm">
                        Settings
                      </button>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-2">@{userProfile.username}</p>
                  <p className="mb-4 max-w-md">{userProfile.bio}</p>

                  {/* Stats */}
                  <div className="flex justify-center md:justify-start gap-6 mb-4">
                    <div className="text-center">
                      <p className="font-bold text-lg">{userProfile.postsCount}</p>
                      <p className="text-sm text-muted-foreground">Posts</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg">{userProfile.friendsCount}</p>
                      <p className="text-sm text-muted-foreground">Friends</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg">{userProfile.followersCount}</p>
                      <p className="text-sm text-muted-foreground">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg">{userProfile.followingCount}</p>
                      <p className="text-sm text-muted-foreground">Following</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{userProfile.joined}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Posts</h2>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">All</span>
                <span className="px-2 py-1 border rounded text-sm">Code</span>
                <span className="px-2 py-1 border rounded text-sm">Images</span>
              </div>
            </div>

            {/* User Posts */}
            <div className="space-y-6">
              {userPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

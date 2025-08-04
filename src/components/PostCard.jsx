import { useState } from "react";
import { Heart, MessageCircle, User, BookmarkPlus } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import CodeBlock from "./CodeBlock";
import { useUser } from "../providers/getUser";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
  function timeAgo(date) {
    const now = Date.now();
    const postTime = new Date(date).getTime(); // supports both Date and ISO string
    const diff = now - postTime;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;

    return new Date(date).toLocaleDateString(); // fallback: show actual date
  }

  const navigate = useNavigate();
  const { user } = useUser();

  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(post.likes);
  const [likeDisabled, setLikeDisabled] = useState(false);
  const [isSaved, setIsSaved] = useState(user.savedPosts.includes(post._id));
  const [saveDisabled,setSavedisbled]=useState(false);

  const handleLike = async () => {
    if (isLiked) {
      setLikeDisabled(true)
      setIsLiked(false);
      setLikes(likes - 1);
      const response = await fetch(`http://localhost:3000/unlike-post`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ postId: post._id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setLikeDisabled(false);
      if (response.status != 200) {
        navigate('/login');
      }
    }
    else {
      setLikeDisabled(true)
      setIsLiked(true);
      setLikes(likes + 1);

      const response = await fetch(`http://localhost:3000/like-post`, {
        method: 'POST',
        body: JSON.stringify({ postId: post._id }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setLikeDisabled(false);
      if (response.status != 200) {
        navigate('/login');
      }
    }
  };

  const handleComment = () => {
    if (newComment.trim()) {
      console.log("New comment:", newComment);
      setNewComment("");
    }
  };

  const handleSave = async (id) => {
    setSavedisbled(true)
    let path=""
    if(isSaved){
      path='http://localhost:3000/unsave-post'
    }
    else{
      path='http://localhost:3000/save-post'
    }
    setIsSaved(!isSaved);
    
    const response = await fetch(path, {
      credentials: 'include',
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId: id })
    });
    console.log(response.status);
    if (response.status != 200) {
      navigate('/login');
    }
    setSavedisbled(false)
  }

  const [current, setCurrent] = useState(0);
  return (
    <Card className="w-full bg-white dark:bg-gradient-to-br from-[#1a3760] via-[#4b5f7e] to-[#c9d1db] text-black dark:text-white border border-zinc-300 dark:border-zinc-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div onClick={()=>{navigate(`/user?id=${post.userId}`)}} className="flex items-center space-x-3">
            <Avatar className="cursor-pointer">
              <AvatarImage src={post.profilePicture || ''} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="cursor-pointer">
              <p className="font-semibold">{post.username}</p>
              <p className="text-sm text-muted-foreground dark:text-zinc-400">
                @{post.username} • {timeAgo(post.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Post Content */}
        <div className="relative">
          <p className="mb-4 text-zinc-800 dark:text-zinc-200">{post.caption}</p>

          {post.codeSnippet.length !== 0 && (
            <div className="space-y-4">
              {post.codeSnippet.map((code, index) => {
                return (
                  <CodeBlock
                    key={index}
                    code={code}
                    language={post.language[index]}
                  />
                );
              })}
            </div>
          )}

          {post.imageUrl.length !== 0 && (
            <div className="rounded-lg overflow-hidden my-2">
              {post.imageUrl.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Image ${index + 1}`}
                  className={`w-full h-auto max-h-96 object-cover ${index === current ? "block" : "hidden"}`}
                />
              ))}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {/*Dots*/}
                {post.imageUrl.length > 1 && post.imageUrl.map((_, idx) => (
                  <button
                    key={idx}
                    className={`h-2 w-2 rounded-full ${current === idx ? "bg-white" : "bg-gray-400"} transition`}
                    onClick={() => setCurrent(idx)}
                  ></button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <div key={tag} className="text-xs dark:bg-zinc-800 dark:text-zinc-300">
              #{tag}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center space-x-4">
            <button
              disabled={likeDisabled}
              onClick={handleLike}
              className={`${isLiked ? "text-red-500" : ""}`}
            >
              <Heart className={`mr-1 h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              {likes}
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="mr-1 h-4 w-4" />
              comments
            </button>
          </div>
          <div className="">
            <button disabled={saveDisabled} onClick={()=>{handleSave(post._id)}}>
              <BookmarkPlus className={`${isSaved ? "fill-current" : ""} mr-1 h-7 w-7`}></BookmarkPlus>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="space-y-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
            {/* Sample Comments */}
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">jane_dev</span> Great code! Very clean implementation 👏
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">MS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">mike_codes</span> Thanks for sharing! This helped me solve a similar issue.
                  </p>
                </div>
              </div>
            </div>

            {/* Add Comment */}
            <div className="flex space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  <User className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex space-x-2">
                <textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[60px] text-sm dark:bg-zinc-800 dark:text-white"
                />
                <button onClick={handleComment}>
                  Post
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;

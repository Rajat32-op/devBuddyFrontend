import { useState } from "react";
import { Heart, MessageCircle, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import CodeBlock from "./CodeBlock";

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
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleComment = () => {
    if (newComment.trim()) {
      console.log("New comment:", newComment);
      setNewComment("");
    }
  };
  return (
    <Card className="w-full bg-white dark:bg-zinc-900 text-black dark:text-white border border-zinc-300 dark:border-zinc-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={post.profilePicture||''} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post.username}</p>
              <p className="text-sm text-muted-foreground dark:text-zinc-400">
                @{post.username} • {timeAgo(post.createdAt)}
              </p>
            </div>
          </div>
          <button className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
            Follow
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Post Content */}
        <div>
          <p className="mb-3 text-zinc-800 dark:text-zinc-200">{post.caption}</p>

          {post.codeSnippet !== "" && (
            <CodeBlock
              code={post.content.code}
              language={post.content.language || "javascript"}
            />
          )}

          {post.image !== "" && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={post.content.imageUrl}
                alt="Post content"
                className="w-full h-auto max-h-96 object-cover"
              />
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

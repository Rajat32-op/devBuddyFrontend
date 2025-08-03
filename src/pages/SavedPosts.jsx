import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { useUser } from "../providers/getUser"

const SavedPosts = () => {
    const { user } = useUser();
    const [savedPosts, setSavedPosts] = useState([])
    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch('http://localhost:3000/get-saved-posts', {
                credentials: 'include',
            });
            if (response.ok){
                const data=response.json();
                setSavedPosts(data);
            }
        }
        fetchPosts();
    }, [])
    return (
        <div className="space-y-6">
            {savedPosts.map(post => {
                <PostCard
                    key={post._id}
                    post={post}
                ></PostCard>
            })}
        </div>
    )
}

export default SavedPosts
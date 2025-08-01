import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { User } from 'lucide-react';
import { useUser } from '../providers/getUser.jsx';
import PostCard from '../components/PostCard';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const UserPage = () => {
    const query = useQuery();
    const userId = query.get('id');
    const navigate = useNavigate();
    if (userId === null || userId === undefined) {
        navigate('/')
    }
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);

    const [userPosts, setUserPosts] = useState([]);
    
    let isFriends=true;
    const { user } = useUser();
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true)
            const response = await fetch(`http://localhost:3000/get-user?id=${userId}`, {
                credentials: 'include'
            });
            if (response.status === 200) {
                const data = await response.json();
                setProfile(data);
                if(data.friends.includes(user._id)){
                    isFriends=true;
                }else{
                    isFriends=false;
                }
                if (user._id === data._id) {
                    navigate('/profile');
                }
                setLoading(false);
            } else {
                console.error("Failed to fetch user data");
            }
        };
        fetchUser();
    }, [userId]);
    useEffect(()=>{

        if (isFriends) {
            
            const fetchPosts = async () => {
                const response = await fetch(`http://localhost:3000/get-posts?userId=${profile._id}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (response.status === 200) {
                    const data = await response.json();
                    setUserPosts(data);
                }
            }
            fetchPosts();
        }
    },[profile]);
    if (loading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    }
    return (
        <div className='min-h-screen bg-background text-foreground dark:bg-black dark:text-white'>
            <Navbar />
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-4xl mx-auto">
                    {/* Profile Header */}
                    <Card className="mb-6 dark:bg-gradient-to-br from-[#1a3760] via-[#4b5f7e] to-[#c9d1db]">
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                {/* Profile Picture */}
                                <Avatar className="h-32 w-32 md:h-40 md:w-40">
                                    {/* <AvatarImage src={'/placeholder.svg'} /> */}
                                    <AvatarFallback className="text-2xl">
                                        {profile.profilePicture !== "" ? (
                                            <img src={profile.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                                        ) : (
                                            <User className="h-16 w-16 md:h-20 md:w-20" />
                                        )}
                                    </AvatarFallback>
                                </Avatar>

                                {/* Profile Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                        <h1 className="text-2xl font-bold">{profile.name}</h1>
                                    </div>

                                    <p className="text-muted-foreground mb-2">@{profile.username}</p>
                                    <p className="mb-4 max-w-md">{profile.bio}</p>

                                    {/* Stats */}
                                    <div className="flex justify-center md:justify-start gap-6 mb-4">
                                        <div className="text-center">
                                            <p className="font-bold text-lg">{profile.posts.length}</p>
                                            <p className="text-sm text-muted-foreground">Posts</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-lg">{profile.friends.length}</p>
                                            <p className="text-sm text-muted-foreground">Friends</p>
                                        </div>

                                    </div>

                                    <p className="text-sm text-muted-foreground">{new Date(profile.createdAt).toLocaleDateString()}</p>
                                    {isFriends ? (
                                        <button className="px-3 py-1 border rounded text-sm mt-4 bg-blue-500 text-white">
                                            Remove Friend
                                        </button>
                                    ) : (
                                        <button className="px-3 py-1 border rounded text-sm mt-4 bg-green-500 text-white">
                                            Add Friend
                                        </button>
                                    )}

                                </div>
                            </div>
                        </CardContent>
                    </Card>
            {isFriends &&
                <div className="space-y-6">
                    {userPosts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            }
                </div>
            </div>
        </div>
    )
}

export default UserPage
import { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [socket,setSocket]=useState(null)
    async function fetchUser() {
        setUser(undefined);
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3000/me", {
                method: "GET",
                credentials: "include"
            });
            if (response.status === 200) {
                let tempuser = await response.json();
                setUser(tempuser);
                setSocket( io("http://localhost:3000", {
                  withCredentials: true,
                  transports: ['websocket'],
                  reconnection:false,
                  query:{userId:tempuser._id}
                }));
            }
            else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchUser();
    }, [])
    return (
        <UserContext.Provider value={{ user, setUser,fetchUser ,loading,socket}}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => { return useContext(UserContext) };
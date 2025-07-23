import { createContext, useState, useEffect, useContext } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    async function fetchUser() {
        setUser(undefined);
        try {
            const response = await fetch("http://localhost:3000/me", {
                method: "GET",
                credentials: "include"
            });
            if (response.status === 200) {
                let tempuser = await response.json();
                setUser(tempuser);
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
        <UserContext.Provider value={{ user, setUser,fetchUser ,loading}}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => { return useContext(UserContext) };
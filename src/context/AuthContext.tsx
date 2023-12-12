import {createContext, useContext, useEffect, useState, ReactNode} from 'react';
import {IContextType, IUser} from "@/types";
import {getCurrentUser} from "@/lib/appwrite/api.ts";
import {useNavigate} from "react-router-dom";
export const INITIAL_USER = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: '',
};

// state: to know whether there is a logged in user
const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: ()=> {},
    setIsAuthenticated: ()=> {},
    checkAuthUser: async () => false as boolean
}

const AuthContext = createContext<IContextType>(INITIAL_STATE)
const AuthProvider = ({children}: {children: ReactNode}) => {

    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate()

    const checkAuthUser = async () => {
        try {
            const currentAccount = await getCurrentUser();

            if(!currentAccount) return false;

            setUser({
                id: currentAccount.$id,
                name: currentAccount.name,
                username: currentAccount.username,
                email: currentAccount.email,
                imageUrl: currentAccount.imageUrl,
                bio: currentAccount.bio,
            })

            setIsAuthenticated(true)
            return true;
        } catch(e) {
            console.log(e)
            return false
        } finally {
            setIsLoading(false);
        }
    }

    //whenever the page is reloaded: check for the logged-in user in local storage
    useEffect(() => {
        if(localStorage.getItem('cookieFallback') === '[]'
            || localStorage.getItem('cookieFallback') === null) {
            navigate('/sign-in')
        }
        checkAuthUser()
    }, [])


    const value = {
        user,
        isLoading,
        isAuthenticated,
        setUser,
        setIsAuthenticated,
        checkAuthUser
    }

    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext)
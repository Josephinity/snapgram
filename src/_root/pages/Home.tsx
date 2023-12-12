import {useUserContext} from "@/context/AuthContext.tsx";

function Home() {
    const authContext = useUserContext();

    return (
        <div>
            {authContext.isAuthenticated &&
                <div>
                    `username: ${authContext.user.email}`
                    `password: ${authContext.user.username}`
                </div>
            }
            Home

        </div>
    );
}

export default Home;
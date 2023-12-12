import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import {useUserContext} from "@/context/AuthContext.tsx";
import {sidebarLinks} from "@/constants";
import {Button} from "@/components/ui/button.tsx";
import Loader from "@/components/shared/Loader.tsx";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations.ts";

function LeftSidebar() {
    const {user} = useUserContext();
    const {pathname} = useLocation();
    const {mutateAsync: signOutAccount, isPending: isSigningOut} = useSignOutAccount()
    const navigate = useNavigate();

    async function onSignOut() {
        try {
            const isSuccess = await signOutAccount()
            if(isSuccess) {
                navigate(0)
            }
        } catch(e) {
            console.log(e)
        }
    }

    return (
        <nav className="leftsidebar">
            <Link to="/">
                <img src="/assets/images/logo.svg" alt="logo" height={36} width={170}/>
            </Link>
            <div className="flex">
                <Link to={`/profile/${user.id}`} className="flex-center">
                    <img src={user.imageUrl || '/assets/icon/profile-placeholder.svg'} className="rounded-full h-12 w-12 mr-2" />
                    <div>
                        <p className="body-bold">{user.username}</p>
                        <p className="small-regular text-light-3">@{user.username}</p>
                    </div>
                </Link>
            </div>
            <div className="flex flex-col flex-1 gap-5">
                {
                    sidebarLinks.map(
                        link => {
                            const isActive = pathname === link.route;
                            return (
                                <NavLink to={link.route}
                                         key={link.label}
                                         className={`leftsidebar-link h-12 group flex items-center ${isActive && 'bg-primary-500'}`}>
                                    <img src={link.imgURL} alt={link.label}
                                         className={`group-hover:invert-white mx-2 ${isActive && 'invert-white'}`} />
                                    <p className="small-semibold">{link.label}</p>
                                </NavLink>
                        )}
                    )
                }
            </div>
            <Button onClick={onSignOut} variant="ghost" className="justify-start px-0 group">
                <img src="/assets/icons/logout.svg" alt="github" className="px-2 w-15 h-15 group-hover:invert-white"/>
                {
                    isSigningOut ? <div className="flex-center gap-2"><Loader />Loading...</div>
                        : <div className="small-medium group-hover:text-off-white">Sign out</div>
                }
            </Button>
        </nav>
    );
}

export default LeftSidebar;
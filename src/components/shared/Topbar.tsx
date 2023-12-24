import {Link, useNavigate} from "react-router-dom";
import { Button } from "@/components/ui/button"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations.ts";
import Loader from "@/components/shared/Loader.tsx"
import {useUserContext} from "@/context/AuthContext.tsx";

function Topbar() {

    const {user}= useUserContext();
    const {mutateAsync: signOutAccount, isPending: isSigningOut} = useSignOutAccount();
    const navigate = useNavigate();
    async function onSignOut() {
        try {
            const isSuccess = await signOutAccount()
            if(isSuccess) {
                navigate(0)
            }
        } catch(e) {
            console.log(e)
        } finally {
            navigate('/sign-in')
        }
    }

    return (
        <section className="topbar">
            <div className="flex-between py-4 px-5">
                <Link to="/">
                    <img src="/assets/images/logo.svg" alt="logo" height={325} width={130}/>
                </Link>
                <div className="flex gap-2 pl-2">
                    <Link to={`/profile/${user.id}`} className="flex-center">
                        <img src={user.imageUrl || '/assets/icon/profile-placeholder.svg'} className="rounded-full" height={25} width={25}/>
                    </Link>
                    <Link to="https://github.com/Josephinity" className="flex-center">
                        <img src="/assets/icons/github-mark.svg" alt="github" height={25} width={25}/>
                    </Link>
                    <Button onClick={onSignOut} variant="ghost">
                        {isSigningOut ? <Loader />: <img src="/assets/icons/logout.svg" alt="github" className="hover:invert-white"/>}
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default Topbar;
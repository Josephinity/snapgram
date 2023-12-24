import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import {useGetUsers} from "@/lib/react-query/queriesAndMutations.ts";
import {useInView} from "react-intersection-observer";
import Loader from "@/components/shared/Loader.tsx";
import {useEffect} from "react";
import {toast} from "@/components/ui/use-toast.ts";

function People() {

    const {
        data: users,
        fetchNextPage,
        hasNextPage,
        isPending: isLoadingUsers,
        isError
    } = useGetUsers()
    const { ref, inView } = useInView();

    useEffect(() => {
            fetchNextPage()
        }, [inView]
    )

    if (isError) {
        toast({ title: "Something went wrong." });
        return;
    }

    function handleFollow(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()
    }

    return (
        <div className="common-container">
            <div className="user-container">
                <h2 className="h3-bold md:h2-bold w-full">People</h2>
                {
                    isLoadingUsers && !users
                    ? <div className="w-full flex-center text-light-3 small-regular gap-2"><Loader />Loading...</div>
                    : <ul className="user-grid">
                        {
                            users.pages.map(page => {
                                return page?.documents.map((user) =>
                                    <li key={user.$id} className="flex-1 min-w-[200px] w-full">
                                        <Link to={`/profile/${user?.$id}`} className="user-card">
                                            <img
                                                src={user?.imageUrl}
                                                alt="creator"
                                                className="rounded-full w-14 h-14"
                                            />
                                            <p className="base-medium text-light-1 text-center line-clamp-1">{user?.username}</p>
                                            <p className="small-regular text-light-3 text-center line-clamp-1">@{user?.username}</p>
                                            <Button onClick={handleFollow} className="shad-button_primary px-5">
                                                Follow
                                            </Button>
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                }
                {
                    hasNextPage ?
                    <div ref={ref} className="w-full flex-center mt-10">
                        <Loader />
                    </div>
                    : !isLoadingUsers && <p className="text-light-4 mt-10 small-regular text-center w-full">-- End --</p>
                }
            </div>
        </div>
    );
}

export default People;
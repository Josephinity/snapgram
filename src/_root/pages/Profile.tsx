import {useUserContext} from "@/context/AuthContext.tsx";
import {Link, Outlet, Route, Routes, useLocation, useParams} from "react-router-dom";
import {useGetUserById} from "@/lib/react-query/queriesAndMutations.ts";
import {Button} from "@/components/ui/button.tsx";
import Loader from "@/components/shared/Loader.tsx";
import GridPostList from "@/components/shared/GridPostList.tsx";

function Profile() {

    const { user: currentUser } = useUserContext()
    const { pathname } = useLocation();
    const { id: userId } = useParams()

    if(!userId) {
        return "Error loading userId"
    }
    const { data: user } = useGetUserById(userId)

    if(!user) {
        return <div className="flex-center w-full"><Loader /></div>
    }

    return (
        <div className="profile-container">
            <div className="profile-inner_container">
                <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 xl:gap-7">
                    <img src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                         alt="profile"
                         className="rounded-full w-28 h-28 lg:h-36 lg:w-36 "
                    />
                    <div className="flex flex-col flex-1 justify-between items-center xl:items-start mt-2">
                        <h2 className="h3-bold md:h2-bold">{ user.name || user.username }</h2>
                        <p className="body-medium text-light-3">{`@${user.username}`}</p>
                        {
                            currentUser.id === userId &&
                            <Link to={`/update-profile/${currentUser.id}`} className="mt-10 w-40 xl:hidden">
                                <div className="shad-button_dark_4 rounded-l flex-center gap-2 py-5">
                                    <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
                                    <p className="whitespace-nowrap small-medium">Edit Profile</p>
                                </div>
                            </Link>
                        }
                        <ul className="flex gap-7 body-medium pt-8">
                            <li key="post-count" className="flex items-center gap-2">
                                <p className="small-semibold lg:body-bold text-primary-500">{user.posts.length}</p>
                                <p className="small-medium lg:base-medium text-light-2">Posts</p>
                            </li>
                            <li key="followers" className="flex items-center gap-2">
                                <p className="small-semibold lg:body-bold text-primary-500">20</p>
                                <p className="small-medium lg:base-medium text-light-2">Followers</p>
                            </li>
                            <li key="following" className="flex items-center gap-2">
                                <p className="small-semibold lg:body-bold text-primary-500">20</p>
                                <p className="small-medium lg:base-medium text-light-2">Following</p>
                            </li>
                        </ul>
                        <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
                            {currentUser.bio}
                        </p>
                    </div>

                    {
                        currentUser.id === userId &&
                        <Link to={`/update-profile/${currentUser.id}`} className="hidden xl:block">
                            <div className="shad-button_dark_4 rounded-l flex-center gap-2 py-5">
                                <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
                                <p className="whitespace-nowrap small-medium">Edit Profile</p>
                            </div>
                        </Link>
                    }
                    {
                        currentUser.id !== userId &&
                        <Button type="button" className="shad-button_primary px-8">
                            Follow
                        </Button>
                    }
                </div>
            </div>

            {
                currentUser.id === userId &&
                <div className="flex justify-center xl:justify-start w-full max-w-5xl gap-3">
                    <Link to={`/profile/${userId}`}>
                        <div className={`profile-tab rounded-l-lg ${
                            pathname === `/profile/${userId}` && "!bg-dark-3"
                        }`}>
                            <img src="/assets/icons/posts.svg" alt="posts" width={20} height={20} />
                            <p className="whitespace-nowrap small-medium">Posts</p>
                        </div>
                    </Link>

                    <Link to={`/profile/${userId}/liked-posts`}>
                        <div className={`profile-tab rounded-l-lg ${
                            pathname === `/profile/${userId}/liked-posts` && "!bg-dark-3"
                        }`}>
                            <img src="/assets/icons/like.svg" alt="like" width={20} height={20} />
                            <p className="whitespace-nowrap small-medium">Liked Posts</p>
                        </div>
                    </Link>
                </div>
            }

            <Routes>
                {/*Index routes render into their parent's Outlet at their parent's URL*/}
                <Route index element={<GridPostList posts={user.posts} showUser={false} />} />
                {
                    currentUser.id === userId &&
                    <Route path="/liked-posts" element={ <GridPostList posts={user.liked} showStats={false} />} />
                }
            </Routes>
            <Outlet />
        </div>
    );
};

export default Profile;
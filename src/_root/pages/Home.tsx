import {useGetRecentPosts} from "@/lib/react-query/queriesAndMutations.ts";
import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard.tsx";

function Home() {
    const {
        data: posts,
        isPending: isLoadingPosts,
        // isError: isErrorPosts
    } = useGetRecentPosts()

    return (
        <div className="home-container">
            <div className="home-posts">
                <h2 className="h3-bold md:h2-bold w-full">Home Feed</h2>
                {
                    isLoadingPosts
                        ? <div className="flex gap-2 text-light-3 small-regular">
                            <Loader />Loading...
                        </div>
                        : <ul className="flex flex-col flex-1 w-full gap-9">
                            {
                                posts?.map(post =>
                                    <li key={post.$id} className="flex justify-center w-full">
                                        <PostCard post={post} />
                                    </li>
                            )}
                        </ul>
                }
            </div>
        </div>
    );
}

export default Home;
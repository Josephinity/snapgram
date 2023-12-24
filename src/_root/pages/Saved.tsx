import {useGetCurrentUser} from "@/lib/react-query/queriesAndMutations.ts";
import GridPostList from "@/components/shared/GridPostList.tsx";
import {Models} from "appwrite";
import Loader from "@/components/shared/Loader.tsx";

function Saved() {
    const { data: user, isPending: isLoadingUser } = useGetCurrentUser()
    const savedPosts = user?.save.map((savePost: Models.Document) => ({
        ...savePost.post,
        creator: {
            imageUrl: user.imageUrl,
            $id: user.$id
        }
    }))

    return (
        <div className="saved-container">
            <div className="flex gap-2 w-full max-w-5xl">
                <img src="/assets/icons/save.svg" alt="save" className="invert-white" width={30} height={30}/>
                <h2 className="h3-bold md:h2-bold w-full">Saved Posts</h2>
            </div>
            <div className="w-full flex justify-center max-w-5xl gap-9">
                {
                    isLoadingUser ? <Loader />
                    : <GridPostList posts={savedPosts} showStats={false}/>
                }
            </div>
        </div>
    );
}

export default Saved;
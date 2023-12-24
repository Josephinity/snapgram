import PostForm from "@/components/forms/PostForm.tsx";
import {useGetPostById} from "@/lib/react-query/queriesAndMutations.ts";
import {useParams} from "react-router-dom";
import Loader from "@/components/shared/Loader.tsx";

function EditPost() {

    const { id: postId } = useParams()

    if(!postId) {
        return <div>Invalid Post ID</div>
    }

    const {
        data: post,
        isPending
    } = useGetPostById(postId)

    return <section className="common-container">
        <div className="w-full max-w-5xl flex-start">
            <img src="/assets/icons/gallery-add.svg"
                 alt="add"
                 className="invert-white pr-2 w-10 h-10"/>
            <h2 className="h3-bold md:h2-bold w-full">Edit Post</h2>
        </div>
        <div className="w-full max-w-5xl">
            {
                isPending
                    ? <div className="flex gap-2"><Loader />Loading...</div>
                    : <PostForm post={post!} action='Update'/>
            }
        </div>
    </section>;
}

export default EditPost;
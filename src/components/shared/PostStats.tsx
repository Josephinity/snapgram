import {Models} from "appwrite";
import {
    useDeleteSavedPost,
    useGetCurrentUser,
    useLikePost,
    useSavePost
} from "@/lib/react-query/queriesAndMutations.ts";
import {useEffect, useState} from "react";
import {checkIsLiked} from "@/lib/utils.ts";
import Loader from "@/components/shared/Loader.tsx";

type PostStatsProps = {
    post: Models.Document;
    userId: string;
}
function PostStats({ post, userId }: PostStatsProps) {

    const likesList = post.likes.map((userLiked: Models.Document) => userLiked.$id)

    const [ likes, setLikes ] = useState<string[]>(likesList)

    const [ isSaved, setIsSaved ] = useState<boolean>(false);

    const { mutate: likePost } = useLikePost()
    const { mutate: savePost, isPending: isSavingPost } = useSavePost()
    const { mutate: deleteSavedPost, isPending: isDeletingSave } = useDeleteSavedPost()

    const { data: user } = useGetCurrentUser()
    const savedPostRecord = user?.save.find((record: Models.Document) => record.post.$id === post.$id)

    useEffect(() => {
            setIsSaved(!!savedPostRecord)   // if(record) true; else false
        },
        [user]
    )

    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation()

        let newLikes
        if(checkIsLiked(likes, userId)) {
            newLikes = likes.filter(id => id !== userId)
        } else {
            newLikes = [userId, ...likes]
        }
        setLikes(newLikes)
        likePost( { postId: post.$id, likesArray: newLikes } )
    }

    const handleSavePost = (e: React.MouseEvent) => {
        e.stopPropagation()

        if(isSaved) {
            deleteSavedPost({ savedRecordId: savedPostRecord.$id })
            setIsSaved(false)
        } else {
            savePost({ postId: post.$id, userId: userId })
            setIsSaved(true)
        }
    }

    return (
        <div className="flex justify-between">
            <div className="flex-center gap-1">
                <img
                    src={checkIsLiked(likes, userId)
                        ? "/assets/icons/liked.svg" 
                        : "/assets/icons/like.svg"
                    }
                     alt="like"
                     onClick={handleLikePost}
                     width={20}
                     height={20}
                     className="cursor-pointer"
                />
                <p className="small-medium lg:base-medium">{likes.length}</p>
            </div>
            <div className="pl-2">
            {
                isSavingPost || isDeletingSave ? <Loader />
                : <img
                    src={isSaved && savedPostRecord
                        ? "/assets/icons/saved.svg"
                        : "/assets/icons/save.svg"
                    }
                    alt="save"
                    onClick={handleSavePost}
                    width={20}
                    height={20}
                    className="cursor-pointer"
                />
            }
            </div>
        </div>
    );
}

export default PostStats;
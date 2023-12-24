import {Link, useNavigate, useParams} from "react-router-dom";
import {useDeletePost, useGetPostById} from "@/lib/react-query/queriesAndMutations.ts";
import TimeAgo from "timeago-react";
import {useUserContext} from "@/context/AuthContext.tsx";
import Loader from "@/components/shared/Loader.tsx";
import {Button} from "@/components/ui/button.tsx";

function PostDetails() {
    const { id: postId } = useParams()
    const { user } = useUserContext()
    const navigate = useNavigate();

    if(!postId) return "Invalid Post Id"
    const { data: post, isPending, isSuccess} = useGetPostById(postId)
    const { mutateAsync: deletePost, isPending: isDeletingPost } = useDeletePost()

    if(!isPending && (!isSuccess || !post)) {
        return <>Error loading post</>
    }

    const handleDelete = async () => {
        try {
            await deletePost({postId: postId, imageId: post?.imageId})
            navigate('/')
        } catch(e) {
            console.log(e)
        }
    }

    return <div className="post_details-container">
        <div className="hidden md:flex max-w-5xl w-full">
            <Button
                onClick={() => navigate(-1)}
                variant="ghost"
                className="shad-button_ghost">
                <img
                    src={"/assets/icons/back.svg"}
                    alt="back"
                    width={24}
                    height={24}
                />
                <p className="small-medium lg:base-medium">Back</p>
            </Button>
        </div>
        {
            isPending ? <><Loader />Loading...</>
            : <div className="post_details-card">
                <img src={post?.imageUrl}
                     alt="img"
                     className="post_details-img"
                />
                <div className="flex flex-col gap-2 p-10">
                    <div className="flex flex-between flex-wrap">
                        <div className="flex flex-1 gap-2 w-11/12 flex-wrap pr-4">
                            <Link to={`/profile/${post?.creator.$id}`}>
                                <img src={post?.creator.imageUrl || '/assets/icon/profile-placeholder.svg'}
                                     className="rounded-full lg:h-12 w-12"
                                />
                            </Link>
                            <div className="flex flex-col gap-1 justify-center max-w-full">
                                <Link to={`/profile/${post?.creator.$id}`}>
                                    <p className="base-medium lg:body-bold text-light-1">
                                        { post?.creator.name || post?.creator.username }
                                    </p>
                                </Link>
                                <div className="flex flex-wrap w-full subtle-semibold lg:small-regular text-light-3 gap-2">
                                    <TimeAgo
                                        datetime={post!.$createdAt}
                                        locale='en'
                                    />
                                    <p>{post?.location && '•'}</p>
                                    <p className="break-words max-w-full">{post?.location && `${post?.location}`}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-center flex-shrink-0 flex-wrap">
                            <Link to={`/edit-post/${postId}`}
                                  className={`${user.id !== post?.creator.$id && 'hidden'}`}
                            >
                                <img src='/assets/icons/edit.svg'
                                     alt="edit"
                                     width={20}
                                     height={20}/>
                            </Link>
                            <Button
                                onClick={handleDelete}
                                variant="ghost"
                                className={`ost_details-delete_btn ${
                                    user.id !== post?.creator.$id && "hidden"
                                }`}>
                                {
                                    isDeletingPost ? <Loader />
                                    : <img
                                        src={"/assets/icons/delete.svg"}
                                        alt="delete"
                                        width={20}
                                        height={20}
                                    />
                                }
                            </Button>
                        </div>
                    </div>
                    <hr className="border w-full border-dark-4/80 my-4" />
                    <p className="small-medium lg:base-medium break-words">{post?.caption}</p>
                    {
                        post?.tags && post?.tags[0] !== "" &&
                        <ul className="flex flex-wrap small-regular text-light-3 gap-2">
                            {
                                post?.tags.map((tag: string, idx: number)=> <p key={`${postId}-tag-${idx}`}>#{tag}</p>)
                            }
                        </ul>
                    }
                </div>
            </div>
        }
    </div>
}

export default PostDetails;
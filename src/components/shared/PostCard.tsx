import {Link} from "react-router-dom";
import TimeAgo from "timeago-react";
import {Models} from "appwrite";
import {useUserContext} from "@/context/AuthContext.tsx";
import PostStats from "@/components/shared/PostStats.tsx";

type PostCardProps = {
    post: Models.Document;
}

function PostCard({post}: PostCardProps) {
    const { creator, $id: postId, caption, imageUrl, location, tags, $createdAt} = post;
    const { user } = useUserContext()

    return (
        <div className="post-card">
            <div className="flex-between">
                <div className="flex flex-wrap gap-2 w-11/12">
                    <Link to={`/profile/${creator.$id}`}>
                        <img src={creator.imageUrl || '/assets/icon/profile-placeholder.svg'} className="rounded-full lg:h-12 w-12" />
                    </Link>
                    <div className="flex flex-col justify-center max-w-full">
                        <Link to={`/profile/${creator.$id}`}>
                            <p className="base-medium lg:body-bold text-light-1">{ creator.name || creator.username }</p>
                        </Link>
                        <div className="flex flex-wrap w-full subtle-semibold lg:small-regular text-light-3 gap-2">
                            <TimeAgo
                                datetime={$createdAt}
                                locale='en'
                            />
                            <p>{location && '•'}</p>
                            <p className="max-w-full break-words">{location && `${location}`}</p>
                        </div>
                    </div>
                </div>
                <Link to={`/edit-post/${postId}`}
                      className={`w-1/12 ${user.id !== creator.$id && 'hidden'}`}
                >
                    <img src='/assets/icons/edit.svg' alt="edit" width={20} height={20}/>
                </Link>
            </div>

            <Link to={`/posts/${postId}`}>
                <p className="small-medium lg:base-medium py-5 break-words">{caption}</p>
                {
                    tags && tags[0] !== "" &&
                        <ul className="flex flex-wrap small-regular text-light-3 gap-2 mb-2">
                            {
                                tags.map((tag: string, idx: number)=> <p key={`${postId}-tag-${idx}`}>#{tag}</p>)
                            }
                        </ul>
                }
                <img src={imageUrl || '/assets/icons/profile-placeholder.svg'}
                     alt="post image"
                     className="post-card_img"
                />
            </Link>
            <PostStats post={post} userId={user.id} />
        </div>
    )
}

export default PostCard;
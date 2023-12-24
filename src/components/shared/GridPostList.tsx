import {Models} from "appwrite";
import {useUserContext} from "@/context/AuthContext.tsx";
import {Link} from "react-router-dom";
import PostStats from "@/components/shared/PostStats.tsx";


type GridPostListProps = {
    posts?: Models.Document[];
    showUser?: boolean;
    showStats?: boolean;
}
function GridPostList({ posts, showUser = true, showStats = true }: GridPostListProps) {
    const { user } = useUserContext();


    return (
        <div className="grid-container">
            {
                posts?.map(post => (
                    <li key={post.$id} className="min-w-80 h-80 relative">
                        <Link to={`/posts/${post.$id}`} className="grid-post_link">
                            <img src={post.imageUrl} alt="post" className="h-full w-full object-cover" />
                        </Link>

                        <div className="grid-post_user">
                            {
                                showUser &&
                                <Link to={`/profile/${post.creator.$id}`}>
                                    <div className="flex items-center gap-2">
                                        <img src={post.creator.imageUrl} alt="profile" className="h-8 w-8 rounded-full" />
                                        <p className="line-clamp-1">{ post.creator.name || post.creator.username }</p>
                                    </div>
                                </Link>
                            }
                            {
                                showStats && <PostStats post={post} userId={user.id} />
                            }
                        </div>
                    </li>
                ))
            }
        </div>
    );
}

export default GridPostList;
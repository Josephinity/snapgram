// import {useQuery, useMutation, useQueryClient, useInfiniteQuery} from '@tanstack/react-query'
import {
    createPost,
    createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePosts, getInfiniteUsers, getPostById,
    getRecentPosts, getUserById, likePost, savePost, searchPosts,
    signInAccount,
    signOutAccount, updatePost, updateUserProfile
} from "@/lib/appwrite/api.ts";
import {INewPost, INewUser, IUpdatePost, IUpdateUser} from "@/types";
import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {QUERY_KEYS} from "@/lib/react-query/queryKeys.ts";


export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user:INewUser) => createUserAccount(user)
    })
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user:{email:string, password:string}) => signInAccount(user)
    })
}

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: () => signOutAccount()
    })
}

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser   //uses this function to query data
    })
}

export const useCreatePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS] //filter to invalidate the queries
            })
        }
    })
}

export const useDeletePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (post: { postId: string, imageId: string }) => deletePost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS] //filter to invalidate the queries
            })
        }
    })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: IUpdatePost) => updatePost(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS] //filter to invalidate the queries
            })
        }
    })
}

export const useGetPostById = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),   //uses this function to query data
        enabled: !!postId
        /*
            enabled: enable automatic refetching when the query mounts or the query key changes
            !!postId: if postId changes, enable the refetching
        */
    })
}

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,   //uses this function with input param postId
    })
}

export const useGetPosts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts,
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
            if(!lastPage || lastPage && lastPage.documents.length === 0) {
                return null
            }

            // Use the $id of the last document as the cursor.
            const lastId = lastPage.documents[lastPage.documents.length - 1].$id
            return lastId
        }
    })
}


export const useSearchPosts = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts(searchTerm),
        enabled: !!searchTerm   // !!searchTerm: if searchTerm changes, enable the refetching
    })
}


export const useLikePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ( { postId, likesArray }: {postId: string, likesArray: string[]}) => likePost(postId, likesArray),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id] //filter to invalidate the queries
            }),
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS] //filter to invalidate the queries
            }),
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS] //filter to invalidate the queries
            }),
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER] //filter to invalidate the queries
            })
        }
    })
}


export const useSavePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ( { postId, userId }: { postId: string, userId: string }) => savePost(postId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS] //filter to invalidate the queries
            }),
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS] //filter to invalidate the queries
            }),
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER] //filter to invalidate the queries
            })
        }
    })
}

export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ savedRecordId }: { savedRecordId: string }) => deleteSavedPost(savedRecordId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS] //filter to invalidate the queries
            }),
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS] //filter to invalidate the queries
            }),
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER] //filter to invalidate the queries
            })
        }
    })
}

export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: IUpdateUser) => updateUserProfile(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            }),
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id]
            })
        }
    })

}

export const useGetUserById = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
        queryFn: () => getUserById(userId),
        enabled: !!userId
    })
}

export const useGetUsers = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_USERS],
        queryFn: getInfiniteUsers,
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
            if(!lastPage || lastPage && lastPage.documents.length === 0) {
                return null
            }

            // Use the $id of the last document as the cursor.
            const lastId = lastPage.documents[lastPage.documents.length - 1].$id
            return lastId
        }
    })
}
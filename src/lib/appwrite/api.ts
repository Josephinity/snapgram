import {INewPost, INewUser, IUpdatePost, IUpdateUser} from "@/types";
import {account, appwriteConfig, avatars, databases, storage} from "@/lib/appwrite/config.ts"
import {ID, Query} from 'appwrite'
export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.username //this field is newAccount.name
        );

        if(!newAccount) throw Error("No new account is created")

        const avatarUrl = avatars.getInitials(user.username);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            email: newAccount.email,
            name: user.name,
            username: newAccount.name,
            imageUrl: avatarUrl,
        })

        return newUser;

    } catch (e) {
        console.log(e)
    }
}

export async function saveUserToDB(user: {
    accountId: string,
    email: string,
    name?: string,
    username: string,
    imageUrl: URL,
}) {

    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,   // which db
            appwriteConfig.userCollectionId,   // which table
            ID.unique(),
            user // new data
        )
        console.log(newUser);
        return newUser;
    } catch(e) {
        console.log("Failure writing new user to db")
        console.log(e);
        // return e;
    }
}


export async function signInAccount(user: {email:string, password:string}) {
    try {
        const session = await account.createEmailSession(user.email, user.password);

        return session;

    } catch(e) {
        console.log(e);
    }
}


export async function signOutAccount() {
    try {
        const response = account.deleteSession("current");
        return response;
    } catch(e) {
        console.log(e);
    }
}


// ============================== GET ACCOUNT
export async function getAccount() {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error

        return currentAccount;
    } catch (error) {
        console.log(error);
    }
}


export async function getCurrentUser() {
    try {
        const currentAccount = await getAccount();
        if (!currentAccount) throw Error;

        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)],
        )
        if(!response) throw Error;

        // console.log(response.documents)

        return response.documents[0];

    } catch(e) {
        console.log(e);
        return null;
    }
}


export async function createPost(post: INewPost) {
    try {
        // Upload file to appwrite storage
        const uploadedFile = await uploadFile(post.file[0]);

        if (!uploadedFile) throw Error;

        // Get file url
        const fileUrl = getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        // Convert tags into array and strip whitespaces
        const tags = post.tags?.replace(/ /g, "").toLowerCase().split(",") || [];

        // Create post
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags: tags,
            }
        );

        if (!newPost) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        return newPost;
    } catch (error) {
        console.log(error);
    }
}


export async function updatePost(data: IUpdatePost) {
    try {
        const image = {
            imageUrl: data.imageUrl,
            imageId: data.imageId
        }

        const isNewImage = data.file.length > 0

        if(isNewImage) {
            const file =  await uploadFile(data.file[0]);
            if(!file) throw Error

            const imageUrl = getFilePreview(file.$id)
            if(!imageUrl) {
                await deleteFile(file.$id)
                throw Error
            }

            image.imageId = file.$id
            image.imageUrl = imageUrl
        }

        const tags = data.tags?.replace(/ /g, "").toLowerCase().split(",") || [];

        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            data.postId,
            {
                caption: data.caption,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                location: data.location,
                tags: tags
            }
        )

        if(!updatedPost) {
            if(isNewImage) await deleteFile(image.imageId)
            throw Error;
        }

        if(isNewImage) {
            deleteFile(data.imageId)
        }

        return updatedPost;
    } catch (e) {
        console.log(e)
    }
}

export async function deletePost(post: {postId: string, imageId: string}) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            post.postId
        )

        if(!statusCode) throw Error;

        const deleteStatus = await deleteFile(post.imageId)

        if(!deleteStatus) throw Error;

        return { status: 'ok' }
    } catch(e) {
        console.log(e)
    }
}

export async function getPostById(postId: string) {
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )
        if(!post) throw Error;

        return post;
    } catch(e) {
        console.log(e);
        return null;
    }
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );

        return uploadedFile;
    } catch (error) {
        console.log(error);
    }
}


// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            "top",
            100
        );

        if (!fileUrl) throw Error

        return fileUrl;
    } catch (error) {
        console.log(error);
    }
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);
        console.log(`1 image deleted ${fileId}`)
        return { status: "ok" };
    } catch (error) {
        console.log(error);
    }
}


// ============================== LIKE POST (update post array)
export async function likePost( postId: string, likesArray: string[] ) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes: likesArray
            }
        )

        if(!updatedPost) throw Error;

        return updatedPost
    } catch(e) {
        console.log(e)
    }
}

export async function savePost( postId: string, userId: string ) {
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId
            }
        )

        if(!updatedPost) throw Error;

        return updatedPost
    } catch(e) {
        console.log(e)
    }
}


export async function deleteSavedPost( savedRecordId: string ) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedRecordId
        )

        if(!statusCode) throw Error;

        return { status: 'ok' }
    } catch(e) {
        console.log(e)
    }
}


export async function getInfinitePosts( { pageParam } : { pageParam: string | undefined } ) {
    const queries = [Query.orderDesc('$updatedAt'), Query.limit(6)]

    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()))
    }

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        )

        if(!posts) throw Error;

        return posts
    } catch(e) {
        console.log(e)
    }
}

export async function getRecentPosts() {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(20)
            ],
        )
        if(!posts) throw Error;

        // console.log(response.documents)

        return posts.documents;

    } catch(e) {
        console.log(e);
        return null;
    }
}

// ============================== GET SEARCHED POSTS
export async function searchPosts(searchTerm: string) {

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [
                Query.search('caption',  searchTerm),
                Query.limit(20)
            ]
        )

        if(!posts) throw Error;

        return posts
    } catch(e) {
        console.log(e)
    }
}


export async function updateUserProfile(data: IUpdateUser) {
    try {
        const image = {
            imageUrl: data.imageUrl,
            imageId: data.imageId
        }

        if (data.file) {
            const file = await uploadFile(data.file)
            if(!file) throw Error

            const imageUrl = getFilePreview(file.$id)
            if(!imageUrl) throw Error
            image.imageUrl = imageUrl
            image.imageId = file.$id
        }

        const user = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            data.userId,
            {
                name: data.name,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                bio: data.bio,
            }
        )

        if(!user) {
            if(data.file && image.imageId) deleteFile(image.imageId)
            throw Error
        }

        if(data.file) {
            deleteFile(data.imageId)
        }

        return user
    } catch(e) {
        console.log(e)
    }
}


export async function getUserById(userId: string) {
    try {
        const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId
        )

        if(!user) throw Error

        return user
    } catch(e) {
        console.log(e)
    }
}


export async function getInfiniteUsers( { pageParam } : { pageParam: string | undefined } ) {
    const queries = [Query.orderDesc('$createdAt'), Query.limit(9)]

    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()))
    }

    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            queries
        )

        if(!users) throw Error;

        return users
    } catch(e) {
        console.log(e)
    }
}
import {INewUser} from "@/types";
import {account, appwirteConfig, avatars, databases} from "@/lib/appwrite/config.ts"
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
            appwirteConfig.databaseId,   // which db
            appwirteConfig.userCollectionId,   // which table
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


export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) console.log('Not signed-in');

        const response = await databases.listDocuments(
            appwirteConfig.databaseId,
            appwirteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)],
        )
        if(!response) throw Error;

        // console.log(response.documents)

        return response.documents[0];

    } catch(e) {
        console.log(e);
    }
}
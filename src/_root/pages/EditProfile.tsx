import {useUserContext} from "@/context/AuthContext.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {profileValidationSchema} from "@/lib/validation";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import Loader from "@/components/shared/Loader.tsx";
import ProfileUploader from "@/components/shared/ProfileUploader.tsx";
import {useUpdateUserProfile} from "@/lib/react-query/queriesAndMutations.ts";
import {useEffect} from "react";

function EditProfile() {

    const { user: currentUser, setUser: setCurrentUser, isLoading } = useUserContext()
    const { id } = useParams()
    const { mutateAsync: updateUserProfile, isPending: isUpdatingUser } = useUpdateUserProfile()
    const navigate = useNavigate()

    const form = useForm<z.infer<typeof profileValidationSchema>>({
        resolver: zodResolver(profileValidationSchema),
        defaultValues: {
            file: undefined,
            username: currentUser.username,
            name: currentUser.name,
            email: currentUser.email,
            bio: currentUser.bio
        }
    })

    useEffect(()=> {
            form.setValue('username', currentUser.username)
            form.setValue('email', currentUser.email)
            form.setValue('name', currentUser.name || "")
            form.setValue('bio', currentUser.bio)
        }, [currentUser]
    )

    if(isLoading) {
        return <div className="flex-center w-full"><Loader /></div>
    }

    if(id !== currentUser.id) {
        return (
            <div className="common-container">
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
                <div className="flex-1 flex-center">Sign in account to edit profile</div>
            </div>
        )
    }

    async function onSubmit(values: z.infer<typeof profileValidationSchema>) {
        try {
            const updatedUser = await updateUserProfile({
                userId: currentUser.id,
                name: values.name,
                bio: values.bio,
                imageUrl: currentUser.imageUrl,
                imageId: currentUser.imageId,
                file: values.file
            })

            if(!updatedUser) throw Error

            setCurrentUser({
                ...currentUser,
                name: updatedUser.name,
                bio: updatedUser.bio,
                imageUrl: updatedUser.imageUrl,
                imageId: updatedUser.imageId
            })

            navigate(`/profile/${currentUser.id}`)
        } catch(e) {
            console.log(e)
        }
    }

    return (
        <div className="profile-container">
            <div className="flex gap-3 w-full max-w-5xl">
                <img src="/assets/icons/edit.svg" alt="edit" className="invert-white" />
                <h2 className="h3-bold md:h2-bold">Edit Profile</h2>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
                    <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <ProfileUploader
                                        fieldChange={field.onChange}
                                        imageUrl={currentUser.imageUrl}
                                    />
                                </FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input type="text"
                                           className="shad-input"
                                           placeholder={currentUser.name}
                                           {...field}
                                    />
                                </FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input disabled
                                           type="text"
                                           className="shad-input"
                                           placeholder={currentUser.username}
                                           readOnly={true}
                                           {...field}
                                    />
                                </FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input disabled
                                           type="text"
                                           className="shad-input"
                                           placeholder={currentUser.email}
                                           readOnly={true}
                                           {...field}
                                    />
                                </FormControl>
                                <FormMessage className="shad-form_message"/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="shad-textarea"
                                        placeholder={currentUser.bio}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end w-full gap-4">
                        <Button type="button"
                                className="shad-button_dark_4"
                                onClick={() => {
                                    navigate(-1)
                                }}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" className="shad-button_primary whitespace-nowrap">
                            {
                                isUpdatingUser ? (
                                    <div className="flex-center gap-2">
                                        <Loader /> Loading ...
                                    </div>
                                ) : "Update Profile"
                            }
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default EditProfile;
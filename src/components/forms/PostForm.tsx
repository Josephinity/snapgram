import {useForm} from "react-hook-form";
import * as z from "zod";
import {newPostValidationSchema} from "@/lib/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {FileUploader, Loader} from "@/components/shared";
import {Models} from "appwrite";
import {useCreatePost, useUpdatePost} from "@/lib/react-query/queriesAndMutations.ts";
import {useUserContext} from "@/context/AuthContext.tsx";
import {useToast} from "@/components/ui/use-toast.ts";
import {useNavigate} from "react-router-dom";

type PostFormProps = {
    post?: Models.Document;
    action: 'Update' | 'Create'
}

function PostForm({ post, action } : PostFormProps) {
    const form = useForm<z.infer<typeof newPostValidationSchema>>({
        resolver: zodResolver(newPostValidationSchema),
        defaultValues: {
            caption: post ? post?.caption: "",
            file: [],
            location: post ? post?.location : "",
            tags: post ? post?.tags.join(',') : ""
        },
    })

    const { mutateAsync: createPost, isPending: isCreatingPost} = useCreatePost()
    const { mutateAsync: updatePost, isPending: isUpdatingPost } = useUpdatePost()
    const { user} = useUserContext()
    const { toast } = useToast()
    const navigate = useNavigate()

    async function onSubmit(values: z.infer<typeof newPostValidationSchema>) {
        if(action === 'Create') {
            const newPost = await createPost({
                userId: user.id,
                ...values
            })

            if(!newPost) {
                return toast({
                    title: "Failed to create post, please try again"
                })
            }

            navigate(`/posts/${newPost.$id}`)
        } else if(action === 'Update') {

            if(!post) {
                return "Error Loading Post"
            }

            const response = await updatePost(
                {
                    postId: post.$id,
                    imageId: post?.imageId,
                    imageUrl: post?.imageUrl,
                    ...values
            })

            if(!response) {
                return toast({
                    title: "'Failed to update post, please try again"
                })
            }
            navigate(`/posts/${post.$id}`)
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
                <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Caption</FormLabel>
                            <FormControl>
                                <Textarea
                                    className="shad-textarea"
                                    placeholder="Edit caption here"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Add Photos</FormLabel>
                            <FormControl>
                                <FileUploader
                                    fieldChange={field.onChange} imageUrl={post?.imageUrl}/>
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Add Location</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input" {...field} />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Add Tags (separated by comma ',')</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input" {...field} />
                            </FormControl>
                            <FormMessage className="shad-form_message"/>
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
                            isCreatingPost || isUpdatingPost ? (
                                <div className="flex-center gap-2">
                                    <Loader /> Loading ...
                                </div>
                            )
                            : action + " Post"
                        }
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default PostForm;
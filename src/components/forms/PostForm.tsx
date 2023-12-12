import {useForm} from "react-hook-form";
import * as z from "zod";
import {newPostValidationSchema} from "@/lib/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import Loader from "@/components/shared/Loader.tsx";

function PostForm() {
    const form = useForm<z.infer<typeof newPostValidationSchema>>({
        resolver: zodResolver(newPostValidationSchema),
        defaultValues: {
            caption: "",
            file: [],
            location: "",
            tags: ""
        },
    })

    function onSubmit(values: z.infer<typeof newPostValidationSchema>) {
        console.log(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full max-w-5xl">
                <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Caption</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input" {...field}/>
                            </FormControl>
                            <FormMessage />
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
                                <Input type="text" className="shad-input" {...field}/>
                            </FormControl>
                            <FormMessage />
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
                                <Input type="text"
                                       className="shad-input"
                                       {...field}
                                />
                            </FormControl>
                            <FormMessage />
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
                                <Input type="text"
                                       className="shad-input"
                                       placeholder="JS,React,NextJS"
                                       {...field}
                                />
                            </FormControl>
                            <FormMessage className="shad-form_message"/>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end w-full gap-4">
                    <Button type="button" className="shad-button_dark_4">
                        Cancel
                    </Button>

                    <Button type="submit" className="shad-button_primary whitespace-nowrap">
                        {
                            // isLoading ? (
                            //     <div className="flex-center gap-2">
                            //         <Loader /> Loading...
                            //     </div>
                            // ):
                            "Create Post"
                        }
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default PostForm;
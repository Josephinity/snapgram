"use client"

import {useForm} from "react-hook-form";
import * as z from "zod";
import {signupValidationSchema} from "@/lib/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import Loader from "@/components/shared/Loader.tsx";
import {Link, useNavigate} from "react-router-dom";
import {useToast} from "@/components/ui/use-toast"
import {useCreateUserAccount, useSignInAccount} from "@/lib/react-query/queriesAndMutations.ts";
import {useUserContext} from "@/context/AuthContext.tsx";

function SignupForm() {
    const {toast} = useToast()
    const {mutateAsync: createUserAccount, isPending: isCreatingAccount} = useCreateUserAccount();
    const {mutateAsync: signInAccount, isPending: isSigningIn} = useSignInAccount();
    const {checkAuthUser, isLoading: isLoadingUser} = useUserContext(); // returns type IContextType but only 2 items used here
    const navigate = useNavigate()


    const form = useForm<z.infer<typeof signupValidationSchema>>({
        resolver: zodResolver(signupValidationSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        },
    })

    /*creates new user and signs user in*/
    async function onSubmit(values: z.infer<typeof signupValidationSchema>) {

        try {
            const newUser = await createUserAccount(values);

            if(!newUser) {
                return toast({
                    title: "User creation failed",
                    description: "Please try again",
                });
            }

            const session = await signInAccount({email:values.email, password:values.password});

            if(!session) {
                return toast({title: 'Sign in failed. Please try again.'})
            }

            //Store session in a react context so the app knows about the signed in user
            //create a context in src/context/AuthContext.tsx and use it here
            const isLoggedIn = await checkAuthUser()

            if(isLoggedIn) {
                form.reset()
                navigate('/')
                return toast({title: `Welcome, ${newUser.username}!`})
            } else {
               return toast({title: 'Log in failed. Please try again'})
            }

        } catch(e) {
            console.log(e);
        }
    }

    return (
        <div className="sm:w-420 flex-center flex-col">
            <img src="/assets/images/logo.svg" alt="logo" />
            <h2 className="h3-bold md:h2-bold pt-5 sm:pt-10">Create a new account</h2>
            <p className="text-light-3 small-medium md:base-regular mt-2">To use Snapgram, please enter your details.</p>


            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input type="username" className="shad-input" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" className="shad-input" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" className="shad-input" {...field} />
                                </FormControl>
                                <FormDescription>
                                    {/*Password must be a combination of letters and digits.*/}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="shad-button_primary">
                        {
                            isCreatingAccount || isSigningIn || isLoadingUser ? (
                                <div className="flex-center gap-2">
                                    <Loader /> {
                                        isSigningIn || isLoadingUser
                                            ? "Signing in..."
                                            : "Signing up..."
                                    }
                                </div>
                            ): "Sign Up"
                        }
                    </Button>
                    <p className="small-regular text-light-2 text-center mt-2">
                        Already have an account?
                        <Link to="/sign-in" className="text-primary-500 small-semibold ml-1">Sign-in</Link>
                    </p>
                </form>
            </Form>
        </div>

    );
}

export default SignupForm;
"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {Link, useNavigate} from "react-router-dom"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { signinValidationSchema } from "@/lib/validation";
import Loader from "@/components/shared/Loader"
import {toast} from "@/components/ui/use-toast.ts";
import {useSignInAccount} from "@/lib/react-query/queriesAndMutations.ts";
import {useUserContext} from "@/context/AuthContext.tsx";
import {useEffect} from "react";


function SigninForm() {

    const {mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();
    const {checkAuthUser, isLoading: isLoadingUser} = useUserContext();
    const navigate = useNavigate();


    const form = useForm<z.infer<typeof signinValidationSchema>>({
        resolver: zodResolver(signinValidationSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof signinValidationSchema>) {

        try {
            const session = await signInAccount({email: values.email, password: values.password});

            if (!session) {
                return toast({title: 'Sign in failed. Please try again.'})
            }

            const isLoggedIn = await checkAuthUser()

            if(isLoggedIn) {
                navigate('/')
                form.reset()
            } else {
                return toast({title: 'Log in failed. Please try again.'})
            }

        } catch(e) {
            console.log(e)
        }
    }

    // useEffect(() => {
    //     if(isAuthenticated) {
    //         navigate('/')
    //     }
    // }, []);

    return (
        <Form {...form}>
            <div className="sm:w-420 flex-center flex-col">

                <img src="/assets/images/logo.svg" alt="logo" />

                <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Log into your account</h2>
                <p className="text-light-3 small-medium md:base-regular mt-2">Welcome back! Please enter your details.</p>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">

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
                            isSigningIn || isLoadingUser ? (
                                <div className="flex-center gap-2">
                                    <Loader /> Loading...
                                </div>
                            ): "Log In"
                        }
                    </Button>
                    <p className="small-regular text-light-2 text-center mt-2">
                        Don't have an account?
                        <Link to="/sign-up" className="text-primary-500 small-semibold ml-1">Sign up</Link>
                    </p>
                </form>

            </div>
        </Form>
    );
}

export default SigninForm;
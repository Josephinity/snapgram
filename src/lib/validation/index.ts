import * as z from "zod"

const emailPassword = {
    email: z.string().email(),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters."
    }).max(20)
}


export const signinValidationSchema = z.object(
    emailPassword
)

export const signupValidationSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters"
    }),
    ...emailPassword
})

export const newPostValidationSchema = z.object({
    caption: z.string().max(2200, {
        message: "Exceeded the limit of 2200 characters"
    }),
    file: z.custom<File[]>(),
    location: z.string().max(256, {
        message: "Exceeded the limit of 256 characters"
    }),
    tags: z.string().max(256, {
        message: "Exceeded the limit of 256 characters"
    }),
})

export const profileValidationSchema = z.object({
    file: z.custom<File>(),
    username: z.string().min(2, {
            message: "Username should be no less than 2 characters"
        }).max(32, {
            message: "Exceeded the limit of 32 characters"
    }),
    name: z.string().max(128, {
        message: "Exceeded the limit of 128 characters"
    }),
    email: z.string().email(),
    bio: z.string().max(256, {
        message: "Exceeded the limit of 256 characters"
    }),
})
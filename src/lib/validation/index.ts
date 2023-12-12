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
    file: z.any(),
    location: z.string().max(256, {
        message: "Exceeded the limit of 256 characters"
    }),
    tags: z.string().max(2200, {
        message: "Exceeded the limit of 2200 characters"
    }),
})
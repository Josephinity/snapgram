import './globals.css';

import {Routes, Route} from 'react-router-dom';
import {Home, Saved, Explore, CreatePost, AllUsers, Profile, EditPost, EditProfile, PostDetails} from "./_root/pages";
import SigninForm from "./_auth/forms/SigninForm.tsx";
import SignupForm from "./_auth/forms/SignupForm.tsx";
import AuthLayout from "./_auth/AuthLayout.tsx";
import RootLayout from "./_root/RootLayout.tsx";
import { Toaster } from "@/components/ui/toaster"

function App() {

    return (
        <main className="flex h-screen overflow-y-auto">

            <Routes>

                {/*public routes in _auth*/}
                <Route element={<AuthLayout />}>
                    <Route path="/sign-in" element={<SigninForm />}/>
                    <Route path="/sign-up" element={<SignupForm />}/>
                </Route>


                {/*private routes in _root*/}
                <Route element={<RootLayout />}>
                    {/*Index routes render into their parent's Outlet at their parent's URL*/}
                    <Route index element={<Home />}/>
                    <Route path="/explore" element={<Explore />}/>
                    <Route path="/all-users" element={<AllUsers />}/>
                    <Route path="/saved" element={<Saved />}/>
                    <Route path="/create-post" element={<CreatePost />}/>
                    <Route path="/update-post/:id" element={<EditPost />}/>
                    <Route path="/posts/:id" element={<PostDetails />}/>
                    <Route path="/profile/:id" element={<Profile />}/>
                    <Route path="/update-profile/:id" element={<EditProfile />}/>
                </Route>

            </Routes>
            <Toaster />
        </main>
    );
}

export default App;
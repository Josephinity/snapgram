# Setup Environment for React + TS + Vite + Tailwind + Shadcn
Install Vite + React https://vitejs.dev/guide/
$ npm create vite@latest ./  
    choose react, typescript[Y]
$ npm install
$ npm run dev

Move /src/assets to public folder
Clear /src folder
Create /src/main.tsx
    in /src/main.tsx

        import ReactDOM from 'react-dom/client';
        import App from "./App.tsx";
        import { BrowserRouter } from 'react-router-dom'
        
        ReactDOM.createRoot(document.getElementById('root')!).render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

The package to control routing of the application
$ npm install react-router-dom

Create /src/App.tsx, /src/globals.css
    in /src/App.tsx

        //type rsf + [Tab] to use 'react arrow function component', available in extension 'es7+ React/Redux/React-Native'
        import './globals.css';

Create /src/_auth,   //_auth is seen by everyone
       /src/_auth/forms    
Create /src/_root,   //_root is seen by signed-in users ONLY
       /src/_root/RootLayout.tsx, 
       /src/_root/pages,     
       /src/_root/index.ts,  //an integration of all pages such as Home, Contact, About...
       /src/_root/pages/Home.tsx
    in /src/_root/index.ts

    export { default as Home } from './Home';

So that in /src/App.tsx, we can
    
    import { Home, Page1, Page2, ... } from "./_root/pages";


Install Tailwind https://tailwindcss.com/docs/guides/vite
$ npm install -D tailwindcss postcss autoprefixer
$ npx tailwindcss init -p
    in tailwind.config.js https://github.com/adrianhajdin/social_media_app/blob/main/tailwind.config.js
    in /src/globals.css

        @tailwind base;
        @tailwind components;
        @tailwind utilities;

Install extra tailwindcss plugins, for e.g.
$ npm install -D tailwindcss-animate
$ npm run dev

in /src/globals.css
https://github.com/adrianhajdin/social_media_app/blob/main/src/globals.css

Install Shadcn https://ui.shadcn.com/docs/installation/vite
// Shadcn installation will overwrite your globals.css and tailwind.config.js, make sure they are recovered
To add any Shadcn component, for e.g.
$ npx shadcn-ui@latest add button
$ npx shadcn-ui@latest add form


# Purpose of Files

Create /public/assets, /public/assets/images, /public/assets/icons, ...
    to store public image files

Create /src/components/shared
    and put any shared little components there

Create /src/lib/
    is where you can keep any application-specific files that are used globally throughout the app

Create /src/lib/validation, /src/lib/validation/index.ts
    is where to keep form validation schemas
    

In /src/App.tsx    
    Control page redirection using router

    //type rsf + [Tab] to use 'react arrow function component', available in extension 'es7+ React/Redux/React-Native'
    import './globals.css';
    import {Routes, Route} from 'react-router-dom'; 

    /*
        Now wrap everything in <Routes> </Routes>
        Create public routes (seen by everyone) and 
            private routes (seen by signed-in users ONLY)
    */
        <main>
            <Routes>
                {/*public routes in _auth*/}
                <Route element={<AuthLayout />}>
                    <Route path="/sign-in" element={<SigninForm />}/>
                    <Route path="/sign-up" element={<SignupForm />}/>
                </Route>


                {/*private routes in _root*/}
                <Route element={<RootLayout />}>
                    {/*index indicates the entry page*/}
                    <Route index element={<Home />}/>
                </Route>
            </Routes>
        </main>

In /src/_auth/AuthLayout.tsx
    If user authenticated, goto <Navigate />, otherwise goto <Outlet />

    import { Outlet, Navigate } from 'react-router-dom';

    function AuthLayout() {
        const isAuthenticated = false;
        return (
            <>
                {
                    isAuthenticated ? (
                        <Navigate to="/" />
                    ): (
                        <>
                            <section className="flex flex-1 justify-center items-center flex-col py-10">
                                <Outlet />
                            </section>
                        </>
                    )
                }
            </>
        );
    }


{useForm} of Shadcn  https://ui.shadcn.com/docs/components/form



#Note
The package to control routing of the pages
$ npm install react-router-dom
    Routes, 
    Route, 
    Outlet, 
    Navigate








# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

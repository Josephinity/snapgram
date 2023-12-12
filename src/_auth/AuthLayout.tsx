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
                        <section className="flex items-center xl:flex-center flex-1 flex-col py-10 overflow-y-scroll">
                            <Outlet />
                        </section>

                        <img
                            src="/assets/images/side-img.svg"
                            alt="logo"
                            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
                        />
                    </>
                )
            }
        </>
    );
}

export default AuthLayout;
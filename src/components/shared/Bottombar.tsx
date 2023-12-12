import {bottombarLinks} from "@/constants";
import {NavLink, useLocation} from "react-router-dom";

function Bottombar() {
    const {pathname} = useLocation();

    return (
        <nav className="bottom-bar">
            {
                bottombarLinks.map(
                    link => {
                        const isActive = pathname === link.route;
                        return (
                            <NavLink to={link.route}
                                     key={link.label}
                                     className={`bottombar-link group flex-col flex-center p-2 w-14 ${isActive && 'bg-primary-500'}`}>
                                <img src={link.imgURL} alt={link.label}
                                     className={`group-hover:invert-white my-1 ${isActive && 'invert-white'}`} />
                                <p className="tiny-medium text-light-2">{link.label}</p>
                            </NavLink>
                        )}
                )
            }
        </nav>
    );
}

export default Bottombar;
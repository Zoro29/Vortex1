import "../css/Navbar.css";
import { useAuth } from "../context/AuthContext";

function Navbar({ navbarRef }) {
    const { user, loading } = useAuth();
    return (
        <nav
            className="navbar"
            ref={navbarRef}
        >
            <a
                href="/"
                className="navbar-brand"
            >
                <span>VORTEX</span>
            </a>

            <div className="navbar-links">

                <a
                    href="/journey"
                    className="navbar-link"
                >
                    Journey
                </a>

                <a
                    href="/about"
                    className="navbar-link"
                >
                    About
                </a>

                {!loading && (
                    <a
                        href={user ? "/dashboard" : "/login"}
                        className="navbar-link"
                    >
                        {user ? "Dashboard" : "Login"}
                    </a>
                )}

            </div>
        </nav>
    );
}

export default Navbar;

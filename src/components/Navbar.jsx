import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <header className="masthead p-4 mb-5">
        <div className="inner">
          <nav className="nav nav-masthead justify-content-center">
            <Link className="nav-link mx-5" to="/">Book Events</Link>
            <Link className="nav-link" to="/show-events">Show Events</Link>
          </nav>
        </div>
      </header>
    );
}

export default Navbar;
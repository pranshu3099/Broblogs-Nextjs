import Link from "next/link";
const Navbar = () => {
  return (
    <nav className="container">
      <>
        {
          <div className="nav-main-container">
            <div className="nav-icons">
              <Link href="/" className="icons">
                Home
              </Link>
              <Link href="/create" className="icons">
                Write Blog
              </Link>
              <Link href="/profile/logout" className="icons">
                profile
              </Link>
            </div>
          </div>
        }
      </>
    </nav>
  );
};

export default Navbar;

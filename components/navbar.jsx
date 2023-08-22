import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
const Navbar = () => {
  const [item, setItem] = useState(false);
  const [verified, setVerified] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      setItem(localStorage.getItem("Bearer"));
    }
  }, [router.asPath]);
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("Bearer");
    localStorage.removeItem("admin");
    router.push("/login");
    setItem(false);
  };
  return (
    <nav className="container">
      <>
        {item && (
          <div className="nav-main-container">
            <div className="nav-icons">
              <Link href="/" className="icons">
                Home
              </Link>
              <Link href="/create" className="icons">
                Write Blog
              </Link>
              {!item ? (
                <Link href="/login" className="icons">
                  Login
                </Link>
              ) : (
                <Link href="#" className="icons" onClick={handleLogout}>
                  Logout
                </Link>
              )}
            </div>
          </div>
        )}
      </>
    </nav>
  );
};

export default Navbar;

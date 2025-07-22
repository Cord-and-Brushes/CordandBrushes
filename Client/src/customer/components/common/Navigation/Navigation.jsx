import { Fragment, useState, useEffect } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import {
  Link as RouterLink,
  useLocation,
  Link,
  useNavigate,
} from "react-router-dom";
import {
  InformationCircleIcon,
  UserIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import Logo from "../../../../assets/2.png";

const navigation = {
  pages: [
    { name: "Home", href: "/" },
    { name: "Workshop", href: "/workshop" },
    { name: "Liveclasses", href: "/liveclasses" },
    { name: "Blog", href: "/blog" },
  ],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [infoOverlayOpen, setInfoOverlayOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: "" });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in
    const loggedInUser = localStorage.getItem("user");
    let parsedUser = null;
    if (loggedInUser && loggedInUser !== "undefined" && loggedInUser !== "") {
      try {
        parsedUser = JSON.parse(loggedInUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (e) {
        setUser({ name: "" });
        setIsLoggedIn(false);
        localStorage.removeItem("user");
        console.error("Error parsing user from localStorage in Navigation:", e);
      }
    }
  }, []);

  // If user is logged in but not verified, show a message
  if (isLoggedIn && user && user.verified === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="p-8 bg-white rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-4 text-orange-600">
            Email Not Verified
          </h2>
          <p className="mb-4">
            Please verify your email address to access your account.
          </p>
          <p className="text-gray-500">
            Check your inbox for a verification link.
          </p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("persist:root");
    setUser({ name: "" });
    setIsLoggedIn(false);
    setUserMenuOpen(false);
    navigate("/");
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const openInfoOverlay = () => {
    setInfoOverlayOpen(true);
  };

  const closeInfoOverlay = () => {
    setInfoOverlayOpen(false);
  };

  return (
    <div className="bg-red-600">
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-white"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Links */}
                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  {navigation.pages.map((page) => (
                    <div key={page.name} className="flow-root">
                      <RouterLink
                        key={page.name}
                        to={page.href}
                        className="-m-2 block p-2 font-bold text-lg text-gray-900"
                      >
                        {page.name}
                      </RouterLink>
                    </div>
                  ))}
                </div>

                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  {isLoggedIn ? (
                    <>
                      <div className="flow-root">
                        <Link
                          to="/profile"
                          className="-m-2 flex gap-x-2 p-2 font-medium text-gray-900"
                        >
                          <UserIcon
                            className="h-6 w-6 text-black"
                            aria-hidden="true"
                          />
                          Profile
                          {/*   {user.name} */}
                        </Link>
                      </div>
                      <div className="flow-root">
                        <a
                          href="#"
                          onClick={handleLogout}
                          className="-m-2 block p-2 font-medium text-gray-900"
                        >
                          Logout
                        </a>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flow-root">
                        <a
                          href="/auth/login"
                          className="-m-2 block p-2 font-medium text-gray-900"
                        >
                          Sign in
                        </a>
                      </div>
                      <div className="flow-root">
                        <a
                          href="/auth/signup"
                          className="-m-2 block p-2 font-medium text-gray-900"
                        >
                          Create account
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop mode */}
      <header className="relative bg-white">
        <p className="flex h-10 items-center justify-center bg-[#F94C10] px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Get free delivery on orders over $100
        </p>
        {/* Logo on Mobile view*/}
        <div className="lg:hidden text-center flex justify-center items-center">
          <a href="#">
            <span className="sr-only">Your Company</span>
            <img
              className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-16 lg:w-16 object-contain"
              src={Logo}
              alt="logo"
            />
          </a>
        </div>

        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b lg:py-5 py-2 border-gray-200">
            <div className="flex h-16 items-center">
              <div className="flex items-center">
                {/* Logo on desktop view*/}
                <a href="#" className="mr-4 hidden lg:block">
                  <span className="sr-only">Your Company</span>
                  <img className="h-28 object-contain" src={Logo} alt="logo" />
                </a>

                <button
                  type="button"
                  className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                  onClick={() => setOpen(true)}
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open menu</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Flyout menus */}
                <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
                  <div className="flex h-full space-x-8">
                    {navigation.pages.map((page) => (
                      <RouterLink
                        key={page.name}
                        to={page.href}
                        className="flex items-center text-md font-semibold text-black hover:text-[#F94C10] relative"
                        style={{
                          paddingBottom:
                            location.pathname === page.href ? "5px" : "0",
                          borderBottom:
                            location.pathname === page.href
                              ? "3px solid #F94C10"
                              : "none",
                          color:
                            location.pathname === page.href
                              ? "#F94C10"
                              : "black",
                          transition: "padding-bottom 0.3s, border-bottom 0.2s",
                        }}
                      >
                        {page.name}
                      </RouterLink>
                    ))}
                  </div>
                </Popover.Group>
              </div>

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {isLoggedIn ? (
                    <div className="relative">
                      <button
                        type="button"
                        className="lg:block ml-2 p-2 text-black"
                        onClick={toggleUserMenu}
                      >
                        <UserIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                      {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <div className="py-1">
                            <Link
                              to="/profile"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Profile{/* {user.name} */}
                            </Link>
                            <a
                              href="#"
                              onClick={handleLogout}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Logout
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <a
                        href="/auth/login"
                        className="text-md font-semibold text-gray-700 hover:text-gray-800"
                      >
                        Sign in
                      </a>
                      <span
                        className="h-6 w-px bg-gray-200"
                        aria-hidden="true"
                      />
                      <a
                        href="/auth/signup"
                        className="text-md font-semibold text-gray-700 hover:text-gray-800"
                      >
                        Create account
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}

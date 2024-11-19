import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import {AiOutlineSearch} from "react-icons/ai";
import {FaMoon, FaSun} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../redux/theme/themeSlice.js";

export default function Header() {
    const path = useLocation().pathname;
    const { currUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { theme } = useSelector((state) => state.theme);


    const handleThemeChange = () => {
        dispatch(setTheme());
    }

  return (
    <Navbar className="border-b-2">
        <Link to="/" className="self-center whitespace-nowrap text-sm 
        sm:text-xl font-semibold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-blue-200
             via-green-100 to-yellow-50 rounded-lg text-gray-600">
                Zhifan's
            </span>
            <span className="text-gray-700 dark:text-gray-300">Blog</span>
        </Link>
        <form>
            <TextInput
                type="text"
                placeholder="Search"
                rightIcon={AiOutlineSearch}
                className="hidden lg:inline"
            />
        </form>
        <Button className="w-12 h-10 lg:hidden" color="gray" pill>
           <AiOutlineSearch className="self-center" /> 
        </Button>
        <div className="flex gap-3 md:order-2">
            <Button className="w-12 h-10 hidden sm:inline" 
                    color="gray" 
                    pill 
                    onClick={handleThemeChange}
            >
                {theme === 'light' ? <FaSun /> : <FaMoon />}
            </Button>
            {currUser ? (
                <Dropdown arrowIcon={false} inline label={
                    <Avatar alt="user" img={currUser.profilePicture} rounded/>
                }>
                    <Dropdown.Header className="flex flex-col pointer-events-none">
                        <span className="block text-sm">@{currUser.username}</span>
                        <span className="block text-sm font-medium truncate">@{currUser.email}</span>
                    </Dropdown.Header>
                    <Link to={'/dashboard?tab=profile'}>
                        <Dropdown.Item>Profile</Dropdown.Item>
                    </Link>
                    <Dropdown.Divider />
                    <Link to="/logout">
                        <Dropdown.Item>Sign Out</Dropdown.Item>
                    </Link>
                </Dropdown>
            ) : (
                <Button gradientDuoTone="tealToLime" outline>
                    <Link to="/login">Sign In</Link>
                </Button>
            )}
            
            <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
            <Navbar.Link active={path === "/"} as={'div'}>
                <Link to="/">Home</Link>
            </Navbar.Link>
            <Navbar.Link active={path === "/about"} as={'div'}>
                <Link to="/about">About</Link>
            </Navbar.Link>
            <Navbar.Link active={path === "/projects"} as={'div'}>
                <Link to="/projects">Projects</Link>
            </Navbar.Link>
        </Navbar.Collapse>
    </Navbar>
  )
}

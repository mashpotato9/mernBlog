import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {AiOutlineSearch} from "react-icons/ai";
import {FaMoon, FaSun} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../redux/theme/themeSlice.js";
import apiRequest from '../../lib/apiRequest.js';
import { logoutSuccess } from "../redux/user/userSlice.js";
import { useEffect, useState } from "react";


export default function Header() {
    const path = useLocation().pathname;
    const { currUser } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();


    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const searchTermFromUrl = searchParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    const handleThemeChange = () => {
        dispatch(setTheme());
    }

    const handleLogout = async () => {
        try {
            const res = await apiRequest.post('auth/logout');
            dispatch(logoutSuccess());
        } catch (error) {
            console.log(error);
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

  return (
    <Navbar className="border-b-2 fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900">
        <Link to="/" className="self-center whitespace-nowrap text-sm 
        sm:text-xl font-semibold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-blue-200
             via-green-100 to-yellow-50 rounded-lg text-gray-600">
                Zhifan's
            </span>
            <span className="text-gray-700 dark:text-gray-300">Blog</span>
        </Link>
        <form onSubmit={handleSearch}>
            <TextInput
                type="text"
                placeholder="Search"
                rightIcon={AiOutlineSearch}
                className="hidden lg:inline"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                    <Avatar alt="user" img={currUser.profilePicture} rounded />
                }>
                    <Dropdown.Header className="flex flex-col pointer-events-none">
                        <span className="block text-sm">@{currUser.username}</span>
                        <span className="block text-sm font-medium truncate">@{currUser.email}</span>
                    </Dropdown.Header>
                    <Link to={'/dashboard?tab=profile'}>
                        <Dropdown.Item>Profile</Dropdown.Item>
                    </Link>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>Sign Out</Dropdown.Item>

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

import { Button, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import {AiOutlineSearch} from "react-icons/ai";
import {FaMoon} from "react-icons/fa";

export default function Header() {
    const path = useLocation().pathname;

  return (
    <Navbar className="border-b-2">
        <Link to="/" className="self-center whitespace-nowrap text-sm 
        sm:text-xl font-semibold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-blue-200
             via-green-100 to-yellow-50 rounded-lg text-gray-600">
                Zhifan's
            </span>
            <span className="text-gray-700">Blog</span>
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
            <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
                <FaMoon />
            </Button>
            <Button gradientDuoTone="tealToLime" outline>
                <Link to="/signin">Sign In</Link>
            </Button>
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

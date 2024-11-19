import { Footer } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { BsFacebook, BsGithub, BsInstagram, BsX } from 'react-icons/bs'

export default function FooterCom() {
  return (
    <Footer container className='border border-t-8 border-blue-200'>
        <div className='w-full max-w-7xl mx-auto'>
            <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
                <div className='mt-5'>
                    <Link to="/" className="self-center whitespace-nowrap text-lg
                        sm:text-xl font-semibold dark:text-white">
                        <span className="px-2 py-1 bg-gradient-to-r from-blue-200
                            via-green-100 to-yellow-50 rounded-lg text-gray-600">
                            Zhifan's
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">Blog</span>
                    </Link>
                </div>
                <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
                    <div>
                        <Footer.Title title='About' />
                        <Footer.LinkGroup col>
                            <Footer.Link 
                                to="/about"
                                target='_blank'
                                rel='noopener noreferrer'
                            > About Me </Footer.Link>
                            <Footer.Link 
                                to="/about"
                                target='_blank'
                                rel='noopener noreferrer'
                            > Contact Ne </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div>
                        <Footer.Title title='Follow Us' />
                        <Footer.LinkGroup col>
                            <Footer.Link 
                                href="https://www.github.com"
                                target='_blank'
                                rel='noopener noreferrer'
                            > Github </Footer.Link>
                            <Footer.Link 
                                href='https://www.discord.com'
                                target='_blank'
                                rel='noopener noreferrer'
                            > Discord </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div>
                        <Footer.Title title='Legal' />
                        <Footer.LinkGroup col>
                            <Footer.Link 
                                href="#"
                                target='_blank'
                                rel='noopener noreferrer'
                            > Privacy Policy </Footer.Link>
                            <Footer.Link 
                                href='#'
                                target='_blank'
                                rel='noopener noreferrer'
                            > Terms & Conditions </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                </div>
            </div>
            <Footer.Divider />
            <div className='w-full sm:flex sm:items-center sm:justify-between'>
                <Footer.Copyright 
                    href='#' 
                    by="Zhifan's Blog" 
                    year={new Date().getFullYear()}
                />
                <div className='flex gap-6 sm:mt-2 mt-4 sm:justify-center'>
                    <Footer.Icon href='#' icon={BsFacebook} />
                    <Footer.Icon href='#' icon={BsInstagram} />
                    <Footer.Icon href='#' icon={BsX} />
                    <Footer.Icon href='#' icon={BsGithub} />
                </div>
            </div>
        </div>
    </Footer>
  )
}



import { Sidebar } from 'flowbite-react';
import { HiArrowSmRight, HiDocumentText, HiUser } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { logoutSuccess } from '../redux/user/userSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import apiRequest from '../../lib/apiRequest.js';

export default function DashSidebar() {
  const { currUser } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl){
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleLogout = async() => {
    try{
      const res = await apiRequest.post('auth/logout');
      dispatch(logoutSuccess());
    } catch (error) {
      console.log(error);
    }
}

  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-2'>
                <Link to="/dashboard?tab=profile">
                  <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currUser.isAdmin ? 'Admin' : 'User'} labelColor='dark' as='div'>
                    Profile
                  </Sidebar.Item>
                </Link>
                {currUser.isAdmin && 
                <Link to="/dashboard?tab=posts">
                  <Sidebar.Item active={tab === 'posts'} icon={HiDocumentText} as='div'>
                    Posts
                  </Sidebar.Item>
                </Link>}
                <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleLogout}>
                    Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

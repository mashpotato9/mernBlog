import { Link } from 'react-router-dom'
import CallToAction from '../components/CallToAction.jsx'
import { useEffect, useState } from 'react'
import apiRequest from '../../lib/apiRequest.js'
import PostCard from '../components/PostCard.jsx'

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await apiRequest.get('/post?limit=6');
      if (res.status === 200) {
        setPosts(res.data.posts);
      }
    }
    fetchPosts();
  }, []);


  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl ">Welcome to my blog</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          fringilla, nunc at ultrices posuere, nunc libero ultricies diam, nec
          tempus odio purus nec ipsum. Donec auctor, tortor nec lacinia
          elementum, elit metus tincidunt
        </p>
        <Link to='/search' className='text-xs sm:text-sm text-blue-300 font-bold hover:underline '>
        View all posts
        </Link>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-400 max-w-6xl mx-auto'>
        <CallToAction />
      </div>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {
          posts && posts.length > 0 && (
            <div className='p-3 max-w-6xl mx-auto'>
              <h2 className='text-2xl font-semibold'>Recent Posts</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </div>
          )
        }
      </div>
      <div className='flex justify-center pb-5'>
        <Link to={'/search'} className='text-lg text-blue-500 hover:underline'>
          View All Posts
        </Link>
      </div>
    </div>
  )
}

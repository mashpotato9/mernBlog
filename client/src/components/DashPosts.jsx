import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiRequest from "../../lib/apiRequest";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";


export default function DashPosts() {
  const { currUser } = useSelector((state) => state.user);
  const [showMore, setShowMore] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [showWindow, setShowWindow] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await apiRequest.get(`/post?userId=${currUser._id}`);
        if (res.status === 200) {
          setUserPosts(res.data.posts);
          if(res.data.posts.length < 6) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currUser?.isAdmin) {
      fetchPosts();
    }
  }, [currUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try{
      const res = await apiRequest.get(`/post?userId=${currUser._id}&startIndex=${startIndex}`);
      if (res.status === 200) {
        setUserPosts((prev) => [...prev, ...res.data.posts]);
        if(res.data.posts.length < 6) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeletePost = async () => {
    setShowWindow(false);
    try{
      const res = await apiRequest.delete(`/post/${postIdToDelete}`);
      if (res.status === 200) {
        setUserPosts(prev => prev.filter(post => post._id !== postIdToDelete));
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="table-auto overflow-x-scroll md: mx-auto p-3 scrollbar 
    scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700
    dark:scrollbar-thumb-slate-500">
      {currUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
                <Table.HeadCell>Date updated</Table.HeadCell>
                <Table.HeadCell>Post image</Table.HeadCell>
                <Table.HeadCell>Post title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell>
                    <span>Edit</span>
                </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
                <Table.Body key={post._id} divide-y>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                        <Table.Cell>
                            <Link to={`/post/${post.slug}`}>
                                <img src={post.image} alt={post.title} className="w-20 h-12 object-cover bg-gray-500" />
                            </Link>
                        </Table.Cell>
                        <Table.Cell>
                            <Link className="font-medium text-gray-900 dark:text-white" to={`/post/${post.slug}`}>{post.title}</Link>
                        </Table.Cell>
                        <Table.Cell>{post.category}</Table.Cell>
                        <Table.Cell>
                            <span onClick={() => {setShowWindow(true); setPostIdToDelete(post._id);}} className="font-medium text-red-400 hover:underline cursor-pointer">
                              Delete
                            </span>
                        </Table.Cell>
                        <Table.Cell>
                            <Link className='text-blue-400 hover:underline cursor-pointer' to={`/editPost/${post._id}`}>
                                <span>Edit</span>
                            </Link>
                            
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            ))}
          </Table>
          {
            showMore && (
              <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
                Show More
              </button>
            )
          }
        </>
      ) : (
        <p>You do not have any post yet</p>
      )}
      <Modal show={showWindow} onClose={() => setShowWindow(false)} popup size='md'>
            <Modal.Header />
            <Modal.Body>
                <div className='text-center'>
                    <HiOutlineExclamationCircle className='text-gray-400 dark:text-gray-200 w-14 h-14 mb-4 mx-auto' />
                    <p className='mb-5 text-lg text-gray-500 dark:text-gray-300'>Are you sure you want to delete this post?</p>
                </div>
                <div className='flex justify-center gap-20'>
                    <Button color='failure' onClick={handleDeletePost}>Yes, I'm sure</Button>
                    <Button color='' onClick={() => setShowWindow(false)}>Cancel</Button>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  );
}

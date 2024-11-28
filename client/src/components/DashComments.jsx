import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiRequest from "../../lib/apiRequest";
import { Button, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";


export default function DashComments() {
  const { currUser } = useSelector((state) => state.user);
  const [showMore, setShowMore] = useState(true);
  const [comments, setComments] = useState([]);
  const [showWindow, setShowWindow] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await apiRequest.get('/comment');
        if (res.status === 200) {
            setComments(res.data.comments);
          if(res.data.comments.length < 6) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currUser?.isAdmin) {
        fetchComments();
    }
  }, [currUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try{
      const res = await apiRequest.get(`/comment?startIndex=${startIndex}`);
      if (res.status === 200) {
        setComments((prev) => [...prev, ...res.data.comments]);
        if(res.data.comments.length < 6) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeleteComment = async () => {
    try{
        const res = await apiRequest.delete(`/comment/${commentIdToDelete}`);
        if (res.status === 200) {
            setComments(prev => prev.filter(user => user._id !== commentIdToDelete));
            setShowWindow(false);
        }
    } catch (error) {
        console.log(error);
    }
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar
     scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700
      dark:scrollbar-thumb-slate-500">
      {currUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
                <Table.HeadCell>Date Updated</Table.HeadCell>
                <Table.HeadCell>Comment content</Table.HeadCell>
                <Table.HeadCell>Number of Likes</Table.HeadCell>
                <Table.HeadCell>Post Id</Table.HeadCell>
                <Table.HeadCell>User Id</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
                <Table.Body key={comment._id} divide-y='true'>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                        <Table.Cell>
                            {comment.content}
                        </Table.Cell>
                        <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                        <Table.Cell>{comment.postId}</Table.Cell>
                        <Table.Cell>{comment.userId}</Table.Cell>
                        <Table.Cell>
                            <span onClick={() => {setShowWindow(true); setCommentIdToDelete(comment._id);}} className="font-medium text-red-400 hover:underline cursor-pointer">
                              Delete
                            </span>
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
        <p>There is currently no comment</p>
      )}
      <Modal show={showWindow} onClose={() => setShowWindow(false)} popup size='md'>
            <Modal.Header />
            <Modal.Body>
                <div className='text-center'>
                    <HiOutlineExclamationCircle className='text-gray-400 dark:text-gray-200 w-14 h-14 mb-4 mx-auto' />
                    <p className='mb-5 text-lg text-gray-500 dark:text-gray-300'>Are you sure you want to delete this comment?</p>
                </div>
                <div className='flex justify-center gap-20'>
                    <Button color='failure' onClick={handleDeleteComment}>Yes, I'm sure</Button>
                    <Button color='' onClick={() => setShowWindow(false)}>Cancel</Button>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  );
}

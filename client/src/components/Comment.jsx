import { Alert, Button, Textarea } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import apiRequest from '../../lib/apiRequest.js'
import SingleComment from './SingleComment.jsx';


export default function Comment({ postId }) {
    const {currUser} = useSelector(state => state.user);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState('');
    const [commentsToDisplay, setCommentsToDisplay] = useState([]);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(comment.length < 1) return;
        try{
            const res = await apiRequest.post('/comment', {
                content: comment,
                postId,
                userId: currUser._id
            })

            if(res.status === 200){
                setComment('');
                setCommentError('');
                setCommentsToDisplay([res.data, ...commentsToDisplay]);
            }
        }
        catch(err){
            setCommentError(err.response.data.message);
        }
    }

    useEffect(() => {
        const getComments = async () => {
            try{
                const res = await apiRequest.get(`/comment/${postId}`);
                if(res.status === 200){
                    setCommentsToDisplay(res.data);
                }
            } catch(err){
                console.log(err);
            }
        }
        getComments();
    }, [postId])

    const handleLike = async (commentId) => {
        try{
            if(!currUser) {
                navigate('/login');
                return;
            }
            const res = await apiRequest.put(`/comment/likeComment/${commentId}`);

            if(res.status === 200){
                setCommentsToDisplay(commentsToDisplay.map(comment =>
                    comment._id === commentId ?{
                        ...comment,
                        likes: res.data.likes,
                        numberOfLikes: res.data.likes.length
                    } : comment
                ));
            }
        } catch(err){
            console.log(err);
        }
    }

    const handleEdit = async (comment, editedContent) => {
        setCommentsToDisplay(commentsToDisplay.map(c =>
            c._id === comment._id ? {
                ...c,
                content: editedContent
            } : c
        ));
    }

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
        {currUser ? (
            <div className='flex items-center gap-2 my-5 text-gray-500 text-sm'>
                <p>Signed In As:</p>
                <img className='h-5 w-5 object-cover rounded-full' src={currUser.profilePicture} alt="" />
                <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-600 hover:underline'>
                    @{currUser.username}
                </Link>
            </div>
        ) : (
            <div className='text-s text-red-400 my-5 flex gap-2'>
                <p>Sign In To Comment</p>
                <Link to={'/login'} className='text-blue-500 hover:underline'>
                    Sign In
                </Link>
            </div>
        )}
        {currUser && (
            <form onSubmit={handleSubmit} className='border border-blue-300 rounded-md p-3'>
                <Textarea placeholder='Add a comment...' rows={4} maxLength={200} onChange={(e) => setComment(e.target.value)} value={comment}/>
                <div className='flex justify-between items-center mt-5'>
                    <p className='text-gray-500 text-sm'>{200 - comment.length} Characters remaining</p>
                    <Button gradientDuoTone='tealToLime' type='submit' >Post Comment</Button>
                </div>
                {commentError && (
                    <Alert color='failure' className='mt-3' >{commentError}</Alert>
                )}
                
            </form>
        )}
        {commentsToDisplay.length === 0 ? (
            <p className='text-gray-500 text-sm mt-5'>No Comments Yet</p>
        ) : (
            <>
            <div className='text-sm my-5 flex items-center gap-1'>
                <p>Comments</p>
                <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                    <p>{commentsToDisplay.length}</p>
                </div>
            </div>
            {commentsToDisplay.map(comment => (
                <SingleComment 
                key={comment._id}
                comment={comment}
                onLike={handleLike}
                onEdit={handleEdit}
                />
            ))}

            </>
        )}
    </div>
  )
}

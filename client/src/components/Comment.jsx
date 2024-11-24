import { Alert, Button, Textarea } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import apiRequest from '../../lib/apiRequest.js'

export default function Comment({postId}) {
    const {currUser} = useSelector(state => state.user);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState('');

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
            }
        }
        catch(err){
            setCommentError(err.response.data.message);
        }
        
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
    </div>
  )
}

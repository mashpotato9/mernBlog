import { useEffect, useState } from 'react'
import apiRequest from '../../lib/apiRequest.js'
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function SingleComment({comment, onLike}) {
    const {currUser} = useSelector(state => state.user);
    const [commentUser, setCommentUser] = useState({});

    useEffect(() => {
        const getUser = async () => {
            try{
                const res = await apiRequest.get(`/user/${comment.userId}`);
                if(res.status === 200){
                    setCommentUser(res.data);
                }
            } catch(err){
                console.log(err);
            }
        }
        getUser();
    }, [comment])

  return (
    <div className='flex p-4 border-b dark:border-gray-500 text-sm'>
        <div className='flex-shrink-0 mr-3'>
            <img className='w-10 h-10 rounded-full bg-gray-200' src={commentUser.profilePicture} alt={commentUser.username} />
        </div>
        <div className='flex-1'>
            <div className='flex item-center mb-2' >
                <span className='font-bold mr-1 text-xs truncate'>{commentUser ? `@${commentUser.username}` : 'anonymous user'}</span>
                <span className='text-gray-500 text-xs'>
                    {moment(comment.createdAt).fromNow()}
                </span>
            </div>
            <p className='text-gray-600 pb-2'>{comment.content}</p>
            <div className='flex items-center gap-2 pt-2 text-xs border-t dark:border-gray-700 max-w-fit'>
                <button type='button' className={`text-gray-400 hover:text-blue-400 ${
                    currUser && comment.likes.includes(currUser._id) && '!text-blue-400'}`}
                onClick={() => onLike(comment._id)}>
                    <FaThumbsUp className='text-sm' />
                </button>
                <p className='text-gray-400'>{comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes ===1 ? 'like' : 'likes')}</p>
            </div>
        </div>
    </div>
  )
}

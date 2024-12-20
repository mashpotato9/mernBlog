import { useEffect, useState } from 'react'
import apiRequest from '../../lib/apiRequest.js'
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Textarea } from 'flowbite-react';
import { Button } from 'flowbite-react';

export default function SingleComment({comment, onLike, onEdit, onDelete}) {
    const {currUser} = useSelector(state => state.user);
    const [commentUser, setCommentUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    

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

    const handleEdit = () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    }

    const handleSave = async () => {
        try {
            const res = await apiRequest.put(`/comment/editComment/${comment._id}`, {
                content: editedContent
            });
            if(res.status === 200){
                onEdit(comment, editedContent);
                setIsEditing(false);
            }
        } catch (error) {
            console.log(error);
        }
    }
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
            {isEditing ? (
                <>
                    <Textarea className='mb-2'
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                    />
                    <div className='flex justify-end gap-2 text-xs'>
                        <Button type='button' gradientDuoTone='tealToLime'
                        onClick={handleSave}>
                            Save
                        </Button>
                        <Button type='button' gradientDuoTone='tealToLime' outline
                        onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                    </div>
                </>
            ) : (
                <>  
                    <p className='text-gray-600 pb-2'>{comment.content}</p>
                    <div className='flex items-center gap-2 pt-2 text-xs border-t dark:border-gray-700 max-w-fit'>
                        <button type='button' className={`text-gray-400 hover:text-blue-400 ${
                        currUser && comment.likes.includes(currUser._id) && '!text-blue-400'}`}
                        onClick={() => onLike(comment._id)}>
                            <FaThumbsUp className='text-sm' />
                        </button>
                        <p className='text-gray-400'>{comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes ===1 ? 'like' : 'likes')}</p>
                        {currUser && (currUser._id === comment.userId || currUser.isAdmin) && (
                            <>
                            <button type='button' className='text-gray-400 hover:text-blue-400'
                            onClick={handleEdit}>
                                Edit
                            </button>
                            <button type='button' className='text-gray-400 hover:text-red-400'
                            onClick={() => onDelete(comment._id)}>
                                Delete
                            </button>
                            </>
                        )}
                    </div>
                </>
            )}
            
        </div>
    </div>
  )
}

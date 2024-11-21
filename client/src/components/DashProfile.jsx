import { Alert, Button, TextInput, Modal } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateStart, updateSuccess, updateFailure, deleteStart, deleteSuccess, deleteFailure } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';
import apiRequest from '../../lib/apiRequest.js';


export default function DashProfile() {
    const { currUser, error } = useSelector(state => state.user);
    const [imgFile, setImgFile] = useState(null);
    const [imgURL, setImgURL] = useState(null);
    const [progress, setProgress] = useState(false);
    const [imgUploadError, setImgUploadError] = useState(null);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [showWindow, setShowWindow] = useState(false);
    const [formData, setFormData] = useState({});
    

    const filePickerRef = useRef();
    const dispatch = useDispatch();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                setImgUploadError('File size too large (max 2MB)');
                return;
            }
            setImgFile(file);
            setImgURL(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        if(imgFile){
            uploadImg();
        }
    }, [imgFile]);

    const uploadImg = async () => {
        setProgress(true)
        setImgUploadError(null);
        const data = getStorage(app);
        const fileName = new Date().getTime() + '-' + imgFile.name;
        const storageRef = ref(data, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imgFile);
        uploadTask.on(
            'state_changed',
            (error) => {
                setImgUploadError('Could not upload image (File too large)');
                setImgURL(null);
                setImgFile(null);
                setProgress(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImgURL(downloadURL);
                    setFormData({ ...formData, profilePicture: downloadURL });
                    setProgress(false);
                });
            },
        );
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        if(Object.keys(formData).length === 0){
            setUpdateUserError('No changes made');
            return;
        }
        if(progress){
            return;
        }
        try {
            dispatch(updateStart());
            const res = await apiRequest.put(`user/update/${currUser._id}`, formData);
            dispatch(updateSuccess(res.data));
            setUpdateUserSuccess('User updated successfully');
        } catch (error) {
            dispatch(updateFailure(error.response?.data?.message));
            setUpdateUserError(error.response?.data?.message);
        }
    }

    const handleDeleteUser = async () => {
        setShowWindow(false);
        try {
            dispatch(deleteStart());
            const res = await apiRequest.delete(`user/delete/${currUser._id}`);
            dispatch(deleteSuccess(res.data.message));
        } catch (error) {
            dispatch(deleteFailure(error.response?.data?.message));
        }
    }


  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
            <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={()=> filePickerRef.current.click()}>
                <img src={imgURL || currUser.profilePicture} alt="user" className='rounded-full w-full h-full object-cover border-8 border-[lightgray]' />   
            </div>
            {imgUploadError && (
                <Alert color='failure'>
                {imgUploadError}
                </Alert>
            )}
            <TextInput type='text' id='username' placeholder='username' defaultValue={currUser.username} onChange={handleChange} />
            <TextInput type='email' id='email' placeholder='email' defaultValue={currUser.email} onChange={handleChange} />
            <TextInput type='password' id='password' placeholder='password' onChange={handleChange} />
            <Button type='submit' className='w-60 self-center' gradientDuoTone='tealToLime' outline>Update</Button>
        </form>
        <div className='text-red-500 flex justify-between mt-5'>
            <span className='cursor-pointer' onClick={() => setShowWindow(true)}>Delete Account</span>
            <span className='cursor-pointer'>Log out</span>
        </div>
        {updateUserSuccess && (
            <Alert color='success' className='mt-5'>
            {updateUserSuccess}
            </Alert>
        )}
        {updateUserError && (
            <Alert color='failure' className='mt-5'>
            {updateUserError}
            </Alert>
        )}
        {error && (
            <Alert color='failure' className='mt-5'>
            {error}
            </Alert>
        )}
        <Modal show={showWindow} onClose={() => setShowWindow(false)} popup size='md'>
            <Modal.Header />
            <Modal.Body>
                <div className='text-center'>
                    <HiOutlineExclamationCircle className='text-gray-400 dark:text-gray-200 w-14 h-14 mb-4 mx-auto' />
                    <p className='mb-5 text-lg text-gray-500 dark:text-gray-300'>Are you sure you want to delete your account?</p>
                </div>
                <div className='flex justify-center gap-20'>
                    <Button color='failure' onClick={handleDeleteUser}>Yes, I'm sure</Button>
                    <Button color='' onClick={() => setShowWindow(false)}>Cancel</Button>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

import { Alert, Button, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateStart, updateSuccess, updateFailure } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';
import apiRequest from '../../lib/apiRequest.js';


export default function DashProfile() {
    const { currUser } = useSelector(state => state.user);
    const [imgFile, setImgFile] = useState(null);
    const [imgURL, setImgURL] = useState(null);
    const [progress, setProgress] = useState(false);
    const [imgUploadError, setImgUploadError] = useState(null);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
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
            <span className='cursor-pointer'>Delete Account</span>
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
    </div>
  )
}

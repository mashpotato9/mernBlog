import { Alert, Button, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';


export default function DashProfile() {
    const { currUser } = useSelector(state => state.user);
    const [imgFile, setImgFile] = useState(null);
    const [imgURL, setImgURL] = useState(null);
    const [progress, setProgress] = useState(null);
    const [imgUploadError, setImgUploadError] = useState(null);
    const filePickerRef = useRef();

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
        setImgUploadError(null);
        const data = getStorage(app);
        const fileName = new Date().getTime() + '-' + imgFile.name;
        const storageRef = ref(data, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imgFile);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress.toFixed(0));
            },
            (error) => {
                setImgUploadError('Could not upload image (File too large)');
                setImgURL(null);
                setImgFile(null);
                setProgress(null);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImgURL(downloadURL);
                });
            },
        );

    };


  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form className='flex flex-col gap-4'>
            <input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
            <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={()=> filePickerRef.current.click()}>
                <img src={imgURL || currUser.profilePicture} alt="user" className='rounded-full w-full h-full object-cover border-8 border-[lightgray]' />   
            </div>
            {imgUploadError && (
                <Alert color='failure'>
                {imgUploadError}
                </Alert>
            )}
            <TextInput type='text' id='username' placeholder='username' defaultValue={currUser.username}/>
            <TextInput type='email' id='email' placeholder='email' defaultValue={currUser.email}/>
            <TextInput type='password' id='password' placeholder='password'/>
            <Button type='submit' className='w-60 self-center' gradientDuoTone='tealToLime' outline>Update</Button>
        </form>
        <div className='text-red-500 flex justify-between mt-5'>
            <span className='cursor-pointer'>Delete Account</span>
            <span className='cursor-pointer'>Log out</span>
        </div>
    </div>
  )
}

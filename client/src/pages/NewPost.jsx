import { TextInput, Select, FileInput, Button } from 'flowbite-react';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';


export default function NewPost() {
    const [file, setFile] = useState(null);
    const [imgUploadProgress, setImgUploadProgress] = useState(null);
    const [imgUploadError, setImgUploadError] = useState(null);
    const [form, setForm] = useState({});

    const handleUploadImg = async () => {
        try{
            if(!file){
                setImgUploadError('Please select an image');
                return;
            }
            setImgUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed', 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImgUploadProgress(progress.toFixed(0));
                }, 
                (error) => {
                    setImgUploadError(error.message);
                    setImgUploadProgress(null);
                }, 
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImgUploadProgress(null);
                        setImgUploadError(null);
                        setForm({...form, image: downloadURL});
                    });
                }
            );
        } catch (error) {
            setImgUploadError('An error occurred');
            setImgUploadProgress(null);
            console.log(error);
        }

    }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">New Post</h1>
        <form className="flex flex-col space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput type='text' placeholder='Title' required id='title' className='flex-1' />
                <Select>
                    <option value='uncategorize'>Select a category</option>
                    <option value='javascript'> JavaScript </option>
                    <option value='typescript'> TypeScript </option>
                    <option value='reactjs'>React.js</option>
                    <option value='nodejs'>Node.js</option>
                </Select>
            </div>
            <div className='flex gap-4 items-center justify-between border-4 border-blue-200 border-dotted p-3'>
                <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                <Button type='button' gradientDuoTone='tealToLime' size='sm' outline onClick={handleUploadImg} >Upload Image</Button>
            </div>
            <ReactQuill theme='snow' placeholder='Write Something' className='h-72 mb-12'/>
            <Button type='submit' gradientDuoTone='tealToLime'>Publish</Button>
        </form>
        
    </div>
  )
}

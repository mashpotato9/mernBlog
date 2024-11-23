import { TextInput, Select, FileInput, Button, Alert } from 'flowbite-react';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';
import apiRequest from '../../lib/apiRequest.js';
import { useNavigate, useParams } from 'react-router-dom';


export default function EditPost() {
    const [file, setFile] = useState(null);
    const [imgUploadProgress, setImgUploadProgress] = useState(null);
    const [imgUploadError, setImgUploadError] = useState(null);
    const [form, setForm] = useState({});
    const [uploadError, setUploadError] = useState(null);
    const { postId } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // Use postId as a query parameter
                const res = await apiRequest.get(`/post?postId=${postId}`);
                if (res.status === 200) {
                    // Since getPosts returns an array in posts field
                    setForm(res.data.posts[0]);
                    setUploadError(null);
                }
            } catch (error) {
                console.error('Error fetching post:', error);
                setUploadError(error.response?.data?.message || 'Error fetching post');
            }
        };
        
        if (postId) {
            fetchPost();
        }
    }, [postId]);

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
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await apiRequest.put(`/post/${form._id}`, form);
            if(res.status !== 200){
                setUploadError(res.data.message);
                return;
            } else {
                console.log('Post updated:', res.data);
                setUploadError(null);
                navigate(`/post/${res.data.slug}`);
            }
        } catch (error) {
            setUploadError(error.message);
        }

    }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">Edit Post</h1>
        <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput type='text' placeholder='Title' required id='title' className='flex-1' onChange={
                    (e) => setForm({...form, title: e.target.value})
                } value={form.title} />
                <Select onChange={
                    (e) => setForm({...form, category: e.target.value})
                } value={form.category}>
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
            {imgUploadError && <Alert color='failure'>{imgUploadError}</Alert>}
            {form.image && (
                <img
                src={form.image}
                alt='upload'
                className='w-full h-72 object-cover'
                />
            )}
            <ReactQuill value={form.content} theme='snow' placeholder='Write Something' className='h-72 mb-12' onChange={
                (value) => setForm({...form, content: value})
            } />
            <Button type='submit' gradientDuoTone='tealToLime'>Update</Button>
            {uploadError && <Alert type='error'>{uploadError}</Alert>}
        </form>
        
    </div>
  )
}

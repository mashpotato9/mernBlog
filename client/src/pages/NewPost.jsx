import { TextInput, Select, FileInput, Button } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function NewPost() {
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
                <FileInput type='file' accept='image/*' />
                <Button type='button' gradientDuoTone='tealToLime' size='sm' outline>Upload Image</Button>
            </div>
            <ReactQuill theme='snow' placeholder='Write Something' className='h-72 mb-12'/>
            <Button type='submit' gradientDuoTone='tealToLime'>Publish</Button>
        </form>
        
    </div>
  )
}

import { Button, TextInput } from 'flowbite-react';
import { useSelector } from 'react-redux';


export default function DashProfile() {
    const { currUser } = useSelector(state => state.user);

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form className='flex flex-col gap-4'>
            <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'>
                <img src={currUser.profilePicture} alt="user" className='rounded-full w-full h-full object-cover border-8 border-[lightgray]' />   
            </div>
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

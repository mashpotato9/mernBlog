import CallToAction from '../components/CallToAction.jsx';

export default function Project() {
  return (
    <div className='min-h-screen max-w-2xl mx-auto flex flex-col justify-center items-center gap-6 p-3'>
      <h1 className='text-6xl font-semibold'>Projects</h1>
      <p className='text-md text-gray-500'>Check Out This MERN Blog App</p>
      <CallToAction />
    </div>
  )
}

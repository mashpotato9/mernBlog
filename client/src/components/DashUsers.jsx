import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiRequest from "../../lib/apiRequest";
import { Button, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";


export default function DashUsers() {
  const { currUser } = useSelector((state) => state.user);
  const [showMore, setShowMore] = useState(true);
  const [users, setUsers] = useState([]);
  const [showWindow, setShowWindow] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiRequest.get('/user');
        if (res.status === 200) {
            setUsers(res.data.users);
          if(res.data.users.length < 6) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currUser?.isAdmin) {
        fetchUsers();
    }
  }, [currUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try{
      const res = await apiRequest.get(`/user?startIndex=${startIndex}`);
      if (res.status === 200) {
        setUsers((prev) => [...prev, ...res.data.users]);
        if(res.data.users.length < 6) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeleteUser = async () => {
    try{
        const res = await apiRequest.delete(`/user/${userIdToDelete}`);
        if (res.status === 200) {
            setUsers(prev => prev.filter(user => user._id !== userIdToDelete));
            setShowWindow(false);
        }
    } catch (error) {
        console.log(error);
    }
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100
     scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
                <Table.HeadCell>Date Created</Table.HeadCell>
                <Table.HeadCell>User image</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Admin</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
                <Table.Body key={user._id} divide-y='true'>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                        <Table.Cell>
                            <img src={user.profilePicture} alt={user.username} className="w-10 h-10 object-cover bg-gray-500 rounded-full" />
                        </Table.Cell>
                        <Table.Cell>{user.username}</Table.Cell>
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>{user.isAdmin ? 'Yes' : 'No'}</Table.Cell>
                        <Table.Cell>
                            <span onClick={() => {setShowWindow(true); setUserIdToDelete(user._id);}} className="font-medium text-red-400 hover:underline cursor-pointer">
                              Delete
                            </span>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            ))}
          </Table>
          {
            showMore && (
              <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
                Show More
              </button>
            )
          }
        </>
      ) : (
        <p>There is currently no user</p>
      )}
      <Modal show={showWindow} onClose={() => setShowWindow(false)} popup size='md'>
            <Modal.Header />
            <Modal.Body>
                <div className='text-center'>
                    <HiOutlineExclamationCircle className='text-gray-400 dark:text-gray-200 w-14 h-14 mb-4 mx-auto' />
                    <p className='mb-5 text-lg text-gray-500 dark:text-gray-300'>Are you sure you want to delete this user?</p>
                </div>
                <div className='flex justify-center gap-20'>
                    <Button color='failure' onClick={handleDeleteUser}>Yes, I'm sure</Button>
                    <Button color='' onClick={() => setShowWindow(false)}>Cancel</Button>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  );
}


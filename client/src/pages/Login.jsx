import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest.js";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../redux/user/userSlice.js";
import OAuth from "../components/OAuth.jsx";

export default function Login() {

  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username').trim();
    const password = formData.get('password').trim();

    if (!username || !password) {
      return dispatch(loginFailure('All fields are required'));
    }

    try {
      dispatch(loginStart());
      const res = await apiRequest.post('/auth/login', {
        username,
        password
      });
      dispatch(loginSuccess(res.data));
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      
      if (errorMessage?.includes('duplicate key error')) {
        dispatch(loginFailure('Username already exists. Please choose another one.'));
      } else if (error.response?.data?.message) {
        dispatch(loginFailure(error.response.data.message));
      } else if (error.response?.status === 500) {
        dispatch(loginFailure('Server error. Please try again later.'));
      } else {
        dispatch(loginFailure('Something went wrong. Please try again.'));
      }
    }
  }

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="#" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-blue-200
              via-green-100 to-yellow-50 rounded-lg text-gray-600">
              Zhifan's
            </span>
              <span className="text-gray-700">Blog</span>
          </Link>
          <p className="text-sm mt-5">
            This is a demo blog site built with React, Tailwind CSS. 
            You can log in to browse posts.
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Username" className="text-xl" />
              <TextInput 
                type="text"
                placeholder="Your Username"
                name="username"
              />
            </div>
            <div>
              <Label value="Password" className="text-xl" />
              <TextInput 
                type="password"
                placeholder="Your Password"
                name="password"
              />
            </div>
            <Button gradientDuoTone="tealToLime" type="submit" disabled={loading} >
              {
                loading ? (
                  <>
                  <Spinner size="sm" />
                  <span className="text-gray-700 pl-3">Loading...</span>
                  </>
                ) : (<span className="text-gray-700">Log in</span>)
              }
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-3">
            <span>Don't have an account?</span>
            <Link to="/register" className="text-blue-500">Sign up</Link>
          </div>
          {error && 
          <Alert className="mt-3" color="failure">{error}</Alert>
          }
        </div>
      </div>
    </div>
  )
}


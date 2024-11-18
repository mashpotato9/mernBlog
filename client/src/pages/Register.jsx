import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest.js";
import { useState } from "react";

export default function Register() {

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username').trim();
    const email = formData.get('email').trim();
    const password = formData.get('password').trim();

    if (!username || !email || !password) {
      setLoading(false);
      return setError('All fields are required');
    }

    try {
      setLoading(true);
      await apiRequest.post('/auth/register', {
        username,
        email,
        password
      });
      setError(null);
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      
      // Handle specific error cases
      if (errorMessage?.includes('duplicate key error')) {
        setError('Username already exists. Please choose another one.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-blue-200
              via-green-100 to-yellow-50 rounded-lg text-gray-600">
              Zhifan's
            </span>
              <span className="text-gray-700">Blog</span>
          </Link>
          <p className="text-sm mt-5">
            This is a demo blog site built with React, Tailwind CSS. 
            You can sign up to browse posts.
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
              <Label value="Email" className="text-xl" />
              <TextInput 
                type="email"
                placeholder="name@company.com"
                name="email"
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
            <Button gradientDuoTone="redToYellow" type="submit" disabled={loading} >
              {
                loading ? (
                  <>
                  <Spinner size="sm" />
                  <span className="text-gray-700 pl-3">Loading...</span>
                  </>
                ) : (<span className="text-gray-700">Sign up</span>)
              }
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-3">
            <span>Have an account?</span>
            <Link to="/login" className="text-blue-500">Sign in</Link>
          </div>
          {error && 
          <Alert className="mt-3" color="failure">{error}</Alert>
          }
        </div>
      </div>
    </div>
  )
}

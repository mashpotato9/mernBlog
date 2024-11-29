import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Projects from './pages/Projects.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Login from './pages/Login.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import NewPost from './pages/newPost.jsx'
import EditPost from './pages/EditPost.jsx'
import SinglePage from './pages/SinglePage.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Search from './pages/Search.jsx'

export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Header />
      <div className='pt-[64px]'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Search />} />
          <Route element={<PrivateRoute />} > 
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<AdminRoute />} > 
            <Route path="/newpost" element={<NewPost />} />\
            <Route path='/editpost/:postId' element={<EditPost />} />
          </Route>
          <Route path="/projects" element={<Projects />} />
          <Route path="/post/:postSlug" element={<SinglePage />} />

        </Routes>
        <Footer />
      </div>
      
    </BrowserRouter>
  )
}


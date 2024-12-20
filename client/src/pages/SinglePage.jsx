import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import apiRequest from "../../lib/apiRequest"
import { Button, Spinner } from "flowbite-react";
import CallToAction from "../components/CallToAction.jsx";
import Comment from "../components/Comment.jsx";
import PostCard from "../components/PostCard.jsx";

export default function SinglePage() {
    const { slug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);
    const [recentPosts, setRecentPosts] = useState([]);

    console.log(slug);

    useEffect(() => {
        const fetchPost = async () => {
            try{
                setLoading(true);
                const res = await apiRequest.get(`/post?slug=${slug}`)
                if(res.status === 200) {
                    setPost(res.data.posts[0]);
                    setLoading(false);
                    setError(false);
                } else {
                    setError(true);
                    setLoading(false);
                    return;
                }
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        }
        fetchPost()
    }, [slug]);

    useEffect(() => {
        try {
            const fetchRecentPosts = async () => {
                const res = await apiRequest.get('/post?limit=3')
                if(res.status === 200) {
                    setRecentPosts(res.data.posts);
                }
            }
            fetchRecentPosts();
        } catch (error) {
            console.log(error);
        }
    }, [])

    if(loading) {
        return(
        <div className="flex justify-center items-center min-h-screen">
            <Spinner size="xl" />
        </div>
        )
    }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen" >
        <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto
        lg:text-4xl">{post && post.title}</h1>
        <Link to={`/search?category=${post.category}`} className="self-center mt-5">
            <Button color="gray" pill size='xs'>{post && post.category}</Button>
        </Link>
        <img src={post && post.image} alt={post && post.title} className="mt-5 p-3 max-h-[600px] w-full object-cover" />
        <div className="flex justify-between p-3 border-b border-slate-600 mx-auto w-full max-w-2xl text-xs">
            <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="italic">{post && (post.content.length / 1000).toFixed(0)} mins read</span>
        </div>
        <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{__html: post && post.content}}>

        </div>
        <div className="max-w-4xl mx-auto w-full">
            <CallToAction />
        </div>
        <Comment postId={post._id} />

        <div className="flex flex-col justify-center items-center mb-5">
            <h1 className="text-xl mt-5"> Recent Articles</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                {recentPosts && 
                    recentPosts.map(post => (<PostCard key={post._id} post={post} />))
                }
            </div>
        </div>
    </main>
  )
}

import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import PostCard from "../components/PostCard.jsx";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    order: "desc",
    category: "Uncategorized",
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchTermFromUrl = searchParams.get("searchTerm");
    const sortFromUrl = searchParams.get("order");
    const categoryFromUrl = searchParams.get("category");

    setSidebarData({
        searchTerm: searchTermFromUrl || "",
        order: sortFromUrl || "desc",
        category: categoryFromUrl || "uncategorized",
    });

    const fetchPosts = async () => {
        setLoading(true);
        const query = searchParams.toString();
        
        try {
            const res = await apiRequest.get(`post?${query}`);
            if (res.status === 200) {
                setPosts(res.data.posts);
                setLoading(false);
                if (res.data.posts.length === 6) {
                    setShowMore(true);
                } else {
                    setShowMore(false);
                }
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };
    fetchPosts();
}, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData((prev) => ({
        ...prev,
        searchTerm: e.target.value,
      }));
    }
    if (e.target.id === "order") {
      const order = e.target.value || "desc";
      setSidebarData((prev) => ({
        ...prev,
        order,
      }));
    }
    if (e.target.id === "category") {
      const cate = e.target.value || "Uncategorized";
      setSidebarData((prev) => ({
        ...prev,
        category: cate,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();

    if (sidebarData.searchTerm) {
        searchParams.set("searchTerm", sidebarData.searchTerm);
    }

    searchParams.set("order", sidebarData.order);

    if (sidebarData.category && sidebarData.category !== "uncategorized") {
        searchParams.set("category", sidebarData.category);
    }

    const query = searchParams.toString();
    navigate(`/search?${query}`);
};

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("startIndex", startIndex);
    searchParams.set("limit", "6");
    if (sidebarData.order) {
        searchParams.set("order", sidebarData.order);
    }
    const query = searchParams.toString();
    console.log('Query string:', query);  // Debug log

    try {
        const res = await apiRequest.get(`post?${query}`);
        console.log('Response:', res.data);  // Debug log
        if (res.status === 200) {
            setPosts((prev) => [...prev, ...res.data.posts]);
            setShowMore(res.data.hasMore);
        }
    } catch (error) {
        console.error(error);
    }
};

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:{" "}
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="font-semibold">Sort: </label>
            <Select id="order" value={sidebarData.order} onChange={handleChange}>
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <label className="font-semibold">Category: </label>
            <Select
              id="category"
              value={sidebarData.category}
              onChange={handleChange}
            >
              <option value="Uncategorized">Uncategorized</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="reactjs">React.js</option>
              <option value="nodejs">Node.js</option>
            </Select>
          </div>
          <Button type="submit" className="w-full" gradientDuoTone="tealToLime">
            Search
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Posts Results
        </h1>
        <div className="p-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            posts.length > 0 &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
        {showMore && (
          <button
            onClick={handleShowMore}
            className="w-full hover:underline p-7"
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
}

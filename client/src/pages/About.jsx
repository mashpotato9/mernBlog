
export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div>
          <h1 className="text-6xl font font-semibold text-center my-7">About</h1>
          <div className="text-lg text-gray-500 flex flex-col gap-6">
            <p>
              This is a simple blog application built with the MERN stack. It
              allows users to create, read, update, and delete posts as well as 
              commenting. Users can also filter posts by category, search for posts, 
              and view latest posts. There are also additional features for Admin users, 
              such as viewing all posts/users and deleting any post/comment.
            </p>

            <p>
              The application uses React for the frontend, Node.js and Express for the 
              backend, and MongoDB for the database. The application is styled with 
              Tailwind CSS and uses React Router for navigation.
            </p>

            <p>
              The source code for this application can be found on{' '}
              <a href="https://github.com/mashpotato9/mernBlog" target="_blank" rel="noreferrer" className="text-blue-400"> github </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

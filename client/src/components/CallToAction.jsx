import { Button } from "flowbite-react";


export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row border border-green-200 justify-center items-center rounded-tl-xl rounded-br-xl p-3">
        <div className="flex-1 justify-center flex flex-col">
            <h2 className="text-2xl font-serif">Check Out Source Code</h2>
            <p className="text-sm mt-3 my-2">You can find the source code of this website by clicking the button</p>
            <div className="w-fit">
              <Button gradientDuoTone='purpleToBlue'className="mt-3 text-gray-100 px-3 py-1 rounded-md ">
                <a href="https://github.com/mashpotato9/mernBlog" target="_blank" >
                  Learn More
                </a>
              </Button>
            </div>

        </div>
        <div className="ml-10">
            <img src="https://static.semrush.com/blog/uploads/files/c2/0d/c20d6af1070cd45205f7c7ab4a92f049/embracing-ai-in-advertising.svg" alt="" />
        </div>
    </div>
  )
}

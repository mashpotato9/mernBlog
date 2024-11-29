import { Button } from "flowbite-react";


export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row border border-green-200 justify-center items-center rounded-tl-xl rounded-br-xl p-6 ">
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
        <div className="ml-10 flex-1">
            <img src="https://firebasestorage.googleapis.com/v0/b/mernblog-611d4.firebasestorage.app/o/image.png?alt=media&token=1c3b8718-6187-4443-af39-868f9a8ce65b" alt="" 
            className="mt-5 sm:mt-0" />
        </div>
    </div>
  )
}

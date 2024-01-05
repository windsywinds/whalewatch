

const Feedback = () => {
    return (
        <div className="pb-4 pt-10 pl-10 pr-10 rounded-xl overflow-hidden">

            <div className="flex items-center justify-center flex-col text-center" >
           
            <p className="text-sm mb-2 pt-2">I'd love to hear from you! If you've encountered any errors or issues while viewing, have a suggestion or just simply want to drop a comment, use the form below to send me a message!</p>
            <p className="text-sm mb-2 font-bold pt-2">If you enjoy using the app and want to help support its improvement, please consider using one of the below options!</p>
            <p className="text-sm mb-1 font-bold pt-2 underline"><a href="https://www.buymeacoffee.com/windsywinds"  target="_blank">Donate</a></p>
            <p className="text-sm font-bold mb-1 underline"><a href="https://windsorphoto.netlify.app"  target="_blank" rel="noopener noreferrer">Buy my prints</a></p>
            <p className="text-sm mb-1 pt-2">Or simply</p>
            <p className="text-sm font-bold underline"><a href="https://instagram.com/windsywinds" target="_blank">Follow me on instagram</a></p>

            </div>
            <div className="flex flex-col mb-0 mx-auto pt-5">
            
            <div className="flex justify-center items-center">

                <form 
                    action="https://getform.io/f/e2059994-fbac-4aba-b565-63d41527e0a8"
                    method="POST"
                    className="flex flex-col w-full md:w-7/12"
                    >
                        
                    <input 
                        type="type"
                        name="name"
                        placeholder="Name"
                        className="p-2 bg-slate-300 border-2 rounded-md focus:outline-none"
                        required
                    ></input>
                    <input
                        type="text"
                        name="hidden"
                        placeholder="hidden"
                        style={{ position: 'absolute', left: '-9999px' }}
                        tabIndex="-1"
                        autoComplete="off"
                        aria-hidden="true"
                        value="Whales"
                    ></input>
                    <input 
                        type="email"
                        name="email"
                        placeholder="Your@Email.com"
                        className="my-2 p-2 bg-slate-300 border-2 rounded-md focus:outline-none"
                        required
                    ></input>
                    <textarea
                        name="message"
                        placeholder="Your Message"
                        rows="10"
                        className="mb-4 p-2 bg-slate-300 border-2 rounded-md focus:outline-none"                        
                        ></textarea>
                        <button 
                        type="submit"
                        className=" w-max
                        inline-block bg-blue-500 text-white hover:bg-blue-600 font-semibold rounded-xl py-2 px-4 transition-colors duration-400 ease-in-out drop-shadow-sm shadow-sm shadow-slate-800"
                        required
                        >Send!</button>
                </form>

            </div>

        </div>
        </div>
    )
}

export default Feedback;


import { useState } from "react";
import Privacy from './Privacy.jsx';

export const Footer = () => {
	const [showPrivacy, setShowPrivacy] = useState(false);

	//pop up privacy page
	const handleClickPrivacy = () => {
	  setShowPrivacy(true);
	};
  //close privcy page
	const handleClosePrivacy = () => {
	  setShowPrivacy(false);
	};

	return (
        <div className="py-5 text-center">
				<div className="container max-w-screen-lg mx-auto">
					<div>
						<div className="flex flex-wrap justify-center gap-4">
							<a 
								href="https://linkedin.com/in/windsor-sam"
                                target="blank"
								className="bg-stone-400 p-2 font-semibold text-white inline-flex items-center space-x-2 rounded-full">
								<svg
								className="w-5 h-5 fill-current"
								role="img"
								viewBox="0 0 256 256"
								xmlns="http://www.w3.org/2000/svg"
								>
								<g>
									<path d="M218.123122,218.127392 L180.191928,218.127392 L180.191928,158.724263 C180.191928,144.559023 179.939053,126.323993 160.463756,126.323993 C140.707926,126.323993 137.685284,141.757585 137.685284,157.692986 L137.685284,218.123441 L99.7540894,218.123441 L99.7540894,95.9665207 L136.168036,95.9665207 L136.168036,112.660562 L136.677736,112.660562 C144.102746,99.9650027 157.908637,92.3824528 172.605689,92.9280076 C211.050535,92.9280076 218.138927,118.216023 218.138927,151.114151 L218.123122,218.127392 Z M56.9550587,79.2685282 C44.7981969,79.2707099 34.9413443,69.4171797 34.9391618,57.260052 C34.93698,45.1029244 44.7902948,35.2458562 56.9471566,35.2436736 C69.1040185,35.2414916 78.9608713,45.0950217 78.963054,57.2521493 C78.9641017,63.090208 76.6459976,68.6895714 72.5186979,72.8184433 C68.3913982,76.9473153 62.7929898,79.26748 56.9550587,79.2685282 M75.9206558,218.127392 L37.94995,218.127392 L37.94995,95.9665207 L75.9206558,95.9665207 L75.9206558,218.127392 Z M237.033403,0.0182577091 L18.8895249,0.0182577091 C8.57959469,-0.0980923971 0.124827038,8.16056231 -0.001,18.4706066 L-0.001,237.524091 C0.120519052,247.839103 8.57460631,256.105934 18.8895249,255.9977 L237.033403,255.9977 C247.368728,256.125818 255.855922,247.859464 255.999,237.524091 L255.999,18.4548016 C255.851624,8.12438979 247.363742,-0.133792868 237.033403,0.000790807055" />
								</g>
								</svg>
							</a>
							<a 
								href="https://windsywinds.github.io/"
                                target="blank"
								className="bg-stone-400 p-2 font-semibold text-white inline-flex items-center space-x-2 rounded-full">
								<svg
								xmlns="http://www.w3.org/2000/svg"
								xmlnsXlink="http://www.w3.org/1999/xlink"
								aria-hidden="true"
								role="img"
								className="w-5"
								preserveAspectRatio="xMidYMid meet"
								viewBox="0 0 24 24"
								>
								<g fill="none">
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
										fill="currentColor"
									/>
								</g>
								</svg>
							</a>
							<a 
								href="https://instagram.com/windsywinds"
                                target="blank"
								className="bg-stone-400 p-2 font-semibold text-white inline-flex items-center space-x-2 rounded-full">
								 <svg 
								xmlns="http://www.w3.org/2000/svg"
								xmlnsXlink="http://www.w3.org/1999/xlink"
								aria-hidden="true"
								role="img"
								className="w-5"
								preserveAspectRatio="xMidYMid meet"
								viewBox="0 0 24 24"> 
								 <g fill="none">
								 <path d="m 12 0 c -3.2565 0 -3.666 0.015 -4.9455 0.072 c -1.2795 0.06 -2.151 0.261 -2.9145 0.558 a 5.8755 5.8755 90 0 0 -2.1255 1.3845 a 5.8905 5.8905 90 0 0 -1.3845 2.1255 c -0.297 0.762 -0.4995 1.635 -0.558 2.91 c -0.057 1.2825 -0.072 1.6905 -0.072 4.9515 c 0 3.258 0.015 3.666 0.072 4.9455 c 0.06 1.278 0.261 2.1495 0.558 2.913 c 0.3075 0.789 0.717 1.458 1.3845 2.1255 c 0.666 0.6675 1.335 1.0785 2.124 1.3845 c 0.765 0.297 1.635 0.4995 2.913 0.558 c 1.281 0.057 1.689 0.072 4.9485 0.072 s 3.666 -0.015 4.947 -0.072 c 1.2765 -0.06 2.151 -0.261 2.9145 -0.558 a 5.874 5.874 90 0 0 2.124 -1.3845 c 0.6675 -0.6675 1.077 -1.3365 1.3845 -2.1255 c 0.2955 -0.7635 0.498 -1.635 0.558 -2.913 c 0.057 -1.2795 0.072 -1.6875 0.072 -4.947 s -0.015 -3.6675 -0.072 -4.9485 c -0.06 -1.2765 -0.2625 -2.1495 -0.558 -2.9115 a 5.889 5.889 90 0 0 -1.3845 -2.1255 a 5.8665 5.8665 90 0 0 -2.1255 -1.3845 c -0.765 -0.297 -1.638 -0.4995 -2.9145 -0.558 c -1.281 -0.057 -1.6875 -0.072 -4.9485 -0.072 h 0.0045 z m -1.0755 2.163 h 1.077 c 3.204 0 3.5835 0.0105 4.848 0.069 c 1.17 0.0525 1.806 0.249 2.229 0.4125 c 0.5595 0.2175 0.96 0.4785 1.38 0.8985 c 0.42 0.42 0.6795 0.819 0.897 1.38 c 0.165 0.4215 0.36 1.0575 0.4125 2.2275 c 0.0585 1.2645 0.0705 1.644 0.0705 4.8465 s -0.012 3.5835 -0.0705 4.848 c -0.0525 1.17 -0.249 1.8045 -0.4125 2.2275 a 3.705 3.705 0 0 1 -0.8985 1.3785 c -0.42 0.42 -0.819 0.6795 -1.38 0.897 c -0.42 0.165 -1.056 0.36 -2.2275 0.414 c -1.2645 0.057 -1.644 0.0705 -4.848 0.0705 s -3.585 -0.0135 -4.8495 -0.0705 c -1.17 -0.054 -1.8045 -0.249 -2.2275 -0.414 a 3.717 3.717 90 0 1 -1.38 -0.897 a 3.72 3.72 90 0 1 -0.9 -1.38 c -0.1635 -0.4215 -0.36 -1.0575 -0.4125 -2.2275 c -0.057 -1.2645 -0.069 -1.644 -0.069 -4.8495 c 0 -3.204 0.012 -3.582 0.069 -4.8465 c 0.054 -1.17 0.249 -1.806 0.414 -2.229 c 0.2175 -0.5595 0.4785 -0.96 0.8985 -1.38 c 0.42 -0.42 0.819 -0.6795 1.38 -0.897 c 0.423 -0.165 1.0575 -0.36 2.2275 -0.414 c 1.107 -0.051 1.536 -0.066 3.7725 -0.0675 v 0.003 z m 7.482 1.992 a 1.44 1.44 0 1 0 0 2.88 a 1.44 1.44 0 0 0 0 -2.88 z m -6.405 1.683 a 6.1635 6.1635 90 1 0 0 12.3255 a 6.1635 6.1635 90 0 0 0 -12.3255 z m 0 2.1615 a 4.0005 4.0005 90 1 1 0 8.001 a 4.0005 4.0005 90 0 1 0 -8.001 z"
								 fill="currentColor"
								 /> 
								 </g>
								 </svg>
							</a>
						</div>
					</div>
				</div>
				<div className="flex items-center pt-4 justify-center text-slate-700">
  <button onClick={handleClickPrivacy}>Privacy Policy</button>
      
  {showPrivacy && <Privacy onClose={handleClosePrivacy} />}
  
  						</div>
				<div className="flex flex-row pt-1 items-center justify-center">
  					<p className="pt-4 flex-grow flex-shrink text-center text-slate-400">
    								&copy; {new Date().getFullYear()} Sam Windsor. All rights reserved.
  					</p>
  
  
  
			</div>
<div className="flex flex-col pt-2 items-center justify-center">
  <a href="https://www.buymeacoffee.com/windsywinds" target="_blank">
	<img className="h-[40px] w-[160px]" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee"  />
	
	</a>
  </div>

					<div className="text-xs">
				<a href="https://www.flaticon.com/free-icons/blue-whale" title="blue whale icons">Icons by Freepik - Flaticon</a>
				</div>

		</div>
    )
}


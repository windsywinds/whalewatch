import React, { useState } from 'react';
import Feedback from './Feedback';
import About from './About';


//This component handles the dropdown function of the main app.jsx components.

export const AboutDropdown = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleDropdown = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="justify-center items-center text-center">
      <div
        className="cursor-pointer"
        onClick={toggleDropdown}
      >
        <h2 className="text-xl font-bold py-1">
          About 
        </h2>
      </div>
      
      <div className={`dropdown-content overflow-hidden transition-max-height duration-1000 ease-in-out ${expanded ? 'max-h-[1000px]' : 'max-h-0'}`}>
  {expanded && <About />}
</div>
<button className="text-xs" onClick={toggleDropdown}>
      {!expanded && <p>&#8595; See more &#8595;</p>  }
      {expanded && <p>&#8593; Hide &#8593;</p> }</button>
      
    </div>
  );
}



export const FeedbackDropdown = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleDropdown = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="justify-center items-center text-center">
      <div
        className="cursor-pointer"
        onClick={toggleDropdown}
      >
        <h2 className="text-xl font-bold py-1">
          Got Feedback? 
        </h2>
      </div>
      
      <div className={`dropdown-content overflow-hidden transition-max-height duration-1000 ease-in-out ${expanded ? 'max-h-[1000px]' : 'max-h-0'}`}>
  {expanded && <Feedback />}
</div>
<button className="text-xs" onClick={toggleDropdown}>
      {!expanded && <p>&#8595; See more &#8595;</p>  }
      {expanded && <p>&#8593; Hide &#8593;</p> }</button>
    
    </div>
  );
}
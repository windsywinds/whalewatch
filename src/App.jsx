import { useState, useEffect } from 'react';
import { Auth } from './components/auth';
import  Intro   from './components/Intro';
import { Display } from './components/Display';
import { SubmitSightings } from './components/Submit';
import { NewsDropdown, FeedbackDropdown } from './components/Dropdown';
import { AboutDropdown } from './components/Dropdown';
import { Footer } from './components/Footer';
import News from './components/News';
import Resources from './components/Resources'



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeComponent, setActiveComponent] = useState('display'); // Default active component


  //check if user is logged in
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
  };

    //manage user selected section to display
  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="bg-[#0b0f51] text-stone-800 min-h-screen font-inter flex flex-col">
      <div className="bg-slate-500 shadow-2xl shadow-black flex flex-col items-center min-w-screen justify-between sm:pt-15 sm:pb-4 sm:max-w-7xl sm:w-11/12 sm:mx-auto sm:my-9 sm:rounded-2xl">
        <div className="w-full">
          <Auth onLogin={handleLogin} onLogout={handleLogout} />
        </div>

        <div className="bg-[#e8e9ff] w-[90%] my-4 pb-2 rounded-xl shadow-lg shadow-slate-800">
        <div className="flex flex-row font-bold pb-4 pt-5 items-center justify-center">
          <p className="font-bold text-3xl underline">Whale Watch NZ </p>
          
        </div>
        </div>



        <div className="bg-[#e8e9ff] w-[90%] my-4 pb-1 pt-2 rounded-2xl my-4 shadow-lg shadow-slate-800">
          <div className="flex flex-col sm:flex-row justify-evenly space-x-1 px-1 sm:space-x-4 my-4">
          <button
              className={`px-4 py-2 rounded-lg ${
                activeComponent === 'news' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-blue-300'
              }`}
              onClick={() => handleComponentChange('news')}
            >
              News and Updates
            </button>
            <div className="flex flex-row justify-between items-center space-x-4 py-2 sm:py-0">
            <button
              className={`px-4 py-2 rounded-lg ${
                activeComponent === 'display' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-blue-300'
              }`}
              onClick={() => handleComponentChange('display')}
            >
              Latest Sightings
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeComponent === 'submit' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-blue-300'
              }`}
              onClick={() => handleComponentChange('submit')}
            >
              Submit Sighting
            </button>
            </div>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeComponent === 'resources' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-blue-300'
              }`}
              onClick={() => handleComponentChange('resources')}
            >
              Resources
            </button>
          </div>

          {activeComponent === 'news' && <News />}
          {activeComponent === 'resources' && <Resources />}
          {activeComponent === 'display' && <Display />}
          {activeComponent === 'submit' && !isLoggedIn && (
            <div className="flex items-center justify-center text-center pb-2">
              <p className="py-10">You need to login to submit a sighting!</p>
            </div>
          )}
          {activeComponent === 'submit' && isLoggedIn && <SubmitSightings />}
        </div>
        <div className="bg-[#e8e9ff] w-[90%] my-4 pb-1 pt-2 rounded-2xl my-4 shadow-lg shadow-slate-800">
          <AboutDropdown />
        </div>

        <div className="bg-[#e8e9ff] w-[90%] my-4 pb-1 pt-2 rounded-2xl my-4 shadow-lg shadow-slate-800">
          <FeedbackDropdown />
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
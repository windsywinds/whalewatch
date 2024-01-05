

const News = () => {
    return (
        <div className="pb-4 pt-10  rounded-xl overflow-hidden w-[95%] md:w-[85%]">

            <div className="flex items-center justify-center flex-col text-center" >

            <section className="pb-5">
            <p className="text-sm mb-1 pt-2 font-bold">Release v3.0 - 03/01/2024</p>
            <p className="text-sm mb-1 pt-1">Changes: </p>  
            <p className="text-sm mb-1 pt-2">Push Notifications <br />
            Push notifications can now be enabled for sightings up to 30km from the users location. Login with an email address and select the options menu. 
             <br/>
            With this change, the app is now available nation wide. The twitter account will only tweet for Wellington users for now during this period, but in future will be changed to tweet for every sighting as users will be able to subscribe to local alerts.
            </p>
            </section >

            <section className="pb-5">
            <p className="text-sm mb-1 pt-2 font-bold">Release v2.0 - 8/12/2023</p>
            <p className="text-sm mb-1 pt-1">Changes: </p>  
            <p className="text-sm mb-1 pt-2">A better Layout! <br />
            With the recent App install changes (See below for details), there has been an update in the layout.<br/> 
            There is a new mobile layout consistent between the web and app, as well as updates to the desktop version with a better menu.
             <br/>
            More updates and changes still to come! Please be sure to let me know if you encounter any problems using the feedback section!
            </p>
            </section >

            <section className="pb-5">
            <p className="text-sm mb-1 pt-2 font-bold">Release v1.6 - 24/11/2023</p>
            <p className="text-sm mb-1 pt-1">Changes: </p>  
            <p className="text-sm mb-1 pt-2">Mobile Web App! <br />You can now install the app directly onto your homescreen!<br/> 
            iOS - select the middle button that looks like a book with an arrow and scroll down until you find "Add to home screen". <br/>
            Android - select the three dots in the top right and tap "Install app".</p>
            </section >

            <section className="pb-5">
            <p className="text-sm mb-1 pt-2 font-bold">Release v1.5 - 01/10/2023</p>
            <p className="text-sm mb-1 pt-1">Changes: </p>  
            <p className="text-sm mb-1 pt-2">Twitter alerts are active! <br />Follow <a href="https://twitter.com/WhaleWatchNZ" className="underline" target="_blank" rel="noopener noreferrer">@WhaleWatchNZ</a> on Twitter and turn on notifications to receieve push alerts to your phone when a new sighting is submitted!<br/> 
            It's important to remember that all sightings are user submitted, and so can't always be guaranteed to be accurate or true. </p>
            </section >

            <section className="pb-5">
            <p className="text-sm mb-1 pt-2 font-bold">Release v1.4 - 29/09/2023</p>
            <p className="text-sm mb-1 pt-1">Changes: </p>  
            <p className="text-sm mb-1 pt-2">Colour coded pins on maps! <br />You can now click on map pins to see details of the sighting.<br/> 
            Reduced database reads to allow for potential upgrade for twitter alerts. </p>
            </section >

            <section className="pb-5">
            <p className="text-sm mb-1 pt-2 font-bold">Release v1.3 - 27/09/2023</p>
            <p className="text-sm mb-1 pt-1">Changes: </p>  
            <p className="text-sm mb-1 pt-2">Add new "display as map" page for results. <br />Updated the "Confirmed Sighting" button to also update the time of the results sighting. </p>
            </section >
           
            <section className="pb-5">
            <p className="text-sm mb-1 pt-2 font-bold">Release v1.2</p>
            <p className="text-sm mb-1 pt-1">Changes: </p>  
            <p className="text-sm mb-1 pt-2">Added resources page. <br/>Condensed pages to single section with buttons. </p>
            </section >
            
            </div>
        </div>
    )
}

export default News;


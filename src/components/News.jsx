

function News() {
    return (
        <div className="pb-4 pt-10 pl-10 pr-10 rounded-xl overflow-hidden ">

            <div className="flex items-center justify-center flex-col text-center" >

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


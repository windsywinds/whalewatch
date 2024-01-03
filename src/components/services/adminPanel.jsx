

export const AdminPanel = () => {

    const handleRefresh = () => {
      window.location.reload();
    }
    const handleTrueRefresh = () => {
      window.location.reload(true);
    }

    const removeSightingData = (e) => {
        e.preventDefault()
        localStorage.removeItem('sightingList');
        localStorage.removeItem('lastSightListUpdate');
    }

    return(
      <div>

        <div className="flex flex-row gap-2 py-4">
          <div>
            <button onClick={handleRefresh}
              className="py-4 px-4 bg-blue-500"
              >reload()</button>
          </div>

          <div>
            <button onClick={handleTrueRefresh}
              className="py-4 px-4 bg-blue-500"
              >reload(true)</button>
          </div>

          <div>
            <button onClick={removeSightingData}
              className="py-4 px-4 bg-blue-500"
              >Remove Sighting Data</button>
          </div>
        </div>


      </div>      
    )
  }
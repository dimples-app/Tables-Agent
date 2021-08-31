import React, {useState} from 'react'

function SearchForm(props) {
    const {handleSearch} = props;
    const [mobileNumber, setMobileNumber] = useState("")

    // change handler
    function handleChange(event) {
        const value = event.target.value;
        setMobileNumber(value);
    }

    //submit search
    function handleSubmit(event) {
      handleSearch(event, mobileNumber);
    }

    return (
        <div>
        <div>
            <h1 className="header">Search Reservation</h1>
        </div>
        <form
        
          onSubmit={handleSubmit}
          className="row g-3 justify-content-center"
        >
          <div className="d-flex">
            <input
              name="mobile_number"
              className="form-control mr-2"
              type="search"
              placeholder="Enter mobile number"
              value={mobileNumber}
              onChange={handleChange}
              aria-label="Search"
            />
            <button type="submit" className="btn btn-primary mr-3">
              Search
            </button>
          </div>
        </form>
      </div>
    )
}

export default SearchForm
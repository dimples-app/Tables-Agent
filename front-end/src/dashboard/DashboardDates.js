import React from 'react'
import {previous, today, next} from "../utils/date-time"

function DashboardDates(props) {
    const {date, handleDate} = props;
     return (
      <div
      className="btn-group d-flex justify-content-around"
      role="group"
      aria-label="buttons"
    >
      <button
        type="button"
        className="btn btn-outline-dark  btn-lg mb-3 mr-4"
        onClick={() => handleDate(previous(date))}
      >
        Previous
      </button>
      
      <button
        type="button"
        className="btn btn-success  btn-lg mb-3 mr-4"
        onClick={() => handleDate(today(date))}
      >
        Today
      </button>

      <button
        type="button"
        className="btn btn-outline-dark  btn-lg mb-3 mr-4"
        onClick={() => handleDate(next(date))}
      >
        Next
      </button>
    </div>
      );
}

export default DashboardDates
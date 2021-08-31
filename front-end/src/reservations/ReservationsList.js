import React from 'react'
import { formatAsDate, formatAsTime } from "../utils/date-time";
import { Link } from "react-router-dom";

function ReservationsList(props) {
    const {reservations, handleCancelReservation} = props;

    //check if reservation exist
    if (!reservations || !reservations.length) 
        return <p>No reservations found</p>
    

    //check reservation is valid
    
    const listValidReservations = reservations.filter((reservation) => 
            reservation.status !== "cancelled"
    )
      
    // check if valid reservation exist
    if(!listValidReservations || !listValidReservations.length) 
        return <p> No Valid Reservations Found</p>
    

    const handleCancel = (event) => {
        event.preventDefault();
        const reservationId = event.target.getAttribute("id");
        handleCancelReservation(reservationId);
    }

     return (
        <div>
      <h4 className="centertext">Reservations</h4>
      <div className="row" >
        {listValidReservations.map((reservation) => (
          <div className="col-xs-12 col-sm-6 col-md-4" key={reservation.reservation_id}>
            <div className="card mb-3">
              <div className="card-header">
                <p className="card-title">
                  {reservation.first_name} {reservation.last_name}
                </p>
              </div>
              <div className="card-body">
                <p className="card-text">
                  People: {reservation.people}
                </p>
                <p className="card-text">
                <span className="bold">Date: </span>
                  {formatAsDate(reservation.reservation_date)}
                </p>
                <p className="card-text">
                <span>Time: </span>
                  {formatAsTime(reservation.reservation_time)}
                </p>
                <p className="card-text">
                  <span>Contact Number: </span>
                  {reservation.mobile_number}
                </p>
                <p
                  className="card-text"
                  data-reservation-id-status={reservation.reservation_id}
                >
                  <span className="bold">Status: </span>
                  {reservation.status && reservation.status.toUpperCase()}
                </p>
              </div>
              <div className="col mb-3">
                {reservation.status === "booked" ? (
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="buttons"
                  >
                    <Link
                      className="btn btn-primary mr-2"
                      to={`/reservations/${reservation.reservation_id}/seat`}
                    >
                      Seat
                    </Link>
                    <Link
                      className="btn btn btn-secondary mr-2"
                      to={`/reservations/${reservation.reservation_id}/edit`}
                    >
                      Edit
                    </Link>
                    <button
                      id={reservation.reservation_id}
                      onClick={handleCancel}
                      className="btn btn-secondary mr-2"
                      data-reservation-id-cancel={reservation.reservation_id}
                    >
                      Cancel
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    )
}

export default ReservationsList
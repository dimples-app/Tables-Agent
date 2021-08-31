import React from "react";
import DashboardDates from "./DashboardDates";
import TablesList from "../tables/TablesList";
import ReservationsList from "../reservations/ReservationsList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard(props) {
  return (
    <main>
      <div>
        <h1 className="header">Dashboard</h1>
      </div>
  
      <div className="centertext">
        <h2>Reservations: {props.date}</h2>
        <DashboardDates date={props.date} handleDate={props.handleDate}/>
      </div>
    
      <TablesList
        tables={props.tables}
        handleUnAssignTableToFinishReservation={
          props.handleUnAssignTableToFinishReservation
        }
      />
      <ReservationsList
        reservations={props.reservations}
        handleCancelReservation={props.handleCancelReservation}
      />
    </main>
  );
}

export default Dashboard;

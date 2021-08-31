import React, {useEffect, useState} from "react";
import { useHistory } from "react-router-dom";
import {
  listReservations,
  fetchTables,
  deleteTable,
  cancelReservation,
  seatReservation,
  createTable,
} from "../utils/api";
import useQuery from "./../utils/useQuery";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import Reservations from "../reservations/Reservations";
import Tables from "../tables/Tables";
import Search from "../search/Search";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const history = useHistory();
  const [date, setDate] = useState(query.get("date") || today());
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState(null);
  const [errors, setErrors] = useState(null);
  const [isClicked, setIsClicked] = useState(false);

  function handleLoadReservationAndTable() {
    const abortController = new AbortController();
    setErrors(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .then(() => fetchTables(abortController.signal))
      .then(setTables)
      .catch((error) => setErrors([{message: "something went wrong", id: 'ResTabErr'}]));
    return () => abortController.abort();
  }

  useEffect(handleLoadReservationAndTable, [date, isClicked]);


  function handleNewReservation(newReservation) {
    setDate(newReservation.reservation_date);
    setReservations((prevState) => [...prevState, newReservation]);
  }

  function handleUpdateReservation(updatedReservation) {
    setDate(updatedReservation.reservation_date);
    const index = reservations.find(
      (reservation) =>
        Number(reservation.reservation_id) ===
        Number(updatedReservation.reservation_id)
    );
    setReservations((prevState) => {
      prevState.splice(index, 1, updatedReservation);
    });
  }

  function handleNewTable(newTable) {
    const abortController = new AbortController();
    createTable(newTable, abortController.signal)
    .then(() => setTables((prevState) => [...prevState, newTable]))
    .then(() => history.push("/dashboard"))
    .catch((error) => setErrors([{...error, id: 'NewTabErr'}]));
    return () => abortController.abort();
  }

  function handleDate(newDate) {
    setDate(newDate)
  }

  function handleCancelReservation(reservationId) {
    const confirmed = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (confirmed) {
      cancelReservation(reservationId)
        .then(() => setIsClicked(!isClicked))
        .then(() => listReservations({ date }))
        .then(() => history.push(`/dashboard?date=${date}`))
        .catch((error) => setErrors([{...error, id: 'CancelResErr'}]));
    }
  }

  function handleAssignTableToReservation(reservationId, tableId) {
    const table = tables.find(
      (table) => Number(table.table_id) === Number(tableId)
    );
    const tableIndex = tables.indexOf(table);

    seatReservation(reservationId, tableId)
      .then((updatedReservation) => {
        const updatedTable = {
          ...table,
          reservation_id: updatedReservation.reservation_id,
        };
        return updatedTable;
      })
      .then((updatedTable) =>
        setTables((prevState) => {
          prevState.splice(tableIndex, 1, updatedTable);
          return prevState;
        })
      )
      .then(() => setIsClicked(!isClicked))
      .then(() => history.push(`/dashboard?date=${date}`))
      .catch((error) => setErrors([{...error, id: 'AssTabResErr'}]));
  }  

  function handleUnAssignTableToFinishReservation(tableId) {
    const confirmed = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    if (confirmed) {
      const abortController = new AbortController();
      deleteTable(tableId, abortController.signal)
        .then(() => {
          const table = tables.find(
            (table) => Number(table.table_id) === Number(tableId)
          );
          const reservationIndex = reservations.findIndex(
            (res) => Number(res.reservation_id) === Number(table.reservation_id)
          );
          setReservations((prevState) => {
            prevState.splice(reservationIndex, 1);
            return prevState;
          });
        })
        .then(() =>
          setTables((prevState) => {
            const table = prevState.find(
              (table) => Number(table.table_id) === Number(tableId)
            );
            table.reservation_id = null;
            return prevState;
          })
        )
        .then(() => setIsClicked(!isClicked))
        .then(() => fetchTables())
        .then(() => history.push(`/dashboard?date=${date}`))
        .catch((error) => setErrors([{...error, id: 'UnAssTabErr'}]));
        return () => abortController.abort();
    }
  }

  return (
    <Switch>
    <Route exact={true} path="/">
      <Redirect to={"/dashboard"} />
    </Route>
    <Route path="/dashboard">
      <Dashboard
        errors={errors}
        date={date}
        handleDate={handleDate}
        reservations={reservations}
        tables={tables}
        handleUnAssignTableToFinishReservation={
          handleUnAssignTableToFinishReservation
        }
        handleCancelReservation={handleCancelReservation}
      />
    </Route>
    <Route path="/reservations">
      <Reservations
        errors={errors}
        tables={tables}
        handleAssignTableToReservation={handleAssignTableToReservation}
        handleNewReservation={handleNewReservation}
        handleUpdateReservation={handleUpdateReservation}
      />
    </Route>
    <Route path="/tables">
      <Tables 
      handleNewTable={handleNewTable} 
      errors={errors} />
    </Route>
    <Route path="/search">
      <Search />
    </Route>
    <Route>
      <NotFound />
    </Route>
  </Switch>
  );
}

export default Routes;

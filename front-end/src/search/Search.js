import React from 'react';
import {useEffect, useState} from 'react'
import {listReservationsByNumber, cancelReservation} from "../utils/api"
import { Route, Switch } from "react-router-dom";
import SearchForm from './SearchForm';
import ReservationsList from "../reservations/ReservationsList"
import ErrorAlert from '../layout/ErrorAlert'


function Search() {
    const [isCancelled, setIsCancelled] = useState(false);
    const [reservations, setReservations] = useState(null);
    const [mobileNumber, setMobileNumber] = useState("");
    const [errors, setErrors] = useState(null);

    useEffect(loadReservationByNumber, [mobileNumber, isCancelled])
    
    function loadReservationByNumber() {
      setErrors(null);
      if (mobileNumber === "") return;

      const abortController = new AbortController();
      listReservationsByNumber(mobileNumber, abortController.signal)
          .then(setReservations)
          .catch((err) => setErrors([err]));
          return () => abortController.abort();
    }

    function handleSearch(event, mobileNumber) {
        event.preventDefault();
        setMobileNumber(mobileNumber);
      }

    function handleCancelReservation(reservationId) {
        const confirmed = window.confirm(
          "Do you want to cancel this reservation? This cannot be undone."
        );
        if (confirmed) {
          cancelReservation(reservationId)
            .then(() => setIsCancelled(!isCancelled))
            .catch((err) => setErrors([err]));
        }
    }

    return (
        <Switch>
        <Route exact={true} path="/search">
          <SearchForm handleSearch={handleSearch} />
          <ErrorAlert errors={errors} />
          <ReservationsList
            reservations={reservations}
            handleCancelReservation={handleCancelReservation}
          />
        </Route>
      </Switch>
    )
}

export default Search
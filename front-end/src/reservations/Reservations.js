import { Redirect, Route, Switch } from "react-router-dom";
import Seat from "./Seat";
import ReservationForm from "./ReservationForm";

function Reservations(props) {
  const {
    tables,
    handleAssignTableToReservation,
    handleUpdateReservation,
    handleNewReservation,
    errors,
  } = props;
  return (
    <Switch>
      <Route exact={true} path="/reservations">
        <Redirect to="/dashboard" />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <Seat
          tables={tables}
          handleAssignTableToReservation={handleAssignTableToReservation}
          errors={errors}
        />
      </Route>
      <Route path={["/reservations/:reservation_id/edit", "/reservations/new"]}>
        <ReservationForm
          handleNewReservation={handleNewReservation}
          handleUpdateReservation={handleUpdateReservation}
        />
      </Route>
    </Switch>
  );
}

export default Reservations;
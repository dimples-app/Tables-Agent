import { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function Seat(props) {
  const { tables, handleAssignTableToReservation, errors } = props;
  const [tableId, setTableId] = useState("");

  const history = useHistory();
  const { reservation_id } = useParams();

  function handleChange(e) {
    const selectedIndex = e.target.options.selectedIndex;
    const value = e.target.options[selectedIndex].getAttribute("id");
    setTableId(value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const reservationId = Number(reservation_id);
    handleAssignTableToReservation(reservationId, tableId);
  }

  function handleCancel() {
    //console.log("+++++++ GO BACK ++++++", history.goBack() )
    history.goBack();
  }

  if (!tables) return null;
  return (
    <div>
      <h1 className="header">Assign A Table</h1>
      <hr />
      <ErrorAlert errors={errors} />

      <div className="row d-flex justify-content-center">
        <form className="col-md-8 col-lg-6" onSubmit={handleSubmit}>
          <div>
            <select
              name="table_id"
              className=" mb-3 form-control form-control-lg" 
              aria-label=".form-select-lg example"
              onChange={handleChange}
            >
              <option className="dropdown" defaultValue>Open to Select a Table Number</option>
              {tables.map((table) => (
                <option key={table.table_id} id={table.table_id}>
                  {table.table_name} - {table.capacity}
                </option>
              ))}
            </select>
          </div>
          <div className="btn-group d-flex ml-4"  aria-label="buttons">
            <button
              type="button"
              className="btn btn-secondary mr-4"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary mr-4"
              disabled={!tableId}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Seat;
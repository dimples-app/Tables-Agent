import React, {useState, useEffect} from 'react'
import { useHistory,  useParams } from 'react-router';
import {
    createReservation,
    editReservation,
    fetchReservation,
  } from "../utils/api";
  import { formatAsDate, formatAsTime } from "../utils/date-time";
  import ErrorAlert from '../layout/ErrorAlert';

function ReservationForm(props) {
  const {handleNewReservation, handleUpdateReservation} = props;

    const initalFormData = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 0,
        status:"booked"
    }
  
    const history = useHistory();
    const { reservation_id } = useParams();
    const [isEdit, setIsEdit] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);
    const [formData, setFormData] = useState({...initalFormData})

    useEffect(() => {
        if(reservation_id) {
          const abortController = new AbortController();
            fetchReservation(reservation_id, abortController.signal)
            .then((reservation) => {
                setFormData({
                first_name: reservation.first_name,
                last_name: reservation.last_name,
                mobile_number: reservation.mobile_number,
                reservation_date: formatAsDate(reservation.reservation_date),
                reservation_time: formatAsTime(reservation.reservation_time),
                people: reservation.people,
                })
            })
            .then(() => setIsEdit(true))
            .catch(setError) 
            return () => abortController.abort();
        } else {
                setFormData({
                  first_name: "",
                  last_name: "",
                  mobile_number: "",
                  reservation_date: "",
                  reservation_time: "",
                  people: 0,
                  status:"booked"
                });
        }
    }, [reservation_id])

    /**
     * Function to validate form
     */
    function handleFormValidation() {
        const errors = [];
        const currentTime = Date.now();
        const time = formData.reservation_time;
        const date = formData.reservation_date;
        const day = new Date(formData.reservation_date).getUTCDay();
        const dateTime = new Date(`${formData.reservation_date}T${formData.reservation_time}:00`);
        const hours = dateTime.getHours();
        const mins = dateTime.getMinutes();

        //check if it is truesday
        if (day === 2) {
            errors.push({
                id: "ValErr-1",
                message: "Reservation date cannot fall on a Tuesday.",
            })
        }
        //check reservation date is in past
        if (date && currentTime > Date.parse(`${date} ${time}`) ) {
            errors.push({
              id: "ValErr-2",
                message:
                "Cannot make a reservation in the past. Select a future date.",
            })
        }

        // check before restaurnat open
        if (hours < 10 || (hours === 10 && mins < 30)) {
          errors.push({
            id: "ValErr-3",
            message: "Cannot reserve a time before 10 am.",
          });
        }

        //check after last reservation time
        if ((hours === 21 && mins > 30) || (hours === 22 && mins < 30)) {

            errors.push({
              id: "ValErr-4",
                message: "Cannot reserve a time after 9:30 PM. Too close to closing time.",
              });

        }

        //check after closing time
        if (hours > 22 || (hours === 22 && mins >= 30)) {
            errors.push({
              id: "ValErr-5",
                message: "Cannot reserve a time after 10:30 PM. Restaurant closes at 10:30 PM.",
              });
        
        }

        errors.length >= 1 ? setValidationErrors(errors) : setValidationErrors(null)
        return errors.length >= 1
    }

    //change handler
    function handleChange(event) {
        setError(error);
        let value = event.target.value;
        if (event.target.name === "people") {
            value = Number(event.target.value)
        }
        setFormData((currentFormData) => {
            return {
                ...currentFormData,
                [event.target.name]: value,
            }
        })
    }

    // cancel handler
    function handleCancel() {
      history.push("/dashboard");
    }

    //handle Edit reservation
    function handleEdit() {
      const abortController = new AbortController();
        editReservation(reservation_id, formData, abortController.signal)
        .then(() => handleUpdateReservation(formData), error => setError(error))
        .then(() => history.push("/dashboard"))
        return () => abortController.abort();
 
    }

    //handle new reservation
    function handleCreate() {
      const abortController = new AbortController();
        createReservation(formData, abortController.signal)
       .then(() => handleNewReservation(formData), error => setError(error))
       .then(() => history.push("/dashboard"))
       return () => abortController.abort();
    }

    function handleReservationValidation(event) {
      event.preventDefault();
      const formHasErrors = handleFormValidation();
      if(formHasErrors) return 
      isEdit ?  handleEdit() : handleCreate()
    }
    return (
        <div>
            <div>
            {isEdit ? 
            <h1 className="header">Edit Reservation</h1> : 
            <h1 className="header">New Reservation</h1>}
            </div>
            <div id="reservation_time_help" className="form-text col-md-8">
              {<p> ** All fields are required. Restaurant Hours: 10:30am - 10:30pm </p>}
              
            </div>
            
            <ErrorAlert errors={validationErrors} />
            <form className="row g-3" onSubmit={handleReservationValidation}>
            
            <div className="col-md-8">
              <label htmlFor="first_name" className="form-label" >
                First Name
              </label>
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              id="first_name"
              name="first_name"
              onChange={handleChange}
              value={formData.first_name}
              placeholder="First Name "
              required={true}
            />
          </div>
        </div>
        <div className="col-md-8">
          <label htmlFor="last_name" className="form-label" >
            Last Name
          </label>
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              id="last_name"
              name="last_name"
              onChange={handleChange}
              value={formData.last_name}
              placeholder="Last Name "
              required={true}
            />
          </div>
        </div>

        <div className="col-md-8" >
          <label htmlFor="people" className="form-label">
            People
          </label>
          <div className="col-sm-8">
            <input
              type="number"
              className="form-control"
              id="people"
              name="people"
              onChange={handleChange}
              value={formData.people}
              placeholder="Number of people"
              min={1}
              required={true}
            />
          </div>
        </div>
        <div className="col-md-8">
          <label htmlFor="mobile_number" className="form-label">
            Mobile #
          </label>
          <div className="col-sm-8">
            <input
              type="tel"
              className="form-control"
              id="mobile_number"
              name="mobile_number"
              pattern="^[\+]?[(]?[0-9]{0,3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$"
              onChange={handleChange}
              placeholder="123-456-7890"
              value={formData.mobile_number}
              required={true}
            />
          </div>
        </div>
        
        <div className="col-md-8">
          <label htmlFor="reservation_date" className="form-label">
            Reservation Date
          </label>
          <div className="col-sm-8">
            <input
              type="date"
              className="form-control"
              id="reservation_date"
              name="reservation_date"
              pattern="\d{4}-\d{2}-\d{2}"
              onChange={handleChange}
              value={formData.reservation_date}
              required={true}
            />
          </div>
        </div>
        <div className="col-md-8" >
          <label htmlFor="reservation_time" className="form-label">
            Reservation Time
          </label>
          <div className="col-sm-8">
            <input
              type="time"
              className="form-control"
              id="reservation_time"
              name="reservation_time"
              pattern="[0-9]{2}:[0-9]{2}"
              onChange={handleChange}
              value={formData.reservation_time}
              required={true}
            />
          </div>
        </div>
        <div id="reservation_time_help" className="form-text col-md-8">
            Last reservation at 9:30pm
          </div>
        <div className="form-group col-md-8 col mt-5 p-6">
          <button className="btn btn-secondary mr-3" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary mr-3">
            Submit
          </button>
        </div>
        
        </form>
        
        </div>
    )
}

export default ReservationForm
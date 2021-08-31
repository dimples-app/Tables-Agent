import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import ErrorAlert from '../layout/ErrorAlert';

function NewTableForm(props) {
  const {handleNewTable} = props;
    
    const initialFormData = {
        table_name: "",
        capacity: "0",
      };
      const history = useHistory();
      const [formData, setFormData] = useState({ ...initialFormData });
      const [validationErrors, setValidationErrors] = useState(null)

      // handle change
      function handleChange(event) {
        setFormData((currentFormData) => {
            return {
              ...currentFormData,
              [event.target.name]: event.target.value,
            };
          });
      }

      function handleTableFormValidation() {
        const errors = [];
        
        //check table name
        if (formData.table_name === "") {
            errors.push({
              id: "ValErrTab-1",
              message: "Table Name cannot be empty.",
            });
        }

        //check table name length
        if (formData.table_name.length < 2) {
            errors.push({
              id: "ValErrTab-2",
              message: "Table Name must be atleast 2 characters long.",
            });

        }

        //check capacity
        if (formData.capacity === "") {
             // check if capacity is not empty
            errors.push({
              id: "ValErrTab-3",
              message: "Capacity must not be left empty.",
            });
            
          } else if (isNaN(formData.capacity)) {
            // check if capacity is a number
            errors.push({
              id: "ValErrTab-4",
              message: "Capacity must be a number.",
            });
           
          } else {
            // check if capacity is atleast 1
            if (Number(formData.capacity) < 1) {
              errors.push({
                id: "ValErrTab-5",
                message: "Capacity must be atleast 1.",
              });
             
            }
          }
          errors.length >= 1 ? setValidationErrors(errors) : setValidationErrors(null)
          return errors.length >= 1
      }

      function handleSubmit(event) {
        event.preventDefault();
        const formHasErrors = handleTableFormValidation();
        if(formHasErrors) return 
        handleNewTable(formData)
      }

      // handle cancel
      function handleCancel() {
         history.goBack();
      }

    return (
        <div>
          <div>
            <h1 className="header">New Table</h1>
          </div>

            <div id="reservation_time_help" className="form-text col-md-8">
              {<p> ** All fields are required. </p>}
            </div>

        <ErrorAlert errors={validationErrors} />
        
        <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-8">
          <label htmlFor="table_name" className="form-label">
            Table Name
          </label>
          <input
            name="table_name"
            type="text"
            className="form-control"
            id="table_name"
            minLength="2"
            required={true}
            value={formData.table_name}
            onChange={handleChange}
            placeholder="Table Name"
          />
        </div>
        <div className="col-md-8">
          <label htmlFor="capacity" className="form-label">
            Capacity
          </label>
          <input
            name="capacity"
            type="number"
            className="form-control"
            id="capacity"
            min="1"
            required={true}
            value={formData.capacity}
            onChange={handleChange}
          />
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

export default NewTableForm
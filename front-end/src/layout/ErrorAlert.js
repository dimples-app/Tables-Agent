import React from "react";

/**
 * Defines the alert message to render if the specified error is truthy.
 * @param error
 *  an instance of an object with `.message` property as a string, typically an Error instance.
 * @returns {JSX.Element}
 *  a bootstrap danger alert that contains the message string.
 */

function ErrorAlert({ errors }) {
  if(!errors || errors.length === 0) {
    return null;
  }
  return (
      <div className="alert alert-danger mr-2">
        {errors.map((err) => (
          <div key={err.id}>
            {err.message}
          </div>
        ))}
      </div>
  );
}

export default ErrorAlert;

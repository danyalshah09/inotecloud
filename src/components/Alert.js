// Alert.js
import React from 'react';

export const Alert = (props) => {
  const alertClass = props.type === "danger" ? "alert-danger" : "alert-primary";

  return (
    <div>
      <div className={`alert ${alertClass} my-4`} role="alert">
        {props.message}
      </div>
    </div>
  );
};

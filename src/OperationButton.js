import React from "react";
import { ACTIONS } from "./App";
const OperationButton = ({ dispatch, operand }) => {
  return (
    <button
      onClick={() => {
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operand } });
      }}
    >
      {operand}
    </button>
  );
};

export default OperationButton;

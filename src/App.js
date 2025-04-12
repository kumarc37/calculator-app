import { useReducer } from "react";
import "./App.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
};
// my comment
const Intiger_Formatter = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand?.split(".");
  if (decimal == null) return Intiger_Formatter.format(integer);
  return `${Intiger_Formatter.format(integer)}.${decimal}`;
}

const evaluate = ({ currentOperand, previousOperand, operation }) => {
  const prev = parseFloat(previousOperand);
  const cur = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(cur)) return "";
  let computation = "";
  switch (operation) {
    case "+": {
      computation = prev + cur;
      break;
    }
    case "-": {
      computation = prev - cur;
      break;
    }
    case "/": {
      computation = prev / cur;
      break;
    }
    case "*": {
      computation = prev * cur;
      break;
    }
    default: {
      break;
    }
  }
  return computation.toString();
};
const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.ADD_DIGIT: {
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand?.includes(".")) {
        return state;
      }
      if (state.overWrite === true) {
        return { ...state, currentOperand: payload.digit, overWrite: false };
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    }
    case ACTIONS.CHOOSE_OPERATION: {
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operand,
        };
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          previousOperand: state.currentOperand,
          operation: payload.operand,
          currentOperand: null,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operand,
        currentOperand: null,
      };
    }
    case ACTIONS.EVALUATE: {
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        currentOperand: evaluate(state),
        operation: null,
        previousOperand: null,
        overWrite: true,
      };
    }
    case ACTIONS.DELETE_DIGIT: {
      if (state.overWrite) {
        return {
          ...state,
          currentOperand: null,
          overWrite: false,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1)
        return { ...state, currentOperand: null };
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    }
    case ACTIONS.CLEAR: {
      return {};
    }
    default:
      return state;
  }
};
function App() {
  const [{ previousOperand, currentOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previousOperand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="currentOperand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => {
          dispatch({ type: ACTIONS.CLEAR });
        }}
      >
        AC
      </button>
      <button
        onClick={() => {
          dispatch({ type: ACTIONS.DELETE_DIGIT });
        }}
      >
        DEL
      </button>
      <OperationButton operand={"/"} dispatch={dispatch} />
      <DigitButton digit={"1"} dispatch={dispatch} />
      <DigitButton digit={"2"} dispatch={dispatch} />
      <DigitButton digit={"3"} dispatch={dispatch} />
      <OperationButton operand={"*"} dispatch={dispatch} />
      <DigitButton digit={"4"} dispatch={dispatch} />
      <DigitButton digit={"5"} dispatch={dispatch} />
      <DigitButton digit={"6"} dispatch={dispatch} />
      <OperationButton operand={"+"} dispatch={dispatch} />
      <DigitButton digit={"7"} dispatch={dispatch} />
      <DigitButton digit={"8"} dispatch={dispatch} />
      <DigitButton digit={"9"} dispatch={dispatch} />
      <OperationButton operand={"-"} dispatch={dispatch} />
      <DigitButton digit={"."} dispatch={dispatch} />
      <DigitButton digit={"0"} dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => {
          dispatch({ type: ACTIONS.EVALUATE });
        }}
      >
        =
      </button>
    </div>
  );
}

export default App;

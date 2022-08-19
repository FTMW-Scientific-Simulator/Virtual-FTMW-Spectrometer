import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { Action } from "./actions";

const initialState = {
  params: {
    minWave: 1900,
    maxWave: 2300,
    molecule: "CO",
    pressure: 0.001,
    resolution: 1,
    numScan: 1,
    zeroFill: 0,
    source: 3100,
    beamsplitter: "AR_ZnSe",
    cellWindow: "CaF2",
    detector: "MCT",
  },

  data: null,

  backgroundData: null,

  progress: false,

  error: {
    active: false,
    text: "",
  },
};

function reducer(state, action) {
  switch (action.type) {
    // ---------- calc_spectrum parameters ----------
    case Action.StoreParams:
      return {
        ...state,
        params: action.payload,
      };

    // ---------- graph data (Plotly) ----------
    case Action.StoreData:
      return {
        ...state,
        data: action.payload,
      };

    // ---------- store background sample data ----------
    case Action.StoreBackgroundData:
      return {
        ...state,
        backgroundData: action.payload,
      };

    // ---------- spinning progress wheel ----------
    case Action.SetProgress:
      return {
        ...state,
        progress: action.payload,
      };

    // ----------  error text ----------
    case Action.SetError:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
}

export default createStore(reducer, initialState, applyMiddleware(thunk));

import React, { useEffect } from "react";
import { animateToBand, cancelAnimation } from "../InstrumentWindow/animations/instrumentWindowAnimations";
import { useDispatch, useSelector } from "react-redux";
import { setProgress } from "../../redux/progressSlice";
import { setError } from "../../redux/errorSlice";
import { setSpectrumData, setSpectrumParameters } from "../../redux/acquireSpectrumSlice";
import { useNavigate } from "react-router-dom";

export let sleepID = 0;

/**
 * A component that reaches out to the Flask server with user entered parameters and received X and Y coordinates.
 *
 * @param {string} fetchURL - The URL used to reach out to the server.
 * @param {string} buttonText - The text on the button.
 * @param {string} buttonStyle - The class ID set on the button to determine style.
 */
export default function Fetch({
  fetchURL,
  buttonText,
  buttonStyle}) {

  const dispatch = useDispatch();
  const { fetching, postfetch } = useSelector((store) => store.progress);
  const { 
    molecule, 
    stepSize,
    frequencyMin,
    frequencyMax,
    numCyclesPerStep,
    microwavePulseWidth,
    mwBand,
    repetitionRate,
    molecularPulseWidth,
    acquisitionType,
    vres,
  } = useSelector((store) => store.experimentalSetup);

  let nav = useNavigate();

  // cancel fetch
  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#aborting_a_fetch
  const controller = new AbortController();
  const signal = controller.signal;

  // move mirror
  useEffect(() => {
    if (document.querySelector("#cancel-scan-button")) {
      document
        .querySelector("#cancel-scan-button")
        .addEventListener("click", () => {
          controller.abort();
          if (document.querySelector("instrument-window") !== null) {
            cancelAnimation();
          }
        });
    }

    if (document.getElementById("instrument-window") !== null && postfetch && acquisitionType === "range") {
      animateToBand(mwBand, frequencyMin, frequencyMax, stepSize, numCyclesPerStep);
    }
  });

  /**
   * Fetches the server with user entered parameters and sets the X and Y coordinates
   */
  const fetchServer = async () => {
    // remove any errors (if existing) and start a progress spinner
    dispatch(setError([false, null]));
    dispatch(setProgress([true, true, false]));
    
    let body = "";
    let delay = 0;

    body = JSON.stringify({
      molecule: molecule,
      stepSize: stepSize,
      frequencyMin: frequencyMin,
      frequencyMax: frequencyMax,
      numCyclesPerStep: numCyclesPerStep,
      microwavePulseWidth: microwavePulseWidth,
      mwBand: mwBand,
      repetitionRate: repetitionRate,
      molecularPulseWidth: molecularPulseWidth,
      acquisitionType: acquisitionType,
      vres: vres,
    });

    try {
      const response = await fetch(fetchURL, {
        method: "POST",
        signal: signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      const data = await response.json();
      delay = ((frequencyMax - frequencyMin) / stepSize) * numCyclesPerStep * 1000 + 1;
      // No delay for single frequency
      delay = acquisitionType === "range" ? delay + 1200 : 0;
      dispatch(setProgress([true, false, true]));

      if (response.ok) {
        if (data.success) {

          // if the acquisition type is range, navigate to instrument page
          if (acquisitionType === "range") {
            nav("/instrument", -1);
          }

          sleepID = setTimeout(() => {
            dispatch(setProgress(false, false, false));
            dispatch(setSpectrumData([data, frequencyMin, frequencyMax]));
            dispatch(
              setSpectrumParameters({
                molecule: molecule,
                stepSize: stepSize,
                frequencyMin: frequencyMin,
                frequencyMax: frequencyMax,
                numCyclesPerStep: numCyclesPerStep,
                microwavePulseWidth: microwavePulseWidth,
                mwBand: mwBand,
                repetitionRate: repetitionRate,
                molecularPulseWidth: molecularPulseWidth,
                acquisitionType: acquisitionType,
                vres: vres,
                spectrumTitle: acquisitionType === "range" ? "Frequency Range" : "Single Frequency",
              })
            );
          }, delay); 
        }
        else {
          dispatch(setProgress(false, false, false));
          dispatch(setError([true, data.text]));
        }
      }
    } catch (error) {
       dispatch(setProgress(false, false, false));
       switch (error.name) {
          case "AbortError":
            dispatch(setError([true, "Scan canceled"]));
            break;
          default:
            dispatch(setError([true, "We could not collect your data at this time. Please wait a few moments and try again."]));
        }
      }
  };

  return (
    <button
      className={buttonStyle}
      disabled={fetching}
      onClick={fetchServer}
    >
      {buttonText}
    </button>
  );
}
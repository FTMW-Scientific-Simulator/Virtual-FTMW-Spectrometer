import React, { useEffect } from "react";

// constants
import { OPD } from "../dictionaries/constants";

// functions
import { animateCornerCube } from "../functions/animation";
import checkParams from "../functions/checkParams";

// redux
import { useDispatch, useSelector } from "react-redux";

// redux slices
import { setAbsorbanceData } from "../redux/absorbanceDataSlice";
import {
  setBackgroundData,
  setBackgroundParameters,
} from "../redux/backgroundDataSlice";
import { setError } from "../redux/errorSlice";
import { setLectureBottle } from "../redux/lectureBottleSlice";
import { setPeaksData } from "../redux/peaksDataSlice";
import { setProgress } from "../redux/progressSlice";
import { setSampleData, setSampleParameters } from "../redux/sampleDataSlice";
import { setTimer } from "../redux/timerSlice";

// router
import { useNavigate } from "react-router-dom";

export let sleepID = 0;

/**
 * A component that reaches out to the Flask server with user entered parameters and received X and Y coordinates.
 *
 * @param {object} params - The parameters used to find_peaks.
 * @param {string} type - The type of fetch request that is being performed.
 * @param {string} fetchURL - The URL used to reach out to the server.
 * @param {string} buttonText - The text on the button.
 * @param {string} buttonStyle - The class ID set on the button to determine style.
 */
export default function Fetch({
  params,
  type,
  fetchURL,
  buttonText,
  buttonStyle,
  tooManyPoints = false,
}) {
  const dispatch = useDispatch();

  const { fetching, postfetch } = useSelector((store) => store.progress);
  const { devMode } = useSelector((store) => store.devMode);
  let {
    beamsplitter,
    detector,
    medium,
    pressure,
    molecule,
    resolution,
    scan,
    source,
    waveMax,
    waveMin,
    window,
    zeroFill,
  } = useSelector((store) => store.parameter);

  let nav = useNavigate();
  if (devMode) {
    nav = (route, num) => {};
  }

  // cancel fetch
  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#aborting_a_fetch
  const controller = new AbortController();
  const signal = controller.signal;

  // waiting for entire page to render to fix issue where first cancel on load did not work
  useEffect(() => {
    if (document.querySelector("#cancel-scan-button")) {
      document
        .querySelector("#cancel-scan-button")
        .addEventListener("click", () => {
          controller.abort();
        });
    }

    if (document.getElementById("instrument") !== null && postfetch && !devMode) {
      animateCornerCube(scan / 2, OPD[resolution].time * 2);
    }
  });

  const fetchServer = async () => {
    // remove any errors (if existing) and start a progress spinner
    dispatch(setError([false, null]));
    dispatch(setProgress([true, true, false]));

    let body = "";
    let delay = 0; // Default value => immediate

    if (
      type.localeCompare("background") === 0 ||
      type.localeCompare("sample") === 0
    ) {
      // Allows the user to generate new absorbance data (there was a recursive issue in the Absorbance Plotly)
      dispatch(setAbsorbanceData([null, null, null]));
      dispatch(setTimer(0));

      // validate the user parameters
      let errorMessage = checkParams({
        beamsplitter,
        detector,
        medium,
        pressure,
        molecule,
        resolution,
        scan,
        source,
        waveMax,
        waveMin,
        window,
        zeroFill,
      });

      // error occurred in checkParams, display error message to user
      if (errorMessage) {
        dispatch(setProgress([false, false, false]));
        dispatch(setError([true, String(errorMessage)]));
        return;
      }

      // Leaves delay as Immediate if in devMode
      if (!devMode) {
        // Calculate time the scan would take
        delay = OPD[resolution].time * scan * 1000; // 1000 is to convert to milliseconds
      }

      // Controls the Label and valve on the Lecture Bottle
      if (type.localeCompare("background") === 0) {
        dispatch(setLectureBottle(false));
      } else if (type.localeCompare("sample") === 0) {
        dispatch(setLectureBottle(true));
      }

      // calculate medium if set to "Air"
      let mole = 1;
      let pressure_param = pressure;

      if (medium === "Air") {
        const air_pressure = 1.01325;
        mole = pressure / air_pressure;
        pressure_param = air_pressure;
      }

      // Construct message body
      body = JSON.stringify({
        beamsplitter: beamsplitter,
        detector: detector,
        medium: medium,
        mole: mole,
        molecule: molecule,
        pressure: pressure_param,
        resolution: resolution,
        scan: scan,
        source: source,
        waveMax: waveMax,
        waveMin: waveMin,
        window: window,
        zeroFill: zeroFill,
      });
    } else if (type.localeCompare("find_peaks") === 0) {
      let startIndex = params.x.findIndex((element) => {
        return element >= params.lowerBound;
      });

      if (startIndex === -1) {
        startIndex = 0;
      }

      let endIndex = params.x.findIndex((element) => {
        return element >= params.upperBound;
      });

      if (endIndex === -1) {
        endIndex = params.x.length - 1;
      }

      body = JSON.stringify({
        x: params.x.slice(startIndex, endIndex + 1),
        y: params.y.slice(startIndex, endIndex + 1),
        threshold: params.threshold,
      });
    } else {
      dispatch(setProgress([false, false, false]));
      dispatch(
        setError([
          true,
          `Invalid Request Type. Received "${type}": expected sample, background, or find_peaks`,
        ])
      );
      return;
    }

    // checkParam succeeded and build message body, send request to api
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
      dispatch(setProgress([true, false, true]));
      // connection was successful
      if (response.ok) {
        // determine where to store received data
        if (data.success) {
          switch (type) {
            case "sample":
              // Reset Stored Data
              dispatch(setSampleData([null, null, null]));

              // Only navigate to Instrument Window when !devMode
              if (!devMode) {
                nav("/instrument", -1);
                // animateCornerCube(scan / 2, OPD[resolution].time * 2);
              }

              // Delays the appearance of generated data
              sleepID = setTimeout(() => {
                dispatch(setProgress(false, false, false));
                dispatch(setSampleData([data, waveMin, waveMax]));
                dispatch(
                  setSampleParameters(
                    JSON.stringify({
                      beamsplitter: beamsplitter,
                      detector: detector,
                      medium: medium,
                      molecule: molecule,
                      pressure: pressure,
                      resolution: resolution,
                      scan: scan,
                      source: source,
                      waveMax: waveMax,
                      waveMin: waveMin,
                      window: window,
                      zeroFill: zeroFill,
                    })
                  )
                );
              }, delay);
              break;
            case "background":
              // Reset Stored Data
              dispatch(setBackgroundData([null, null, null]));

              // Only navigate to Instrument Window when !devMode
              if (!devMode) {
                nav("/instrument", -1);
                // animateCornerCube(scan / 2, OPD[resolution].time * 2);
              }

              // Delays the appearance of generated data
              sleepID = setTimeout(() => {
                dispatch(setProgress(false, false, false));
                dispatch(setBackgroundData([data, waveMin, waveMax]));
                dispatch(
                  setBackgroundParameters(
                    JSON.stringify({
                      beamsplitter: beamsplitter,
                      detector: detector,
                      medium: medium,
                      molecule: molecule,
                      pressure: pressure,
                      resolution: resolution,
                      scan: scan,
                      source: source,
                      waveMax: waveMax,
                      waveMin: waveMin,
                      window: window,
                      zeroFill: zeroFill,
                    })
                  )
                );
              }, delay);
              break;
            case "find_peaks":
              dispatch(setProgress(false, false, false));
              dispatch(setPeaksData(data));
              break;
            default:
              console.error(
                `Invalid Request Type. Received: "${type}" expected sample, background, or find_peaks`
              );
              break;
          }
        }
        // display error message
        else {
          dispatch(setProgress(false, false, false));
          dispatch(setError([true, String(data.text)]));
        }
      }
      // connection was unsuccessful
      else {
        dispatch(setProgress(false, false, false));
        dispatch(setError([true, String(data.text)]));
      }
    } catch (error) {
      dispatch(setProgress(false, false, false));

      switch (error.name) {
        case "AbortError":
          dispatch(setError([true, "Scan canceled"]));
          break;
        default:
          console.error(`Fetch error: ${error.message}`);

          dispatch(
            setError([
              true,
              "We could not collect your data at this time. Please wait a few moments and try again.",
            ])
          );
      }
    }
  };

  return (
    <button
      className={buttonStyle}
      disabled={fetching || tooManyPoints}
      onClick={fetchServer}
    >
      {buttonText}
    </button>
  );
}

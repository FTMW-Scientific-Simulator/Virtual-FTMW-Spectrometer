import React, { useState, useEffect } from "react";

// components
import { Dialog } from "@mui/material";
import CloseButton from "../components/CloseButton";
import Main from "../images/InstrumentSVG";
import Spinner from "../components/Spinner";

// constants
import { BAD_ID, OPD, PARAMETER_VALUE } from "../dictionaries/constants";

// dictionaries
import { tooltips } from "../dictionaries/tooltips";
import { molecules } from "../dictionaries/molecule";

// functions
import {
  animateCornerCube,
  beamsplitterInteractivity,
  bubblesAnimation,
  cellWindowInteractivity,
  detectorInteractivity,
  displayInteractivity,
  distanceInteractivity,
  sourceInteractivity,
  textInteractivity,
} from "../functions/animation";

// redux
import { useSelector } from "react-redux";

// style
import "../style/routes/InstrumentWindow.css";
import "../style/components/Button.css";

/**
 * Route that contains:
 * - Instrument Window SVG
 * - SVG tooltip popups
 * - MUI Drawer with Experimental Setup
 * - Animation test button (in devmode)
 * - Progress spinner
 */
export default function InstrumentWindow() {
  const {
    beamsplitter,
    detector,
    medium,
    molecule,
    pressure,
    resolution,
    scan,
    source,
    waveMax,
    waveMin,
    window,
  } = useSelector((store) => store.parameter);
  const { fetching, prefetch, postfetch } = useSelector(
    (store) => store.progress
  );
  const { devMode } = useSelector((store) => store.devMode);
  const { lectureBottleInUse } = useSelector((store) => store.lectureBottle);
  const { backgroundData } = useSelector((store) => store.backgroundData);
  const { sampleData } = useSelector((store) => store.sampleData);
  const { error, errorText } = useSelector((store) => store.error);

  const [toggled, setToggled] = useState(false);
  const [element, setElement] = useState();

  const delay = OPD[resolution].time * scan * 1000; // 1000 is to convert to milliseconds

  // find group id when SVG is clicked
  const handleClick = (event) => {
    if (!BAD_ID.includes(event.target.parentElement.id)) {
      setElement(event.target.parentElement.id);
      setToggled(!toggled);
    }
  };

  // useEffect - wait for components to render then perform interactivity/animation
  useEffect(() => {
    beamsplitterInteractivity(beamsplitter);
    detectorInteractivity(detector);
    sourceInteractivity(source);
    cellWindowInteractivity(window);
    textInteractivity(
      lectureBottleInUse ? molecules[molecule] : "",
      OPD,
      pressure,
      resolution,
      scan,
      waveMax,
      waveMin
    );
    displayInteractivity(backgroundData, sampleData);
    distanceInteractivity(postfetch, OPD[resolution].distance);
    bubblesAnimation(
      medium === PARAMETER_VALUE.mediumAir ? true : false,
      lectureBottleInUse,
      pressure
    );
  });

  return (
    <div id="instrument-window">
      {/* top-down instrument SVG component */}
      <Main id="instrument" onClick={handleClick} />

      {/* button for settings, progress spinner */}
      <div id="instrument-spinner">
        <h1>Scan Progress</h1>
        {devMode && (
          <button className="button" onClick={() => animateCornerCube(1, 5)}>
            Animate MCC
          </button>
        )}
        {prefetch && <Spinner variant="indeterminate" size={100} />}
        {postfetch && !devMode && (
          <>
            <h2>Processing Sample...</h2>
            <Spinner
              variant="determinate"
              timer={delay}
              scans={scan}
              size={100}
              oneScan={OPD[resolution].time}
            />
          </>
        )}
        {!fetching && error && (
          <div id="instrument-error" style={{ display: "grid" }}>
            <p>{errorText}</p>
          </div>
        )}
      </div>

      {/* MUI Dialog popup that holds tooltip information */}
      {element && (
        <Dialog
          onClose={handleClick}
          open={toggled}
          fullScreen={element === "display" ? true : false}
        >
          <CloseButton id="customized-dialog-title" onClose={handleClick}>
            {tooltips[element].text}
          </CloseButton>
        </Dialog>
      )}
    </div>
  );
}

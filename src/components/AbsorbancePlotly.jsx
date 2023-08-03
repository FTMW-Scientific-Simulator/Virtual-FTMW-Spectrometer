import React, { forwardRef } from "react";

// components
import Plot from "react-plotly.js";

// redux
import { useSelector, useDispatch } from "react-redux";

// redux slice
import { setAbsorbanceData } from "../redux/absorbanceDataSlice";

// helper function
import { generateAbsorbance } from "../dictionaries/dataFunctions";

// style
import "../style/components/Plotly.css";
import "../style/components/Absorbance.css";

/**
 * A component that uses Plotly.js to graph absorbance spectrum data
 */
export const AbsorbancePlotly = forwardRef((props, ref) => {
  const { absorbanceData } = useSelector((store) => store.absorbanceData);
  const { backgroundData } = useSelector((store) => store.backgroundData);
  const { sampleData, sampleWaveMin, sampleWaveMax } = useSelector(
    (store) => store.sampleData
  );
  
  const dispatch = useDispatch();

  // if the correct data exists, calculate the absorbance data
  if (sampleData && backgroundData && !absorbanceData) {

    dispatch(
      setAbsorbanceData([
        generateAbsorbance(backgroundData, sampleData),
        sampleWaveMin,
        sampleWaveMax,
      ])
    );
  }

  if (absorbanceData) {
    return (
      <div className="absorbance">
        {/* Graph */}
        <Plot
          ref={ref}
          className="plotly"
          data={[
            {
              x: absorbanceData.x,
              y: absorbanceData.y,
              type: "scatter",
              marker: { color: "#f50057" },
            },
          ]}
          layout={{
            title: "Absorbance Spectrum",
            font: { family: "Roboto", color: "#000" },
            xaxis: {
              range: [sampleWaveMin, sampleWaveMax],
              title: { text: "Wavenumber (cm⁻¹)" },
              rangeslider: {
                autorange: true,
                yaxis: { rangemode: "auto" },
              },
              type: "linear",
            },
            yaxis: {
              autorange: true,
              title: {
                text: "Signal",
              },
              type: "linear",
              fixedrange: false,
              // https://community.plotly.com/t/how-to-hide-axis-ticktexts-but-remain-axis-tilte/10839/2
              showticklabels: false,
            },
          }}
          // https://community.plotly.com/t/react-plotly-responsive-chart-not-working/47547
          useResizeHandler={true}
        />
        {/* End Graph */}
      </div>
    );
  } else {
    return <div></div>;
  }
});

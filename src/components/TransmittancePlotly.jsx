import React, { forwardRef } from "react";

// components
import Plot from "react-plotly.js";

// redux
import { useSelector } from "react-redux";

// style
import "../style/components/Plotly.css";

// this component uses the plotly library to graph processed spectrum data
export const TransmittancePlotly = forwardRef((props, ref) => {
  const { backgroundData } = useSelector((store) => store.backgroundData);
  const { spectrumData } = useSelector((store) => store.spectrumData);
  const { waveMaxSaved, waveMinSaved } = useSelector(
    (store) => store.parameter
  );
  //   const newX = spectrumData.x / backgroundData.x;
  const newY = [spectrumData.x.length];

  for (let i = 0; i < spectrumData.x.length; i++) {
    newY[i] = spectrumData.y[i] / backgroundData.y[i];

    if (newY[i] > 2) {
      newY[i] = 2;
    }
    
    if (newY[i] < -2) {
      newY[i] = -2;
    }
  }

  if (spectrumData) {
    // https://github.com/suzil/radis-app/blob/main/frontend/src/components/CalcSpectrumPlot.tsx
    return (
      <>
        {
          <Plot
            ref={ref}
            className="plotly"
            data={[
              {
                x: spectrumData.x,
                y: newY,
                type: "scatter",
                marker: { color: "#f50057" },
              },
            ]}
            layout={{
              title: "Transmittance Spectrum",
              font: { family: "Roboto", color: "#000" },
              xaxis: {
                range: [waveMinSaved, waveMaxSaved],
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
        }
      </>
    );
  } else {
    return <div></div>;
  }
});

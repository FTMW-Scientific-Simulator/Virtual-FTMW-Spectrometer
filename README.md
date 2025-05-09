# Virtual-FTMW-Spectrometer

The Virtual FTMW Spectrometer (FTMW-SIS) is a web-based educational tool designed to simulate the operation of a Fourier Transform Microwave (FTMW) spectrometer. Developed for academic use, this simulator enables students to explore rotational spectroscopy principles, generate molecular spectra, and interact with a virtual FTMW instrument, providing hands-on learning without physical hardware.

This project uses [React](https://github.com/facebook/react) for the frontend and [Flask](https://github.com/pallets/flask/) for the backend. The backend is located in a separate [repository](https://github.com/FTMW-Scientific-Simulator/Virtual-FTMW-Functions).

## Installation

Information on how to run the front-end can be found in the repository's [wiki page](../../wiki).

## Usage

The intended audience for this application is undergraduate chemistry students studying spectroscopy. The following screenshots are not exhaustive but acknowledge most of the main features:

- Experimental Setup (Shows the spectrometer’s physical setup, including the vacuum chamber, molecular beam source, and microwave source)

![b5b5a7d39cf8baabf826305b9ebbe46](https://github.com/user-attachments/assets/86f1338e-348a-4118-aabc-3de21bca0a98)

- Instrument Window (top-down view of simplified spectrometer)

![9c5e7909104abfec865c14087eeaeb8](https://github.com/user-attachments/assets/ae25f062-d52f-4c31-90f3-0e4267b13e5c)

- Schematic Window (Displays a block diagram of the FTMW spectrometer with clickable components to learn their functions)
  
![e02d57f7019f924f4c6c1924f600dcc](https://github.com/user-attachments/assets/1fc76b9f-3087-4721-b73c-28ff68d5c8d5)
  
- Spectrum Window (Plots the generated rotational spectrum)

![05729f9fa95a2dab146420dc589b5b8](https://github.com/user-attachments/assets/96acd1ee-9cf0-4335-a65e-e5d63bb96877)

- Find Peaks (Highlights spectral peaks in a table or plot, allowing analysis of rotational transitions)

![92838fee0b449c43e083169d054fc96](https://github.com/user-attachments/assets/f160f9ad-ef8e-4108-be88-dbdc40139d2c)

To use the simulator:

1. Access the interface at `http://localhost:3000`.
2. Set parameters (e.g., molecule, frequency range, pulse widths) in the Experiment Setup tab.
3. Explore the Schematic tab to learn about the spectrometer’s components.
4. Generate a spectrum in the Spectrum tab and analyze results in the Find Peaks tab.



## Additional Information

Additional information regarding the FTMW-SIS can be found in the repository's [wiki page](../../wiki). This information includes Redux Toolkit, SVG diagrams, SVG optimization, SVG interactivity, and SVG animation.

## Contributing

Upkeep of this project is intended for recruited undergraduate students, but pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

See [LICENSE](LICENSE)

**Relevant third-party tools and resources we depend on:**

- [GitHub Pages Deploy Action](https://github.com/JamesIves/github-pages-deploy-action): GitHub Action used to automate deployment of web applications to GitHub Pages (Licensed [MIT](https://github.com/JamesIves/github-pages-deploy-action/blob/dev/LICENSE))

- [MUI](https://mui.com/): React user interface component library (Licensed [MIT](https://github.com/mui/material-ui/blob/master/LICENSE))

- [Plotly.js](https://github.com/plotly/plotly.js): JavaScript data visualization library (Licensed [MIT](https://github.com/plotly/plotly.js/blob/master/LICENSE))

- [Radis](https://radis.github.io/): Spectra generation (Licensed [LGPL-3.0](https://github.com/radis/radis/blob/develop/LICENSE))

- [React](https://react.dev/): JavaScript library for building user interfaces (Licensed [MIT](https://github.com/facebook/react/blob/main/LICENSE))

- [React CSV](https://github.com/react-csv/react-csv): React components to build CSV files on the fly (Licensed [MIT](https://github.com/react-csv/react-csv/blob/master/LICENSE.txt))

- [React Router](https://github.com/remix-run/react-router): Declarative routing for React (Licensed [MIT](https://github.com/remix-run/react-router/blob/main/LICENSE.md))

- [React to Print](https://github.com/gregnb/react-to-print): React components for printing in the browser (Licensed [MIT](https://github.com/gregnb/react-to-print/blob/master/LICENSE))

- [Redux Toolkit](https://github.com/reduxjs/redux-toolkit): Library for updating and managing application state (Licensed [MIT](https://github.com/reduxjs/redux-toolkit/blob/master/LICENSE))

- [SVGO](https://github.com/svg/svgo): Node.js tool for optimizing SVG files (Licensed [MIT](https://github.com/svg/svgo/blob/main/LICENSE))

- [SVGOMG](https://github.com/jakearchibald/svgomg): Web GUI for SVGO (Licensed [MIT](https://github.com/jakearchibald/svgomg/blob/main/LICENSE.md))

- [SVGR](https://github.com/gregberge/svgr): Tool for transforming SVGs into React components (Licensed [MIT](https://github.com/gregberge/svgr/blob/main/LICENSE))

**Inspiration from:**

- [Make a README](https://www.makeareadme.com/): Inspiration for README.md template (Licensed [MIT](https://github.com/dguo/make-a-readme/blob/main/LICENSE))

- [Radis app](https://www.radis.app/): Inspiration for user interface components like the dual slider for the wavenumber range (Licensed [LGPL-3.0](https://github.com/suzil/radis-app/blob/main/LICENSE))

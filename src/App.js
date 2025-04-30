import React, { useState } from "react";

// components
import { ReactComponent as RLLogo } from "./images/RastonLabLogo.svg";
import DevMode from "./components/DevMode";
import LandingPage from "./components/LandingPage";

// dictionary
import { menuItems } from "./dictionaries/menuItems";

// mui
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Drawer,
  Popover,
} from "@mui/material";

// mui icons
import { GitHub } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";

// router
import { Outlet, Link } from "react-router-dom";

// style
import "./style/App.css";
import { SHOW_DEVMODE } from "./dictionaries/constants";

/**
 * "Base" of this project. Contains the MenuBar with room for other "routes" to exist on the rest of the page
 */
export default function App() {
  const [expanded, setExpanded] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [gitHubPopover, setGutHubPopover] = useState(false);

  const handleChange = (panel) => (newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleOpenNavMenu = () => {
    setDrawer(true);
  };

  const handleCloseNavMenu = () => {
    setDrawer(false);
  };

  const openGitHubPopover = (event) => {
    setGutHubPopover(event.currentTarget);
  };

  const closeGitHubPopover = () => {
    setGutHubPopover(null);
  };

  return (
    <div>
      <LandingPage isMenu={false} />

      <AppBar className="nav-area" position="static">
        <Container maxWidth="xl" sx={{ paddingLeft: { xs: 0 } }}>
          <Toolbar
            sx={{
              alignItems: "flex-start",
              padding: "10px",
              margin: "0",
              justifySelf: "left",
            }}
          >
            {/* Start Small Menu */}
            <Box sx={{ flexGrow: 0.1, display: { xs: "flex", lg: "none" } }}>
              <IconButton
                size="large"
                aria-label="Menu and Navigation"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                open={drawer}
                anchor={"left"}
                onClose={handleCloseNavMenu}
                className="mini-menu"
              >
                <Box>
                  {menuItems.map((page) => (
                    <Accordion
                      key={page.label}
                      square
                      expanded={expanded === page.label}
                      onChange={handleChange(page.label)}
                      onMouseLeave={handleChange("")}
                      disableGutters
                    >
                      <AccordionSummary className="menu-items">
                        {page.label}
                      </AccordionSummary>
                      <AccordionDetails className="dropdown">
                        {page.submenu.map((submenu) => {
                            return (
                              <ul
                                key={submenu.label}
                                className={"dropdown-items"}
                              >
                                {submenu.component}
                              </ul>
                            );
                          })
                        }
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </Drawer>
            </Box>
            {/* End Small Menu */}

            {/* Start Logo and Title */}
            <a
              className="logolink"
              target="_blank"
              rel="noreferrer"
              href="https://www.rastonlab.org/"
            >
              <RLLogo width={50} height={50} viewBox="0 0 100 100" />
            </a>
            <Link className="logo" to="/">
              <span className="red">F</span>
              <span className="orange">T</span>
              <span className="yellow">M</span>
              <span className="green">W</span>
              <span className="teal">-</span>
              <span className="blue">S</span>
              <span className="indigo">I</span>
              <span className="purple">S</span>
            </Link>
            {/* End Logo and Title */}

            {/* Start Full Sized Menu */}
            {menuItems.map((page) => (
              <Accordion
                key={page.label}
                square
                expanded={expanded === page.label}
                onChange={handleChange(page.label)}
                onMouseLeave={handleChange("")}
                sx={{
                  display: { xs: "none", lg: "block" },
                  boxShadow: "none",
                }}
                disableGutters
              >
                <AccordionSummary className="menu-items">
                  {page.label}
                </AccordionSummary>
                <AccordionDetails className="dropdown">
                  {page.submenu.map((submenu) => {
                      return (
                        <ul key={submenu.label} className={"dropdown-items"}>
                          {submenu.component}
                        </ul>
                      );
                  })}
                </AccordionDetails>
              </Accordion>
            ))}
            {/* End Full Sized Menu */}
            <div className="left-cluster">
              {SHOW_DEVMODE && <DevMode />}
              {/* Icons */}
              <a
                href="https://github.com/FTMW-Scientific-Simulator/Virtual-FTMW-Spectrometer#readme"
                target="_blank"
                rel="noreferrer"
              >
                <GitHub
                  className="icon"
                  sx={{ fontSize: "35px" }}
                  onMouseEnter={openGitHubPopover}
                  onMouseLeave={closeGitHubPopover}
                />
              </a>

              {/* Icon Popovers */}
              <Popover
                sx={{ pointerEvents: "none" }}
                open={Boolean(gitHubPopover)}
                anchorEl={gitHubPopover}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                If you are interested in the code and tools
                <br /> behind this project check out our GitHub!
              </Popover>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
      <Outlet />
    </div>
  );
}

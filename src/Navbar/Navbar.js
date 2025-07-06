import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Container } from "react-bootstrap";
import { useTheme } from "../ThemeToggle/ThemContext.js";
import { FaRobot } from "react-icons/fa"; 
const title = process.env.REACT_APP_TITLE;

function MyNavbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Navbar
      fixed="top"
      bg={isDark ? "dark" : "light"}
      variant={isDark ? "dark" : "light"}
      expand="lg"
      className="custom-navbar"
    >
      <Container fluid>
        <Navbar.Brand href="#">
        <FaRobot size={25} className="me-2" />
        {title}
      </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-auto" />

        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-end align-items-center"
        >
          {/* Light / Dark toggle */}
          <div className="d-flex align-items-center">
            <span className="theme-label me-2" style={{ color: "#f8f9fa" }}>
              Light
            </span>

            <div className="form-check form-switch mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
                checked={isDark}
                onChange={toggleTheme}
              />
            </div>
            <span className="theme-label ms-2" style={{ color: "#212529" }}>
              Dark
            </span>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;

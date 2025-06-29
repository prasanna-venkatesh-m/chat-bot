import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Container } from "react-bootstrap";
import { useTheme } from "../ThemeToggle/ThemContext.js";

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
        <Navbar.Brand href="#">Navbar</Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-auto" />

        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-end align-items-center"
        >
          {/* Light / Dark toggle */}
          <div className="d-flex align-items-center">
            <span className="me-2">Light</span>
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
            <span className="ms-2">Dark</span>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;

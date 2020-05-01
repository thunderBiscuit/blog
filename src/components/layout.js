import React from "react"
import { Helmet } from "react-helmet"

import Hamburger from "./hamburger"
import Sidebar from "./sidebar"

class Layout extends React.Component {
  render() {
    return (
      <>
        <Helmet>
          <script async defer data-domain="thunderbiscuit.com" src="https://plausible.io/js/plausible.js"></script>
        </Helmet>
        <div className="container">
          <div className="columns">
            <div className="column is-one-quarter is-hidden-mobile">
              <Sidebar />
            </div>

            <div className="column content">
              <Hamburger class={"navbar-burger"} />
              {this.props.children}
            </div>
          </div>

          <div
            id="mobile-menu"
            style={{
              marginLeft: "0px",
              top: "3rem",
              width: "220px",
              height: "100vh",
              backgroundColor: "#ffffff",
              position: "absolute",
              transform: "translateX(-220px)",
              transition: "all 0.5s ease",
            }}
          >
            <Sidebar />
            <br />
            <br />
            <Hamburger class={"navbar-burger is-active"} />
          </div>
        </div>
      </>
    )
  }
}

export default Layout

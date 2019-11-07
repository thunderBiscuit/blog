import React from "react"
import { Link } from "gatsby"

import Hamburger from "./hamburger"
import MobileMenu from "./mobile-menu"

class Layout extends React.Component {
  render() {
    return (
      <div class="container">
        <div class="columns">
          <div class="column is-one-quarter is-hidden-mobile">
            <Link to={`/`}>
              <p
                style={{
                  marginBottom: "3rem",
                  borderBottom: "2px solid #209cee",
                  marginRight: "2.5rem",
                  color: "#363636",
                  fontFamily: "Fira Sans, sans-serif",
                }}
              >
                thunder-blog
              </p>
            </Link>
            <Link to={`/`}>About</Link>
            <br />
            <Link to={`/all-posts/`}>All Posts</Link>
            <br />
            <Link to={`/tags/`}>Tags</Link>
            <br />
            <Link to={`/contact/`}>Contact</Link>
          </div>

          <div class="column content">
            <Hamburger class={"navbar-burger"} />
            {this.props.children}
          </div>
        </div>

        <div
          id="mobile-menu"
          style={{
            marginLeft: "0px",
            top: "3rem",
            width: "300px",
            height: "100vh",
            backgroundColor: "#ffffff",
            position: "absolute",
            transform: "translateX(-300px)",
            transition: "all 0.5s linear",
          }}
        >
          <MobileMenu />
          <br />
          <br />
          <Hamburger class={"navbar-burger is-active"} />
        </div>
      </div>
    )
  }
}

export default Layout

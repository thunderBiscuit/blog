import React from "react"
import { Link } from "gatsby"

export default ({ children }) => (
  <div class="container">
    <div class="columns">
      <div class="column is-one-quarter is-hidden-mobile">
        <Link to={`/`}>
          <h3
            style={{
              marginBottom: "3rem",
              borderBottom: "2px solid #209cee",
              marginRight: "2.5rem",
              color: "#363636",
              fontFamily: "Fira Sans, sans-serif",
            }}
          >
            thunder-blog
          </h3>
        </Link>
        <Link to={`/`}>About</Link>
        <br />
        <Link to={`/all-posts/`}>All Posts</Link>
        <br />
        <Link to={`/tags/`}>Tags</Link>
        <br />
        <Link to={`/contact/`}>Contact</Link>
      </div>
      <div class="column content">{children}</div>
    </div>
  </div>
)

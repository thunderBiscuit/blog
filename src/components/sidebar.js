import React from "react"
import { Link } from "gatsby"

function Sidebar(props) {
  return (
    <>
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
    </>
  )
}

export default Sidebar

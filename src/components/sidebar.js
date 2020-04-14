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
          thunder blog
        </p>
      </Link>
      <Link to={`/`} className="sidebar-link">about</Link>
      <br />
      <Link to={`/all-posts/`} className="sidebar-link">all posts</Link>
      <br />
      <Link to={`/tags/`} className="sidebar-link">tags</Link>
      <br />
      <Link to={`/contact/`} className="sidebar-link">contact</Link>
    </>
  )
}

export default Sidebar

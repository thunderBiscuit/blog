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
      <Link to={`/`}>about</Link>
      <br />
      <Link to={`/all-posts/`}>all posts</Link>
      <br />
      <Link to={`/tags/`}>tags</Link>
      <br />
      <Link to={`/contact/`}>contact</Link>
    </>
  )
}

export default Sidebar

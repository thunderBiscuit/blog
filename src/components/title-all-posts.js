import React from "react"
import { Link } from "gatsby"

function TitleAllPosts({ children }) {
  return (
    <>
    <h2
      className="title is-size-2"
      style={{ marginBottom: "1rem", textAlign: "center" }}
    >
      {children}
    </h2>
    <p
      style={{ marginBottom: "4rem", textAlign: "center" }}
    >
      <Link to={`/tags/`} className="sidebar-link"><em>(or search by tag instead)</em></Link>
    </p>
    </>
  )
}

export default TitleAllPosts

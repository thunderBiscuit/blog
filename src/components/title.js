import React from "react"

function Title({ children }) {
  return (
    <h1
      className="title is-size-2"
      style={{ marginBottom: "4rem", textAlign: "center" }}
    >
      {children}
    </h1>
  )
}

export default Title

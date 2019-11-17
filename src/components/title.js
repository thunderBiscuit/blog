import React from "react"

function Title({ children }) {
  return (
    <h2
      className="title is-size-2"
      style={{ marginBottom: "4rem", textAlign: "center" }}
    >
      {children}
    </h2>
  )
}

export default Title

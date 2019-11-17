import React from "react"

import lightning from "../images/lightning.png"

function FourOFour() {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "5rem",
        }}
      >
        <img src={lightning} alt="lightning bolt" />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "4rem",
          marginBottom: "2rem",
        }}
      >
        <h1
          class="title hero-title"
          style={{ marginBottom: "1rem", fontWeight: 500 }}
        >
          Houston, that's a 404.
        </h1>
      </div>
    </>
  )
}

export default FourOFour

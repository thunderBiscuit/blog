import React from "react"
import Layout from "../components/layout"

import lightning from "./lightning.png"

function MainSection() {
  return (
    <Layout>
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
          marginTop: "2rem",
          marginBottom: "2rem",
        }}
      >
        <h1>thunder blogging</h1>
      </div>
      <p>A blog about all sorts of stuff related to web development.</p>
    </Layout>
  )
}

export default MainSection

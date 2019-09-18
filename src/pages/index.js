import React from "react"
import Layout from "../components/layout"

import "../styles/global.scss"
import lightning from "../images/lightning.png"

function Blog() {
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
        <h1 class="title" style={{ marginBottom: "1rem" }}>
          thunder blog
        </h1>
      </div>
      <blockquote>A blog about computers, software, and satoshis.</blockquote>
      {/* <blockquote>Computers, software, and satoshis.</blockquote> */}
      <br />
      <br />
    </Layout>
  )
}

export default Blog

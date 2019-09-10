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
          thunder blogging
        </h1>
      </div>
      <blockquote>
        A blog about computers, web development, and satoshis.
      </blockquote>
      <br />
      <br />
      <p>
        A blog about all sorts of stuff related to computers, web development,
        and satoshis. Pork belly poutine drinking vinegar gluten-free taxidermy
        coloring book messenger bag. Brooklyn brunch gluten-free selfies occupy.
        Tilde pok pok pug, disrupt trust fund synth literally retro lyft
        everyday carry flexitarian pour-over four dollar toast bitters. Tattooed
        woke pabst ugh marfa glossier listicle. Listicle taxidermy glossier
        heirloom, helvetica vaporware try-hard lumbersexual dreamcatcher
        asymmetrical.
      </p>
    </Layout>
  )
}

export default Blog

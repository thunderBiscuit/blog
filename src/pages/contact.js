import React from "react"

import Layout from "../components/layout"
import Title from "../components/title"

export default () => (
  <Layout>
    <Title>Contact me</Title>
    <p>
      The easiest way to contact me is to{" "}
      <a href="https://twitter.com/thunderB__" target="_blank" rel="noopener noreferrer">send me a DM on twitter</a>.
    </p>
    <p>
      You can also send me an email at{" "}
      <a href="mailto: thunderB@protonmail.com">thunderB@protonmail.com</a>.
    </p>
    <p>
      If you want to see what I'm up to, check out my GiHub account
      <a href="https://github.com/thunderBiscuit" target="_blank" rel="noopener noreferrer"> here</a>.
    </p>
  </Layout>
)

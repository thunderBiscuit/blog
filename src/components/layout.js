import React from "react"
import { Link } from "gatsby"
import { Container, Grid } from "@material-ui/core"

import Header from "./header"
import "./layout.css"

export default ({ children }) => (
  <>
    <Container maxWidth="md">
      <Header />
      <Grid container>
        <Grid item xs={3}>
          <Link to={`/`}>
            <h3 style={{ marginBottom: "3rem" }}>thunder-blog</h3>
          </Link>
          <Link to={`/about/`}>About</Link>
          <br />
          <Link to={`/all-posts/`}>All Posts</Link>
          <br />
          <Link to={`/tags/`}>Tags</Link>
          <br />
          <Link to={`/contact/`}>Contact</Link>
        </Grid>
        <Grid item xs={9}>
          {children}
        </Grid>
      </Grid>
    </Container>
  </>
)

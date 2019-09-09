import React from "react"
import { Link } from "gatsby"
import { Container, Grid } from "@material-ui/core"

export default ({ children }) => (
  <>
    <Container maxWidth="md" className="maincontainer">
      <Grid container>
        <Grid item xs={3}>
          <Link to={`/`}>
            <h3
              style={{
                marginBottom: "3rem",
                borderBottom: "2px solid #209cee",
                marginRight: "2.5rem",
                color: "#363636",
                fontFamily: "Fira Sans, sans-serif",
              }}
            >
              thunder-blog
            </h3>
          </Link>
          <Link to={`/`}>About</Link>
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

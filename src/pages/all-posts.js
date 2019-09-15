import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Title from "../components/title"
import PostLink from "../components/post-link"

export default ({ data }) => (
  <Layout>
    <Title>All posts</Title>

    <div style={{ marginTop: "4rem" }}>
      <h5 style={{ marginBottom: "2rem" }}>
        2019
        <span style={{ color: "#bdbdbd" }}>
          {" "}
          — {data.nineteen.totalCount} Posts
        </span>
      </h5>
      {data.nineteen.edges.map(({ node }) => (
        <PostLink node={node} />
      ))}
    </div>
  </Layout>
)

export const query = graphql`
  query {
    eighteen: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { year: { eq: "2018" } } }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMM, YYYY")
          }
          fields {
            slug
          }
        }
      }
    }
    nineteen: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { year: { eq: "2019" } } }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMM, YYYY")
          }
          fields {
            slug
          }
        }
      }
    }
  }
`

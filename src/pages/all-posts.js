import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import TitleAllPosts from "../components/title-all-posts"
import PostLink from "../components/post-link"

export default ({ data }) => (
  <Layout>
    <TitleAllPosts>all posts</TitleAllPosts>

    <div style={{ marginTop: "4rem" }}>
      <h5 className="title is-5" style={{ marginBottom: "2rem" }}>
        2020
        <span style={{ color: "#bdbdbd" }}>
          {" "}
          — {data.twenty.totalCount} Posts
        </span>
      </h5>
      {data.twenty.edges.map(({ node }) => (
        <PostLink node={node} />
      ))}
    </div>
    <div style={{ marginTop: "7rem" }}>
      <h5 className="title is-5" style={{ marginBottom: "2rem" }}>
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
    twenty: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { year: { eq: "2020" } } }
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

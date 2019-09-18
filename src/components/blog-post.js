import React from "react"
import { graphql } from "gatsby"

import Layout from "./layout"
import Title from "./title"
import TagsList from "./tags-list"

export default ({ data }) => {
  const post = data.markdownRemark
  return (
    <Layout>
      <div>
        <Title>{post.frontmatter.title}</Title>
        <div
          class="content blog-post"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
      <hr />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h5 style={{ color: "#bdbdbd" }}>{post.frontmatter.date}</h5>
        <TagsList>{post.frontmatter}</TagsList>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "DD MMM, YYYY")
        tags
      }
    }
  }
`

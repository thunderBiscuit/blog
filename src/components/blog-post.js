import React from "react"
import { graphql } from "gatsby"

import Layout from "./layout"
import Title from "./title"

export default ({ data }) => {
  const post = data.markdownRemark
  return (
    <Layout>
      <div>
        <Title>{post.frontmatter.title}</Title>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
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
      }
    }
  }
`

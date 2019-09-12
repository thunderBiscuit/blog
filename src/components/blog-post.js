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
        <div class="content" dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
      <hr />
      <TagsList>{post.frontmatter}</TagsList>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        tags
      }
    }
  }
`

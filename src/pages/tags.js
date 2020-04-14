import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Title from "../components/title"
import PostLink from "../components/post-link"
import TagButton from "../components/tag-button"

class tagsPage extends React.Component {
  state = {
    currentTags: [],
  }

  handleClick = event => {
    const maybeNewTag = event.target.id
    const { currentTags } = this.state

    const elem = document.getElementById(event.target.id)
    // console.log("element class: ", elem.className)
    if (elem.className.includes("is-outlined")) {
      elem.className = "button is-primary is-small"
    } else {
      elem.className = "button is-primary is-small is-outlined"
    }

    if (!currentTags.includes(maybeNewTag)) {
      this.setState(prevState => ({
        currentTags: [...prevState.currentTags, maybeNewTag],
      }))
    } else {
      // console.log("was already in there boo")
      this.setState(prevState => ({
        currentTags: prevState.currentTags.filter(cat => maybeNewTag !== cat),
      }))
    }
  }

  render() {
    // console.log(this.props)
    // console.log(this.state)
    console.log("latest tags: ", this.state.currentTags)
    return (
      <Layout>
        <Title>tags</Title>
        <TagButton onClick={this.handleClick} name={"gpg"} id={"gpg"} />
        <TagButton onClick={this.handleClick} name={"bitcoin"} id={"bitcoin"} />
        <TagButton onClick={this.handleClick} name={"samourai"} id={"samourai"} />
        <TagButton onClick={this.handleClick} name={"rust"} id={"rust"} />
        <TagButton
          onClick={this.handleClick}
          name={"cli-apps"}
          id={"cli-apps"}
        />
        <TagButton onClick={this.handleClick} name={"meta"} id={"meta"} />
        <div style={{ marginTop: "3rem" }}>
          <h4 id="numberOfPosts">0 Posts</h4>
          {this.props.data.allMarkdownRemark.edges.map(({ node }) => {
            const found = node.frontmatter.tags.some(r =>
              this.state.currentTags.includes(r)
            )
            if (found) {
              return <PostLink node={node} name={"aPost"} />
            } else {
              return null
            }
          })}
        </div>
      </Layout>
    )
  }
  componentDidUpdate() {
    console.log("component updated")
    const countPosts = document.getElementsByName("aPost").length
    if (countPosts === 1) {
      document.getElementById("numberOfPosts").innerText = countPosts + " Post"
    } else {
      document.getElementById("numberOfPosts").innerText = countPosts + " Posts"
    }
  }
}

export default tagsPage

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMM, YYYY")
            tags
          }
          fields {
            slug
          }
        }
      }
    }
  }
`

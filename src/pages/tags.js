import React from "react"
import { graphql } from "gatsby"
// import { Button } from "@material-ui/core"
// import "../styles/bulma.css"

import Layout from "../components/layout"
import Title from "../components/title"
import PostLink from "../components/post-link"

class tagsPage extends React.Component {
  state = {
    currentTags: [],
    totalPosts: 0,
  }

  // updateTotalPosts = () => {
  //   this.setState(({ totalPosts }) => ({
  //     totalPosts: document.getElementsByName("aPost").length,
  //   }))
  // }

  // addPostToTotal = () => {
  //   this.setState((prevState, { totalPosts }) => ({
  //     totalPosts: prevState.totalPosts + 1,
  //   }))
  // }

  resetTotal = () => {
    console.log("I reset the total")
  }

  handleClick = event => {
    const maybeNewTag = event.target.name
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
    // console.log("latest state: ", this.state)
    console.log("latest tags: ", this.state.currentTags)
    return (
      <Layout>
        <Title>Tags</Title>
        <TagButton onClick={this.handleClick} name={"hello"} id={"hello"} />
        <TagButton onClick={this.handleClick} name={"world"} id={"world"} />
        <div style={{ marginTop: "3rem" }}>
          {/* <h4>{this.state.totalPosts} Posts</h4> */}
          <h4 id="numberOfPosts">0 Posts</h4>
          {/* <h4>{document.getElementsByName("aPost").length} Posts</h4> */}
          {/* <h4>{this.props.data.allMarkdownRemark.totalCount} Posts</h4> */}
          {this.props.data.allMarkdownRemark.edges.map(({ node }) => {
            const found = node.frontmatter.tags.some(r =>
              this.state.currentTags.includes(r)
            )
            if (found) {
              // this.addPostToTotal()
              // this.updateTotalPosts()
              return <PostLink node={node} name={"aPost"} />
            } else {
              // this.resetTotal()
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

const TagButton = props => (
  <button
    onClick={props.onClick}
    type="button"
    style={{ marginRight: "0.5rem" }}
    name={props.name}
    id={props.id}
    className="button is-primary is-small is-outlined"
  >
    {props.name}
  </button>
)

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

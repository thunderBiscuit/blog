import React from "react"
import { Link } from "gatsby"

function PostLink({ node, name }) {
  return (
    <Link to={node.fields.slug} name={name}>
      <div
        key={node.id}
        style={{
          borderBottom: "1px dashed #bdbdbd",
          marginTop: "3rem",
        }}
      >
        <h5
          className="title is-5"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
            fontWeight: "400",
            fontSize: "18px",
          }}
        >
          <span>{node.frontmatter.title}</span>
          <span style={{ color: "#bdbdbd" }}>{node.frontmatter.date}</span>
        </h5>
      </div>
    </Link>
  )
}

export default PostLink

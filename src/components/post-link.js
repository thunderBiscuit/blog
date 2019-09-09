import React from "react"
import { Link } from "gatsby"

function PostLink({ node, name }) {
  return (
    <Link to={node.fields.slug} name={name}>
      <div
        key={node.id}
        style={{
          borderBottom: "1px dashed black",
          marginTop: "2rem",
        }}
      >
        <h4
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <span style={{ fontWeight: "700", color: "#363636" }}>
            {node.frontmatter.title}
          </span>
          <div class="tags">
            <span style={{ fontWeight: "700", color: "#bdbdbd" }}>
              {node.frontmatter.date}
            </span>
          </div>
        </h4>
      </div>
    </Link>
  )
}

export default PostLink

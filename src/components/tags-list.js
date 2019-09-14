import React from "react"

function TagsList({ children }) {
  console.log(children)
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      {children.tags.map(tag => {
        return (
          <span className="tag is-primary" style={{ marginRight: "0.5rem" }}>
            {tag}
          </span>
        )
      })}
    </div>
  )
}

export default TagsList

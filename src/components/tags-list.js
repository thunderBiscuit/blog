import React from "react"

function TagsList({ children }) {
  console.log(children)
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      {children.tags.map(tag => {
        // console.log("I am", tag)
        return (
          <span className="tag" style={{ marginRight: "0.5rem" }}>
            {tag}
          </span>
        )
      })}
    </div>
  )
}

export default TagsList

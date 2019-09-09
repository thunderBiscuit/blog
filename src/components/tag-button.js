import React from "react"

function TagButton(props) {
  return (
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
}

export default TagButton

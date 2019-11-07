import React from "react"

class Hamburger extends React.Component {
  mobileMenuClick = event => {
    const elem = document.getElementById("mobile-menu")
    console.log("mobileMenuClick was called")
    if (elem.style.transform === "translateX(-300px)") {
      elem.style.transform = "translateX(0px)"
    } else {
      elem.style.transform = "translateX(-300px)"
    }
  }

  render() {
    return (
      <a
        role="button"
        class={this.props.class}
        aria-label="menu"
        aria-expanded="false"
        href="#"
        onClick={this.mobileMenuClick}
        style={{
          float: "left",
          border: "1px solid #209cee",
          borderRadius: "50px",
        }}
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    )
  }
}

export default Hamburger

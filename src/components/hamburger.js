import React from "react"

class Hamburger extends React.Component {
  mobileMenuClick = event => {
    const elem = document.getElementById("mobile-menu")
    if (elem.style.transform === "translateX(-220px)") {
      elem.style.transform = "translateX(0px)"
    } else {
      elem.style.transform = "translateX(-220px)"
    }
  }

  render() {
    return (
      <button
        // role="button"
        class={this.props.class}
        aria-label="menu"
        aria-expanded="false"
        href="#"
        onClick={this.mobileMenuClick}
        style={{
          float: "left",
          background: "#ffffff",
          border: "2px solid #209cee",
          borderRadius: "50px",
        }}
      >
        {/* <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span> */}
        ⚡
      </button>
    )
  }
}

export default Hamburger

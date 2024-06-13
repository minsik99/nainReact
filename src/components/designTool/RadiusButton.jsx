import React from "react";
import PropTypes from "prop-types";

const RadiusButton = ({
  padding,
  color,
  text,
  onClick,
  fontSize,
  borderRadius,
}) => {
  const buttonStyles = {
    padding: padding || "12px 24px",
    backgroundColor: color,
    border: "none",
    borderRadius: borderRadius || "10px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: fontSize || "14px",
  };

  return (
    <button style={buttonStyles} onClick={onClick}>
      {text}
    </button>
  );
};

RadiusButton.propTypes = {
  padding: PropTypes.string,
  color: PropTypes.string,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  fontSize: PropTypes.string,
  borderRadius: PropTypes.string,
};

RadiusButton.defaultProps = {
  padding: "12px 24px",
  color: "#007bff",
  onClick: () => {
    alert("뭘봐");
  },
  fontSize: "14px",
  borderRadius: "10px",
};

export default RadiusButton;

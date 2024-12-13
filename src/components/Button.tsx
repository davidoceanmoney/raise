import React from "react";
import { twMerge } from "tailwind-merge";

const Button = ({ type = "solid", className, children, ...rest }:any) => {
  let classes = "uppercase rounded-xl p-4 text-xs font-monument";
  if (type === "solid") {
    classes = twMerge(`${classes} text-gray-900 bg-gold-200`, className);
  }
  if (type === "outline") {
    classes = twMerge(
      `${classes} bg-gray-900 text-gold-200 border border-gold-200`,
      className
    );
  }
  if (type === "busd") {
    classes = twMerge(
      `${classes} bg-gray-700 text-gold-200 border border-gold-200`,
      className
    );
  }
  if (type === "link") {
    classes = className;
  }
  if (type === "dark") {
    classes = twMerge(`${classes} bg-gray-900 text-gold-200`, className);
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
};
export default Button;

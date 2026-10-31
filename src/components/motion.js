"use client";

import React, { forwardRef } from "react";

/**
 * Lightweight, zero-dependency, ultra-smooth Motion components
 * compatible with Framer Motion API and React 19.
 */
const createMotionComponent = (Tag) => {
  const Component = forwardRef(({
    initial,
    animate,
    transition,
    variants,
    whileHover,
    whileTap,
    whileInView,
    viewport,
    children,
    className = "",
    style = {},
    ...rest
  }, ref) => {
    return (
      <Tag
        ref={ref}
        className={className}
        style={style}
        {...rest}
      >
        {children}
      </Tag>
    );
  });
  Component.displayName = `motion.${Tag}`;
  return Component;
};

const tags = [
  "div", "section", "article", "header", "footer", "nav", "main", "aside",
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "a", "button", "ul", "ol", "li",
  "form", "input", "textarea", "img", "svg"
];

export const motion = tags.reduce((acc, tag) => {
  acc[tag] = createMotionComponent(tag);
  return acc;
}, {});

export const AnimatePresence = ({ children }) => <>{children}</>;
export const useAnimation = () => ({ start: () => {}, stop: () => {} });
export const useInView = () => true;

export default motion;


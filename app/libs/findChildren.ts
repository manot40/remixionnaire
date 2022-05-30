import React from "react";

export const findChildren = (children: JSX.Element, name: string) => {
  return React.Children.map(children, (child) =>
    child.type.displayName === name ? child : null
  );
};

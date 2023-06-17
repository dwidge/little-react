// Copyright DWJ 2023.
// Distributed under the Boost Software License, Version 1.0.
// https://www.boost.org/LICENSE_1_0.txt

import React from "react";

export const classy =
  (Component: keyof JSX.IntrinsicElements | React.ComponentType<any>) =>
  (className: string = "", style: React.CSSProperties = {}) =>
    React.forwardRef(
      (props: React.ComponentPropsWithRef<typeof Component>, ref) => (
        <Component
          {...props}
          ref={ref}
          className={className + " " + props.className ?? ""}
          style={{
            ...style,
            ...(props.style ?? {}),
          }}
        />
      )
    );

export const div = classy("div");
export const canvas = classy("canvas");

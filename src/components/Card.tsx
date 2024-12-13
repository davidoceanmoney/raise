// import React from "react";
// import { twMerge } from "tailwind-merge";

// const Card = React.forwardRef(({ className, children, ...rest }, ref) => {
//   return (
//     <div
//       ref={ref}
//       {...rest}
//       className={`${twMerge(
//         "bg-gray-900 p-6 font-monument rounded-xl",
//         className
//       )}`}
//     >
//       {children}
//     </div>
//   );
// });

// Card.displayName = "Card";

// export default Card;

import React, { forwardRef, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

// Define props for the Card component
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string; // Optional className prop
}

// Use forwardRef with properly typed ref and props
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        {...rest}
        className={twMerge(
          "bg-gray-900 p-6 font-monument rounded-xl",
          className
        )}
      >
        {children}
      </div>
    );
  }
);

// Set displayName for better debugging
Card.displayName = "Card";

export default Card;


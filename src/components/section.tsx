import React, { FC, PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "zmp-ui";
import { BoxProps } from "zmp-ui/box";
import { To } from "zmp-ui/useNavigate";

export interface SectionProps extends BoxProps {
  title: string;
  padding?: "all" | "none" | "title-only";
  rightText?: React.ReactNode;
  rightTo?: To;
}

export const Section: FC<PropsWithChildren<SectionProps>> = ({
  children,
  title,
  padding = "all",
  rightText,
  rightTo,
  ...props
}) => {
  return (
    <Box
      className={`bg-background ${
        padding === "all" ? " py-2 px-2 space-y-4" : ""
      } ${padding === "title-only" ? "py-4 space-y-4" : ""}`}
      {...props}
    >
      <div className="flex items-center justify-between">
        <Text.Title
          className={`${
            padding === "title-only" ? "px-2" : ""
          } font-bold text-lg`}
        >
          {title}
        </Text.Title>
        {rightText &&
          (rightTo ? (
            <Link
              to={rightTo}
              className="font-medium text-md text-[#212529] no-underline"
            >
              {rightText}
            </Link>
          ) : (
            <Text className="font-medium text-md text-[#212529]">
              {rightText}
            </Text>
          ))}
      </div>
      {children}
    </Box>
  );
};

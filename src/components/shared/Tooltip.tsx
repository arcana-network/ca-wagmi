import React from "react";
import { Tooltip } from "@ark-ui/react";
import styled from "styled-components";

type AppTooltipProps = {
  message: string;
  children: React.ReactNode;
};

// Styled Components
const TooltipTrigger = styled(Tooltip.Trigger)`
  display: inline-flex;
`;

const TooltipContent = styled(Tooltip.Content)`
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: 0.875rem;
  background-color: white;
  color: black;
  border-radius: 4px;
  padding: 8px 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TooltipArrow = styled(Tooltip.Arrow)`
  fill: white;
`;

const AppTooltip: React.FC<AppTooltipProps> = ({ message, children }) => {
  return (
    <Tooltip.Root openDelay={1000} interactive={true}>
      <TooltipTrigger asChild>
        <div>{children}</div>
      </TooltipTrigger>
      <Tooltip.Positioner>
        <TooltipContent>
          {message}
          <TooltipArrow />
        </TooltipContent>
      </Tooltip.Positioner>
    </Tooltip.Root>
  );
};

export default AppTooltip;

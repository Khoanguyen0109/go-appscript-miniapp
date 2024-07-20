import React, { ReactNode, useMemo, useState } from "react";
import { Box, Button, Icon, Text } from "zmp-ui";

interface ListRendererUserProps<T> {
  title?: string;
  limit?: number;
  items: T[];
  renderLeft: (item: T) => ReactNode;
  renderRight: (item: T) => ReactNode;
  renderKey?: (item: T) => string;
  onClick?: (item: T) => void;
  noDivider?: boolean;
  gap?: number;
  padding?: number;
}

export function ListRendererUser<T>({
  title,
  items,
  limit,
  renderLeft,
  renderRight,
  renderKey,
  onClick,
  noDivider,
  gap,
  padding = 4,
}: ListRendererUserProps<T>) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const collapsedItems = useMemo(() => {
    return items.slice(0, limit);
  }, [items]);

  return (
    <Box className="bg-nature-800 text-white rounded-xl my-4">
      {title && <Text.Title className="p-4 pb-0">{title}</Text.Title>}
      <Box>
        {(isCollapsed ? collapsedItems : items).map((item, i, list) => (
          <div
            key={renderKey ? renderKey(item) : i}
            onClick={() => onClick?.(item)}
            className={`flex items-start space-x-1 p-${padding} items-center last:pb-0 mb-1 border-b-[0.56px] border-solid border-gray-200`}
          >
            {renderLeft(item)}
            <Box className="flex-1 min-w-0 mt-1  relative">
              {renderRight(item)}
            </Box>
          </div>
        ))}
      </Box>
      {isCollapsed && collapsedItems.length < items.length ? (
        <Box className="p-2">
          <Button
            onClick={() => setIsCollapsed(false)}
            fullWidth
            suffixIcon={<Icon icon="zi-chevron-down" />}
            variant="tertiary"
            type="neutral"
          >
            Xem thêm
          </Button>
        </Box>
      ) : (
        <Box className="w-full"></Box>
      )}
    </Box>
  );
}

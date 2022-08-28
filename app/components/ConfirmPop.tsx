import {
  Button,
  Card,
  Loading,
  Popover,
  Spacer,
  Text,
} from "@nextui-org/react";

interface IProps {
  content?: any;
  isLoading?: boolean;
  onConfirm?: () => void;
  colorScheme?: "primary" | "secondary" | "error" | "success" | "warning";
}

export default function ConfirmModal({
  content,
  onConfirm,
  isLoading = false,
  colorScheme = "primary",
}: IProps) {
  return (
    <Popover>
      <Popover.Trigger>
        {content ? (
          <div>{content}</div>
        ) : (
          <Button
            auto
            light
            color={colorScheme}
            css={{ alignSelf: "center" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* @ts-ignore */}
            <ion-icon name="trash-outline" style={{ fontSize: "1.4rem" }} />
          </Button>
        )}
      </Popover.Trigger>
      <Popover.Content>
        <Card
          css={{
            backgroundColor: "$backgroundDeep",
            border: "1px solid $border",
          }}
        >
          <Text css={{ maxWidth: "200px", textAlign: "center" }}>
            Are you sure you want to delete this item?
          </Text>
          <Spacer />
          <Button
            style={{ width: "100%" }}
            disabled={isLoading}
            onClick={onConfirm}
            color={colorScheme}
            ghost
          >
            {isLoading ? (
              <Loading type="points-opacity" color="currentColor" size="sm" />
            ) : (
              "Proceed"
            )}
          </Button>
        </Card>
      </Popover.Content>
    </Popover>
  );
}

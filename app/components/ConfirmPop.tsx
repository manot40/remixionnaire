import {
  Button,
  Card,
  Loading,
  Popover,
  Spacer,
  Text,
} from "@nextui-org/react";
import { Form } from "@remix-run/react";

interface IProps {
  param?: any;
  isLoading?: boolean;
  colorScheme?: "primary" | "secondary" | "error" | "success" | "warning";
}

export default function ConfirmModal({
  param = "",
  isLoading = false,
  colorScheme = "primary",
}: IProps) {
  return (
    <Popover>
      <Popover.Trigger>
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
      </Popover.Trigger>
      <Popover.Content>
        <Card css={{backgroundColor: "$backgroundDeep", border: "1px solid $border"}}>
          <Form method="delete" style={{ alignSelf: "center" }}>
            <input hidden name="id" value={param} readOnly />
            <Text css={{ maxWidth: "200px", textAlign: "center" }}>
              Are you sure you want to delete this item?
            </Text>
            <Spacer />
            <Button
              style={{ width: "100%" }}
              disabled={isLoading}
              color={colorScheme}
              type="submit"
              ghost
            >
              {isLoading ? (
                <Loading type="points-opacity" color="currentColor" size="sm" />
              ) : (
                "Proceed"
              )}
            </Button>
          </Form>
        </Card>
      </Popover.Content>
    </Popover>
  );
}

// <Modal preventClose open={open}>
//   <Modal.Header>
//     <Text
//       b
//       css={{
//         letterSpacing: "$wide",
//         marginTop: "12px !important",
//         fontSize: "1.5rem",
//       }}
//     >
//       Confirmation
//     </Text>
//   </Modal.Header>
//   <Modal.Body>
//     <Divider />
//     <Spacer y={0.5} />
//     <Text style={{ textAlign: "center" }}>{content}</Text>
//     <Spacer y={0.5} />
//     <Divider />
//   </Modal.Body>
//   <Modal.Footer css={{ display: "flex", justifyContent: "center" }}>
//     <Button
//       flat
//       onClick={reject}
//       color={colorScheme}
//       css={{ minWidth: "9rem" }}
//     >
//       Dismiss
//     </Button>
//     <Button
//       disabled={isLoading}
//       color={colorScheme}
//       onClick={proceed}
//       css={{ minWidth: "9rem" }}
//     >
//       {isLoading ? (
//         <Loading type="points-opacity" color="currentColor" size="sm" />
//       ) : (
//         "Proceed"
//       )}
//     </Button>
//   </Modal.Footer>
// </Modal>

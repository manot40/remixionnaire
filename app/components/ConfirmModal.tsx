import {
  Button,
  Divider,
  Loading,
  Modal,
  Spacer,
  Text,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

interface IProps {
  open: boolean;
  content: string;
  param?: any;
  colorScheme?: "primary" | "secondary" | "error" | "success" | "warning";
  onProceed: (args: any) => void;
  onReject: (args: any) => void;
}

export default function ConfirmModal({
  open,
  content,
  param,
  colorScheme = "primary",
  onProceed,
  onReject,
}: IProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [open]);

  const reject = () => {
    onReject(param);
  };

  const proceed = () => {
    onProceed(param);
    setIsLoading(true);
  };

  return (
    <Modal preventClose open={open}>
      <Modal.Header>
        <Text
          b
          css={{
            letterSpacing: "$wide",
            marginTop: "12px !important",
            fontSize: "1.5rem",
          }}
        >
          Confirmation
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Divider />
        <Spacer y={0.5} />
        <Text style={{ textAlign: "center" }}>{content}</Text>
        <Spacer y={0.5} />
        <Divider />
      </Modal.Body>
      <Modal.Footer css={{ display: "flex", justifyContent: "center" }}>
        <Button
          flat
          onClick={reject}
          color={colorScheme}
          css={{ minWidth: "9rem" }}
        >
          Dismiss
        </Button>
        <Button
          disabled={isLoading}
          color={colorScheme}
          onClick={proceed}
          css={{ minWidth: "9rem" }}
        >
          {isLoading ? (
            <Loading type="points-opacity" color="currentColor" size="sm" />
          ) : (
            "Proceed"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

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
  onProceed: (args: any) => void;
  onReject: (args: any) => void;
}

export default function ConfirmModal({
  open,
  content,
  param,
  onProceed,
  onReject,
}: IProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [open]);

  const reject = () => {
    onReject(param);
    setIsLoading(true);
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
        <Button auto flat onClick={reject}>
          Reject
        </Button>
        <Button auto disabled={isLoading} onClick={proceed}>
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

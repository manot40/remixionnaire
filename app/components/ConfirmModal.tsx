import { Button, Divider, Modal, Spacer, Text } from "@nextui-org/react";

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
  return (
    <Modal preventClose open={open}>
      <Modal.Header>
        <Text b size={24} style={{ marginTop: "12px" }}>
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
        <Button auto flat onClick={() => onReject(param)}>
          Reject
        </Button>
        <Button auto onClick={() => onProceed(param)}>
          Proceed
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

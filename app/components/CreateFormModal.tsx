import {
  Modal,
  Text,
  Spacer,
  Input,
  Button,
  Loading,
  Textarea,
} from "@nextui-org/react";
import { Form } from "@remix-run/react";

interface IProps {
  open: boolean;
  isLoading: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

export default function CreateFormModal({
  open,
  isLoading,
  onSubmit,
  onClose,
}: IProps) {
  return (
    <Modal
      closeButton
      onClose={onClose}
      open={open}
      css={{ backgroundColor: "$backgroundDeep" }}
    >
      <Modal.Header>
        <Text h4 css={{ letterSpacing: "$wide" }}>
          Create New Form
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Spacer y={0.5} />
        <Form method="post" onSubmit={onSubmit}>
          <Input
            name="name"
            label="Form Title"
            clearable
            bordered
            fullWidth
            required
          />
          <Spacer y={0.5} />
          <Input
            type="datetime-local"
            name="expiresAt"
            label="Expiry Date (optional)"
            clearable
            bordered
            fullWidth
          />
          <Spacer y={0.5} />
          <Textarea
            name="description"
            label="Description (optional)"
            bordered
            fullWidth
          />
          <Spacer y={2} />
          <Button
            type="submit"
            disabled={isLoading}
            shadow={!isLoading}
            css={{ marginBottom: "1.33rem", width: "100%" }}
          >
            {isLoading ? (
              <Loading type="points-opacity" color="currentColor" size="sm" />
            ) : (
              "Submit"
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

import { Modal, Text, Spacer, Input, Button, Loading, Textarea } from "@nextui-org/react";
import { Form } from "@remix-run/react";
import { useState, useEffect } from "react";

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
  // Form Data
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [expiry, setExpiry] = useState("");

  return (
    <Modal closeButton onClose={onClose} open={open}>
      <Modal.Header>
        <Text h4>Create New Form</Text>
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
            onChange={(e) => setName(e.target.value)}
          />
          <Spacer y={0.5} />
          <Input
            type="datetime-local"
            name="expiresAt"
            label="Expiry Date (optional)"
            clearable
            bordered
            fullWidth
            onChange={(e) => setExpiry(e.target.value)}
          />
          <Spacer y={0.5} />
          <Textarea
            name="description"
            label="Description (optional)"
            bordered
            fullWidth
            onChange={(e) => setDesc(e.target.value)}
          />
          <Spacer y={2} />
          <Button
            css={{ marginBottom: "1.33rem", width: "100%" }}
            type="submit"
            shadow
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

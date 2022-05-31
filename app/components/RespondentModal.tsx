import { Modal, Text, Spacer, Input, Button, Loading } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

type Param = { id: string; name: string; email: string };

export default function RespondentModal({
  questionnaireId,
  onSubmit,
}: {
  questionnaireId: string;
  onSubmit: (param: Param) => void;
}) {
  const fetcher = useFetcher();
  const iconStyle = { fontSize: "16px" };

  // Form Data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [open, setOpen] = useState(true);
  const [allowName, setAllow] = useState(false);
  const [badEmail, setBadEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const mailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (email && !mailRegex.test(email)) {
      !badEmail && setBadEmail(true);
    }
    if (email && mailRegex.test(email)) {
      badEmail && setBadEmail(false);
      timer = setTimeout(() => {
        fetcher.submit({ email }, { method: "put" });
        setIsLoading(true);
      }, 600);
    }

    return () => {
      timer && clearTimeout(timer);
    };
  }, [email]);

  useEffect(() => {
    const id = fetcher.data?.id;

    if (fetcher.data?.error == 404) setAllow(true);

    if (fetcher.data?.error == 403)
      toast.error("You are already answered this form");

    if (typeof id === "string") {
      !allowName &&
        toast.success(`Your email registered with name ${fetcher.data?.name}`);
      onSubmit({ id, name, email });
      setOpen(false);
    }

    setIsLoading(false);
  }, [fetcher.data]);

  const submit = () => {
    fetcher.submit(
      { data: JSON.stringify({ name, email }) },
      { method: "put" }
    );
    setIsLoading(true);
  };

  return (
    <Modal
      blur
      open={open}
      preventClose
      css={{ backgroundColor: "$background", border: "1px solid $border" }}
    >
      <Spacer y={0.5} />
      <Modal.Header>
        <Text h4>Identity confirmation</Text>
      </Modal.Header>
      <Modal.Body>
        <Input
          // @ts-ignore
          contentLeft={<ion-icon name="mail-outline" style={iconStyle} />}
          contentRight={isLoading && !allowName && <Loading size="xs" />}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          helperColor={badEmail ? "error" : "default"}
          helperText={badEmail ? "Enter valid email address" : ""}
          status={badEmail ? "error" : "default"}
          placeholder="Email"
          fullWidth
        />
        <Spacer y={0.05} />
        <Input
          // @ts-ignore
          contentLeft={<ion-icon name="person-outline" style={iconStyle} />}
          type="text"
          disabled={!allowName}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          clearable
          fullWidth
        />
        <Spacer />
        <Button
          onClick={submit}
          shadow={email !== "" || !badEmail || name.length >= 3}
          disabled={email == "" || badEmail || name.length < 3}
          type="submit"
          css={{ marginBottom: "1.66rem", width: "100%" }}
        >
          {isLoading && allowName ? (
            <Loading type="points-opacity" color="currentColor" size="sm" />
          ) : (
            "Register"
          )}
        </Button>
      </Modal.Body>
      <Spacer />
    </Modal>
  );
}

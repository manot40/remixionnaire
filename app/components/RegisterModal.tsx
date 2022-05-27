import {
  Modal,
  Text,
  Spacer,
  Input,
  Button,
  Loading,
} from "@nextui-org/react";
import { Form } from "@remix-run/react";
import { useState, useEffect } from "react";

interface IProps {
  open: boolean;
  isLoading: boolean;
  onRegister: () => void;
  onClose: () => void;
}

export default function RegisterModal({
  open,
  isLoading,
  onRegister,
  onClose,
}: IProps) {
  const iconStyle = { fontSize: "16px" };
  // Form Data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  // Password Validation
  const [passWeak, setPassWeak] = useState(false);
  const [isNotMatch, setIsNotMatch] = useState(false);
  // Form State
  const [badEmail, setBadEmail] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const mailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // Verify if user entered valid email format
    email && !mailRegex.test(email) ? setBadEmail(true) : setBadEmail(false);
    if (password) {
      // Verify if password length 8 or more
      password.length < 8 ? setPassWeak(true) : setPassWeak(false);
      // Verify if password and repeated password match
      password !== confirm ? setIsNotMatch(true) : setIsNotMatch(false);
    }
  }, [email, password, confirm]);

  useEffect(() => {
    // Verify if all fields are filled with valid data
    setIsReady(
      !passWeak &&
        !isNotMatch &&
        !badEmail &&
        !isLoading &&
        name.length >= 3 &&
        email !== "" &&
        password !== ""
    );
  });

  return (
    <Modal
      closeButton
      onClose={onClose}
      open={open}
      css={{ backgroundColor: "$backgroundDeep" }}
    >
      <Modal.Header>
        <Text h4>Register New Account</Text>
      </Modal.Header>
      <Modal.Body>
        <Spacer y={0.5} />
        <Form method="post" onSubmit={onRegister}>
          <input hidden name="isRegister" value="true" readOnly />
          <Input
            // @ts-ignore
            contentLeft={<ion-icon name="person-outline" style={iconStyle} />}
            type="text"
            name="name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            clearable
            fullWidth
          />
          <Spacer />
          <Input
            // @ts-ignore
            contentLeft={<ion-icon name="mail-outline" style={iconStyle} />}
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            helperColor={badEmail ? "error" : "default"}
            helperText={badEmail ? "Enter valid email address" : ""}
            status={badEmail ? "error" : "default"}
            placeholder="Email"
            clearable
            fullWidth
          />
          <Spacer y={badEmail ? 1.5 : 1} />
          <Input.Password
            // @ts-ignore
            contentLeft={<ion-icon name="lock-closed-outline" style={iconStyle} />}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            helperColor={passWeak ? "error" : "default"}
            helperText={passWeak ? "Please enter at least 8 char" : ""}
            status={passWeak ? "error" : "default"}
            placeholder="Password"
            clearable
            fullWidth
          />
          <Spacer y={passWeak ? 1.5 : 1} />
          <Input
            // @ts-ignore
            contentLeft={<ion-icon name="lock-closed" style={iconStyle} />}
            type="password"
            onChange={(e) => setConfirm(e.target.value)}
            helperColor={isNotMatch ? "error" : "default"}
            helperText={isNotMatch ? "Repeated password didn't match" : ""}
            status={isNotMatch ? "error" : "default"}
            placeholder="Repeat Password"
            clearable
            fullWidth
          />
          <Spacer y={passWeak ? 2.5 : 2} />
          <Button
            shadow={isReady}
            disabled={!isReady}
            type="submit"
            css={{ marginBottom: "1.66rem", width: "100%" }}
          >
            {isLoading ? (
              <Loading type="points-opacity" color="currentColor" size="sm" />
            ) : (
              "Register"
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

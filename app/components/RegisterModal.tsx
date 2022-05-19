import {
  Modal,
  Text,
  Container,
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
    const mailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    !email.match(mailRegex) ? setBadEmail(true) : setBadEmail(false);
    password !== confirm ? setIsNotMatch(true) : setIsNotMatch(false);
    password.length < 8 ? setPassWeak(true) : setPassWeak(false);

    setIsReady(
      !passWeak &&
        !isNotMatch &&
        !badEmail &&
        !isLoading &&
        name.length >= 3 &&
        email !== "" &&
        password !== ""
    );
  }, [
    name,
    email,
    password,
    confirm,
    passWeak,
    isNotMatch,
    badEmail,
    isLoading,
    isReady,
  ]);

  return (
    <div>
      <Modal closeButton onClose={onClose} open={open}>
        <Modal.Header>
          <Text h4>Registrasi Akun Baru</Text>
        </Modal.Header>
        <Modal.Body>
          <Container
            as="div"
            display="flex"
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Spacer y={0.5} />
            <Form method="post" onSubmit={onRegister}>
              <input hidden name="isRegister" value="true" readOnly />
              <Input
                // @ts-ignore
                contentLeft={<ion-icon name="person-outline" style={iconStyle} />}
                type="text"
                name="name"
                onChange={(e) => setName(e.target.value)}
                width="18rem"
                placeholder="Nama Lengkap"
                clearable
              />
              <Spacer />
              <Input
                // @ts-ignore
                contentLeft={<ion-icon name="mail-outline" style={iconStyle} />}
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                helperColor={badEmail ? "error" : "default"}
                helperText={
                  badEmail ? "Pleas enter valid email address" : ""
                }
                status={badEmail ? "error" : "default"}
                width="18rem"
                placeholder="Email"
                clearable
              />
              <Spacer y={badEmail ? 1.5 : 1} />
              <Input.Password
                // @ts-ignore
                contentLeft={<ion-icon name="lock-closed-outline" style={iconStyle} />}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                helperColor={passWeak ? "error" : "default"}
                helperText={
                  passWeak
                    ? "Please enter at least 8 char"
                    : ""
                }
                status={passWeak ? "error" : "default"}
                width="18rem"
                placeholder="Password"
                clearable
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
                width="18rem"
                placeholder="Ulangi Password"
                clearable
              />
              <Spacer y={passWeak ? 2.5 : 2} />
              <Button
                shadow={isReady}
                disabled={!isReady}
                type="submit"
                style={{ width: "18rem", marginBottom: "1.33rem" }}
              >
                {isLoading ? (
                  <Loading type="points-opacity" color="currentColor" size="sm" />
                ) : (
                  "Register"
                )}
              </Button>
            </Form>
          </Container>
        </Modal.Body>
      </Modal>
    </div>
  );
}

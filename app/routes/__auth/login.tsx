import {
  Image,
  Button,
  Card,
  Checkbox,
  Container,
  Input,
  Spacer,
  Link,
  Loading,
} from "@nextui-org/react";
import toast from "react-hot-toast";

import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useState, useEffect } from "react";

import { safeRedirect, validateEmail } from "~/libs";
import RegisterModal from "~/components/RegisterModal";
import { createUserSession, getUserId } from "~/session.server";
import { createUser, getUserByEmail, verifyLogin } from "~/models/user.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface ActionData {
  errors?: {
    login?: string;
    name?: string;
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  let user;
  
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  
  const remember = formData.get("remember");
  const isRegister = formData.get("isRegister")?.toString();
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/dashboard");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }

  if (typeof password !== "string") {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  if (isRegister === "true") {
    if (typeof name !== "string" || name.length < 3) {
      return json<ActionData>(
        { errors: { name: "User entered name too short" } },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return json<ActionData>(
        { errors: { email: "A user already exists with this email" } },
        { status: 400 }
      );
    }
    
    user = await createUser(name, email, password);
  } else {
    user = await verifyLogin(email, password);

    if (!user) {
      return json<ActionData>(
        { errors: { login: "Invalid email or password" } },
        { status: 400 }
      );
    }
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo,
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

export default function LoginPage() {
  const actionData = useActionData() as ActionData;

  // Login Form
  const [mailErr, setMailErr] = useState(false);
  const [passErr, setPassErr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Registration Modal
  const [isRegis, setIsRegis] = useState(false);

  const iconStyle = { fontSize: "16px" };

  useEffect(() => {
    if (actionData?.errors) {
      const err = actionData.errors;
      if (err.email) {
        toast.error(err.email);
        setMailErr(true);
      }
      if (err.password) {
        toast.error(err.password);
        setPassErr(true);
      }
      if (err.name) {
        toast.error(err.name);
      }
      if (err.login) {
        toast.error(err.login);
        setMailErr(true);
        setPassErr(true);
      }
      setIsLoading(false);
    }
  }, [actionData]);

  return (
    <Container
      display="flex"
      justify="center"
      alignItems="center"
      wrap="nowrap"
      css={{
        height: "90vh",
        flexDirection: "column",
      }}
    >
      <RegisterModal
        open={isRegis}
        isLoading={isLoading}
        onRegister={() => setIsLoading(true)}
        onClose={() => setIsRegis(false)}
      />
      <Image src="/images/R.png" showSkeleton width={80} height={80} />
      <Spacer y={2} />
      <Card
        style={{
          backgroundColor: "white",
          padding: "2.6rem 1.8rem 1.8rem 1.8rem",
          maxWidth: "max-content",
        }}
      >
        <Form method="post" onSubmit={() => setIsLoading(true)}>
          <Input
            // @ts-ignore
            contentLeft={<ion-icon name="mail-outline" style={iconStyle} />}
            status={mailErr ? "error" : undefined}
            onChange={() => setMailErr(false)}
            name="email"
            type="email"
            width="100%"
            placeholder="Email"
            clearable
          />
          <Spacer />
          <Input.Password
            // @ts-ignore
            contentLeft={<ion-icon name="lock-closed-outline" style={iconStyle} />}
            status={passErr ? "error" : undefined}
            onChange={() => setPassErr(false)}
            name="password"
            width="100%"
            placeholder="Password"
            clearable
          />
          <Spacer />
          <Checkbox name="remember" value="on" size="sm" label="Remember me" />
          <Spacer y={2} />
          <Button
            shadow
            type="submit"
            disabled={isLoading}
            style={{ width: "100%" }}
          >
            {isLoading ? (
              <Loading type="points-opacity" color="currentColor" size="sm" />
            ) : (
              "Login"
            )}
          </Button>
        </Form>
        <Spacer y={2} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Link block color="primary" onClick={() => setIsRegis(true)}>
            Don't have account? Register
          </Link>
          <Spacer y={0.5} />
          <Link underline href="#" css={{ color: "#666" }}>
            Forgot your password?
          </Link>
        </div>
      </Card>
    </Container>
  );
}

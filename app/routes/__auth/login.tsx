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
import * as React from "react";

import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/libs";
import { verifyLogin } from "~/models/user.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/dashboard");
  const remember = formData.get("remember");

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

  const user = await verifyLogin(email, password);
  
  if (!user) {
    return json<ActionData>(
      { errors: { email: "Invalid email or password" } },
      { status: 400 }
    );
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
  const formRef = React.useRef<HTMLFormElement>(null);
  const actionData = useActionData() as ActionData;

  const [mailErr, setMailErr] = React.useState(false);
  const [passErr, setPassErr] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (actionData?.errors) {
      const err = actionData.errors;
      if (err.email) {
        err.email === "Email is invalid" && toast.error(err.email);
        setMailErr(true);
      }
      if (err.password || err.email === "Invalid email or password") {
        toast.error(err.email || err.password || "");
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
      css={{
        height: "90vh",
        flexDirection: "column",
      }}
    >
      <Image src="/images/R.png" showSkeleton width={80} height={80} />
      <Spacer y={2} />
      <Card
        style={{
          backgroundColor: "white",
          padding: "2.6rem 1.8rem 1.8rem 1.8rem",
          maxWidth: "max-content",
        }}
      >
        <Form method="post" ref={formRef} onSubmit={() => setIsLoading(true)}>
          <Input
            // @ts-ignore
            contentLeft={<ion-icon name="mail" style={{ fontSize: "16px" }} />}
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
            contentLeft={<ion-icon name="lock-closed" style={{ fontSize: "16px" }} />}
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
          <Link block href="#" color="primary">
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

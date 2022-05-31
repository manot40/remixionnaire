import type { ActionFunction } from "@remix-run/node";

import {
  Button,
  Container,
  Input,
  Loading,
  Spacer,
  Text,
} from "@nextui-org/react";
import { isSlug } from "cuid";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";

import { getQuestionnaire } from "~/models/questionnaire.server";
import ProfilePopover from "~/components/ProfilePopover";
import { useOptionalUser } from "~/libs";

type ActionData = {
  error: string;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const code = formData.get("code");

  if (typeof code !== "string" || !isSlug(code)) {
    return json<ActionData>({ error: "Invitation code invalid" });
  }

  const qre = await getQuestionnaire({ code });

  if (!qre) {
    return json<ActionData>({
      error: "Invitation code not found",
    });
  } else {
    return redirect(`/r/${qre.id}`);
  }
};

export default function Index() {
  const action = useActionData() as ActionData;
  const [params] = useSearchParams();
  const user = useOptionalUser();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (action?.error) toast.error(action.error);
    setIsLoading(false);
  }, [action]);

  useEffect(() => {
    if (params.get("success"))
      toast.success("Your answers have been submitted");
  }, [params]);

  return (
    <div
      style={{
        width: "100%",
        height: "85vh",
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <Container xl css={{ background: "$gray50" }}>
        <Container
          sm
          css={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "65%",
            flexWrap: "nowrap",
            padding: "1rem 0px 1rem 0px",
          }}
        >
          <div style={{ flex: 1, alignSelf: "flex-end" }}>
            <ProfilePopover user={user} />
          </div>
          <div style={{ userSelect: "none" }}>
            <Text
              h1
              css={{
                textGradient: "45deg, $blue600 -20%, $pink600 50%",

                fontSize: "3rem",
                "@sm": { fontSize: "3.6rem", textAlign: "center" },
              }}
            >
              Remixionnaire
            </Text>
            <Text css={{ letterSpacing: "$normal" }}>
              Simple questionnaire inquiry app, build with Remix and NextUI
            </Text>
          </div>
        </Container>
      </Container>
      <Container
        css={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "$background",
        }}
      >
        <div style={{ display: "block", marginTop: "-1.66rem" }}>
          <Text
            css={{
              textAlign: "center",
              fontWeight: "$semibold",
              letterSpacing: "$tight",
              fontSize: "1.4rem",
            }}
          >
            Enter Form Invitation
          </Text>
          <Spacer y={2} />
          <Form
            method="post"
            onSubmit={() => setIsLoading(true)}
            style={{ width: "18rem", display: "flex", margin: "0 auto" }}
          >
            <Input fullWidth underlined name="code" placeholder="Form code" />
            <Spacer x={0.75} />
            <Button ghost auto type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loading type="spinner" color="currentColor" size="sm" />
              ) : (
                "Go"
              )}
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
}

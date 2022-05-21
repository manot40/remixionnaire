import type { LoaderFunction } from "@remix-run/node";

import {
  Button,
  Card,
  Container,
  Grid,
  Link,
  Row,
  Spacer,
  Text,
  Tooltip,
} from "@nextui-org/react";
import {
  Form,
  useActionData,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import dayjs from "dayjs";

import {
  createQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaires,
} from "~/models/questionnaire.server";
import { getUserId } from "~/session.server";
import CreateFormModal from "~/components/CreateFormModal";
import ConfirmModal from "~/components/ConfirmModal";

type LoaderData = {
  qreList: Awaited<ReturnType<typeof getQuestionnaires>>;
};

interface ActionData {
  error?: {
    action?: "create" | "delete";
    message?: string;
  };
  success?: {
    action?: "create" | "delete";
    message?: string;
  };
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = (await getUserId(request)) || "";
  const qreList = await getQuestionnaires({ userId });
  return json<LoaderData>({ qreList });
};

export const action: LoaderFunction = async ({ request }) => {
  const formData = await request.formData();
  const userId = (await getUserId(request)) || "";

  switch (request.method.toUpperCase()) {
    case "POST":
      const name = formData.get("name")?.toString();
      if (typeof name !== "string" || name.length < 3) {
        return json<ActionData>(
          { error: { message: "Questionnaires name too short" } },
          { status: 400 }
        );
      }

      let expiresAt: any = formData.get("expiresAt")?.toString();
      expiresAt = expiresAt ? dayjs(expiresAt).toDate() : null;

      const description = formData.get("description")?.toString() || null;

      const theme =
        formData.get("theme")?.toString() ||
        ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");

      try {
        const { code } = await createQuestionnaire({
          name,
          theme,
          description,
          expiresAt,
          userId,
        });
        return redirect(`/workspace/${code}`);
      } catch (e: any) {
        return json<ActionData>({
          error: { message: e.message },
        });
      }
    case "DELETE":
      const id = formData.get("id")?.toString();
      if (id) {
        try {
          await deleteQuestionnaire({ id, userId });
          return json<ActionData>({
            success: { message: "Form deleted successfully", action: "delete" },
          });
        } catch {
          return json<ActionData>({
            error: { message: "Form cannot be found", action: "delete" },
          });
        }
      }
    default:
      return null;
  }
};

export default function WorkspaceIndex() {
  const [searchParams] = useSearchParams();
  const data = useLoaderData() as LoaderData;
  const actionData = useActionData() as ActionData;

  const [isLoading, setIsLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [deleting, setDeleting] = useState("");

  if (searchParams.get("error") === "notfound")
    toast.error("Specified form not found");

  useEffect(() => {
    if (actionData?.error) {
      const err = actionData.error;
      if (err.message) toast.error(err.message);
      if (err.action === "delete") setDeleting("");
    }
    if (actionData?.success) {
      const succ = actionData.success;
      if (succ.message) toast.success(succ.message);
      if (succ.action === "delete") setDeleting("");
    }
    setIsLoading(false);
  }, [actionData]);

  const handleDelete = (id?: string) => {
    const button: any = document.querySelector(`#form-delete-${id}`);
    if (button) {
      button.addEventListener("click", (e: any) => {
        e.stopPropagation();
      });
      button.click();
    }
  };

  return (
    <Container sm>
      <Spacer />
      <CreateFormModal
        open={creating}
        isLoading={isLoading}
        onClose={() => setCreating(false)}
        onSubmit={() => setIsLoading(true)}
      />
      <ConfirmModal
        content="Are you sure to delete this item?"
        open={deleting !== ""}
        colorScheme="error"
        param={deleting}
        onProceed={handleDelete}
        onReject={() => setDeleting("")}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text h1 className="heading-text">
          Latest Form
        </Text>
        <Button
          css={{ alignSelf: "center" }}
          onClick={() => setCreating(true)}
          auto
        >
          Create New
        </Button>
      </div>
      <Grid.Container gap={1.5} justify="flex-start">
        {data.qreList.map((qre) => (
          <Grid xs={12} sm={6} md={4} key={qre.id}>
            <Card
              hoverable
              clickable
              onClick={(e) => (window.location.href = `/workspace/${qre.code}`)}
            >
              <Card.Body href={`/workspace/${qre.code}`} as="a" css={{ p: 0 }}>
                <div
                  style={{
                    width: "100%",
                    height: "140px",
                    backgroundColor: `#${qre.theme}`,
                  }}
                />
              </Card.Body>
              <Card.Footer>
                <Row wrap="wrap" justify="space-between">
                  <div>
                    <Text b>{qre.name}</Text>
                    <Text css={{ color: "$accents4", fontWeight: "$semibold" }}>
                      {qre.status}
                    </Text>
                  </div>
                  <Form method="delete" style={{ alignSelf: "center" }}>
                    <input hidden name="id" value={qre.id} readOnly />
                    <button hidden type="submit" id={`form-delete-${qre.id}`} />
                    <Link
                      type="submit"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleting(qre.id);
                      }}
                    >
                      <Tooltip content="Delete this form?">
                        {/* @ts-ignore */}
                        <ion-icon
                          name="trash-outline"
                          style={{ fontSize: "1.4rem" }}
                        />
                      </Tooltip>
                    </Link>
                  </Form>
                </Row>
              </Card.Footer>
            </Card>
          </Grid>
        ))}
      </Grid.Container>
    </Container>
  );
}

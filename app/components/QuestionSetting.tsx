import type { Questionnaire } from "@prisma/client";
import type { WorkspaceData } from "~/types";

import {
  Button,
  Card,
  Container,
  Input,
  Loading,
  Radio,
  Spacer,
  Text,
  Textarea,
} from "@nextui-org/react";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Form, useActionData } from "@remix-run/react";

type TProps = {
  meta: WorkspaceData["meta"];
};

export default function QuestionSetting({ meta: _meta }: TProps) {
  const action = useActionData() as { data: Questionnaire; error: string };
  const [meta, setMeta] = useState(_meta);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading && action?.data) {
      setMeta(action.data);
      toast.success("Questionnaire updated");
    } else if (action?.error) {
      toast.error(action.error);
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  const defaultCSS = {
    padding: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column",
  };

  function changeState<T extends Partial<Questionnaire>>(object: T) {
    setMeta((prev) => {
      const tmp = { ...prev, ...object };
      return tmp;
    });
  }

  return (
    <Card
      css={{
        padding: "$8",
        background: "$background",
        border: "1px solid $border",
      }}
    >
      <Card.Body>
        <Form method="put" onSubmit={() => setIsLoading(true)}>
          <Container
            wrap="nowrap"
            css={{
              width: "100%",
              padding: "$0",
              display: "block",
              "@xs": {
                display: "flex",
              },
            }}
          >
            <Container css={{ ...defaultCSS }}>
              <Input
                required
                name="name"
                value={meta.name}
                label="Questionnaire Name"
                onChange={({ target }) => changeState({ name: target.value })}
              />
              <Spacer y={0.5} />
              <Textarea
                rows={8}
                name="description"
                label="Description"
                className="settings-desc"
                value={meta.description || ""}
                onChange={({ target }) =>
                  changeState({ description: target.value })
                }
              />
            </Container>
            <Spacer />
            <Container css={{ ...defaultCSS, "@xs": { width: "70%" } }}>
              <input value={meta.status} name="status" readOnly hidden />
              <div>
                <Text size={14} as={"label"}>
                  Form Status
                </Text>
                <Radio.Group
                  value={meta.status}
                  css={{ flexDirection: "row", marginTop: "-0.75rem" }}
                  onChange={(val) => changeState({ status: val as any })}
                >
                  <Radio size="sm" value="DRAFT">
                    Draft
                  </Radio>
                  <Spacer />
                  <Radio size="sm" value="ACTIVE">
                    Published
                  </Radio>
                  <Spacer />
                  <Radio size="sm" value="CLOSED">
                    Closed
                  </Radio>
                </Radio.Group>
              </div>
              <Spacer />
              <Input
                name="expiresAt"
                type="datetime-local"
                label="Expiration"
                value={dayjs(meta.expiresAt).format("YYYY-MM-DDTHH:mm")}
                onChange={({ target }) =>
                  changeState({ expiresAt: target.value as any })
                }
              />
              <Spacer />
              <Card bordered shadow={false}>
                <Container
                  css={{
                    padding: 0,
                    display: "flex",
                    flexWrap: "nowrap",
                    justifyContent: "center",
                  }}
                >
                  <Button disabled={isLoading} type="submit" className="w-full">
                    {isLoading ? (
                      <Loading
                        type="points-opacity"
                        color="currentColor"
                        size="sm"
                      />
                    ) : (
                      "Update Settings"
                    )}
                  </Button>
                  <Spacer x={0.5} />
                  <Button
                    auto
                    flat
                    onClick={() => {
                      toast.success("Share URL Copied");
                      navigator.clipboard.writeText(
                        `${window.location.origin}/${meta.code}`
                      );
                    }}
                  >
                    Share
                  </Button>
                </Container>
              </Card>
              <Spacer />
              <Text size={14} span>
                Share code: {meta.code}
              </Text>
            </Container>
          </Container>
        </Form>
      </Card.Body>
    </Card>
  );
}

import {
  Button,
  Card,
  Container,
  Link,
  Popover,
  Spacer,
  Tooltip,
} from "@nextui-org/react";

type TProps = {
  onInsert: (arg?: any) => void;
  onSubmit: () => void;
};

const IconButton = ({
  onInsert,
  icon,
  tooltip,
}: Omit<TProps, "onSubmit"> & { icon: string; tooltip: string }) => (
  <Tooltip css={{ zIndex: 1000000 }} content={tooltip}>
    <Link color="text" onClick={onInsert}>
      {/* @ts-ignore */}
      <ion-icon name={icon} style={{ fontSize: "21px" }} />
    </Link>
  </Tooltip>
);

export default function QuestionsEditorPanel({ onInsert, onSubmit }: TProps) {
  return (
    <Card
      css={{
        bottom: "16px",
        left: "50%",
        transform: `translateX(${-50}%)`,
        width: "24rem",
        position: "fixed",
        zIndex: 9999,
        background: "$background",
        border: "1px solid $border",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Popover>
          <Popover.Trigger>
            <Link css={{ alignItems: "center", userSelect: "none" }}>
              {/* @ts-ignore */}
              <ion-icon
                name="add"
                style={{ fontSize: "21px", marginRight: "6px" }}
              />{" "}
              <span style={{ fontSize: "14px" }}>Insert Question</span>
            </Link>
          </Popover.Trigger>
          <Popover.Content>
            <Card
              css={{ background: "$accents1", border: "1px solid $border" }}
            >
              <Container
                css={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  userSelect: "none",
                }}
              >
                <IconButton
                  tooltip="Simple Text"
                  icon="text-outline"
                  onInsert={() => onInsert("SHORT_TEXT")}
                />
                <Spacer x={1.5} />
                <IconButton
                  tooltip="Long Text"
                  icon="reader-outline"
                  onInsert={() => onInsert("TEXT")}
                />
                <Spacer x={1.5} />
                <IconButton
                  tooltip="Radio"
                  icon="radio-button-on-outline"
                  onInsert={() => onInsert("RADIO")}
                />
                <Spacer x={1.5} />
                <IconButton
                  tooltip="Selection"
                  icon="checkbox-outline"
                  onInsert={() => onInsert("CHECKBOX")}
                />
              </Container>
            </Card>
          </Popover.Content>
        </Popover>
        <Button flat size="sm" css={{ width: "2.4rem" }} onClick={onSubmit}>
          Submit
        </Button>
      </div>
    </Card>
  );
}

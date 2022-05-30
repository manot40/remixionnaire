import {
  Card,
  Container,
  Input,
  Link,
  Tooltip,
  Divider,
} from "@nextui-org/react";
import { findChildren } from "~/libs";

type TProps = {
  children: any;
};

const QuestionCard = ({ children }: TProps) => {
  const cardHeader = findChildren(children, "Header");
  const cardBody = findChildren(children, "Body");
  const cardFooter = findChildren(children, "Footer");
  return (
    <Card css={{ marginBottom: "$10", padding: "12px 6px 0px 6px" }}>
      <Card.Body style={{ minHeight: "12rem" }}>
        {cardHeader.length ? (
          <Container
            wrap="nowrap"
            css={{
              width: "100%",
              padding: "$0",
              display: "block",
              "@sm": {
                display: "flex",
              },
            }}
          >
            {cardHeader}
          </Container>
        ) : null}
        {cardBody}
      </Card.Body>
      {cardFooter.length ? (
        <>
          <Divider />
          <Card.Footer>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0px 12px 0px",
              }}
            >
              {cardFooter}
            </div>
          </Card.Footer>
        </>
      ) : null}
    </Card>
  );
};

const Header = ({ children }: TProps) => children;
Header.displayName = "Header";
QuestionCard.Header = Header;

const Body = ({ children }: TProps) => children;
Body.displayName = "Body";
QuestionCard.Body = Body;

const Footer = ({ children }: TProps) => children;
Footer.displayName = "Footer";
QuestionCard.Footer = Footer;

export default QuestionCard;

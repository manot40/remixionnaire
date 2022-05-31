import type { User as TUser } from "@prisma/client";

import { User } from "@nextui-org/react";

export default function Profile({ user }: { user?: TUser | string }) {
  return (
    <User
      // @ts-ignore
      pointer="true"
      src={
        typeof user == "object"
          ? "https://i.pravatar.cc/150?img=15"
          : "/images/default_user.jpg"
      }
      size="sm"
      name={typeof user == "string" ? user : user?.name}
      description={typeof user == "object" ? "Creator" : ""}
      css={{
        flexDirection: "row-reverse",
        textAlign: "right",
        marginLeft: "0",
      }}
    />
  );
}

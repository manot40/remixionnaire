import type { User as TUser } from "@prisma/client";

import { User } from "@nextui-org/react";

export default function Profile({ user }: { user?: TUser }) {
  return (
    <User
      // @ts-ignore
      pointer="true"
      src={
        user ? "https://i.pravatar.cc/150?img=15" : "/images/default_user.jpg"
      }
      size="sm"
      name={user?.name || "Guest"}
      description={user ? "Creator" : ""}
      css={{
        flexDirection: "row-reverse",
        textAlign: "right",
        marginLeft: "0",
      }}
    />
  );
}

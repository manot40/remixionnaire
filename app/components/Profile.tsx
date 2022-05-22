import type { User as TUser } from "@prisma/client";

import { User } from "@nextui-org/react";

export default function Profile({ user }: { user?: TUser }) {
  return (
    <User
      // @ts-ignore
      pointer="true"
      src={
        user
          ? "https://i.pravatar.cc/150?img=15"
          : "https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrmuq2krdm9b/b/bucket-20211017-1905/o/images/user/default.jpg"
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

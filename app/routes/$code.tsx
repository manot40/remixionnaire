import type { LoaderFunction } from "@remix-run/node";

import { redirect } from "@remix-run/node";
import { getQuestionnaire } from "~/models/questionnaire.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { code } = params;

  if (code) {
    const qre = await getQuestionnaire({ code, status: "ACTIVE" });

    if (!qre) {
      return redirect("/?error=notfound");
    } else {
      return redirect(`/r/${qre.id}`);
    }
  }
};

export default function Search() {
  return {};
}

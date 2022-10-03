import type { FC } from "react";
import { Action, Icon } from "@raycast/api";
import { NewDocumentForm } from "../../views";

export const NewDocumentAction: FC = () => (
  <Action.Push
    icon={Icon.NewDocument}
    shortcut={{ modifiers: ["cmd", "shift"], key: "d" }}
    title="New Document"
    target={<NewDocumentForm />}
  />
);

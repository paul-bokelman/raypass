import type { FC } from "react";
import { Action, Icon } from "@raycast/api";
import { SelectExistingDocument } from "../views";

export const ChangeDocumentAction: FC = () => (
  <Action.Push
    icon={Icon.Switch}
    shortcut={{ modifiers: ["cmd"], key: "o" }}
    title="Switch Document"
    target={<SelectExistingDocument />}
  />
);

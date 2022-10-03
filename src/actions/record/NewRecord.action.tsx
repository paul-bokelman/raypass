import type { FC } from "react";
import { Action, Icon } from "@raycast/api";
import { NewRecordForm } from "../../views";

export const NewRecordAction: FC = () => (
  <Action.Push
    icon={Icon.PlusCircle}
    shortcut={{ modifiers: ["cmd"], key: "n" }}
    title="New Record"
    target={<NewRecordForm />}
  />
);

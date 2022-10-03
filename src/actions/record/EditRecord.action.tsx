import type { FC } from "react";
import type { PasswordRecord } from "../../types";
import { Action, Icon } from "@raycast/api";
import { EditRecordForm } from "../../views";

interface Props {
  id: string;
  record: Omit<PasswordRecord, "id">;
}

export const EditRecordAction: FC<Props> = ({ id, record }) => {
  return (
    <Action.Push
      title="Edit Record"
      icon={{ source: Icon.Pencil }}
      shortcut={{ modifiers: ["cmd", "shift"], key: "e" }}
      target={<EditRecordForm id={id} initialValues={record} />}
    />
  );
};

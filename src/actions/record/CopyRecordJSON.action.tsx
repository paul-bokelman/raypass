import type { FC } from "react";
import type { PasswordRecord } from "../../types";
import { Action } from "@raycast/api";

interface Props {
  record: PasswordRecord;
}

export const CopyRecordJSON: FC<Props> = ({ record }) => (
  <Action.CopyToClipboard
    title="Copy Record (JSON)"
    content={JSON.stringify(record)}
    shortcut={{ modifiers: ["cmd"], key: "j" }}
  />
);

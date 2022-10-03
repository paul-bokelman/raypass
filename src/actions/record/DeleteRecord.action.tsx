import type { FC } from "react";
import type { PasswordRecord } from "../../types";
import { Action, confirmAlert, Alert, showToast, Toast, Icon, Color } from "@raycast/api";
import { records } from "../../utils";
import { documentStore } from "../../context";

interface Props {
  id: string;
  revalidateDocument: () => Promise<{
    document: {
      name: string;
      location: string;
    };
    records: Array<PasswordRecord>;
  } | void>;
}

export const DeleteRecordAction: FC<Props> = ({ id, revalidateDocument }) => {
  const { ref, password } = documentStore.getState();

  const handleDeleteRecord = async () => {
    try {
      if (
        await confirmAlert({
          title: `Delete record "${id}"?`,
          message: "Are you sure you want to delete this record? This action cannot be undone.",
          icon: Icon.Trash,
          primaryAction: { title: "Delete", style: Alert.ActionStyle.Destructive },
          dismissAction: { title: "Cancel", style: Alert.ActionStyle.Cancel },
        })
      ) {
        await records.delete({ id, password: ref?.isEncrypted ? password : undefined });
        await revalidateDocument();
        await showToast(Toast.Style.Success, "Record deleted successfully");
        return;
      }
    } catch (error) {
      await showToast(Toast.Style.Failure, "Failed to delete record");
      return;
    }
  };

  return (
    <Action
      title="Delete Record"
      icon={{ source: Icon.Trash, tintColor: Color.Red }}
      shortcut={{ modifiers: ["cmd", "shift"], key: "backspace" }}
      onAction={handleDeleteRecord}
    />
  );
};

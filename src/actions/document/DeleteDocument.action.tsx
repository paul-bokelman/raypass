import type { FC } from "react";
import { Action, Icon, confirmAlert, Alert } from "@raycast/api";
import { docs } from "../../utils";

interface Props {
  documentName: string;
}

export const DeleteDocumentAction: FC<Props> = ({ documentName }) => {
  // reval
  const handleDeleteDocument = async () => {
    try {
      if (
        await confirmAlert({
          title: `Delete document "${documentName}"?`,
          message: "Are you sure you want to delete this document? This action cannot be undone.",
          icon: Icon.Trash,
          primaryAction: { title: "Delete", style: Alert.ActionStyle.Destructive },
          dismissAction: { title: "Cancel", style: Alert.ActionStyle.Cancel },
        })
      ) {
        await docs.delete({ documentName });
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };

  return (
    <Action
      icon={Icon.DeleteDocument}
      shortcut={{ modifiers: ["cmd"], key: "backspace" }}
      title="Delete Document"
      onAction={handleDeleteDocument}
    />
  );
};

import type { FC } from "react";
import { Action, Icon, useNavigation, showToast, Toast } from "@raycast/api";
import { docs } from "../../utils";
import Command from "../../raypass";

interface Props {
  documentName: string;
  isActive: boolean;
}

export const SetActiveDocument: FC<Props> = ({ documentName, isActive }) => {
  const { push } = useNavigation();
  // reval

  const handleSetActiveDocument = async () => {
    if (isActive) return push(<Command />);

    try {
      await docs.set({ documentName });
      return push(<Command />);
    } catch (err) {
      await showToast(Toast.Style.Failure, "Failed to set active document", `${err}`);
      return;
    }
  };

  return (
    <Action
      icon={Icon.Switch}
      // shortcut={{ modifiers: ["cmd"], key: "enter" }}
      title="Select Document"
      onAction={handleSetActiveDocument}
    />
  );
};

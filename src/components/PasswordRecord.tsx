import type { FC } from "react";
import type { PasswordRecord as PasswordRecordType } from "../types";
import { Action, ActionPanel, Icon, List, AlertActionStyle, confirmAlert, Image, Color } from "@raycast/api";
import { records } from "../utils";
import { documentStore } from "../context";
import { EditRecordForm } from "../views";
import { NewRecordAction, ChangeDocumentAction, NewDocumentAction, RefreshLocalReferencesActions } from "../actions";

interface Props extends PasswordRecordType {
  revalidateDocument: () => Promise<{
    location: string;
    name: string;
    records: Array<PasswordRecordType>;
  } | void>;
}

export const PasswordRecord: FC<Props> = ({ id, name, url, username, password, email, notes, revalidateDocument }) => {
  const { ref, password: docPassword } = documentStore.getState();
  const md = `
  ${url ? `## [${name}](${url})` : `## ${name}`}
  ${notes ? notes : ""}
  `;

  const handleDeleteRecord = async () => {
    if (
      await confirmAlert({
        title: `Deleting ${id}`,
        message: "Are you sure you want to delete this record? This action cannot be undone.",
        icon: Icon.Trash,
        primaryAction: { title: "Delete", style: AlertActionStyle.Destructive },
        dismissAction: { title: "Cancel", style: AlertActionStyle.Cancel },
      })
    ) {
      await records.delete({ id, password: ref?.isEncrypted ? docPassword : undefined });
      await revalidateDocument();
    }
  };

  const getIcon = (): Image.Source => {
    if (url) return `https://icon.horse/icon/${new URL(url).hostname}`;
    return Icon.Key;
  };

  return (
    <List.Item
      icon={{ source: getIcon() }}
      title={name}
      detail={
        <List.Item.Detail
          markdown={md}
          metadata={
            <List.Item.Detail.Metadata>
              <List.Item.Detail.Metadata.Label title={`Record ${id}`} />
              <List.Item.Detail.Metadata.Separator />
              <List.Item.Detail.Metadata.Label title="Password" text={password} />
              {username && <List.Item.Detail.Metadata.Label title="Username" text={username} />}
              {email && <List.Item.Detail.Metadata.Label title="Email" text={email} />}
              {url && <List.Item.Detail.Metadata.Label title="URL" text={url} />}
            </List.Item.Detail.Metadata>
          }
        />
      }
      actions={
        <ActionPanel>
          <ActionPanel.Section title={`Record ${id}`}>
            <Action.Push
              title="Edit Record"
              icon={{ source: Icon.Pencil }}
              shortcut={{ modifiers: ["cmd"], key: "e" }}
              target={<EditRecordForm id={id} initialValues={{ name, username, password, email, notes, url }} />}
            />
            <Action
              title="Delete Record"
              icon={{ source: Icon.Trash, tintColor: Color.Red }}
              shortcut={{ modifiers: ["cmd", "shift"], key: "backspace" }}
              onAction={handleDeleteRecord}
            />
          </ActionPanel.Section>
          <ActionPanel.Section title="RayPass Actions">
            <NewRecordAction />
            <ChangeDocumentAction />
            <NewDocumentAction />
            <RefreshLocalReferencesActions />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
};

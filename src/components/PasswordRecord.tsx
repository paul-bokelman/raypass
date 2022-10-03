import type { FC } from "react";
import type { PasswordRecord as PasswordRecordType } from "../types";
import { ActionPanel, Icon, List, Image } from "@raycast/api";
import {
  CopyRecordPassword,
  CopyRecordUsername,
  CopyRecordEmail,
  CopyRecordJSON,
  OpenRecordURL,
  NewRecordAction,
  EditRecordAction,
  DeleteRecordAction,
  ManageDocumentsAction,
  NewDocumentAction,
  RefreshLocalReferencesActions,
  ShowDocument,
} from "../actions";

interface Props extends PasswordRecordType {
  revalidateDocument: () => Promise<{
    document: {
      name: string;
      location: string;
    };
    records: Array<PasswordRecordType>;
  } | void>;
}

export const PasswordRecord: FC<Props> = ({ id, name, url, username, password, email, notes, revalidateDocument }) => {
  const md = `
  ${url ? `## [${name}](${url})` : `## ${name}`}
  ${notes ? notes : ""}
  `;

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
            <CopyRecordPassword password={password} />
            {username && <CopyRecordUsername username={username} />}
            {email && <CopyRecordEmail email={email} />}
            {url && <OpenRecordURL url={url} />}
            <CopyRecordJSON record={{ id, name, url, username, password, email, notes }} />
            <EditRecordAction id={id} record={{ name, username, password, email, notes, url }} />
            <DeleteRecordAction id={id} revalidateDocument={revalidateDocument} />
          </ActionPanel.Section>
          <ActionPanel.Section title="RayPass Actions">
            <NewRecordAction />
            <ManageDocumentsAction />
            <NewDocumentAction />
            <ShowDocument name={name} />
            <RefreshLocalReferencesActions />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
};

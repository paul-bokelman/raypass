import type { FC } from "react";
import type { ValidationErrors } from "../utils";
import { useState } from "react";
import { Action, ActionPanel, Form, useNavigation, Icon } from "@raycast/api";
import { documentStore } from "../context";
import { docs, validation } from "../utils";
import Command from "../raypass";
import { ChangeDocumentAction, NewDocumentAction, RefreshLocalReferencesActions } from "../actions";

interface Props {
  documentName: string;
}

interface EncryptedPasswordData {
  password: string;
}

export const EncryptedPasswordForm: FC<Props> = ({ documentName }) => {
  const { push } = useNavigation();

  const [errors, setErrors] = useState<ValidationErrors<EncryptedPasswordData>>({
    password: undefined,
  });

  const handleValidation = (name: string, value: string | undefined) => {
    const { error } = validation.validate.field({
      schema: validation.schemas.encryptedPassword,
      field: name,
      value: { [name]: value },
    });

    if (error) return setErrors((prev) => ({ ...prev, [name]: error }));
    return setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async ({ password }: EncryptedPasswordData) => {
    const empty = validation.validate.empty<EncryptedPasswordData>({ password }, ["password"]);
    if (empty) return;

    try {
      await docs.get({ documentName, password });
      documentStore.setState({ password: password });
      push(<Command />);
    } catch (error) {
      return setErrors((prev) => ({ ...prev, password: "Incorrect password" }));
    }
  };

  return (
    <Form
      navigationTitle="Encrypted Document Password"
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Decrypt Document" onSubmit={handleSubmit} icon={Icon.LockUnlocked} />
          <ChangeDocumentAction />
          <NewDocumentAction />
          <RefreshLocalReferencesActions />
        </ActionPanel>
      }
    >
      <Form.Description
        title="Encrypted Document"
        text={`The document "${documentName}" is encrypted, enter the corresponding password to access it.`}
      />
      <Form.Separator />
      <Form.PasswordField
        id="password"
        title="Password"
        placeholder="My secret password"
        error={errors.password}
        onChange={(newValue) => handleValidation("password", newValue)}
        onBlur={(e) => handleValidation(e.target.id, e.target.value)}
      />
    </Form>
  );
};

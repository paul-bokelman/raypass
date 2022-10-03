import type { FC } from "react";
import type { ValidationErrors } from "../utils";
import type { NewDocumentData } from "../types";
import { useState } from "react";
import os from "node:os";
import { Form, Action, ActionPanel, useNavigation, Icon } from "@raycast/api";
import { docs, validation } from "../utils";
import Command from "../raypass";
import { GeneratePasswordAction } from "../actions";

export const NewDocumentForm: FC = () => {
  const { push } = useNavigation();
  const [errors, setErrors] = useState<ValidationErrors<NewDocumentData>>({
    name: undefined,
    encrypted: undefined,
    password: undefined,
  });
  const [encrypting, setEncrypting] = useState<boolean>(false);

  const handleValidation = (name: string, value: string | undefined) => {
    const { error } = validation.validate.field({
      schema: validation.schemas.newDocument,
      field: name,
      value: { [name]: value },
    });

    if (error) return setErrors((prev) => ({ ...prev, [name]: error }));
    return setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (document: NewDocumentData) => {
    const empty = validation.validate.empty<NewDocumentData>(document, ["name", "password"]);
    if (empty) return;

    const nameExists = await docs.collision({ name: document.name });
    if (nameExists) return setErrors((prev) => ({ ...prev, name: "A document with this name already exists!" }));

    const documentCreated = await docs.new(document);
    if (!documentCreated) return;

    push(<Command />);
  };

  return (
    <Form
      navigationTitle="New Document"
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} icon={Icon.ArrowRightCircle} />
          <GeneratePasswordAction />
        </ActionPanel>
      }
    >
      <Form.Description
        title="New Document"
        text={`Create a new document to locally store your passwords. Files are stored in ${os.homedir()}/.raypass. You can encrypt your document with a password (will be required when accessing doc). If you choose not to encrypt your document, it will be accessible by anyone with access to your computer.`}
      />
      <Form.Separator />
      <Form.TextField
        id="name"
        title="Document Name"
        placeholder="Enter a name for your document"
        error={errors.name}
        onChange={(newValue) => handleValidation("name", newValue)}
        onBlur={(e) => handleValidation(e.target.id, e.target.value)}
      />

      <Form.Checkbox
        id="encrypt"
        label="Encrypt and require password?"
        error={errors.encrypted}
        value={encrypting}
        onChange={setEncrypting}
        title="Encrypt Document"
      />

      {encrypting && (
        <Form.PasswordField
          id="password"
          title="Password"
          info="You can generate a password with the action panel (⌘P)"
          placeholder="My secret password"
          error={errors.password}
          onChange={(newValue) => handleValidation("password", newValue)}
          onBlur={(e) => handleValidation(e.target.id, e.target.value)}
        />
      )}
    </Form>
  );
};

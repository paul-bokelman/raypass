# RayPass

<img src="./assets/raypass-icon.png" alt="icon" width="50" height="50" />

Manage passwords through raycast that just your and your laptop know.

## Features

Raypass is a password manager that uses raycast to manage your passwords. It uses AES-256 encryption to encrypt your password records and stores them in a local file to ensure that only you and your laptop know your passwords.

### Documents

Documents are locally stored files that contain your passwords. You can create, optionally encrypt, and switch between documents to manage your passwords.

### Records

Records are the actual passwords that you want to store. You can create, edit, and delete records inside an individual document. Each record follows the following format:

```typescript
export interface Record {
  id: string;
  name: string;
  username?: string;
  email?: string;
  password: string;
  url?: string;
  notes?: string;
}
```

<sub>And of course, shortcuts for everything!</sub>

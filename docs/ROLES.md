# Role-based demo workspaces

The original `/login` layout includes three compact radio options: User,
Administrator, and Manager. Changing the selection preserves the email and
password already entered. Direct URLs `/login/user`, `/login/manager`, and
`/login/administrator` open the same form with that role preselected. The selected
role is stored with the demo session. Registration always creates a User demo session.

| Feature                                     | User | Manager | Administrator |
| ------------------------------------------- | ---- | ------- | ------------- |
| Role-specific dashboard                     | Yes  | Yes     | Yes           |
| Content and image studios                   | Yes  | Yes     | Yes           |
| Save drafts and submit for review           | Yes  | Yes     | Yes           |
| View shared demo content history            | Yes  | Yes     | Yes           |
| Approve content and change approved records | No   | Yes     | Yes           |
| Manage brands, products, audiences          | No   | Yes     | Yes           |
| Analytics                                   | No   | Yes     | Yes           |
| Manage members and roles                    | No   | No      | Yes           |

Menus, dashboard shortcuts, route guards, and workspace mutation checks use the
shared policy in `src/auth/roles.ts`. Opening a restricted URL shows an access
message. Opening a dashboard URL without a session redirects to the login form;
after login, only a permitted internal destination is restored. Logout removes
the session from both browser stores.

Existing sessions without a role become User sessions. Existing member records
are migrated from Admin/Editor/Reviewer to Administrator/User/Manager without
discarding the rest of the saved workspace.

## Authentication boundary

This repository is a frontend demonstration. The three login pages preview roles;
they do not verify passwords or authorize real accounts. No password is stored or
sent. Selecting a role controls this browser's demo experience, and all content is
shared sample data in that browser. Editing a member record does not create or
change a real login account.

For production, an authentication backend must verify credentials, return the
account's assigned role, and enforce authorization on every API operation. The
role selector chooses the entry page; it must never grant a real account a new
role. Browser storage and frontend route guards are not a security boundary.

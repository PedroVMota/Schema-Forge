# Projects

Organize your schemas into separate projects, all saved locally in your browser.

<!-- TODO: Add screenshot -->
![Project Sidebar](../assets/screenshots/project-sidebar.png)

## Creating a project

Open the project sidebar and click **"New Project"**. Each project gets its own independent schema and canvas.

## Switching projects

Click on a project name in the sidebar to switch to it. Your current project is saved automatically.

## Renaming a project

Click the edit icon next to a project name to rename it.

## Deleting a project

Click the delete icon next to a project name. This permanently removes the project and its schema.

## Storage

Projects are stored in your browser's `localStorage` under the key `sql-visualizer-projects`. This means:

- Your data stays on your machine
- Projects persist between browser sessions
- Clearing browser data will delete your projects
- Projects are not synced between devices or browsers

### Storage limits

Most browsers allow ~5-10 MB of localStorage per origin. This is enough for hundreds of schemas. If you're approaching the limit, consider exporting your SQL and removing unused projects.

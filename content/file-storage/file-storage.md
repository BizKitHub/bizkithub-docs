---
id: "D06P6TBNphvoxEJP"
category: "content/file-storage"
tags: []
published_at: "2026-04-24T06:57:26.136Z"
---


File storage
============

The storage is a central place where an organization stores all its files — contracts, invoices, images, PDF attachments, company documentation, and anything else it needs to share within the team. The `/drive` module functions as a classic file browser similar to Finder in macOS or File Explorer in Windows, making its operation intuitive for most users from day one. The storage also serves as an invisible foundation for other parts of the system. Images from product galleries, PDFs of generated contracts, uploaded complaint documents, and contact avatar photos are physically stored here. Each organization has its own isolated space, which other organizations cannot see.

## Browsing Content

The storage has a tree structure similar to a classic filesystem. The main part of the page displays the currently open folder with its subfolders and files, above which is the **breadcrumb navigation** showing the path to the root. You enter a folder by clicking on its name, go up one level by clicking in the breadcrumb navigation, and reach the root by clicking on *Home*. Each folder displays summary statistics that help quickly estimate its scope. **Number of files** is calculated recursively, including all subfolders. **Total size** is presented in a human-readable format (e.g., `1.5 MB`, `320 KB`). **Number of direct items** indicates how many subfolders and files are directly within this folder without nested levels.

## File Organization

The system recommends thematic organization by content — typically, a tree structure emerges with main branches like `contracts/`, `invoices/`, `marketing/`, and so on, which are further divided by year or type. The specific arrangement is entirely up to the user, and the system does not restrict it in any way. File naming is automatically sanitized to remain consistent across the storage. Names are converted to ASCII (i.e., diacritics are removed), converted to lowercase, and spaces are replaced with hyphens. Special characters such as `/`, `\`, `:`, `?`, `*`, `"`, `<`, `>`, `|` are automatically removed because they would interfere with the file path. Each name must be **unique within a single folder**.

> 💡 We recommend using the date in `YYYY-MM-DD` format in the file name (e.g., `invoice-2026-04-23.pdf`). Files will then naturally sort chronologically, and finding a specific document will be faster.

## File Details

Clicking on a file opens a panel with its metadata and available actions. The displayed list includes the name with extension, size in bytes and in human-readable format, MIME type (e.g., `application/pdf` or `image/jpeg`), upload date, path to the parent folder, and an optional tag for free categorization. From the details, you can view the file directly in the browser using the **Preview** button (works for images, PDFs, and text files), download it to your computer with the **Download** button, or rename it without changing its location using **Rename**.

## Uploading Files

Files can be uploaded in three equivalent ways. The **Upload** button opens a standard file selection dialog. Drag & drop works directly from the computer's desktop into the browser window. When multiple files are selected at once, uploads run in parallel, progress is displayed in the bottom right corner, and upon completion, the files automatically appear in the folder.

- **Maximum single file size** — usually 100 MB, the limit can be adjusted in organization settings.
- **Supported types** — any binary files, including PDFs, images, documents, archives, and videos.
- **Security check** — the MIME type is detected from the actual file content, not just the extension, so renaming `.exe` to `.pdf` will not trick the system.

> ⚠️ Executable files (`.exe`, `.sh`, `.bat`) are accepted, but we recommend keeping them compressed in a `.zip` archive. This reduces the risk of accidental execution after download.

## Renaming

A file can be renamed without changing its content or location. The extension is **preserved** during renaming — if you try to change it, the system will reject the request, as it would confuse file type detection. The new name is automatically sanitized (ASCII, lowercase, hyphens instead of spaces) and must be unique within the same folder.

> ℹ️ The physical location in data storage does not change during renaming — the operation occurs only at the metadata level. Therefore, renaming is instantaneous even for files several gigabytes in size.

## Creating Folders

The **New Folder** button opens a dialog with a name field. Multiple levels can also be created at once by entering a path — for example, `projects/2026/q2` will create all three levels in one step (if they don't already exist). The name must be unique within the parent folder, spaces are converted to hyphens, and recreating an existing folder will not result in an error — the operation is idempotent.

## Downloading an Entire Folder as ZIP

Each folder can be downloaded as an archive file. The **Download Folder** button recursively packs all files including subfolders, creates a manifest (`_manifest.txt`) with an overview of the content, and sends the archive to the browser. The download progress includes information about the number of files and total size in the response headers, so the browser can display an accurate progress indicator.

> ⚠️ Downloading is not available if the folder is empty or contains too many files. In such a case, the button is inactive, and it is necessary to create the archive in smaller parts.

## Visibility and Sharing

Each file has a **visibility** attribute, which determines whether it is publicly accessible without logging in. A **public** file can be opened via a direct URL — this is used for images in galleries, avatar photos, and PDF templates. A **private** file requires valid authorization and is intended for sensitive documents such as contracts or invoices. Sharing with third parties occurs via a file's **unique token**, which is part of the public URL. Anyone who knows this token gains access to the file — therefore, do not provide tokens unnecessarily, and for sensitive materials, choose private visibility.

> ⚠️ Always store internal documents as **private**. Public files may be indexed by search engines and become available outside your intended recipient circle.

## Preview and Streaming

For quick content viewing, a built-in viewer is used, which opens the file directly in the window without the need for downloading. **Images** (`.jpg`, `.png`, `.webp`, `.svg`) are displayed as an image canvas. **PDFs** are loaded into the internal PDF viewer. **Text files** (`.txt`, `.md`) are displayed as plain text. For other types, the only option remains — downloading to the computer.

## Permissions

Access to storage is managed at the organization membership level. Organization members have full access to all folders, while guests and customers only see files that have been explicitly shared with them. Administrators can manage folder structure and delete files. All deletion and renaming operations are recorded in the organization's audit log, making it possible to trace who manipulated a file and when.

## Additional Features

- **Automatic deduplication** — identical files are not physically stored twice, saving space even during bulk imports.
- **Quick search** — files can be searched by name directly from the main field above the table.
- **Human-readable sizes** — the system always displays the value in the most suitable unit (B, KB, MB, GB) according to the actual size.
- **Organization isolation** — files from one organization are not accessible from another, not even through technical means outside the regular UI.

## Tips for Daily Work

- Organize files into **logical folders** by document type and period, as searching later will be easier.
- For bulk downloading of documents (e.g., all invoices for a given month), use **Download Folder as ZIP** to get a complete package with one click.
- Upload files with a **descriptive name**; automatic sanitization will then maintain a consistent format across the storage.
- Always keep sensitive documents such as contracts or payslips as **private**.

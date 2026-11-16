# Web Works — Portfolio

A standalone static website for GitHub Pages, featuring a homepage and five interactive demos with their styles, scripts and sample data. The Python server, passwords, enquiry database and Tkinter app are not included.

## Run locally

Open a terminal in this folder and run:

```sh
python -m http.server 8000
```

Visit <http://localhost:8000/>. Do not open the HTML files directly: the demos load JSON over HTTP.

## Publish with GitHub Desktop

1. In GitHub Desktop, choose **File → Add local repository** and select the `portfolio-github` folder.
2. If the repository does not exist yet, choose **create a repository here**. Make sure this folder—containing `index.html`—is the repository root.
3. Review Changes, then choose **Commit to main** with a message such as `Publish portfolio`.
4. Choose **Publish repository** → enter a name such as `web-portfolio` → turn off **Keep this code private** if you want a public repository.
5. On github.com, open **Settings → Pages → Deploy from a branch → main → / (root) → Save**.
6. Wait for deployment to finish. GitHub Pages will show the URL, typically `https://YOUR-USERNAME.github.io/web-portfolio/`.
7. Open the homepage and all five demos. The dashboard does not require a login.

You can name the folder differently. Relative links work in a GitHub Pages subdirectory. The repository owner handles commits and publishing in Desktop; this prepared folder has no Git history yet.

## Features and limitations

- Dashboard: charts, filters, sorting, CSV export and two themes; server-side management is disabled.
- Store and checkout: demo checkout; cart data is stored in the browser. No payment is processed.
- School and tutor: forms validate fields but do not send real enquiries.
- Fictional brands and sample data; no commercial outcomes are claimed.
- Cosmetic product photos and some fonts are loaded from external services and require an internet connection.

Homepage: `index.html`; styles: `assets/styles.css`. The server version is developed separately in a neighboring working folder; its changes are not copied here automatically.

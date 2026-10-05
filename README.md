# China Pavilion — Production Website

Production-ready static website for China Pavilion Chinese Restaurant in Irving, Texas.

## Stack

- HTML / CSS / JavaScript
- No frontend build step required
- Cloudflare Pages for hosting
- GitHub for version control and automatic deployments
- Custom domain through Cloudflare Registrar or another registrar

## Local development

Open this folder in VS Code and run:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

You can also use VS Code Live Server.

## Before launch

### 1. Choose the live domain

Replace every `__SITE_URL__` placeholder in:

- `index.html`
- `robots.txt`
- `sitemap.xml`

with the actual production URL, for example:

```text
https://chinapavilionirving.com
```

Do not leave the placeholder in the live deployment.

### 2. Put the project in GitHub

From this folder:

```bash
git init
git branch -M main
git add .
git commit -m "Initial production site"
```

Create an empty GitHub repository, then connect it:

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

### 3. Deploy with Cloudflare Pages

Recommended for a client project: use Cloudflare Pages Git integration so every push to the production branch can trigger a deployment and other branches can have preview deployments.

In Cloudflare:

1. Go to **Workers & Pages**.
2. Create an application and choose the Pages Git/GitHub flow.
3. Connect the GitHub repository.
4. Production branch: `main`.
5. Framework preset: none / static site.
6. Build command: leave blank.
7. Build output directory: the repository root (`/`).
8. Save and deploy.

The site will receive a temporary `pages.dev` URL first.

### 4. Connect the custom domain

In the Pages project:

**Custom domains → Set up a domain**

For an apex domain such as `example.com`, Cloudflare requires the domain to be a Cloudflare zone and the domain's nameservers to point to Cloudflare.

For `www.example.com`, the Pages custom-domain flow can create the needed DNS record in a Cloudflare-managed zone.

### 5. Domain registration

A good client workflow is:

- Register the domain with Cloudflare Registrar when the desired name is available.
- Keep auto-renew enabled.
- Verify the registrant email when requested.
- Keep the domain in the client's business/account ownership rather than putting the client's domain under a developer-owned account.

## Production files

- `index.html` — site and SEO/schema metadata
- `style.css` — responsive design and accessibility focus/reduced-motion rules
- `script.js` — interactive frontend behavior
- `404.html` — branded not-found page
- `_headers` — security and caching response headers for Cloudflare Pages
- `_redirects` — friendly section routes
- `robots.txt` — crawler rules
- `sitemap.xml` — search-engine sitemap
- `favicon.svg` — browser icon
- `site.webmanifest` — installable site metadata

## Important limitation

This is a production **frontend**. The current reservation and newsletter forms intentionally do not send/store customer data, and the cart is a preview only. Do not advertise them as live ordering/reservation systems until a backend/provider is connected.

For a true ordering platform, add:

- API/backend
- PostgreSQL/Supabase database
- Authenticated restaurant admin dashboard
- Order and reservation APIs
- Payment provider such as Stripe
- Transactional email/SMS provider
- Server-side validation and rate limiting
- Audit logs, monitoring, backups, and secret management

## Client launch checklist

- [ ] Confirm business name, address, phone, hours, menu prices, and photos
- [ ] Replace `__SITE_URL__`
- [ ] Verify domain ownership is controlled by the client
- [ ] Deploy to Cloudflare Pages
- [ ] Connect custom domain
- [ ] Test mobile, desktop, links, phone button, directions, menu search, cart, and modals
- [ ] Confirm Monday closed / other hours are correct
- [ ] Add real restaurant photography
- [ ] Verify sitemap and robots URLs on the live domain
- [ ] Submit the sitemap in Google Search Console
- [ ] Test page title/description/social preview
- [ ] Keep GitHub and Cloudflare access secure

## Updating the site

After deployment:

```bash
git add .
git commit -m "Update menu and homepage"
git push
```

With Git integration enabled, Cloudflare Pages can build and deploy the updated production branch automatically.

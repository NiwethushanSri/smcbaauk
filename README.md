# St. Michael's College, Batticaloa — Alumni Association (UK) website

A small, fast, **static** website for the UK branch: Home, Committee, Gallery and
Contact pages. No build step, no framework, no server — just HTML, CSS and a little
JavaScript. Ideal for free hosting on GitHub Pages.

Theme: red, blue & white (the school colours). Est. 1873 · *Quis Ut Deus*.

```
smcbaa-site/
├── index.html          ← Home
├── committee.html      ← 2026–2027 Executive Committee roster
├── gallery.html        ← Gallery (click-to-enlarge) + link to Facebook albums
├── contact.html        ← Contact form + details
├── README.md
└── assets/
    ├── css/styles.css  ← all styling (colours, fonts, layout)
    ├── js/main.js      ← mobile menu + gallery lightbox
    └── img/            ← logo, crest, flags, committee photo, your photos
```

---

## 1. Publish it free on GitHub Pages

1. Create a new repository on GitHub (e.g. `smcbaa-uk`).
2. Upload **the contents** of this folder so `index.html` sits at the top level of
   the repo (not inside a sub-folder).
3. In the repo: **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Pick branch `main`, folder `/ (root)`, then **Save**.
6. After a minute the site is live at
   `https://<your-username>.github.io/<repo-name>/`

Free hosting, free HTTPS. Every push updates the site. A `.nojekyll` file is included
so GitHub serves the files as-is.

### Custom domain (optional, ~£8–12/year)
Buy a domain, then **Settings → Pages → Custom domain**, and point it at GitHub Pages
per <https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site>.

---

## 2. Make the contact form send (required)

GitHub Pages has no server, so the form uses a free relay, **Formspree**:

1. Sign up free at <https://formspree.io>.
2. Create a form, set it to deliver to **smcbaauk@gmail.com**, and copy the endpoint
   (looks like `https://formspree.io/f/abcdwxyz`).
3. Open `contact.html`, find `YOUR_FORM_ID`, and replace the whole `action` URL.
4. Submit once yourself to confirm — Formspree emails you each message.

Free tier = 50 submissions/month, plenty for a branch site.

---

## 3. Add your real photos to the gallery

The gallery currently shows coloured **placeholder tiles**, plus a button linking to
your Facebook albums (https://www.facebook.com/SMCBAAUK/photos).

To use real photos on the site itself:
1. Put images in `assets/img/` (resize to ~1600px wide JPGs so pages stay fast).
2. In `gallery.html`, swap a placeholder block like:
   ```html
   <figure class="gallery-item"><div class="ph ph-1" data-ph="Photo"></div><figcaption>Big Match Cricket</figcaption></figure>
   ```
   …for:
   ```html
   <figure class="gallery-item">
     <img src="assets/img/big-match-2026.jpg" alt="Big Match 2026" loading="lazy">
     <figcaption>Big Match 2026</figcaption>
   </figure>
   ```
The lightbox works automatically for both photos and placeholders.

---

## 4. What's already set up for you

- **Crest & branding:** your real circular crest (`assets/img/logo.png`, with a
  transparent background) is in the header, hero and footer; the favicon uses it too.
- **Committee page:** the full 2026–2027 roster is listed (office bearers, committee
  members, co-opted members), plus the official group photo. Update names here each
  year in `committee.html`.
- **Contact details:** phone/WhatsApp `+44 7984 183880`, email `smcbaauk@gmail.com`,
  and the Facebook link are wired throughout.
- **Heritage image:** the campus/motto image is used in the Home "Who we are" section.

### A couple of things you may want to tweak
- **Home stats band** (`index.html`): I used `1873`, `15 committee members`, `UK`,
  and a Michaelite-spirit symbol. Swap in real figures (e.g. number of members) if
  you have them.
- **Committee group photo:** the supplied image is fairly small (414px). If you have
  a higher-resolution version, replace `assets/img/committee.jpg` for a crisper look.
- **Colours:** all live at the top of `assets/css/styles.css` under `:root`
  (`--navy`, `--red`, etc.) — change those few values to re-tune the theme.

> Note: the header and footer are repeated in each HTML file (normal for a static
> site). If you change a nav link, update it in all four pages.

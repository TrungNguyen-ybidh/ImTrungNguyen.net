# Trung Nguyen — Personal Portfolio

A personal portfolio website built with HTML, CSS, and JavaScript.


## Project Structure

```
portfolio/
├── index.html          # Homepage — terminal-style intro + nav
├── about.html          # About me
├── experience.html     # Work experience timeline
├── education.html      # Coursework dropdowns + self-education
├── projects.html       # GitHub projects (relevant + others)
├── certificates.html   # Certificates with PDF links
├── contact.html        # Contact info + code block
├── style.css           # All shared styles
├── script.js           # Particle system + theme toggle
├── certs/              # Certificate PDFs
│   └── codecademy-python-ds.pdf
└── README.md
```

## Features

- **Terminal-style homepage** — Python code block with typing animation, shell-style navigation
- **Constellation particle background** — 150+ twinkling stars, shooting stars, dust particles, and constellation patterns
- **Interactive education page** — clickable dropdowns for coursework and self-education subcards (Books, Codecademy, Coursera, edX)
- **Project categories** — relevant projects always visible, other projects in a collapsible dropdown
- **Experience timeline** — vertical timeline with accent dots and date labels
- **Scroll reveal animations** — content fades in as you scroll on inner pages
- **Responsive** — adapts to mobile screens
- **No frameworks** — pure HTML, CSS, JS

## Tech Stack

- HTML5
- CSS3 (custom properties, grid, flexbox, animations)
- Vanilla JavaScript (Canvas API for particles, IntersectionObserver for reveals)
- Google Fonts (Playfair Display, DM Sans, JetBrains Mono)

## How to Run

1. Clone or download this repository
2. Open the folder in VS Code
3. Install the **Live Server** extension
4. Right-click `index.html` → **Open with Live Server**

Or simply open `index.html` in any browser.

## Customization

- **Content** — edit the HTML files directly to update text, links, and courses
- **Colors** — modify CSS variables in `:root` at the top of `style.css`
- **Particles** — adjust counts, speeds, and colors in `script.js`
- **Certificates** — drop PDFs into the `certs/` folder and update `href` links
- **Theme** — light theme colors are in `[data-theme="light"]` blocks in `style.css`

## Author

**Trung Nguyen**
- [GitHub](https://github.com/TrungNguyen-ybidh)
- [LinkedIn](https://www.linkedin.com/in/trung-nguyen-973646248)
- nguyen.trun@northeastern.edu

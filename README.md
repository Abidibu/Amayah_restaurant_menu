# Amayah — Restaurant Menu

Simple multi-page restaurant website built with **HTML, CSS, and JavaScript**.

**Location:** Addis Ababa, Ethiopia

## Pages

| Page | File |
|------|------|
| Home (full-screen landing) | `index.html` |
| Menu + cart | `menu.html` |
| Order history | `orders.html` |
| About | `about.html` |
| Contact | `contact.html` |

## Features

- Full menu with categories and food images
- Add to cart / place order
- Order confirmation + history (saved in browser)
- Mobile hamburger menu
- Responsive layout

## How to run

Open `index.html` in a browser. No server or install needed.

```bash
# optional local server
npx serve .
```

## Project files

```
index.html, menu.html, orders.html, about.html, contact.html
styles.css
cart-shared.js   → cart + mobile nav
menu-data.js     → menu items
menu.js          → menu page logic
orders.js        → order history page
```

Cart and orders use `localStorage` (same browser only).

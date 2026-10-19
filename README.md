# Marsham Tourism — Official Website

**Discover. Experience. Remember.**  
Foundational, high-converting, mobile-responsive website for **Marsham Tourism LLC**, based in **Karama, Dubai, UAE**.

---

## 📁 Modular Project Structure

The project is organized into clean, reusable CSS and JavaScript modules so additional pages (such as dedicated Visa pages, Holiday Package catalogs, or Blog pages) can be added seamlessly:

```text
MARSHAM-TOURISM-WEBSITE/
├── index.html            # Main single-page high-converting landing page
├── css/
│   ├── variables.css     # Brand design tokens (Deep Navy #0F172A, Gold #D97706, White #FFFFFF)
│   ├── base.css          # Reset, typography (Montserrat + Inter), buttons & layout utilities
│   ├── components.css    # Shared Header, Mobile Navigation Drawer, Footer & Floating WhatsApp
│   └── home.css          # Landing page sections (Hero, 6-Service Grid, Packages, About/Trust, Lead Form)
├── js/
│   ├── config.js         # Centralized contact details, WhatsApp number, and social review links
│   └── main.js           # Mobile drawer toggle, sticky header, scroll-spy, service pre-fill & lead form
└── README.md             # Project documentation & expansion guide
```

---

## ✨ Key Features Included

1. **Header & Mobile-First Navigation Drawer**
   - Brand Logo (`Marsham Tourism`) with slogan (`Discover. Experience. Remember.`).
   - Navigation links (`Home`, `Services`, `About Us`, `Packages`, `Contact`) with scroll-spy active highlighting.
   - Bright green **WhatsApp Us** CTA button linking directly to `+971 56 451 1167`.
   - Slide-out mobile navigation drawer with backdrop blur and keyboard accessibility (`Esc` to close).

2. **Hero Section**
   - Headline: *"Your Complete Travel Journey Starts Here"*
   - Subheadline highlighting Karama, Dubai office and core solutions.
   - Primary CTA (**Book a Free Consultation** via WhatsApp) & Secondary CTA (**Explore Services** smooth scroll).

3. **Core Services Grid (3-Column Responsive Grid)**
   - **UAE & Global Visa Assistance**
   - **Flights & Hotel Bookings**
   - **Dubai Desert Safaris & City Tours**
   - **Custom Holiday Packages**
   - **Comprehensive Travel Insurance**
   - **Affiliate & Referral Program**

4. **Featured Packages Section (`#packages`)**
   - Showcases popular Dubai and UAE offerings with indicative starting prices and one-click service pre-selection into the lead capture form.

5. **About & Trust Section (`#about`)**
   - Highlights face-to-face support in Karama, transparent rates, 24/7 client assistance, and strong Google Reviews.
   - Direct buttons to **Google Reviews** (`https://g.page/r/CU8rIrPlPRl9EBM/review`) and **Official Facebook Page** (`https://www.facebook.com/OfiicialMarshamTourism`).

6. **Contact & Direct Lead Capture (`#contact`)**
   - Displays Karama, Dubai address, Phone/WhatsApp (`+971 56 451 1167`), and Email (`marshamtourism@gmail.com`).
   - Interactive **Lead Form** (Name, Phone/WhatsApp, Travel Service Needed dropdown: *Visa, Flights, Safari, Full Package*, Travel Dates, and Notes) that formats inquiries directly into WhatsApp with an Email fallback.

7. **Footer**
   - Includes `© Marsham Tourism LLC. All rights reserved.` and the mandatory pricing disclaimer.

---

## 🚀 How to Add New Pages Later

To add a new page (e.g., `visas.html`):
1. Copy the `<head>`, `<header class="site-header">`, `<aside class="mobile-drawer">`, and `<footer class="site-footer">` from `index.html`.
2. Link the shared stylesheets (`css/variables.css`, `css/base.css`, `css/components.css`) and create a page-specific stylesheet (e.g., `css/visas.css`).
3. Include `js/config.js` and `js/main.js` before `</body>`.

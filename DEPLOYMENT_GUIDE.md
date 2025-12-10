# 🚀 Jenda Mobility Launch Guide

Congratulations! Your website code is 100% ready. Now follows the **3 Critical Steps** to go live and start getting clients.

---

## ✅ Step 1: Deploy to GitHub Pages (Get a Live URL)
*Time required: 2 minutes*

1.  Go to your GitHub repository: [https://github.com/dannyntale10/Jenda_Mobility-2.0](https://github.com/dannyntale10/Jenda_Mobility-2.0)
2.  Click on the **Settings** tab (top right of the repo menu).
3.  Scroll down the left sidebar and click on **Pages**.
4.  Under **Build and deployment** > **Source**, select **"Deploy from a branch"**.
5.  Under **Branch**, select **`main`** and folder **`/ (root)`**.
6.  Click **Save**.
7.  Wait about 1-2 minutes. Refresh the page.
8.  You will see a banner saying: **"Your site is live at..."** (e.g., `https://dannyntale10.github.io/Jenda_Mobility-2.0`).

📢 **Action:** Copy that URL and share it on your WhatsApp/Socials immediately!

---

## ✅ Step 2: Activate Contact Form (Formspree)
*Time required: 3 minutes*

1.  Go to [https://formspree.io/register](https://formspree.io/register) and create a free account.
2.  Click **"New Form"**.
3.  Name it "Jenda Contact Form" and add your email (`dannyntale10@gmail.com`).
4.  Click **Create Form**.
5.  You will see a "Form ID" (an 8-character code, e.g., `xyzkjwer`) or a full URL like `https://formspree.io/f/xyzkjwer`.
6.  **Copy this ID**.

**Update Your Code:**
1.  Open `/Users/danny/Desktop/Jenda Mobility/script.js` on your computer.
2.  Find line **400** (approx) where it says: `fetch('https://formspree.io/f/YOUR_FORMSPREE_ID' ...`
3.  Replace `YOUR_FORMSPREE_ID` with the code you just copied.
4.  Open `/Users/danny/Desktop/Jenda Mobility/index.html`.
5.  Find line **933** (approx): `<form ... action="https://formspree.io/f/YOUR_FORMSPREE_ID"`
6.  Replace `YOUR_FORMSPREE_ID` there too.
7.  **Push changes:**
    ```bash
    git add .
    git commit -m "config: Add real Formspree ID"
    git push
    ```

---

## ✅ Step 3: Claim "Google My Business" (Get Local Clients)
*Time required: 10 minutes*

1.  Go to [https://www.google.com/business/](https://www.google.com/business/) and sign in.
2.  Click **Manage Now**.
3.  Enter business name: **Jenda Mobility**.
4.  Choose business type: **Service business**.
5.  Category: **Web Designer** or **Software Company**.
6.  Location: Enter **Kampala, Uganda** (or your specific area like Ntinda, Nakawa).
7.  Phone number: **+256 703 317 310**.
8.  Website: Paste your **GitHub Pages URL** (from Step 1).
9.  Verify: Google may send a code to your phone.

🌟 **Pro Tip:** Once verified, ask 5 friends to leave a 5-star review immediately. This boosts you to the top of search results!

---

**You are now a live, operational business. Good luck! 🚀**

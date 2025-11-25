# Deployment Guide for Sweksha Beauty Website

Your website is ready to be deployed! Since you are new to coding, I have broken this down into the simplest steps possible.

## Important Note About "Admin Panel"
Your website currently saves data (like new services, packages, etc.) to **files** on your computer.
- **On Vercel/Netlify:** These services are "read-only" for files. This means if you add a new service via the Admin Panel on the live website, **it will not save permanently**. It might disappear after a few minutes.
- **Solution:** For now, you should make changes (like adding services) on your **local computer** (where you are now), and then "push" those changes to GitHub. The live website will update automatically.

---

## Step 1: Create a GitHub Account
1.  Go to [github.com](https://github.com/) and sign up for a free account.
2.  Verify your email address.

## Step 2: Create a Repository
1.  Log in to GitHub.
2.  Click the **+** icon in the top-right corner and select **New repository**.
3.  **Repository name:** `sweksha-beauty-website` (or anything you like).
4.  Make sure **Public** is selected.
5.  Click **Create repository**.
6.  You will see a page with commands. Keep this page open.

## Step 3: Upload Your Code (The Easy Way)
Since you are using VS Code (the editor we are in):
1.  Look at the **left sidebar** for an icon that looks like a tree branch (Source Control).
2.  Click **Publish to GitHub** (if you see it).
    - It might ask you to sign in to GitHub. Follow the prompts.
    - Select "Publish to GitHub public repository".
3.  **OR**, if you don't see that:
    - Open the terminal (Ctrl+` usually opens it).
    - Type these commands one by one (copy and paste):
      ```bash
      git init
      git add .
      git commit -m "Initial commit"
      git branch -M main
      git remote add origin https://github.com/YOUR_USERNAME/sweksha-beauty-website.git
      git push -u origin main
      ```
      *(Replace `YOUR_USERNAME` with your actual GitHub username and the URL from Step 2)*.

## Step 4: Deploy on Vercel
1.  Go to [vercel.com](https://vercel.com/) and sign up with **GitHub**.
2.  Click **Add New...** -> **Project**.
3.  You should see your `sweksha-beauty-website` repository. Click **Import**.
4.  **Environment Variables:**
    - You need to add your AI API Key here so the chat works.
    - Click **Environment Variables**.
    - **Key:** `GEMINI_API_KEY`
    - **Value:** (Paste your API key here: `AIzaSyBHX5eS...`)
    - Click **Add**.
5.  Click **Deploy**.

## Step 5: Celebrate! 🎉
Wait a minute or two. Vercel will give you a link (like `sweksha-beauty.vercel.app`). Your website is now live!

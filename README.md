DocuTrust
Static document-verification site (GitHub Pages) backed by Supabase.
Files
index.html – the website (Home, Verification, About)
config.js – your Supabase URL + anon key
supabase-setup.sql – database setup
Setup
Create a project at supabase.com.
SQL Editor → paste supabase-setup.sql → Run.
Add records in Table Editor → documents.
Project Settings → API: copy Project URL and anon public key into config.js.
Upload all files to a GitHub repo → Settings → Pages → Deploy from branch main / root.
Supabase → Authentication → URL Configuration: add your Pages URL as the Site URL (optional but tidy).

# How to Push to GitHub

## Step 1: Check Current Status

First, see what files need to be committed:

```bash
git status
```

## Step 2: Stage All Changes

Add all modified and new files to staging:

```bash
git add .
```

## Step 3: Commit Changes

Create a commit with a descriptive message:

```bash
git commit -m "Add Supabase connection test component and update setup documentation"
```

Or a more detailed message:

```bash
git commit -m "Phase 2 complete: Supabase setup verified

- Add connection test component to Dashboard
- Update SUPABASE_SETUP.md with detailed instructions
- Add test utilities for Supabase connectivity
- All setup steps completed and verified"
```

## Step 4: Set Up GitHub Repository (First Time Only)

If you haven't created a GitHub repository yet:

1. Go to [github.com](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name it: `cfms` or `copper-fiber-migration`
4. Choose Public or Private
5. **Don't** initialize with README (you already have one)
6. Click "Create repository"

## Step 5: Connect to GitHub

**If this is your first time pushing:**

```bash
# Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual values
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

**Example:**
```bash
git remote add origin https://github.com/mahes/cfms.git
```

**To check if remote is already set:**
```bash
git remote -v
```

## Step 6: Push to GitHub

Push your code to GitHub:

```bash
git push -u origin master
```

**Note:** If your default branch is `main` instead of `master`:
```bash
git push -u origin main
```

## Step 7: Verify

Go to your GitHub repository page and verify all files are there.

## Troubleshooting

### "Remote origin already exists"
If you already have a remote configured:
```bash
# Check current remote
git remote -v

# Update remote URL if needed
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### "Authentication failed"
You may need to authenticate:
- Use a Personal Access Token instead of password
- Or use GitHub CLI: `gh auth login`

### "Branch name mismatch"
If GitHub uses `main` but you have `master`:
```bash
# Rename your branch
git branch -M main
git push -u origin main
```

## Quick Command Summary

```bash
# 1. Check status
git status

# 2. Stage changes
git add .

# 3. Commit
git commit -m "Your commit message"

# 4. Add remote (first time only)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 5. Push
git push -u origin master
```


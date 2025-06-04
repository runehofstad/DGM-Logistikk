# Security Policy

## Environment Variables and Secrets

This repository uses environment variables to store sensitive configuration data. **Never commit actual secrets to the repository.**

### 🔒 Sensitive Files (Never Commit)

The following files contain sensitive information and should **NEVER** be committed:

- `.env` - Local development environment variables
- `.env.production` - Production environment variables  
- Any file containing:
  - Firebase API keys
  - SendGrid API keys
  - Database passwords
  - Authentication tokens

### ✅ Safe Files (Commit These)

- `.env.example` - Template with placeholder values
- `.env.production.template` - Production template with placeholder values
- Documentation files with placeholder/example values

### 🛠️ Setup for New Developers

1. **Copy template files:**
   ```bash
   cp .env.example .env
   cp .env.production.template .env.production
   ```

2. **Get real values from:**
   - Firebase Console for Firebase configuration
   - SendGrid dashboard for email API key
   - Team lead or project administrator

3. **Fill in actual values** in your local `.env` files

### 🚨 If Secrets are Accidentally Committed

If secrets are accidentally committed to the repository:

1. **Immediately rotate/revoke the exposed secrets:**
   - Firebase: Regenerate API keys in Firebase Console
   - SendGrid: Create new API key and delete the old one

2. **Remove from git history:**
   ```bash
   # Remove the sensitive file from git tracking
   git rm --cached .env.production
   
   # Commit the removal
   git commit -m "Remove exposed secrets"
   
   # For complete history cleanup (if needed):
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch .env.production' \
   --prune-empty --tag-name-filter cat -- --all
   ```

3. **Update .gitignore** to prevent future commits

4. **Force push** (if working on a private repository):
   ```bash
   git push --force-with-lease origin main
   ```

### 🔐 Production Security

- All production secrets are stored securely in Firebase Functions configuration
- Environment variables are injected at build/deploy time
- No secrets are stored in the built application files

### 📞 Reporting Security Issues

If you discover a security vulnerability, please report it privately to the repository maintainers rather than opening a public issue.

---

## Current Status

✅ All sensitive data has been removed from this repository  
✅ Template files with placeholder values are provided  
✅ .gitignore updated to prevent future secret commits  
✅ Documentation updated with security best practices
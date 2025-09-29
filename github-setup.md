# GitHub Repository Setup Guide

## 🚀 Setting up CI/CD with GitHub Actions

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository:
   - **Repository name**: `kabir-sant-sharan`
   - **Description**: "Kabir Sant Sharan - Spiritual community website"
   - Set to **Public** or **Private** as preferred
   - **Do not** initialize with README (we have our own files)

### Step 2: Connect Local Repository to GitHub

```bash
# If not already initialized
git init

# Add remote origin (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/kabir-sant-sharan.git

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Complete Kabir Sant Sharan website

- Full Next.js 14 application with Cloudflare Pages deployment
- Progressive Web App (PWA) with offline functionality
- Multi-language support (English, Hindi, Nepali)
- SEO optimization with meta tags and structured data
- Cloudflare integration (D1, R2, Pages, Analytics)
- Mobile-responsive design with A+ performance
- Service worker for offline caching
- Comprehensive security headers
- Custom domain setup (kabirsantsharan.com)

🔧 Generated with Claude Code"

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Configure GitHub Secrets

Go to your repository → **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

#### Required Secrets
- **CLOUDFLARE_API_TOKEN**: Your Cloudflare API token
- **CLOUDFLARE_ACCOUNT_ID**: `7e506c3c49803094e72145796c0f8598`

#### Optional Secrets (for enhanced features)
- **LHCI_GITHUB_APP_TOKEN**: For Lighthouse CI reports
- **SLACK_WEBHOOK_URL**: For deployment notifications (if desired)

### Step 4: Enable GitHub Pages (Optional)

If you also want to serve from GitHub Pages as a backup:

1. Go to **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / **out** (after first CI run)

### Step 5: Branch Protection (Recommended)

1. Go to **Settings** → **Branches**
2. Add branch protection rule for **main**:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators

## 🔄 Automated Workflows

Once set up, every push to `main` will:

1. **Lint & Type Check**: Ensure code quality
2. **Build**: Create optimized production build
3. **Deploy**: Push to Cloudflare Pages
4. **Lighthouse CI**: Performance auditing on PRs
5. **Update**: Automatic cache invalidation

## 📊 Monitoring

After deployment, monitor:
- **Cloudflare Analytics**: Web traffic and performance
- **GitHub Actions**: Build and deployment status
- **Lighthouse Reports**: Performance metrics on PRs

## 🔧 Manual Deployment

If needed, deploy manually:

```bash
npm run build
npx wrangler pages deploy out --project-name=kabir-sant-sharan
```

## 🆘 Troubleshooting

- **Secrets not working**: Check formatting and permissions
- **Build failures**: Review Actions logs in GitHub
- **Deployment issues**: Verify Cloudflare project name and token
- **Domain issues**: Ensure DNS records are correct
# Deployment Guide

This guide covers deploying the Data Maturity Assessment tool with all features enabled.

## 🚀 Quick Deploy to Vercel (Recommended)

### Option 1: Deploy from GitHub
1. Push your code to a GitHub repository
2. Visit [vercel.com](https://vercel.com) and sign in
3. Click "New Project" and import your GitHub repository
4. Vercel will automatically detect it's a React app
5. Configure environment variables (see below)
6. Click "Deploy"

### Option 2: Deploy with Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
vercel

# Follow the prompts to configure your project
```

## 🌐 Deploy to Netlify

### Option 1: Drag and Drop
1. Build the project: `npm run build`
2. Visit [netlify.com](https://netlify.com)
3. Drag the `build` folder to the deploy area

### Option 2: Git Integration
1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository in Netlify dashboard
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Configure environment variables
6. Deploy

## ⚙️ Environment Variables Setup

For any deployment platform, configure these environment variables:

### Required for Backend Integration
```
# Choose one data storage option
REACT_APP_AIRTABLE_API_KEY=your_key
REACT_APP_AIRTABLE_BASE_ID=your_base_id

# OR use Supabase
REACT_APP_SUPABASE_URL=your_url
REACT_APP_SUPABASE_ANON_KEY=your_key
```

### Optional Integrations
```
# Notifications
REACT_APP_SLACK_WEBHOOK_URL=your_webhook
REACT_APP_EMAIL_WEBHOOK_URL=your_webhook
REACT_APP_ADMIN_EMAIL=admin@company.com

# LLM Analysis
REACT_APP_OPENAI_API_KEY=your_openai_key

# Analytics
REACT_APP_GA_TRACKING_ID=your_ga_id
```

## 🔧 Backend Setup Options

### Option 1: Airtable (Easiest)
1. Create an Airtable account
2. Create a new base called "Data Maturity Assessments"
3. Create a table called "Assessments" with these fields:
   - Full Name (Single line text)
   - Email (Email)
   - Job Title (Single line text)
   - Company Name (Single line text)
   - Company Size (Single select)
   - Industry (Single line text)
   - Overall Score (Number)
   - Maturity Tier (Single line text)
   - Strategy Score (Number)
   - Governance Score (Number)
   - Architecture Score (Number)
   - Analytics Score (Number)
   - Team Score (Number)
   - Quality Score (Number)
   - Metadata Score (Number)
   - Security Score (Number)
   - Analysis Summary (Long text)
   - Submitted At (Date)
   - Consent to Follow Up (Checkbox)

4. Get your API key from [airtable.com/api](https://airtable.com/api)
5. Get your Base ID from the API documentation

### Option 2: Supabase (More Advanced)
1. Create a Supabase project
2. Create an `assessments` table with this SQL:

```sql
CREATE TABLE assessments (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT,
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_size TEXT NOT NULL,
  industry TEXT,
  overall_score DECIMAL NOT NULL,
  maturity_tier TEXT NOT NULL,
  dimension_scores JSONB NOT NULL,
  analysis JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  consent_to_follow_up BOOLEAN DEFAULT FALSE
);
```

3. Get your project URL and anon key from project settings

## 📧 Notification Setup

### Slack Notifications
1. Create a Slack app in your workspace
2. Add an Incoming Webhook
3. Copy the webhook URL to `REACT_APP_SLACK_WEBHOOK_URL`

### Email Notifications
Use services like:
- **Zapier**: Create a webhook that sends emails
- **Make.com**: Similar to Zapier
- **Custom API**: Build your own email service

## 🎯 Custom Domain Setup

### Vercel
1. Go to your project dashboard
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Netlify
1. Go to site settings
2. Click "Domain management"
3. Add custom domain
4. Update DNS records

## 📱 Embedding in Wix

1. Deploy your app and get the URL
2. In Wix, add an HTML embed element
3. Use this code:

```html
<iframe 
  src="https://your-domain.com" 
  width="100%" 
  height="800px" 
  frameborder="0"
  style="border: none; border-radius: 8px;">
</iframe>
```

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files to version control
- Use platform-specific environment variable settings
- Rotate API keys regularly

### CORS Setup
If you encounter CORS issues:
1. Ensure your backend allows your domain
2. For Supabase, configure allowed origins
3. For custom APIs, set proper CORS headers

## 📊 Analytics Setup

### Google Analytics
1. Create a GA4 property
2. Get your Measurement ID
3. Add to `REACT_APP_GA_TRACKING_ID`

### Custom Analytics
Modify `src/App.js` to add custom tracking:

```javascript
// Track form submissions
const trackEvent = (eventName, properties) => {
  // Your analytics code here
  console.log('Event:', eventName, properties);
};
```

## 🚨 Troubleshooting

### Build Errors
- Check Node.js version (recommended: 16+)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for TypeScript errors if using TS

### Runtime Errors
- Check browser console for errors
- Verify environment variables are set
- Test API endpoints separately

### Performance Issues
- Enable gzip compression on your hosting platform
- Use CDN for static assets
- Optimize images and bundle size

## 📈 Monitoring & Maintenance

### Error Tracking
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Custom logging for API failures

### Performance Monitoring
- Use Lighthouse for performance audits
- Monitor Core Web Vitals
- Set up uptime monitoring

## 🔄 Updates & Maintenance

### Regular Updates
1. Update dependencies: `npm update`
2. Test thoroughly before deploying
3. Monitor for security vulnerabilities: `npm audit`

### Content Updates
- Questions: Edit `src/data/assessmentQuestions.js`
- Styling: Modify `tailwind.config.js`
- Analysis logic: Update `src/App.js`

## Vercel Deployment (Recommended)

### Prerequisites
- Vercel account
- GitHub repository connected to Vercel
- Vercel KV database (for shareable results)

### Step 1: Set up Vercel KV Database
1. Go to your Vercel dashboard
2. Navigate to your project
3. Go to the "Storage" tab
4. Click "Create Database" and select "KV"
5. Name your database (e.g., "data-maturity-results")
6. Copy the connection details:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

### Step 2: Configure Environment Variables
In your Vercel project settings, add the following environment variables:

**Required for Shareable Results:**
```
KV_REST_API_URL=your_vercel_kv_rest_api_url_here
KV_REST_API_TOKEN=your_vercel_kv_rest_api_token_here
```

**Optional for Enhanced Features:**
```
REACT_APP_OPENAI_API_KEY=sk-your-actual-openai-api-key-here
REACT_APP_AIRTABLE_API_KEY=your_airtable_api_key_here
REACT_APP_AIRTABLE_BASE_ID=your_airtable_base_id_here
REACT_APP_SUPABASE_URL=your_supabase_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Step 3: Deploy
1. Push your code to GitHub
2. Vercel will automatically deploy
3. Test the shareable results feature:
   - Complete an assessment
   - Copy the generated share link
   - Open the link in a new browser/incognito window
   - Verify the results display correctly

### API Endpoints
The following API endpoints are automatically deployed:
- `/api/save-results` - Saves assessment results and returns shareable link
- `/api/get-results?id=<result_id>` - Retrieves saved results by ID

### Troubleshooting
- **Results not saving**: Check KV environment variables are set correctly
- **Shared links not working**: Verify the KV database is accessible
- **Build failures**: Ensure all dependencies are installed and environment variables are set

---

Need help with deployment? Check the main README.md or create an issue in the repository. 
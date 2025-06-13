# Data Maturity Self-Assessment

A comprehensive React-based application for assessing organizational data maturity levels with AI-powered analysis and personalized recommendations.

## 🔒 Security & Architecture

- **Secure Backend API**: OpenAI API key protected on backend with rate limiting
- **Production-Ready**: No API keys exposed in frontend code
- **Rate Limiting**: 5 requests per 15 minutes per IP address
- **Input Validation**: Comprehensive validation and sanitization
- **CORS Protection**: Configured for secure cross-origin requests
- **Error Handling**: Professional error responses without sensitive data exposure

## 🚀 Features

### 1. User Profile Collection
- Comprehensive form collecting user information
- Required fields: Full Name, Job Title, Company Name, Company Size
- Optional fields: Industry, Email Address
- Form validation and error handling
- Updated company size options: "1-10", "11-50", "51-200", "201-500", "500-1000", "1000+"

### 2. Data Maturity Assessment
- **8 Key Dimensions** of data maturity:
  - Strategy & Alignment
  - Data Governance
  - Data Architecture & Integration
  - Analytics & Decision Enablement
  - Team & Skills
  - Data Quality & Operations
  - Metadata & Documentation
  - Security & Risk Management

- **Interactive Features**:
  - 5-point Likert scale for each question
  - Expandable explanations for each question
  - Progress tracking and dimension navigation
  - Mobile-responsive design

### 3. Intelligent Scoring System
- Automatic calculation of dimension scores
- Overall maturity score (0-5 scale)
- Tier classification:
  - **1.0-1.9**: Ad-hoc
  - **2.0-2.9**: Reactive
  - **3.0-3.9**: Developing
  - **4.0-4.4**: Managed
  - **4.5-5.0**: Optimized

### 4. AI-Powered Analysis
- **OpenAI GPT-4 Integration**: Secure backend API with function calling
- **Structured Analysis**: Consistent JSON responses with defined schema
- **Personalized Insights**: Tailored to user profile, job title, and company size
- **Comprehensive Reports**: Summary, peer comparison, SWOT analysis, recommendations, and next steps
- **Professional Presentation**: Clean, consultative analysis format

### 5. Rich Results Visualization
- Interactive bar and radar charts using Recharts
- Color-coded maturity tier display
- Comprehensive analysis breakdown
- Professional, consultative presentation
- Clickable Fuse Data logos linking to fusedata.co

### 6. Shareable Results System
- **Automatic Link Generation**: Results automatically saved with unique URLs
- **Vercel Blob Storage**: Secure cloud storage with company-prefixed file naming
- **Clean URLs**: Professional format (e.g., `/results/ABC123XY`)
- **One-Click Sharing**: Copy link functionality with user feedback
- **Persistent Access**: Results remain accessible via unique links
- **Professional Presentation**: Complete assessment results with company branding
- **Error Handling**: Graceful handling of expired or invalid result links

### 7. Consultation & Lead Generation
- **Updated Consultation Text**: "Need guidance on achieving your data goals? Book a call Dave Findlay, Founder at Fuse Data, to discuss."
- **Professional URL**: Links to `https://www.fusedata.co/strategy-consult`
- **Strategic Positioning**: Positioned below comprehensive analysis
- **Professional Disclaimer**: Added under main assessment title
- **Share Messaging**: Optimized placement and wording for better UX

## 🛠️ Technology Stack

- **Frontend**: React 18 with Create React App
- **Styling**: Tailwind CSS with custom Fuse Data branding
- **Charts**: Recharts library for data visualization
- **Backend**: Vercel Serverless Functions (Node.js)
- **AI Integration**: OpenAI GPT-4 with Function Calling
- **Storage**: Vercel Blob Storage for shareable results
- **Deployment**: Vercel with automatic GitHub integration
- **Security**: Rate limiting, input validation, CORS protection

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd data-maturity
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env.local
   ```
   
   **Required Environment Variables:**
   ```
   # Backend API (Required for AI analysis)
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Vercel Blob Storage (Required for shareable results)
   BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
   ```

4. **Vercel Setup** (Required for production)
   - Create a Vercel account and project
   - Connect your GitHub repository
   - Add environment variables in Vercel dashboard:
     - `OPENAI_API_KEY`: Your OpenAI API key
     - `BLOB_READ_WRITE_TOKEN`: Your Vercel Blob storage token
   - Deploy automatically via GitHub integration

5. **Local Development**
   ```bash
   npm start
   ```
   
   **Note**: For local development with backend API functionality, you'll need:
   - Valid OpenAI API key
   - Vercel CLI for local function testing: `npm i -g vercel`
   - Run `vercel dev` instead of `npm start` for full functionality

6. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 API Endpoints

### `/api/generate-analysis`
- **Method**: POST
- **Purpose**: Generate AI-powered analysis of assessment results
- **Rate Limit**: 5 requests per 15 minutes per IP
- **Input Validation**: Comprehensive validation of user data and scores
- **Response**: Structured JSON with analysis components
- **Security**: OpenAI API key secured on backend

## 🎨 Customization

### Branding
- Fuse Data branding implemented throughout
- Custom color scheme in `tailwind.config.js`
- Clickable logos linking to fusedata.co
- Professional consultation messaging

### Assessment Questions
- Questions defined in `src/data/assessmentQuestions.js`
- 8 dimensions with multiple questions each
- Expandable explanations for user guidance
- Customizable scoring and weighting

### AI Analysis
- OpenAI Function Calling with structured schema
- Customizable prompts in backend API
- Consistent JSON response format
- Professional analysis presentation

## 🌐 Deployment

### Vercel (Production Setup)
1. **Connect Repository**: Link GitHub repo to Vercel project
2. **Environment Variables**: Add required variables in Vercel dashboard
3. **Build Configuration**: Automatic detection for Create React App
4. **Custom Domain**: Configure custom domain if needed
5. **Monitoring**: Built-in analytics and error tracking

### Environment Variables Setup
```bash
# In Vercel Dashboard > Settings > Environment Variables
OPENAI_API_KEY=sk-...
BLOB_READ_WRITE_TOKEN=vercel_blob_...
```

### Vercel Configuration
- `vercel.json` configured for proper routing
- Static files (manifest.json, robots.txt, favicon.ico) properly served
- API routes configured for backend functions
- PWA manifest and robots.txt included

## 📱 Mobile Responsiveness

- Fully responsive design using Tailwind CSS
- Optimized for mobile, tablet, and desktop viewports
- Touch-friendly interface elements
- Accessible form controls and navigation
- Mobile-optimized charts and visualizations

## 🔒 Security Features

### Backend Security
- API key protection (never exposed to frontend)
- Rate limiting (5 requests per 15 minutes)
- Input validation and sanitization
- CORS configuration for secure requests
- Professional error handling without data exposure

### Data Privacy
- No sensitive data stored in frontend
- Secure blob storage with company-prefixed naming
- Professional error messages without technical details
- Clean production code without debug information

## 🚀 Performance Optimizations

- Lazy loading for chart components
- Optimized bundle size with Create React App
- Efficient state management
- Fast loading animations and transitions
- Vercel edge network for global performance

## 📊 Production Features

### Error Handling
- Comprehensive error boundaries
- User-friendly error messages
- Backend error logging for monitoring
- Graceful degradation for API failures

### Monitoring & Analytics
- Ready for Google Analytics integration
- Vercel analytics built-in
- Error tracking and performance monitoring
- Conversion tracking capabilities

### PWA Features
- Web app manifest configured
- Favicon and app icons included
- Robots.txt for SEO
- Mobile-friendly meta tags

## 🎯 Business Features

### Lead Generation
- Professional consultation positioning
- Strategic call-to-action placement
- Fuse Data branding and credibility
- Share functionality for viral growth

### User Experience
- Immediate value with instant results
- Professional analysis presentation
- Easy sharing with colleagues
- Mobile-optimized experience

## 🔄 Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Start development server (frontend only)
npm start

# Start with backend API functionality
vercel dev
```

### Production Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel (automatic via GitHub)
git push origin main
```

### Environment Management
- `env.example` provides template
- `.env.local` for local development
- Vercel dashboard for production variables
- Separate staging and production environments

## 🆘 Troubleshooting

### Common Issues
1. **API Key Errors**: Ensure `OPENAI_API_KEY` is set in Vercel dashboard
2. **Blob Storage Issues**: Verify `BLOB_READ_WRITE_TOKEN` is configured
3. **Rate Limiting**: Wait 15 minutes if rate limit exceeded
4. **Build Errors**: Check Node.js version compatibility

### Debug Mode
- Check Vercel function logs for backend errors
- Use browser dev tools for frontend debugging
- Monitor network requests for API issues

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For questions, issues, or customization requests:
- Create an issue in the repository
- Contact the development team
- Check Vercel deployment logs for production issues

---

**Built with ❤️ by Fuse Data for organizations seeking to understand and improve their data maturity.** 
# Data Maturity Self-Assessment Tool

A comprehensive React web application that delivers a personalized Data Maturity Self-Assessment tool, functioning as both a lead generator and insight delivery engine.

## 🚀 Features

### 1. User Profile Collection
- Comprehensive form collecting user information
- Required fields: Full Name, Job Title, Company Name, Company Size
- Optional fields: Industry, Email Address
- Form validation and error handling

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

### 4. LLM-Generated Analysis
- Personalized summary based on user profile and scores
- Key areas for improvement identification
- Strategic recommendations tailored to job title and company size
- Peer comparison insights

### 5. Rich Results Visualization
- Interactive bar and radar charts
- Color-coded maturity tier display
- Comprehensive analysis breakdown
- Professional, consultative presentation

### 6. Shareable Results System
- **Automatic Link Generation**: Results are automatically saved and a shareable link is created
- **Clean URLs**: Short, professional URLs (e.g., `/results/ABC123XY`) instead of long encoded parameters
- **Vercel KV Storage**: Secure, fast storage with 90-day expiration for shared results
- **One-Click Sharing**: Copy link button for easy sharing with stakeholders
- **Persistent Access**: Shared results remain accessible via the unique link
- **Professional Presentation**: Shared results display company name and submitter information
- **Error Handling**: Graceful handling of expired or invalid result links

**How it works:**
1. User completes assessment and views results
2. Results are automatically saved to Vercel KV storage
3. A unique 8-character ID is generated (e.g., `ABC123XY`)
4. User can copy the shareable link: `https://your-domain.com/results/ABC123XY`
5. Anyone with the link can view the complete assessment results
6. Links expire after 90 days for privacy and storage management

### 7. Lead Generation & Follow-up
- Email capture for detailed PDF reports
- Consent management for follow-up communications
- Integration-ready for backend services (Airtable, Supabase)
- Admin notification system ready

## 🛠️ Technology Stack

- **Frontend**: React 18, Tailwind CSS
- **Charts**: Recharts library
- **Styling**: Tailwind CSS with custom color scheme
- **Storage**: Vercel KV for shareable results
- **Routing**: React Router for shared results pages
- **Build Tool**: Create React App
- **Deployment Ready**: Vercel/Netlify compatible

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd data-maturity-assessment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   **Required for Shareable Results:**
   - `KV_REST_API_URL`: Your Vercel KV REST API URL
   - `KV_REST_API_TOKEN`: Your Vercel KV REST API Token
   
   **Optional for Enhanced Features:**
   - `REACT_APP_OPENAI_API_KEY`: For LLM-generated analysis
   - `REACT_APP_AIRTABLE_API_KEY` & `REACT_APP_AIRTABLE_BASE_ID`: For lead storage
   - Other integrations as needed

4. **Vercel KV Setup** (Required for shareable results)
   - Create a Vercel account and project
   - Add a KV database to your project
   - Copy the `KV_REST_API_URL` and `KV_REST_API_TOKEN` from your Vercel dashboard
   - Add these to your `.env` file

5. **Start development server**
   ```bash
   npm start
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 🎨 Customization

### Branding
- Update colors in `tailwind.config.js`
- Modify the primary color scheme in the `theme.extend.colors` section
- Replace placeholder branding elements in components

### Assessment Questions
- Edit questions in `src/data/assessmentQuestions.js`
- Add or remove dimensions as needed
- Customize explanations and descriptions

### LLM Integration
- Replace the simulated analysis in `App.js` with actual LLM API calls
- Integrate with OpenAI, Claude, or other LLM services
- Customize prompts for different analysis styles

## 🔧 Backend Integration

### Data Storage Options
1. **Airtable**: Simple setup for lead management
2. **Supabase**: Full-featured backend with real-time capabilities
3. **Custom API**: Integrate with existing CRM systems

### Notification Setup
- Email notifications via SendGrid, Mailgun, or similar
- Slack webhooks for instant lead alerts
- Zapier integration for workflow automation

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings (automatic for Create React App)
3. Deploy with custom domain

### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`

### Embedding in Wix
The application is designed to be embeddable via iframe:
```html
<iframe 
  src="https://your-domain.com" 
  width="100%" 
  height="800px" 
  frameborder="0">
</iframe>
```

## 📱 Mobile Responsiveness

- Fully responsive design using Tailwind CSS
- Optimized for mobile, tablet, and desktop
- Touch-friendly interface elements
- Accessible form controls

## 🔒 Privacy & Compliance

- GDPR-compliant consent management
- Optional email collection
- Clear privacy messaging
- Data handling transparency

## 🎯 Lead Generation Features

- **Immediate Value**: Instant assessment results
- **Progressive Disclosure**: Basic results → detailed report offer
- **Multiple CTAs**: Report request, strategy calls, consultations
- **Consent Management**: GDPR-compliant follow-up permissions

## 📊 Analytics Integration Ready

- Google Analytics events for form completions
- Conversion tracking for report requests
- User journey analytics
- A/B testing capabilities

## 🚀 Performance Optimizations

- Lazy loading for chart components
- Optimized bundle size
- Fast loading animations
- Efficient state management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions, issues, or customization requests:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

---

**Built with ❤️ for data professionals seeking to understand and improve their organization's data maturity.** 
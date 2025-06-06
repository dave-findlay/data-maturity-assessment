export const assessmentQuestions = [
  {
    id: 'strategy',
    title: 'Strategy & Alignment',
    description: 'How well your data initiatives align with business strategy and have executive support.',
    questions: [
      {
        id: 'strategy_1',
        text: 'Our organization has a clear, documented data strategy that aligns with business objectives.',
        explanation: 'A formal data strategy provides direction and ensures data initiatives support business goals.'
      },
      {
        id: 'strategy_2',
        text: 'Senior leadership actively champions and invests in data initiatives.',
        explanation: 'Executive sponsorship is critical for successful data transformation and resource allocation.'
      },
      {
        id: 'strategy_3',
        text: 'We regularly measure and communicate the business value of our data investments.',
        explanation: 'Demonstrating ROI helps sustain support and guides future data investment decisions.'
      }
    ]
  },
  {
    id: 'governance',
    title: 'Data Governance',
    description: 'The policies, processes, and organizational structures that ensure data is managed as a strategic asset.',
    questions: [
      {
        id: 'governance_1',
        text: 'We have clearly defined data ownership and stewardship roles across the organization.',
        explanation: 'Clear ownership ensures accountability and proper management of data assets.'
      },
      {
        id: 'governance_2',
        text: 'Our organization has established data policies and standards that are actively enforced.',
        explanation: 'Consistent policies ensure data is handled uniformly and meets compliance requirements.'
      },
      {
        id: 'governance_3',
        text: 'We have formal processes for data access, sharing, and privacy protection.',
        explanation: 'Structured processes balance data accessibility with security and privacy requirements.'
      }
    ]
  },
  {
    id: 'architecture',
    title: 'Data Architecture & Integration',
    description: 'The technical foundation that enables data collection, storage, and integration across systems.',
    questions: [
      {
        id: 'architecture_1',
        text: 'Our data architecture supports scalable, real-time data integration from multiple sources.',
        explanation: 'Modern architecture enables timely access to comprehensive, integrated data.'
      },
      {
        id: 'architecture_2',
        text: 'We have a centralized data platform that provides a single source of truth.',
        explanation: 'Centralized platforms reduce data silos and ensure consistency across the organization.'
      },
      {
        id: 'architecture_3',
        text: 'Our systems can easily adapt to new data sources and changing business requirements.',
        explanation: 'Flexible architecture allows organizations to respond quickly to new opportunities and needs.'
      }
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics & Decision Enablement',
    description: 'The capabilities that turn data into actionable insights for decision-making.',
    questions: [
      {
        id: 'analytics_1',
        text: 'Business users can easily access and analyze data without heavy IT involvement.',
        explanation: 'Self-service analytics empowers users and reduces bottlenecks in data access.'
      },
      {
        id: 'analytics_2',
        text: 'We use advanced analytics (AI/ML, predictive modeling) to drive business decisions.',
        explanation: 'Advanced analytics unlock deeper insights and enable proactive decision-making.'
      },
      {
        id: 'analytics_3',
        text: 'Data insights are embedded into business processes and decision workflows.',
        explanation: 'Integrated insights ensure data drives action rather than just informing discussions.'
      }
    ]
  },
  {
    id: 'team',
    title: 'Team & Skills',
    description: 'The human capabilities and organizational structure needed to execute data initiatives.',
    questions: [
      {
        id: 'team_1',
        text: 'We have dedicated data professionals (analysts, scientists, engineers) with appropriate skills.',
        explanation: 'Specialized roles ensure data initiatives are executed by qualified professionals.'
      },
      {
        id: 'team_2',
        text: 'Business users across the organization have strong data literacy and analytical skills.',
        explanation: 'Widespread data literacy enables self-service analytics and data-driven decision making.'
      },
      {
        id: 'team_3',
        text: 'We have effective collaboration between data teams and business stakeholders.',
        explanation: 'Strong collaboration ensures data initiatives address real business needs and challenges.'
      }
    ]
  },
  {
    id: 'quality',
    title: 'Data Quality & Operations',
    description: 'The processes and systems that ensure data is accurate, complete, and reliable.',
    questions: [
      {
        id: 'quality_1',
        text: 'We have automated data quality monitoring and alerting systems in place.',
        explanation: 'Automated monitoring catches data issues early and maintains trust in data assets.'
      },
      {
        id: 'quality_2',
        text: 'Data quality issues are quickly identified, tracked, and resolved through defined processes.',
        explanation: 'Systematic issue resolution prevents data quality problems from impacting decisions.'
      },
      {
        id: 'quality_3',
        text: 'We regularly measure and report on data quality metrics across key datasets.',
        explanation: 'Ongoing measurement ensures data quality standards are maintained over time.'
      }
    ]
  },
  {
    id: 'metadata',
    title: 'Metadata & Documentation',
    description: 'The information about data that enables discovery, understanding, and proper usage.',
    questions: [
      {
        id: 'metadata_1',
        text: 'Our data assets are well-documented with clear definitions and business context.',
        explanation: 'Good documentation ensures users understand data meaning and appropriate usage.'
      },
      {
        id: 'metadata_2',
        text: 'We maintain comprehensive data lineage and impact analysis capabilities.',
        explanation: 'Data lineage helps users understand data origins and assess the impact of changes.'
      },
      {
        id: 'metadata_3',
        text: 'Users can easily discover and understand available data through self-service tools.',
        explanation: 'Data discovery tools reduce time to insight and promote data reuse across teams.'
      }
    ]
  },
  {
    id: 'security',
    title: 'Security & Risk Management',
    description: 'The controls and processes that protect data assets and ensure regulatory compliance.',
    questions: [
      {
        id: 'security_1',
        text: 'We have comprehensive data security controls including encryption, access controls, and monitoring.',
        explanation: 'Strong security controls protect sensitive data and maintain stakeholder trust.'
      },
      {
        id: 'security_2',
        text: 'Our data practices comply with relevant regulations (GDPR, CCPA, industry standards).',
        explanation: 'Regulatory compliance reduces legal risk and demonstrates responsible data stewardship.'
      },
      {
        id: 'security_3',
        text: 'We have established data backup, recovery, and business continuity procedures.',
        explanation: 'Robust recovery procedures ensure data availability and business continuity during disruptions.'
      }
    ]
  }
];

export const likertScale = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' }
]; 
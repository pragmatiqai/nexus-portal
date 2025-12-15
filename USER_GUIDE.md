# Nexus Portal - User Guide

## Overview

**Nexus Portal** is an AI Compliance Platform designed to help organizations monitor, analyze, and manage AI conversations with advanced risk assessment capabilities. The platform provides comprehensive compliance tracking for AI Act regulations, GDPR requirements, and other regulatory frameworks.

This guide will help you navigate the portal and make the most of its features to ensure your AI systems meet regulatory requirements and organizational policies.

---

## Getting Started

### Logging In

1. When you first access Nexus Portal, you'll be presented with the login screen
2. Enter your email address and password
3. Click the **Login** button to access the platform
4. Once authenticated, you'll see your name displayed in the top-right corner of the header

### Main Navigation

The portal features a clean navigation bar at the top with two main sections:
- **Dashboard** - Overview of your AI conversation statistics and compliance metrics
- **Conversations** - Detailed view of all AI conversations with filtering and analysis tools

You can switch between these views at any time by clicking the respective navigation buttons.

---

## Dashboard

The Dashboard provides a high-level overview of your AI conversation activity and compliance status.

### Key Metrics

The dashboard displays five important metrics in easy-to-read cards:

1. **Total Conversations**
   - Shows the complete count of all AI conversations in your system
   - Helps you understand the overall volume of AI interactions

2. **Total Messages**
   - Displays the total number of individual messages across all conversations
   - Includes both user questions and AI responses

3. **Conversations (Last 30 Days)**
   - Shows recent conversation activity
   - Helps you track current usage trends

4. **Critical Issues (Last 30 Days)**
   - Highlights conversations flagged as CRITICAL risk level
   - These require immediate attention and review
   - Typically indicates severe compliance violations

5. **High Risk Issues (Last 30 Days)**
   - Shows conversations flagged as HIGH risk level
   - These need prompt review and potential remediation
   - May indicate significant compliance concerns

### Using the Dashboard

- The dashboard automatically refreshes when you navigate to it
- Use these metrics to identify trends and potential compliance concerns
- If you see elevated critical or high-risk issues, navigate to the Conversations view to investigate

---

## Conversations View

The Conversations view is your main workspace for reviewing and analyzing AI interactions.

### Understanding the Conversation List

Each conversation is displayed as a card showing:

- **User identifier** - Who initiated the conversation
- **Message count** - Number of messages in the conversation
- **Risk badge** - Visual indicator of the risk level (if assessed)
- **Timestamp** - When the last message was sent
- **First question preview** - A snippet of how the conversation started
- **Conversation ID** - Unique identifier for tracking

### Risk Level Badges

Conversations that have been assessed display color-coded risk badges:

- **CRITICAL** (Red) - Severe compliance violations requiring immediate action
  - May include prohibited AI practices under the AI Act
  - Serious GDPR violations
  - High-risk AI system violations

- **HIGH** (Orange) - Significant compliance concerns requiring prompt attention
  - Potential high-risk AI Act violations
  - GDPR concerns that need review

- **MEDIUM** (Yellow) - Moderate concerns worth reviewing
  - Minor compliance issues
  - Best practice violations

- **LOW** (Green) - Minimal or no compliance concerns
  - Generally compliant conversations
  - No significant violations detected

- **Not Assessed** - Conversations that haven't been analyzed yet

### Filtering Conversations

#### Filter by User

1. Click the **User Filter** dropdown
2. Select a specific user from the list
3. The conversation list will update to show only that user's conversations
4. To clear the filter, click the "×" button on the filter badge or select "All Users"

#### Filter by Risk Level

1. Click the **Risk Filter** dropdown
2. Choose from the available risk levels:
   - All Risk Levels (shows everything)
   - CRITICAL
   - HIGH
   - MEDIUM
   - LOW
   - NOT_ASSESSED (conversations without risk assessment)
3. The list will update to show only conversations matching that risk level
4. To clear the filter, click the "×" button on the filter badge

#### Combining Filters

- You can apply both user and risk filters simultaneously
- The status bar shows:
  - Total conversations in the system
  - Active filters (with × buttons to clear them)
  - Current filtered count

### Pagination

- If you have many conversations, they're divided into pages
- Use the pagination controls at the bottom to navigate between pages
- Default: 50 conversations per page

### Viewing a Conversation

1. Click anywhere on a conversation card or click the "View Conversation →" button
2. You'll be taken to the detailed conversation view

---

## Conversation Details

The Conversation Detail view provides in-depth information about a specific conversation.

### Header Information

At the top of the detail view, you'll see:
- **Back button** - Return to the conversation list
- **AI Risk Assessment button** - Trigger a new compliance analysis
- **Risk badge** - Current risk level (if assessed)
- **Conversation ID** - Unique identifier
- **Message count** - Number of messages in the conversation
- **User** - Who participated in the conversation

### AI Risk Assessment

The **AI Risk Assessment** feature uses a sophisticated multi-agent AI system to analyze conversations for compliance violations. The system employs four specialized AI agents powered by Claude Sonnet 4 that work in parallel and then synthesize their findings into a comprehensive risk assessment.

#### How the Risk Assessment System Works

When you trigger a risk assessment, the conversation is sent to an automated workflow (n8n) that orchestrates multiple AI agents:

**Stage 1: Parallel Analysis by Specialist Agents**

Three specialized AI agents analyze the conversation simultaneously, each focusing on different compliance areas:

1. **Critical Risk Violation Detector (EU AI Act - Prohibited Practices)**

   This agent specifically looks for prohibited AI practices under the EU AI Act that are completely forbidden by law:

   - **Social Scoring Systems**: Citizen trustworthiness ratings by authorities
   - **Real-Time Biometric Identification**: Live facial recognition and crowd scanning in public spaces
   - **Biometric Categorization**: Detecting sensitive attributes like race, ethnicity, religion, sexual orientation, or political views
   - **Emotion Recognition**: Workplace or educational emotion detection (except medical/safety exceptions)
   - **Manipulative AI**: Systems that exploit vulnerabilities of children, elderly, disabled, or economically disadvantaged persons
   - **Subliminal Manipulation**: Techniques that operate below conscious awareness

   **Red Flag Keywords**: "social credit", "citizen score", "live facial recognition", "real-time crowd scanning", "detect ethnicity", "identify political views", "determine sexual orientation", "monitor employee emotions", "detect student engagement", "persuade vulnerable people", "target children", "subliminal"

   **Output**: Boolean violation detection, confidence level (HIGH/MEDIUM/LOW), and reasoning

2. **High Risk Violation Detector (EU AI Act - High-Risk Systems)**

   This agent identifies high-risk AI systems being used without proper compliance awareness:

   **High-Risk AI System Categories**:
   - **Biometric Identification**: Non-real-time biometric verification systems
   - **Critical Infrastructure**: Power grids, water systems, transportation safety
   - **Education**: Admission decisions, student evaluation, exam proctoring
   - **Employment**: CV screening, hiring decisions, performance monitoring, termination
   - **Essential Services**: Credit scoring, loan approval, emergency dispatch, benefit eligibility
   - **Law Enforcement**: Risk assessment tools, lie/emotion detection, evidence analysis
   - **Migration & Border Control**: Visa risk scoring, document verification
   - **Justice System**: Legal research support, case outcome prediction

   **Compliance Gap Detection** - The agent checks if users show awareness of:
   - Risk assessment and management procedures
   - Data quality requirements
   - Technical documentation obligations
   - Human oversight mechanisms
   - Transparency obligations to affected persons

   **Output**: Violation detection, confidence level, and detailed reasoning about system type, deployment status, and compliance gaps

3. **GDPR Violation Detector (Data Protection)**

   This agent analyzes personal data handling and GDPR compliance:

   **Personal Data Categories Monitored**:
   - **Direct Identifiers**: Names in context, emails, phone numbers, addresses, ID numbers
   - **Special Category Data** (highest risk): Health data, biometric data, racial/ethnic origin, political opinions, religious beliefs, sexual orientation
   - **Children's Data**: Information about persons under 16 years old (extra protection required)
   - **Indirect References**: Files that may contain customer, employee, or user personal data

   **Violation Patterns Detected**:
   - **Unlawful Disclosure**: Sharing customer/user data without legal basis
   - **Excessive Collection**: "Collect everything" approach, unnecessary data gathering
   - **Security Gaps**: Unencrypted storage/transmission, casual database access sharing
   - **Missing Consent/Legal Basis**: Processing without legitimate grounds, ignoring opt-outs
   - **Rights Violations**: Refusing deletion requests, blocking data access
   - **Cross-Border Transfers**: Sending data outside EU without safeguards
   - **File References**: Mentions of files that may include personal data

   **Analysis Focus**:
   - Is actual personal data present in this conversation? (active breach)
   - Does the user describe violating GDPR in their practices?
   - Is special category or children's data involved? (highest severity)
   - Is the user asking "how to comply?" vs. actively violating?

   **Output**: GDPR violation detection, confidence level, and reasoning including data type, violation type, and severity

**Stage 2: Final Synthesis and Risk Determination**

After the three specialist agents complete their analysis, a **Final Aggregator Agent** synthesizes all findings:

**Aggregator's Responsibilities**:
- Eliminate false positives (distinguish between asking about compliance vs. actively violating)
- Identify the most serious violation (prohibited AI > GDPR special category > high-risk AI > transparency issues)
- Consider deployment status (deployed systems are urgent; planning phase is preventable)
- Assess user intent (malicious > negligent > uninformed > educational > compliant)
- Resolve conflicts if agents disagree on severity

**Risk Level Determination Criteria**:

- **CRITICAL**:
  - Prohibited AI practices detected with high confidence, OR
  - Special category personal data breach, OR
  - Deployed non-compliant high-risk AI system causing harm

- **HIGH**:
  - High-risk AI system in development without compliance framework, OR
  - Multiple significant transparency violations, OR
  - Substantial GDPR gaps in active systems

- **MEDIUM**:
  - High-risk AI in planning phase with some compliance awareness, OR
  - Minor violations without immediate harm, OR
  - Compliance questions about existing systems

- **LOW**:
  - Educational inquiry about compliance, OR
  - No violations detected, OR
  - Demonstrably compliant approach

**Final Output Structure**:
- **overall_risk_level**: CRITICAL/HIGH/MEDIUM/LOW
- **primary_violation**: Most serious issue identified
- **confidence_level**: HIGH/MEDIUM/LOW (how certain the assessment is)
- **summary**: 3-4 sentence synthesis of all findings
- **violations_detected**: Boolean flags for each category
- **agent_findings**: Brief notes from each specialist agent
- **user_intent_assessment**: malicious/negligent/uninformed/educational/compliant

#### Running a Risk Assessment

1. Click the **AI Risk Assessment** button at the top of the conversation detail page
2. A modal will appear showing the analysis progress with visual indicators for:
   - 🔍 Analyzing AI Act compliance
   - ⚖️ Checking GDPR violations
   - 🛡️ Assessing risk levels
3. The four-agent assessment typically takes 1-2 minutes to complete
4. Once finished, the risk assessment section will automatically populate with results
5. A success message "✓ Risk assessment completed successfully" will briefly appear

**What Happens During Assessment**:
- Your conversation is sent to a secure n8n workflow
- Three AI agents analyze the conversation in parallel (30-45 seconds each)
- Results are merged and aggregated
- Final aggregator synthesizes findings (15-30 seconds)
- Structured assessment is returned to the portal
- Results are stored in Elasticsearch for future reference

#### Understanding Risk Assessment Results

The risk assessment section can be expanded or collapsed by clicking on the header. It includes:

**Risk Overview**
- **Risk Level**: Overall assessment determined by the Final Aggregator (CRITICAL, HIGH, MEDIUM, or LOW)
- **Confidence Level**: How certain the system is (HIGH/MEDIUM/LOW) based on clarity of evidence and agent agreement

**Summary**
- A 3-4 sentence synthesis explaining why the conversation received this risk level
- Combines insights from all three specialist agents
- Focuses on the most serious issues identified
- Provides context about deployment status and user intent

**Primary Violation**
- The single most significant compliance issue detected
- Prioritizes: Prohibited AI > Special Category Data > High-Risk AI > Transparency
- If no violations found, states "none detected"
- Specific regulation or article that was violated

**Violations Detected**
Boolean indicators showing which compliance areas were flagged:
- **AI Act Prohibited**: True/False - Were prohibited AI practices detected?
- **AI Act High Risk**: True/False - Were high-risk AI system violations found?
- **GDPR**: True/False - Were GDPR violations identified?

**Agent Findings**
Detailed findings from each specialized agent:
- **Critical AI**: Brief note from the Critical Risk Violation Detector about prohibited practices
- **High Risk AI**: Brief note from the High Risk Violation Detector about high-risk systems
- **GDPR**: Brief note from the GDPR Violation Detector about data protection issues

These findings provide transparency into how each agent contributed to the final assessment.

**User Intent Assessment**
The system categorizes the likely intent behind the conversation:
- **Malicious**: Deliberate attempt to violate regulations
- **Negligent**: Lack of care or attention to compliance requirements
- **Uninformed**: Lack of awareness about regulatory obligations
- **Educational**: Asking questions to learn about compliance
- **Compliant**: Demonstrating awareness and proper practices

**Assessment Date**
- Timestamp of when the risk assessment was performed
- Useful for tracking when conversations were last evaluated

#### Interpreting Agent Findings

**When All Agents Agree**:
- High confidence in the assessment
- Clear evidence of violations (or lack thereof)
- Straightforward remediation path

**When Agents Disagree**:
- The Final Aggregator explains the discrepancy in the summary
- Confidence level may be marked as MEDIUM or LOW
- May require human review for final determination

**False Positive Prevention**:
The system is designed to distinguish between:
- **Actual violations**: User is describing or planning non-compliant activities
- **Educational inquiries**: User is asking how to comply or learning about regulations
- **Hypothetical scenarios**: User is discussing theoretical situations

If you're asking about compliance, the assessment should reflect "educational" intent and lower risk levels.

### Viewing Messages

The Messages section displays the full conversation timeline:

1. Click the **Messages** header to expand or collapse the message list
2. Each message shows:
   - **Message number** - Position in the conversation
   - **User Question** - What the user asked
   - **AI Response** - How the AI system responded
   - **Timestamp** - When the message was sent
   - **Request ID** - Unique identifier for tracking

3. Messages are displayed in chronological order (oldest to newest)

### Collapsible Sections

Both the Risk Assessment and Messages sections can be collapsed to save screen space:
- Click on the section header to toggle between expanded and collapsed states
- The "−" button indicates the section is expanded
- The "+" button indicates the section is collapsed

---

## Data Synchronization

The Sync feature ensures your conversation data is up-to-date and properly organized.

### Using the Sync Button

1. In the Conversations view, locate the **Sync Conversations** button
2. Click the button to trigger a synchronization
3. During sync, the button will show "Syncing..."
4. After completion, you'll see a success message showing:
   - Number of conversations indexed
   - Number of messages processed

### When to Sync

- When you first access the portal and see no conversations
- After new AI conversations have occurred in your system
- If the conversation list appears outdated
- After significant changes to your data source

### What Sync Does

The synchronization process:
- Connects to your Elasticsearch data source
- Groups individual messages into conversations
- Updates the conversation index
- Refreshes risk assessments
- Updates user lists and statistics

---

## Best Practices

### Regular Monitoring

1. **Check the Dashboard Daily**
   - Monitor for new critical or high-risk issues
   - Track conversation volume trends

2. **Review Critical Issues Immediately**
   - Conversations marked as CRITICAL need urgent attention
   - Take appropriate action based on the violation type

3. **Assess High-Risk Conversations**
   - Review HIGH risk conversations within 24 hours
   - Determine if remediation is needed

### Using Risk Assessments Effectively

1. **Run Assessments on Suspicious Conversations**
   - If a conversation preview looks concerning, run an assessment
   - Don't wait for automatic assessments

2. **Review Assessment Details Carefully**
   - Read the summary and primary violation
   - Check all agent findings for complete context
   - Look at specific violations detected

3. **Document Actions Taken**
   - Keep records of how you addressed compliance issues
   - Track patterns in violations

### Filtering for Efficiency

1. **Use Risk Filters for Prioritization**
   - Filter by CRITICAL to address urgent issues first
   - Work through HIGH risk items next
   - Review MEDIUM and LOW risk periodically

2. **Filter by User for Pattern Detection**
   - Identify if specific users have recurring issues
   - Provide targeted training if needed

3. **Check NOT_ASSESSED Regularly**
   - Find conversations that haven't been analyzed
   - Run assessments on a regular schedule

---

## Understanding Compliance Frameworks

The portal's risk assessment system monitors compliance with two major regulatory frameworks. Understanding what the AI agents look for helps you interpret assessment results and take appropriate action.

### EU AI Act

The EU AI Act (Regulation 2024/1689) establishes a risk-based framework for AI systems operating in the European Union. The portal's assessment system focuses on two critical categories:

#### Prohibited AI Practices (Highest Severity)

These AI uses are **completely forbidden** under the AI Act. Detection triggers CRITICAL risk levels:

1. **Social Scoring by Public Authorities**
   - Citizen trustworthiness rating systems
   - Government-run social credit schemes
   - Authority-based behavioral scoring
   - **Why it's prohibited**: Violates human dignity and discriminates based on behavior

2. **Real-Time Biometric Identification in Public Spaces**
   - Live facial recognition in public areas
   - Real-time crowd scanning
   - Continuous biometric surveillance
   - **Exceptions**: Law enforcement in specific circumstances (terrorism, child abduction, serious crime)
   - **Why it's prohibited**: Mass surveillance, privacy invasion, chilling effects on freedoms

3. **Biometric Categorization of Sensitive Attributes**
   - Inferring race or ethnicity from biometric data
   - Detecting political opinions or sexual orientation
   - Categorizing religious beliefs or philosophical views
   - **Why it's prohibited**: Discrimination risk, privacy violation, human dignity

4. **Emotion Recognition in Workplace and Education**
   - Monitoring employee emotions for performance evaluation
   - Detecting student engagement or emotional states
   - **Exceptions**: Medical or safety reasons
   - **Why it's prohibited**: Psychological manipulation, power imbalance exploitation

5. **Manipulative AI Exploiting Vulnerabilities**
   - Systems targeting children to make harmful decisions
   - AI exploiting elderly persons' cognitive decline
   - Technology manipulating disabled or economically disadvantaged persons
   - **Why it's prohibited**: Exploitation of vulnerable groups, causing significant harm

6. **Subliminal Manipulation**
   - Techniques operating below conscious awareness
   - Hidden persuasion mechanisms
   - **Why it's prohibited**: Removes autonomy, violates informed consent

**Red Flag Keywords Monitored**: "social credit", "citizen score", "live facial recognition", "real-time crowd scanning", "detect ethnicity", "identify political views", "determine sexual orientation", "monitor employee emotions", "detect student engagement", "persuade vulnerable people", "target children", "subliminal"

#### High-Risk AI Systems (Strict Requirements)

These AI applications require compliance with specific obligations. Non-compliance triggers HIGH risk levels:

**Categories Monitored**:

1. **Biometric Identification & Verification**
   - Non-real-time biometric ID systems
   - Identity verification using biometric data
   - **Requirements**: Data quality, security, human oversight

2. **Critical Infrastructure Management**
   - Power grid control systems
   - Water supply management
   - Transportation safety systems
   - **Why high-risk**: Public safety impact, potential for catastrophic failure

3. **Education & Training**
   - University admission decision systems
   - Student performance evaluation tools
   - Exam proctoring and assessment
   - **Why high-risk**: Determines life opportunities, access to education

4. **Employment & HR**
   - CV screening and applicant ranking
   - Hiring decision support systems
   - Employee performance monitoring
   - Termination recommendations
   - **Why high-risk**: Livelihood impact, discrimination potential

5. **Essential Private & Public Services**
   - Credit scoring and creditworthiness assessment
   - Loan approval systems
   - Emergency service dispatch prioritization
   - Public benefit eligibility determination
   - **Why high-risk**: Access to essential services, social exclusion risk

6. **Law Enforcement**
   - Criminal risk assessment tools
   - Lie detection and emotion recognition for investigations
   - Evidence analysis systems
   - Predictive policing
   - **Why high-risk**: Liberty deprivation, justice system integrity

7. **Migration, Asylum & Border Control**
   - Visa application risk scoring
   - Document verification systems
   - Asylum decision support
   - **Why high-risk**: Fundamental rights, protection of vulnerable persons

8. **Justice System**
   - Legal research and case analysis support
   - Case outcome prediction
   - Judicial decision support
   - **Why high-risk**: Rule of law, access to justice, fairness

**Compliance Requirements the Portal Checks For**:

When a high-risk AI system is detected, the agent evaluates whether the user demonstrates awareness of:

- ✓ **Risk Assessment & Management**: Systematic identification and mitigation of risks
- ✓ **Data Quality Requirements**: Relevant, representative, accurate, complete datasets
- ✓ **Technical Documentation**: Comprehensive system documentation
- ✓ **Human Oversight Mechanisms**: Meaningful human review and intervention capabilities
- ✓ **Transparency Obligations**: Clear information to affected persons about AI use
- ✓ **Conformity Assessment**: Testing and validation procedures
- ✓ **Registration Requirements**: Notification to authorities

**Lack of awareness = Compliance Gap = HIGH risk flagged**

### GDPR (General Data Protection Regulation)

The GDPR establishes comprehensive data protection rules for personal data. The portal's GDPR agent monitors for violations that commonly occur in AI conversations.

#### Personal Data Categories Monitored

**1. Direct Identifiers** (Risk Level: Medium-High)
- Full names in context (not just "John" but "John Smith from Berlin")
- Email addresses
- Phone numbers
- Physical addresses
- ID numbers (passport, social security, driver's license)
- **Why monitored**: Easy to link to individuals, enables re-identification

**2. Special Category Data** (Risk Level: CRITICAL)

Also called "sensitive personal data" - requires heightened protection:

- **Health Data**: Medical records, diagnoses, prescriptions, mental health information
- **Biometric Data**: Facial recognition data, fingerprints, voice patterns, DNA
- **Racial or Ethnic Origin**: Information revealing ethnic background
- **Political Opinions**: Party membership, voting preferences, political views
- **Religious or Philosophical Beliefs**: Faith, worldview, ideological stances
- **Sexual Orientation**: Information about sexual preferences or orientation
- **Trade Union Membership**: Labor organization affiliation

**Processing special category data without explicit legal basis = CRITICAL violation**

**3. Children's Data** (Risk Level: HIGH)
- Information about persons under 16 years old
- Extra protection required under GDPR
- Parental consent needed for most processing
- **Why critical**: Children lack capacity to understand risks

**4. Indirect References** (Risk Level: MEDIUM)
- Mentions of "customer database", "employee files", "user records"
- Files that may contain personal data
- Databases with potentially identifiable information
- **Why monitored**: May indicate data processing discussions

#### GDPR Violation Patterns Detected

**1. Unlawful Disclosure** (HIGH severity)
- Sharing customer data in conversations without legal basis
- Discussing specific individuals' personal data
- Copying personal data into AI conversations
- **Legal basis required**: Consent, contract, legal obligation, vital interests, public task, or legitimate interest

**2. Excessive Data Collection** (MEDIUM-HIGH severity)
- "Collect everything" approach without justification
- Gathering unnecessary data beyond stated purpose
- Retaining data longer than needed
- **GDPR Principle**: Data minimization - only collect what's necessary

**3. Security Gaps** (HIGH severity)
- Unencrypted storage or transmission of personal data
- Sharing database access credentials casually
- Inadequate access controls
- No pseudonymization or anonymization
- **GDPR Requirement**: Appropriate technical and organizational measures

**4. Missing Consent or Legal Basis** (MEDIUM-HIGH severity)
- Processing without legitimate legal ground
- Ignoring user opt-outs or withdrawals
- No clear privacy notice
- **GDPR Requirement**: Every processing activity needs a legal basis

**5. Rights Violations** (MEDIUM severity)
- Refusing or ignoring data deletion requests (right to erasure)
- Blocking data access requests (right to access)
- Not providing data portability
- **GDPR Requirement**: Respect individual rights

**6. Cross-Border Transfers** (MEDIUM-HIGH severity)
- Sending personal data outside the EU/EEA without safeguards
- No Standard Contractual Clauses (SCCs) or adequacy decision
- Transferring to countries without adequate protection
- **GDPR Requirement**: Appropriate safeguards for international transfers

**7. Accountability Gaps** (MEDIUM severity)
- No Data Protection Impact Assessment (DPIA) for high-risk processing
- Missing Records of Processing Activities (ROPA)
- No Data Protection Officer (DPO) when required
- **GDPR Requirement**: Demonstrate compliance

#### What the GDPR Agent Analyzes

The agent evaluates:

1. **Is personal data present in THIS conversation?**
   - Direct breach: Actual personal data shared in the conversation
   - Higher severity than just discussing data processing

2. **Does the user describe violating GDPR in their practices?**
   - Planning or describing non-compliant data processing
   - Indicates systemic issues

3. **Is special category or children's data involved?**
   - Triggers highest severity assessment
   - Requires explicit legal basis

4. **User intent: Asking vs. Violating**
   - Educational inquiry: "How do I comply with GDPR?"
   - Active violation: "I'm sharing customer emails with marketing"
   - Assessment reflects the distinction

### Why Compliance Matters

**Legal Consequences**:
- **EU AI Act Fines**: Up to €35 million or 7% of global annual turnover (prohibited practices)
- **GDPR Fines**: Up to €20 million or 4% of global annual turnover (most serious infringements)
- **Criminal Liability**: In some member states for serious violations
- **Civil Lawsuits**: Individuals can sue for damages

**Operational Impact**:
- **Reputation Damage**: Loss of customer trust and brand value
- **Market Access**: Inability to operate in EU markets
- **Competitive Disadvantage**: Compliant competitors gain advantage
- **Insurance**: Higher premiums or loss of coverage

**Ethical Responsibility**:
- **Human Rights Protection**: Fundamental rights and dignity
- **Fairness**: Preventing discrimination and bias
- **Transparency**: Building trustworthy AI systems
- **Accountability**: Responsible innovation and deployment

**The Portal's Role**:
- **Early Detection**: Identify issues before they become violations
- **Education**: Learn what compliance requires
- **Documentation**: Evidence of compliance efforts
- **Risk Mitigation**: Prevent harm and legal exposure

---

## Troubleshooting

### No Conversations Showing

**Problem**: The conversation list is empty or shows "No conversations found"

**Solutions**:
1. Click the **Sync Conversations** button to synchronize data
2. Check if any filters are applied and clear them
3. Verify that your Elasticsearch connection is working
4. Contact your administrator if the issue persists

### Risk Assessment Not Working

**Problem**: The "AI Risk Assessment" button doesn't respond or shows errors

**Solutions**:
1. Check your internet connection
2. Wait a moment and try again (the service may be temporarily busy)
3. Verify the conversation has messages to analyze
4. Contact support if the issue continues

### Slow Loading

**Problem**: The portal takes a long time to load conversations or data

**Solutions**:
1. Check your internet connection speed
2. Try reducing the page size using pagination
3. Clear your browser cache
4. Use filters to narrow down results

### Login Issues

**Problem**: Cannot log in or get authentication errors

**Solutions**:
1. Verify your email and password are correct
2. Check for typos in your credentials
3. Contact your administrator to verify your account is active
4. Clear browser cookies and try again

---

## Getting Help

If you need assistance with the Nexus Portal:

- **Technical Issues**: Report bugs at [GitHub Issues](https://github.com/pragmatiqai/nexus-portal/issues)
- **Email Support**: andres.gavriljuk@pragmatiqai.com
- **Documentation**: Review the README and technical documentation in the repository

---

## Glossary

**AI Agent**: An autonomous AI system designed to perform specialized analysis tasks. The portal uses four Claude Sonnet 4-powered agents for risk assessment

**AI Act**: European Union regulation on artificial intelligence (Regulation 2024/1689) establishing rules for AI systems

**Confidence Level**: How certain the risk assessment system is about its findings (HIGH/MEDIUM/LOW) based on evidence clarity and agent agreement

**Compliance Violation**: An instance where an AI conversation doesn't meet regulatory or policy requirements

**Conversation**: A series of related messages between a user and an AI system, grouped by conversation ID

**Critical Risk Violation Detector**: The AI agent that identifies prohibited AI practices under the EU AI Act

**Elasticsearch**: The database system that stores your AI conversation data and risk assessments

**Final Aggregator**: The fourth AI agent that synthesizes findings from the three specialist agents into a comprehensive risk assessment

**GDPR**: General Data Protection Regulation - EU privacy law governing personal data protection

**GDPR Violation Detector**: The AI agent that identifies personal data protection violations

**High Risk Violation Detector**: The AI agent that identifies high-risk AI systems without proper compliance

**Message**: A single exchange consisting of a user question and AI response

**Multi-Agent System**: The architecture using multiple specialized AI agents working in parallel to analyze different aspects of compliance

**n8n**: The workflow automation platform that orchestrates the multi-agent risk assessment process

**Primary Violation**: The single most serious compliance issue detected in a conversation

**Prohibited AI Practices**: AI uses that are completely forbidden under the EU AI Act (social scoring, real-time biometric ID in public spaces, etc.)

**Risk Assessment**: An automated analysis of a conversation using four AI agents to identify compliance violations and determine risk levels

**Risk Filter**: A tool to view conversations with a specific risk level

**Risk Level**: A categorization of how severe compliance concerns are (CRITICAL, HIGH, MEDIUM, LOW)

**Special Category Data**: Sensitive personal data under GDPR requiring heightened protection (health, biometric, racial/ethnic, political, religious, sexual orientation data)

**Specialist Agent**: One of the three AI agents focusing on specific compliance areas (Critical Risk, High Risk, or GDPR)

**Sync**: The process of updating the portal's data from the Elasticsearch source

**User Filter**: A tool to view conversations from a specific user only

**User Intent Assessment**: The system's evaluation of why a user had a conversation (malicious, negligent, uninformed, educational, or compliant)

---

**Built with ❤️ by PragmatiqAI**

*Last Updated: December 2024*

# Nexus AI Compliance Ecosystem - Complete User Guide

## Introduction

Welcome to the **Nexus AI Compliance Ecosystem** – a comprehensive solution for monitoring, analyzing, and ensuring compliance of AI usage within your organization. This guide explains how the complete system works, what it does, and how different users interact with it.

### What Is Nexus?

Nexus is a two-component system designed to help organizations use AI responsibly while maintaining compliance with regulations like the EU AI Act and GDPR:

**Nexus Proxy** – The invisible monitoring layer that captures every AI conversation in real-time as employees use ChatGPT and other AI services

**Nexus Portal** – The compliance dashboard where teams review captured conversations, assess risks, and identify potential violations

Together, these systems create a complete compliance pipeline: from automatic capture to intelligent analysis to actionable insights.

### Why Organizations Need Nexus

**The Challenge**: Organizations face significant risks when employees use AI systems:
- Prohibited AI practices that carry fines up to €35 million
- GDPR violations with penalties up to €20 million
- Personal data being shared with external AI services
- High-risk AI systems deployed without proper safeguards
- No visibility into what employees are asking AI systems to do

**The Solution**: Nexus provides:
- Complete visibility into all AI conversations
- Real-time capture without disrupting user workflows
- Multi-agent AI-powered compliance analysis
- Early detection of violations before they become legal issues
- Audit trails for regulatory compliance
- Educational feedback to improve AI usage practices

### Who This Guide Is For

This guide serves three primary audiences:

**End Users** – Employees who use AI services like ChatGPT for work and whose conversations are being monitored through Nexus Proxy

**Compliance Teams** – Staff responsible for reviewing AI conversations, assessing risks, and ensuring regulatory compliance using Nexus Portal

**Administrators** – IT and security personnel who maintain the Nexus infrastructure and manage user access

Each section is clearly labeled so you can focus on information relevant to your role.

---

## System Overview

### The Complete Workflow

Here's how Nexus protects your organization from AI-related compliance risks:

**1. User Works with AI** (Nexus Proxy)
- An employee opens ChatGPT to ask a question
- Their browser/system is configured to route through Nexus Proxy
- They authenticate with their corporate credentials
- They have a normal conversation with ChatGPT

**2. Conversation Captured** (Nexus Proxy)
- Nexus Proxy intercepts the conversation transparently
- Every question and response is captured in real-time
- User metadata is attached (username, timestamp, IP address)
- Data is immediately stored in Elasticsearch
- The user experiences no delay or disruption

**3. Data Available for Review** (Nexus Portal)
- Compliance teams access Nexus Portal
- They sync to pull latest conversations from Elasticsearch
- Conversations are grouped by user and displayed chronologically
- Filtering and search tools help find specific conversations
- Dashboard shows statistics and risk trends

**4. Risk Assessment** (Nexus Portal + AI Agents)
- Compliance team triggers AI risk assessment on a conversation
- Four specialized AI agents analyze the conversation in parallel:
  - Critical Risk Detector (prohibited AI practices)
  - High Risk Detector (high-risk AI systems)
  - GDPR Detector (data protection violations)
  - Final Aggregator (synthesizes findings)
- Assessment completes in 1-2 minutes
- Risk level assigned: CRITICAL, HIGH, MEDIUM, or LOW

**5. Action Taken** (Compliance Team)
- Compliance team reviews flagged conversations
- They contact users about violations
- Training is provided where needed
- Violations are documented for audit purposes
- Patterns inform policy and education initiatives

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        END USERS                                │
│  (Employees using ChatGPT through corporate network/browser)    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ All AI traffic routed through proxy
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXUS PROXY                                │
│  • Authenticates users                                          │
│  • Intercepts HTTPS to ChatGPT (MITM)                          │
│  • Captures questions & responses                               │
│  • Attaches metadata (user, time, IP)                          │
│  • Stores in Elasticsearch                                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Conversations stored as documents
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     ELASTICSEARCH                               │
│  • Central data repository                                      │
│  • Indexes all messages and conversations                       │
│  • Provides search and query capabilities                       │
│  • Stores risk assessment results                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Portal queries for conversations
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXUS PORTAL                               │
│  • Web interface for compliance teams                           │
│  • Displays conversations with filtering                        │
│  • Dashboard with statistics                                    │
│  • Triggers risk assessments                                    │
│  • Shows assessment results                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Risk assessment requests
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│               n8n WORKFLOW AUTOMATION                           │
│  • Receives conversation for assessment                         │
│  • Orchestrates 4 AI agents (Claude Sonnet 4)                  │
│  • Runs agents in parallel                                      │
│  • Aggregates findings                                          │
│  • Returns structured assessment                                │
└─────────────────────────────────────────────────────────────────┘
```

### Key Components Explained

**Nexus Proxy**
- **Role**: Data collection and monitoring
- **Technology**: MITM proxy that intercepts HTTPS traffic
- **Function**: Captures AI conversations without user awareness or disruption
- **Output**: Structured conversation data in Elasticsearch
- **Users**: Transparent to end users; configured by IT administrators

**Elasticsearch**
- **Role**: Central data repository
- **Technology**: Distributed search and analytics engine
- **Function**: Stores all conversations, metadata, and risk assessments
- **Output**: Queryable data accessible by Nexus Portal
- **Users**: Backend system; not directly accessed by end users

**Nexus Portal**
- **Role**: Compliance interface and analysis platform
- **Technology**: Web application with dashboard and conversation viewer
- **Function**: Displays conversations, triggers assessments, shows results
- **Output**: Actionable compliance insights
- **Users**: Compliance teams, data protection officers, auditors

**n8n Workflow + AI Agents**
- **Role**: Automated compliance analysis
- **Technology**: Workflow automation with Claude Sonnet 4 agents
- **Function**: Multi-agent analysis of conversations for violations
- **Output**: Risk level, violation details, recommendations
- **Users**: Triggered by compliance teams via Portal

---

## For End Users: What You Need to Know

If you're an employee whose AI usage is being monitored through Nexus Proxy, this section explains what's happening, why, and what you should know.

### What's Being Monitored

**Captured Automatically**:
- Every question you ask ChatGPT when using the corporate proxy
- Every response ChatGPT provides to you
- Your username (from proxy authentication)
- Timestamp of each conversation
- Your IP address
- The complete conversation thread

**NOT Captured**:
- Your ChatGPT account password
- AI conversations on personal devices (outside corporate network)
- Regular web browsing (only AI traffic is logged)
- Conversations on other platforms unless specifically configured

### Why You're Being Monitored

Your organization has legal obligations to ensure AI systems are used compliantly:

**EU AI Act Compliance**: Certain AI uses are completely prohibited (e.g., social scoring, real-time facial recognition in public spaces, emotion recognition in workplaces). If employees use AI for these purposes, even unknowingly, the organization faces massive fines.

**GDPR Compliance**: Sharing customer or employee personal data with ChatGPT may violate data protection laws. Organizations must monitor to prevent unauthorized data sharing.

**Risk Management**: High-risk AI systems (hiring tools, credit scoring, critical infrastructure) require special safeguards. Organizations need to know if employees are using AI for these purposes.

**Audit Requirements**: Regulators may request evidence of compliance monitoring. Nexus provides the necessary audit trail.

**Protection for You**: Monitoring helps identify mistakes before they become violations, protecting both you and the organization from legal consequences.

### How It Works for You

**Setup**:
1. IT provides you with Nexus Proxy credentials (username/password)
2. You install a security certificate on your browser/system
3. You configure your browser to route through the proxy (or IT does this automatically)

**Daily Use**:
1. Open ChatGPT as usual
2. Your browser prompts for proxy authentication (if not already authenticated)
3. Enter your corporate credentials
4. Use ChatGPT normally – conversations stream at normal speed
5. Everything is captured transparently in the background

**No Impact on Your Experience**:
- ChatGPT responds at the same speed
- You see no difference in the interface
- No pop-ups or interruptions
- The capture process is invisible

### What Can Get You Flagged

Nexus uses AI agents to analyze conversations for compliance risks. Certain topics trigger automatic flags:

**CRITICAL Risk (Immediate Review)**:
- Discussing prohibited AI practices (social scoring, mass surveillance, etc.)
- Sharing special category personal data (health, ethnicity, political views, sexual orientation, religious beliefs)
- Using AI for manipulative purposes targeting vulnerable groups

**HIGH Risk (Prompt Review)**:
- Discussing high-risk AI systems without compliance awareness (hiring tools, credit scoring, critical infrastructure)
- Sharing regular personal data (customer names, emails, employee records)
- Security violations (storing data unencrypted, sharing credentials)

**MEDIUM Risk (Review When Possible)**:
- Minor compliance questions
- Discussing data collection practices
- Transparency issues

**LOW Risk (Generally Fine)**:
- Educational questions about compliance
- General AI usage for work tasks
- Questions that don't involve personal data or regulated AI uses

### Best Practices

**DO**:
- ✅ Ask ChatGPT educational questions about compliance
- ✅ Use AI for general research and writing tasks
- ✅ Consult your compliance team before using AI for sensitive decisions
- ✅ Anonymize any examples when asking questions (use "a customer" not "John Smith")

**DON'T**:
- ❌ Copy customer or employee personal data into ChatGPT
- ❌ Ask AI to help you build prohibited AI systems
- ❌ Use AI for high-risk decisions (hiring, lending, healthcare) without compliance approval
- ❌ Attempt to bypass the proxy to hide your AI usage

### Your Rights

**Access**: You can request a copy of all conversations captured under your username (submit to your Data Protection Officer)

**Explanation**: If a conversation is flagged, you can ask your compliance team to explain why

**Training**: If you violate policies, you should receive guidance on correct AI usage

**Privacy**: Only authorized compliance staff can view your conversations

### What Happens If You're Flagged

If one of your conversations is assessed as CRITICAL or HIGH risk:

1. Your compliance team reviews the conversation details
2. They may contact you to discuss what happened
3. You'll receive guidance on proper AI usage
4. Serious violations may result in disciplinary action
5. Training may be provided to prevent future issues

**Remember**: Asking about how to comply is encouraged. Violations occur when you describe actually doing non-compliant things or share personal data.

---

## For Compliance Teams: Using Nexus Portal

If you're responsible for monitoring AI compliance, this section explains how to use Nexus Portal effectively.

### Logging In and Navigation

**Access**:
1. Open Nexus Portal in your browser
2. Log in with your compliance team credentials
3. You'll see your name in the top-right corner

**Main Views**:
- **Dashboard**: High-level statistics and risk metrics
- **Conversations**: Detailed list of all captured conversations

### Dashboard Overview

The dashboard provides at-a-glance visibility into AI usage and compliance status:

**Key Metrics**:
- **Total Conversations**: All captured AI interactions ever
- **Total Messages**: Individual question-answer pairs across all conversations
- **Conversations (Last 30 Days)**: Recent activity level
- **Critical Issues (Last 30 Days)**: Conversations flagged as CRITICAL risk
- **High Risk Issues (Last 30 Days)**: Conversations flagged as HIGH risk

**How to Use**:
- Check daily to monitor trends
- Elevated CRITICAL or HIGH counts indicate immediate attention needed
- Compare month-over-month to see if violations are increasing or decreasing
- Use as a KPI for your organization's AI compliance health

### Reviewing Conversations

**Syncing Data**:

Before reviewing, always sync to ensure you have the latest conversations:

1. Click **Sync Conversations** button
2. Wait for sync to complete (shows number of conversations and messages indexed)
3. The conversation list refreshes with new data

**When to Sync**:
- At the start of each compliance review session
- When notified of new AI activity
- Periodically throughout the day if actively monitoring

**Browsing Conversations**:

Each conversation card shows:
- Username who had the conversation
- Number of messages in the conversation
- Risk badge (if assessed)
- Timestamp of last message
- Preview of the first question
- Conversation ID

**Filtering**:

Use filters to find specific conversations:

**By User**:
1. Click User Filter dropdown
2. Select a specific user
3. View only that user's conversations
4. Clear filter by clicking × on the filter badge

**By Risk Level**:
1. Click Risk Filter dropdown
2. Choose: All, CRITICAL, HIGH, MEDIUM, LOW, or NOT_ASSESSED
3. View only conversations with that risk level
4. Combine with user filter for targeted reviews

**Priority Review Strategy**:
1. Filter by CRITICAL → Review immediately
2. Filter by HIGH → Review within 24 hours
3. Filter by NOT_ASSESSED → Identify conversations that need assessment
4. Filter by specific users → Investigate patterns for training opportunities

### Viewing Conversation Details

Click on any conversation card to see the full details:

**Header Information**:
- Conversation ID
- Username
- Message count
- Current risk level (if assessed)

**Messages Section**:
- Expandable/collapsible section
- Shows every question-answer pair in chronological order
- Each message includes:
  - User's question
  - AI's complete response
  - Timestamp
  - Request ID

**Risk Assessment Section** (if performed):
- Overall risk level with confidence
- Summary explaining the assessment
- Primary violation identified
- Violations detected by category (AI Act Prohibited, AI Act High Risk, GDPR)
- Detailed findings from each of the 3 specialist agents
- User intent assessment (malicious, negligent, uninformed, educational, compliant)
- Assessment timestamp

### Running Risk Assessments

Not all conversations are automatically assessed. You trigger assessments manually:

**When to Assess**:
- Conversations that look suspicious from the preview
- Conversations from users in sensitive roles
- Random sampling for quality assurance
- Conversations mentioning high-risk topics (personal data, hiring, lending, etc.)
- All conversations from new employees (initial monitoring period)

**How to Trigger Assessment**:

1. Open the conversation detail view
2. Click **AI Risk Assessment** button at the top
3. A modal appears showing progress:
   - 🔍 Analyzing AI Act compliance
   - ⚖️ Checking GDPR violations
   - 🛡️ Assessing risk levels
4. Wait 1-2 minutes for completion
5. Results automatically populate in the Risk Assessment section
6. Success message confirms completion

**What Happens Behind the Scenes**:

Your request triggers an n8n workflow that:
1. Sends the conversation to three specialist AI agents in parallel
2. **Critical Risk Detector** checks for prohibited AI practices
3. **High Risk Detector** checks for high-risk AI system violations
4. **GDPR Detector** checks for data protection violations
5. **Final Aggregator** synthesizes all findings into a single assessment
6. Structured results are returned and stored in Elasticsearch

### Interpreting Risk Assessments

**Risk Levels**:

**CRITICAL** (Immediate Action Required):
- Prohibited AI practices detected
- Special category personal data shared
- Deployed non-compliant high-risk systems causing harm
- **Action**: Contact user immediately, escalate to legal if necessary

**HIGH** (Urgent Review Needed):
- High-risk AI systems without compliance framework
- Significant GDPR violations
- Multiple transparency violations
- **Action**: Review within 24 hours, contact user, provide guidance

**MEDIUM** (Review When Possible):
- High-risk AI in planning phase with some awareness
- Minor violations without immediate harm
- Compliance questions about existing systems
- **Action**: Document for trends, contact user if pattern emerges

**LOW** (Minimal Concern):
- Educational inquiries
- No violations detected
- Demonstrably compliant approach
- **Action**: No action needed, good example for training materials

**Confidence Levels**:

**HIGH Confidence**: Clear evidence, all agents agree, straightforward violation or non-violation

**MEDIUM Confidence**: Some ambiguity, agents partially disagree, context-dependent interpretation

**LOW Confidence**: Unclear evidence, significant agent disagreement, requires human review

**User Intent Assessment**:

This helps you understand the user's mindset:

**Malicious**: Deliberately attempting to violate regulations (rare, serious)
**Negligent**: Lack of care about compliance requirements (needs training)
**Uninformed**: Lack of awareness about regulations (needs education)
**Educational**: Asking questions to learn about compliance (positive, no action)
**Compliant**: Demonstrating proper practices (positive example)

### Taking Action on Violations

**For CRITICAL Violations**:

1. **Immediate Review**: Read the complete conversation and assessment
2. **Verify**: Confirm the violation is real (rule out false positives)
3. **Escalate**: Contact legal/compliance leadership immediately
4. **Contact User**: Speak with the user to understand context
5. **Remediate**: Depending on violation:
   - Delete personal data from ChatGPT if possible
   - Stop deployment of prohibited AI systems
   - Notify affected individuals if required by GDPR
   - Document incident for regulators
6. **Follow-Up**: Provide training, implement safeguards, monitor future activity

**For HIGH Violations**:

1. **Review Within 24 Hours**: Prioritize but not emergency-level
2. **Contact User**: Discuss the violation and provide guidance
3. **Document**: Record the violation and action taken
4. **Training**: Provide resources on compliant AI usage
5. **Monitor**: Flag user for closer monitoring for next 30 days

**For MEDIUM/LOW**:

1. **Document**: Keep records for pattern analysis
2. **Trend Analysis**: If same user has multiple MEDIUM flags, escalate to HIGH
3. **Training Opportunities**: Use as examples in education materials
4. **No User Contact**: Unless patterns emerge

### Best Practices for Compliance Teams

**Daily Routine**:
1. Start day by syncing conversations
2. Check dashboard for new CRITICAL/HIGH issues
3. Review flagged conversations from most recent first
4. Run assessments on suspicious unassessed conversations
5. Document actions taken
6. End day by syncing again to ensure nothing missed

**Weekly Activities**:
1. Review trends in violation types
2. Identify users with patterns of risky behavior
3. Prepare training materials based on common issues
4. Sample random conversations for quality assurance
5. Report metrics to leadership (number of conversations, violations, actions taken)

**Monthly Activities**:
1. Comprehensive pattern analysis (departments, violation types, user roles)
2. Update policies based on emerging issues
3. Review and update training materials
4. Audit trail documentation for regulators
5. Risk assessment of your monitoring program itself

**Documentation**:
- Keep detailed logs of all CRITICAL/HIGH violations and actions taken
- Document all user contacts and training provided
- Maintain audit trail for regulatory inspections
- Track metrics: conversations monitored, assessments performed, violations found, actions taken

---

## For Administrators: Managing Nexus Infrastructure

If you're responsible for maintaining the Nexus system, this section covers operational responsibilities.

### Nexus Proxy Administration

**Installation and Setup**:
- Deploy Nexus Proxy on a server accessible to all users
- Configure Primary Proxy (port 8081) and AI Handling Proxy (port 8082)
- Set up Elasticsearch connection
- Generate MITM certificates for HTTPS interception
- Configure authentication (user database)

**User Management**:

**Adding New Users**:
1. Create proxy credentials (username/password)
2. Add to authentication database
3. Distribute certificate file (`littleproxy-mitm.pem`)
4. Provide proxy configuration instructions (hostname:8081)
5. Verify user can authenticate and browse through proxy

**Removing Users**:
1. Remove credentials from authentication database
2. Verify user can no longer authenticate
3. Optionally: review user's conversation history before account deletion

**Certificate Management**:

**Distribution**:
- New users must install the MITM certificate to trust HTTPS interception
- Provide clear instructions for Windows, macOS, and browser-specific installation
- Maintain a help desk process for certificate issues

**Renewal**:
- Monitor certificate expiration dates
- Renew before expiry (typically 1-2 years)
- Distribute new certificate to all users
- Plan for transition period where both old and new certificates are valid

**Performance Monitoring**:

**What to Monitor**:
- Proxy server CPU and memory usage
- Number of active connections
- Request throughput (conversations per hour)
- Elasticsearch storage capacity
- Response latency (should be <200ms added latency)

**Scaling Considerations**:
- Single proxy server can handle ~500 concurrent users
- For larger deployments, use load balancing across multiple proxy instances
- Elasticsearch may require clustering for high conversation volumes
- Monitor and adjust buffer sizes and thread pools

**Troubleshooting**:

**Common Issues**:

*Proxy Not Starting*:
- Check port conflicts (8081 and 8082 available)
- Verify Elasticsearch connectivity
- Review logs for startup errors

*Certificate Errors*:
- Verify certificate is properly signed
- Check certificate has not expired
- Ensure users have installed and trusted certificate

*Slow Performance*:
- Check network bandwidth
- Monitor Elasticsearch query performance
- Review proxy server resource utilization
- Consider scaling infrastructure

*Authentication Failures*:
- Verify user database is accessible
- Check user credentials are correct
- Review authentication logs for patterns

### Nexus Portal Administration

**Setup**:
- Deploy Nexus Portal web application
- Configure Elasticsearch connection (same instance as Proxy uses)
- Set up user authentication for compliance teams
- Configure n8n workflow URL for risk assessments

**User Management**:

**Compliance Team Access**:
- Create accounts for compliance officers, DPOs, auditors
- Assign appropriate permissions (view-only vs. full access)
- Provide login credentials and portal URL

**Access Control**:
- Consider role-based access (some users view only, others can trigger assessments)
- Maintain audit logs of who accessed what conversations
- Periodically review and revoke inactive accounts

**Monitoring**:

**Portal Health**:
- Verify portal is accessible and responsive
- Check Elasticsearch query performance
- Monitor n8n workflow availability
- Track assessment success/failure rates

**Data Quality**:
- Verify conversations are being synced correctly
- Check for missing messages or corrupted data
- Ensure risk assessments are completing successfully

### Elasticsearch Administration

**Capacity Planning**:

**Storage Requirements**:
- Average conversation: ~5-20 KB
- Organization with 1,000 employees having 10 conversations/day: ~50-200 MB/day
- With 1-year retention: ~18-73 GB
- Plan for 3-5x overhead (indexes, replicas, assessments): ~50-350 GB
- Add buffer for growth: provision 500 GB - 1 TB

**Retention Policies**:
- Define how long conversations are kept (6 months to 2 years typical)
- Implement automated deletion of old conversations
- Balance compliance needs vs. storage costs
- Consider regulatory requirements (some violations must be retained longer)

**Backup and Recovery**:

**Backup Strategy**:
- Daily snapshots of Elasticsearch indices
- Store backups in separate location
- Test recovery process quarterly
- Document backup/restore procedures

**Disaster Recovery**:
- Have runbook for Elasticsearch failure
- Test failover to backup instance
- Maintain service level objectives (e.g., restore within 4 hours)

### Security Considerations

**Proxy Security**:
- Nexus Proxy has access to all AI conversations (highly sensitive)
- Limit physical and network access to proxy servers
- Use strong authentication for proxy user accounts
- Rotate MITM certificate regularly
- Monitor for unauthorized proxy instances

**Data Security**:
- Encrypt Elasticsearch data at rest
- Use HTTPS for all Portal connections
- Implement network segmentation (Proxy, Elasticsearch, Portal on isolated segments)
- Apply principle of least privilege for all access
- Conduct regular security audits

**Compliance**:
- Document your monitoring program (why, what, how, who has access)
- Ensure compliance team members are trained on GDPR data handling
- Implement data subject access request procedures
- Maintain audit logs for regulatory inspections
- Consider privacy impact assessment (DPIA) for the monitoring system itself

### Maintenance Tasks

**Daily**:
- Check proxy server health
- Verify Elasticsearch is running and responsive
- Monitor storage capacity
- Review error logs for anomalies

**Weekly**:
- Review performance metrics
- Check certificate expiration dates
- Verify backups are running successfully
- Review and investigate any user reports of issues

**Monthly**:
- Analyze conversation volume trends
- Review storage capacity and retention policies
- Update user accounts (add/remove users)
- Review and update documentation
- Check for Nexus system updates

**Quarterly**:
- Test disaster recovery procedures
- Security audit and vulnerability scanning
- Review system architecture for optimization opportunities
- Update monitoring and alerting rules

---

## Understanding the AI Risk Assessment System

This section provides deeper insight into how Nexus analyzes conversations for compliance violations.

### Multi-Agent Architecture

Nexus uses four specialized AI agents powered by Claude Sonnet 4, orchestrated by an n8n workflow:

**Stage 1: Parallel Specialist Analysis (3 Agents)**

Three agents analyze the conversation simultaneously, each focusing on specific compliance areas:

**1. Critical Risk Violation Detector (EU AI Act - Prohibited Practices)**

Focus: Identifies completely forbidden AI uses under Article 5 of the EU AI Act

What it looks for:
- Social scoring systems by authorities
- Real-time biometric identification in public spaces
- Biometric categorization of sensitive attributes (race, political views, sexual orientation)
- Emotion recognition in workplaces/education
- Manipulative AI targeting vulnerable groups (children, elderly, disabled)
- Subliminal manipulation techniques

Output: Boolean violation detection, confidence level, reasoning

**2. High Risk Violation Detector (EU AI Act - High-Risk Systems)**

Focus: Identifies high-risk AI systems requiring strict compliance measures

What it looks for:
- Biometric identification and verification systems
- Critical infrastructure management (power, water, transport)
- Education and training tools (admissions, grading)
- Employment and HR systems (hiring, evaluation, termination)
- Essential services (credit scoring, benefit eligibility, emergency dispatch)
- Law enforcement tools (risk assessment, evidence analysis)
- Migration and border control systems
- Justice system support

Compliance gap detection:
- Does user show awareness of risk assessment requirements?
- Are data quality standards mentioned?
- Is human oversight discussed?
- Are transparency obligations understood?

Output: Violation detection, confidence level, specific system type, compliance gaps

**3. GDPR Violation Detector (Data Protection)**

Focus: Identifies personal data handling violations

What it looks for:

*Personal Data Categories*:
- Direct identifiers (names, emails, phone numbers, addresses)
- Special category data (health, biometric, racial/ethnic, political, religious, sexual orientation)
- Children's data (under 16 years old)

*Violation Types*:
- Unlawful disclosure (sharing personal data without legal basis)
- Excessive collection ("collect everything" approach)
- Security gaps (unencrypted storage, credential sharing)
- Missing consent or legal basis
- Rights violations (refusing deletion, blocking access)
- Unlawful cross-border transfers
- Lack of accountability (no DPIA, no ROPA)

Analysis factors:
- Is actual personal data present in the conversation? (active breach)
- Does user describe violating GDPR in their practices?
- Is special category or children's data involved? (highest severity)
- Is the user asking how to comply vs. actively violating?

Output: GDPR violation detection, confidence, data type, violation type, severity

**Stage 2: Final Synthesis (1 Agent)**

**4. Final Aggregator Agent**

Focus: Synthesizes all findings into a coherent assessment

Responsibilities:
- Eliminate false positives (distinguish asking about compliance vs. actually violating)
- Identify the most serious violation (prohibited > special category data > high-risk > transparency)
- Consider deployment status (deployed systems = urgent; planning = preventable)
- Assess user intent (malicious > negligent > uninformed > educational > compliant)
- Resolve conflicts if agents disagree
- Assign overall risk level

Risk Level Determination:

**CRITICAL**:
- Prohibited AI practices detected with high confidence, OR
- Special category personal data breach, OR
- Deployed non-compliant high-risk AI system causing harm

**HIGH**:
- High-risk AI system in development without compliance framework, OR
- Multiple significant transparency violations, OR
- Substantial GDPR gaps in active systems

**MEDIUM**:
- High-risk AI in planning phase with some compliance awareness, OR
- Minor violations without immediate harm, OR
- Compliance questions about existing systems

**LOW**:
- Educational inquiry about compliance, OR
- No violations detected, OR
- Demonstrably compliant approach

Output: Overall risk level, primary violation, confidence level, summary, agent findings, user intent

### False Positive Prevention

The system is specifically designed to avoid flagging legitimate compliance questions:

**Distinguishes Between**:

✅ **Educational (Not a Violation)**:
- "What are the requirements for deploying a high-risk AI system?"
- "How do I conduct a GDPR DPIA?"
- "What counts as special category data?"

❌ **Actual Violation**:
- "I'm using AI to screen job applicants. Here's how my system works..."
- "I collected employee health data and stored it in this spreadsheet..."
- "We're using facial recognition to track employee attendance..."

**How It Works**:
- Agents analyze context and verb tenses (asking vs. doing)
- User intent is explicitly assessed
- Confidence levels reflect certainty
- Summary explains the reasoning
- False positives are expected to be rare (<5% of assessments)

### Typical Assessment Results

**Example 1: Educational Inquiry**

*User asks*: "What are GDPR requirements for data retention?"

*Assessment*:
- Risk Level: LOW
- Confidence: HIGH
- Primary Violation: None detected
- User Intent: Educational
- Summary: User is asking about compliance requirements, not violating them

**Example 2: Actual GDPR Violation**

*User asks*: "Analyze this customer database: John Smith, john@example.com, diabetic, 65 years old..."

*Assessment*:
- Risk Level: CRITICAL
- Confidence: HIGH
- Primary Violation: GDPR - Special category data disclosure (health information)
- User Intent: Negligent or uninformed
- Summary: User shared actual special category personal data (health condition) in the conversation, constituting a data breach

**Example 3: High-Risk AI System**

*User asks*: "Help me build an AI system to screen job applicants based on their resumes"

*Assessment*:
- Risk Level: HIGH
- Confidence: MEDIUM
- Primary Violation: EU AI Act - High-risk AI system (employment) without compliance awareness
- User Intent: Uninformed
- Summary: User is developing a high-risk AI system for employment decisions but shows no awareness of compliance obligations

---

## Compliance Frameworks Monitored

### EU AI Act Overview

The **EU AI Act** (Regulation 2024/1689) is the world's first comprehensive AI regulation, establishing a risk-based framework for AI systems in the European Union.

**Why It Matters**:
- Applies to all AI systems placed on the EU market or used in the EU
- Fines up to €35 million or 7% of global annual turnover
- Enforceable from 2025-2027 (phased implementation)

**What Nexus Monitors**:

**Prohibited AI Practices (Article 5)** – Completely forbidden uses:
- Social scoring by public authorities
- Real-time biometric identification in public spaces (limited exceptions)
- Biometric categorization inferring sensitive attributes
- Emotion recognition in workplace/education (limited exceptions)
- Exploiting vulnerabilities of specific groups
- Subliminal manipulation

**High-Risk AI Systems (Annex III)** – Allowed but strictly regulated:
- Biometrics
- Critical infrastructure
- Education and training
- Employment and HR
- Essential public and private services
- Law enforcement
- Migration and border control
- Justice systems

**Compliance Requirements for High-Risk AI**:
- Risk management system
- Data quality and governance
- Technical documentation
- Record-keeping and logging
- Transparency to users
- Human oversight
- Accuracy, robustness, cybersecurity
- Conformity assessment
- Registration in EU database

### GDPR Overview

The **General Data Protection Regulation** (GDPR) is the EU's comprehensive data protection law, regulating personal data processing.

**Why It Matters**:
- Applies to any processing of personal data of EU residents
- Fines up to €20 million or 4% of global annual turnover
- Enforceable since 2018, actively enforced

**What Nexus Monitors**:

**Personal Data Protection**:
- Lawful basis required for all processing (consent, contract, legal obligation, vital interests, public task, legitimate interest)
- Data minimization (collect only what's necessary)
- Purpose limitation (use only for stated purposes)
- Storage limitation (keep only as long as needed)
- Security measures (encryption, access controls, etc.)

**Special Category Data (Article 9)** – Extra sensitive, requires explicit consent or specific legal basis:
- Health data
- Biometric data for identification
- Racial or ethnic origin
- Political opinions
- Religious or philosophical beliefs
- Trade union membership
- Sexual orientation

**Individual Rights**:
- Right to access (receive copy of your data)
- Right to rectification (correct inaccurate data)
- Right to erasure ("right to be forgotten")
- Right to data portability
- Right to object to processing
- Rights related to automated decision-making

**Why Sharing Data with ChatGPT Is Risky**:
- OpenAI is a US company (cross-border data transfer)
- Data may be used for AI training (repurposing)
- No specific consent from data subjects for this use
- Difficult to delete data once shared
- Loss of control over personal data

---

## Common Use Cases and Scenarios

### Scenario 1: Employee Shares Customer Data

**Situation**: Marketing employee copies customer list into ChatGPT asking for email campaign ideas

**What Happens**:
1. Nexus Proxy captures the conversation with customer names and emails
2. Compliance team syncs and sees the new conversation
3. Preview shows personal data is present
4. Compliance triggers risk assessment
5. GDPR agent detects direct identifiers (names, emails) without legal basis
6. Assessment returns: CRITICAL risk, GDPR violation, unlawful disclosure
7. Compliance contacts employee immediately
8. Employee is trained on GDPR, reminded not to share personal data
9. Incident is documented for regulators
10. Organization may need to notify affected customers depending on risk

**Lesson**: Never copy personal data into AI systems without proper legal basis and safeguards

### Scenario 2: HR Building Hiring Tool

**Situation**: HR staff member asks ChatGPT to help build an AI system to rank job applicants

**What Happens**:
1. Conversation captured: "Help me create an AI model to screen resumes and rank candidates"
2. Compliance reviews and triggers assessment
3. High Risk agent identifies this as a high-risk AI system (employment)
4. Agent checks if user mentions compliance requirements – none found
5. Assessment returns: HIGH risk, AI Act high-risk system without compliance awareness
6. Compliance contacts HR to explain requirements:
   - Risk management system needed
   - Data quality standards
   - Human oversight required
   - Bias testing and monitoring
   - Registration with authorities
   - Transparency to applicants
7. HR either abandons the project or works with compliance to implement proper safeguards

**Lesson**: High-risk AI systems require compliance frameworks before development/deployment

### Scenario 3: Employee Asking About Compliance

**Situation**: Employee asks "What are the GDPR requirements for collecting customer consent?"

**What Happens**:
1. Conversation captured
2. Compliance reviews and triggers assessment
3. All agents analyze: no personal data, no violations described, user is asking educational question
4. Assessment returns: LOW risk, no violations, user intent = educational
5. No action needed, conversation demonstrates good compliance awareness
6. May be used as positive example in training

**Lesson**: Asking about compliance is encouraged and will not be flagged as a violation

### Scenario 4: Pattern of Risky Behavior

**Situation**: Same user has 5 conversations flagged as MEDIUM risk over 2 weeks

**What Happens**:
1. Compliance filters by username and reviews pattern
2. Notices user repeatedly asking about using AI for sensitive decisions
3. Individual conversations are MEDIUM but pattern suggests higher concern
4. Compliance contacts user for one-on-one training
5. User is flagged for closer monitoring for next 30 days
6. Additional training provided to user's entire team
7. Pattern documented for management review

**Lesson**: Repeated moderate concerns can indicate need for intervention even if individual conversations aren't severe

### Scenario 5: False Positive

**Situation**: Developer asks "How would a social credit system work, theoretically?" for a research project

**What Happens**:
1. Critical Risk agent flags "social credit system" as prohibited practice
2. Assessment returns: MEDIUM risk (not CRITICAL because context suggests theoretical inquiry)
3. User intent marked as "educational" or "uninformed"
4. Confidence marked as MEDIUM due to ambiguity
5. Compliance reviews manually
6. Determines this is a false positive (research question, not actual deployment)
7. No action taken, but conversation noted in case of future similar inquiries

**Lesson**: System is designed to err on side of caution. Compliance teams provide human judgment for ambiguous cases.

---

## Best Practices Summary

### For End Users

1. **Assume everything is monitored** – Because it is
2. **Never share personal data** – Customer names, emails, employee records, etc.
3. **Ask about compliance** – Educational questions are encouraged
4. **Consult before high-risk uses** – Hiring, lending, critical decisions
5. **Anonymize examples** – Use "a customer" not "John Smith"

### For Compliance Teams

1. **Sync regularly** – Start each session with fresh data
2. **Prioritize by risk** – CRITICAL immediately, HIGH within 24 hours
3. **Document everything** – All reviews, contacts, actions taken
4. **Educate, don't just punish** – Most violations are from lack of awareness
5. **Look for patterns** – Individual incidents + trends = full picture

### For Administrators

1. **Monitor system health** – Daily checks on proxy, Elasticsearch, Portal
2. **Plan for scale** – Conversation volume grows, ensure infrastructure keeps up
3. **Maintain security** – Nexus has access to sensitive data, protect accordingly
4. **Document procedures** – Runbooks for common issues and emergencies
5. **Keep stakeholders informed** – Regular reports on system status and metrics

---

## Frequently Asked Questions

### General Questions

**Q: Is Nexus legal?**

A: Yes. Organizations have legitimate interests in monitoring AI usage for compliance, security, and risk management. Employees should be notified of monitoring (typically via policy). The monitoring itself must comply with GDPR (appropriate security, limited retention, etc.).

**Q: Can employees opt out?**

A: No. If using corporate devices/networks for work purposes, monitoring is mandatory. Personal use on personal devices outside work is not monitored.

**Q: What if an employee uses ChatGPT on their phone?**

A: If using personal device on personal network (cellular data), not monitored. If using corporate Wi-Fi with proxy configured, monitored. Work-related AI usage should go through monitored channels.

**Q: How long is data kept?**

A: Typically 6 months to 2 years depending on organizational policy and regulatory requirements. Some violations may be retained longer for audit purposes.

### Technical Questions

**Q: Does Nexus work with other AI services besides ChatGPT?**

A: Nexus Proxy can be configured to capture other AI services (Claude, Gemini, etc.) but the risk assessment agents are currently optimized for ChatGPT-style conversations. Additional configuration may be needed for other platforms.

**Q: What's the performance impact?**

A: Minimal. Nexus Proxy adds typically <200ms latency. Users experience no noticeable difference in AI response times.

**Q: What if Nexus Proxy goes down?**

A: Users cannot access ChatGPT until proxy is restored (conversations won't route through). This is intentional to ensure no conversations occur unmonitored. IT should have high availability setup and quick recovery procedures.

**Q: Can users see their own conversations in the Portal?**

A: Not by default. Nexus Portal is designed for compliance teams. Users can request copies of their conversations via data subject access requests to the Data Protection Officer.

### Compliance Questions

**Q: Is using ChatGPT for work automatically a violation?**

A: No. Many work uses of AI are perfectly compliant. Violations occur when:
- Personal data is shared without legal basis
- High-risk AI systems are built without proper safeguards
- Prohibited AI practices are pursued

**Q: What if I accidentally shared personal data?**

A: Contact your compliance team immediately. Depending on the sensitivity and volume, the organization may need to:
- Delete the conversation from ChatGPT (if possible)
- Assess the risk of harm
- Notify affected individuals (if required by GDPR)
- Document the incident

**Q: Can compliance teams read ALL my conversations?**

A: Yes, technically, but realistically they focus on:
- Conversations flagged by risk assessments
- Random sampling for quality assurance
- Investigations triggered by other concerns
- Conversations from users in sensitive roles

Most conversations are never individually reviewed unless they're flagged or randomly selected.

**Q: What if I disagree with a risk assessment?**

A: Contact your compliance team. The AI agents are highly accurate but not perfect. Human review can override automated assessments. Provide context and explanation for your conversation.

---

## Troubleshooting

### End Users

**Problem**: "Your connection is not private" error
- **Cause**: Certificate not installed or not trusted
- **Solution**: Install `littleproxy-mitm.pem` certificate and set to "Always Trust"

**Problem**: Repeated proxy authentication prompts
- **Cause**: Incorrect credentials or account inactive
- **Solution**: Verify username/password with IT, ensure account is active

**Problem**: ChatGPT is slow through proxy
- **Cause**: Network issues or proxy overload
- **Solution**: Check your internet connection, contact IT if affects all users

### Compliance Teams

**Problem**: No conversations appearing in Portal
- **Cause**: Haven't synced, or Nexus Proxy not capturing data
- **Solution**: Click Sync button, verify proxy is running, check Elasticsearch connectivity

**Problem**: Risk assessment fails or times out
- **Cause**: n8n workflow unavailable or agents taking too long
- **Solution**: Wait and retry, verify n8n is running, contact administrator if persistent

**Problem**: Assessment results seem wrong
- **Cause**: Ambiguous conversation, edge case, or system error
- **Solution**: Review manually, apply human judgment, report persistent issues to administrators

### Administrators

**Problem**: Elasticsearch running out of storage
- **Cause**: Too many conversations, retention period too long
- **Solution**: Implement or reduce retention period, add storage capacity, optimize indices

**Problem**: Proxy authentication failing for all users
- **Cause**: User database unreachable or configuration error
- **Solution**: Check database connection, verify authentication configuration, review logs

**Problem**: High proxy server CPU usage
- **Cause**: Too many concurrent users for server capacity
- **Solution**: Scale to multiple proxy instances with load balancing, upgrade server resources

---

## Getting Help

### For End Users

**Proxy Issues** (can't connect, certificate errors):
- Contact IT Help Desk
- Reference "Nexus Proxy"

**Compliance Questions** (what you can/can't do):
- Contact Compliance Team
- Email: [compliance@yourcompany.com]

**Your Data** (access, deletion requests):
- Contact Data Protection Officer
- Email: [dpo@yourcompany.com]

### For Compliance Teams

**Portal Issues** (not loading, sync failures):
- Contact System Administrators
- Email: [it-support@yourcompany.com]

**Assessment Questions** (interpreting results, false positives):
- Contact Nexus Development Team
- GitHub Issues: https://github.com/pragmatiqai/nexus-portal/issues
- Email: andres.gavriljuk@pragmatiqai.com

### For Administrators

**System Issues** (proxy down, Elasticsearch problems):
- Review system logs
- Check documentation and runbooks
- Contact infrastructure team

**Nexus Product Support**:
- GitHub Issues (Portal): https://github.com/pragmatiqai/nexus-portal/issues
- GitHub Issues (Proxy): https://github.com/pragmatiqai/nexus-proxy/issues
- Email: andres.gavriljuk@pragmatiqai.com

---

## Glossary

**AI Act**: European Union Regulation 2024/1689 on artificial intelligence

**ChatGPT**: OpenAI's conversational AI system, primary target of Nexus monitoring

**Compliance Team**: Staff responsible for monitoring AI usage and ensuring regulatory compliance

**Conversation**: A series of related messages between a user and an AI system

**Elasticsearch**: Distributed search and analytics engine used as the central data repository

**End User**: Employee whose AI conversations are being monitored through Nexus Proxy

**GDPR**: General Data Protection Regulation, EU law on data protection

**High-Risk AI System**: AI applications requiring strict compliance under the EU AI Act (hiring, lending, critical infrastructure, etc.)

**MITM (Man-in-the-Middle)**: Proxy technique that intercepts and reads encrypted traffic

**Multi-Agent System**: Architecture using multiple specialized AI agents working in parallel

**Nexus Proxy**: System component that captures AI conversations in real-time

**Nexus Portal**: System component that displays conversations and performs risk assessment

**n8n**: Workflow automation platform orchestrating the multi-agent assessment process

**Personal Data**: Any information relating to an identified or identifiable person

**Prohibited AI Practices**: AI uses completely forbidden under EU AI Act Article 5

**Risk Assessment**: Automated analysis using four AI agents to identify compliance violations

**Risk Level**: Classification of violation severity (CRITICAL, HIGH, MEDIUM, LOW)

**Special Category Data**: Sensitive personal data under GDPR requiring extra protection (health, biometric, racial/ethnic, political, religious, sexual orientation)

**SSE (Server-Sent Events)**: Streaming technology used by ChatGPT to send responses incrementally

**Sync**: Process of pulling latest conversations from Elasticsearch into the Portal

**User Intent Assessment**: System's evaluation of why a conversation occurred (malicious, negligent, uninformed, educational, compliant)

---

**Built with ❤️ by PragmatiqAI**

*Protecting organizations from AI compliance risks*

*Last Updated: December 2025*

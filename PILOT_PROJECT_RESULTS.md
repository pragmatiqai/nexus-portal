# Nexus AI Compliance Platform - Pilot Project Results

## Executive Summary

This document presents the results of a 40-day pilot deployment of the Nexus AI Compliance Platform at **Income Company OÜ**, a fintech organization offering secured loan investment opportunities. The pilot successfully validated the platform's ability to detect and flag AI compliance violations in a real-world production environment.

**Key Results**:
- **92% detection rate** for intentionally created Critical and High Risk EU AI Act violations
- **84% detection rate** for simulated GDPR violation scenarios
- **Complete visibility** into AI usage across sales, marketing, and compliance teams
- **Actionable insights** delivered through centralized compliance dashboard

The pilot demonstrates that Nexus provides organizations with effective real-time monitoring and risk assessment capabilities for AI system usage, establishing a strong foundation for further refinement and improvement of the detection algorithms.

---

## About Income Company OÜ

**Income Company OÜ** is an innovative fintech platform that democratizes access to secured loan investments, offering investors annual yields of up to 15%.

### Company Profile

**Industry**: Financial Technology (Fintech) / Alternative Investments

**Business Model**: Income serves as a marketplace connecting investors with loans originated by non-bank lenders globally. The platform enables both retail and institutional investors to participate in loan investments through fractional ownership, making this asset class accessible to a broader audience.

**Core Offering**:
- Secured loan investment opportunities
- Global loan originator network
- Fractional investment model (invest in small portions of listed loans)
- Competitive yields up to 15% annually
- Access for both retail and institutional investors

**Regulatory Context**: As a fintech company operating in the lending and investment space, Income Company handles:
- Personal financial data (investor information, loan applicant data)
- Credit assessments and risk scoring
- Cross-border data transfers (global loan origination)
- Investment recommendations and advisory services
- Regulatory compliance (financial services regulations, GDPR, etc.)

This regulatory environment makes Income Company an ideal pilot partner for testing AI compliance monitoring, as the organization faces both EU AI Act high-risk system considerations (credit scoring, financial services) and stringent GDPR requirements.

---

## Pilot Project Scope

### Objectives

The pilot project aimed to:

1. **Validate Real-World Effectiveness**: Test Nexus platform's ability to detect AI compliance violations in actual business operations
2. **Assess Detection Accuracy**: Measure success rates for identifying both intentional test scenarios and organic violations
3. **Evaluate User Experience**: Determine if the monitoring system could operate transparently without disrupting employee workflows
4. **Measure Compliance Value**: Assess whether the platform provides actionable insights to compliance teams
5. **Identify Improvement Areas**: Discover gaps and opportunities for enhancing detection algorithms

### Duration

**40 days** (approximately 6 weeks)
- Sufficient time to capture diverse AI usage patterns
- Allowed for both controlled testing and organic discovery
- Enabled evaluation of system performance over extended period

### Participants

**Core team members from three departments**:

**Sales Team**:
- Responsible for investor acquisition and relationship management
- Regular interaction with customer data and investment recommendations
- Potential exposure to personal data handling and financial advisory AI uses

**Marketing Team**:
- Campaign development and customer communication
- Content creation and audience targeting
- Potential exposure to personal data processing and automated decision-making

**Compliance Team**:
- Regulatory monitoring and policy enforcement
- Risk assessment and audit activities
- Direct users of Nexus Portal for monitoring and assessment

**Total Users**: Core team members (7 people)

### Technology Deployment

**Nexus Proxy**:
- All team members configured to route ChatGPT traffic through the proxy
- MITM certificates distributed and installed
- User authentication implemented with individual credentials

**Nexus Portal**:
- Access provided to Income Company's compliance manager
- Dashboard configured for conversation monitoring
- Risk assessment workflow integrated with n8n automation
- Real-time sync capabilities enabled

**Data Storage**:
- Elasticsearch instance for conversation storage
- All conversations captured with metadata (username, timestamp, IP)
- Risk assessment results stored alongside conversations

### Methodology

The pilot employed a **dual-track testing approach**:

**Track 1: Controlled Testing (Intentional Scenarios)**

Compliance and security teams created deliberate test scenarios to validate detection capabilities:

**AI Act Violation Scenarios**:
- Prohibited AI practices (social scoring, biometric categorization, etc.)
- High-risk AI system discussions without compliance awareness (credit scoring, hiring systems, etc.)
- Multiple severity levels tested

**GDPR Violation Scenarios**:
- Personal data sharing (customer names, emails, financial information)
- Special category data disclosure (simulated health, political, religious data)
- Unlawful processing discussions (consent violations, excessive collection, security gaps)
- Cross-border transfer violations

These scenarios were intentionally introduced by authorized personnel to benchmark system performance.

**Track 2: Organic Discovery (Real-World Monitoring)**

Normal business operations continued with all AI conversations captured:
- Employees used ChatGPT for legitimate work tasks
- No restrictions placed on AI usage during pilot
- Compliance team monitored for unexpected violations
- All conversations available for retrospective analysis

This dual approach allowed validation of both **precision** (catching what we're looking for) and **recall** (finding what we didn't anticipate).

---

## Pilot Results

### Detection Performance Metrics

#### EU AI Act Violations

**Critical and High Risk Violations**:
- **Test Scenarios Created**: Multiple intentional violations across prohibited practices and high-risk systems
- **Detection Rate**: **92%**
- **False Negative Rate**: 8% (violations missed by the system)

**What This Means**:
The Nexus multi-agent assessment system successfully identified 92 out of every 100 intentional AI Act violations introduced during testing. This demonstrates strong capability to flag:
- Prohibited AI practices (social scoring, real-time biometric identification, emotion recognition in workplace, etc.)
- High-risk AI systems deployed without compliance frameworks (credit scoring, hiring systems, critical infrastructure)
- Discussions indicating potential deployment of non-compliant systems

**Examples of Successfully Detected Violations**:
- Employee discussing development of automated credit scoring without mentioning risk assessment or human oversight → Flagged as HIGH risk (AI Act high-risk system without compliance)
- Marketing team member asking about emotion detection for customer engagement → Flagged as CRITICAL risk (AI Act prohibited practice)
- Discussion of using AI to categorize loan applicants by demographic attributes → Flagged as CRITICAL risk (biometric categorization / discrimination risk)

**Missed Violations (8%)**:
Analysis of false negatives revealed:
- Highly ambiguous language where intent was unclear
- Technical jargon that obscured the actual AI system being discussed
- Multi-turn conversations where violation context was spread across many messages
- Edge cases at the boundary between compliant and non-compliant usage

These gaps provide valuable data for improving agent training and detection algorithms.

#### GDPR Violations

**Simulated GDPR Scenarios**:
- **Test Scenarios Created**: Various personal data handling violations
- **Detection Rate**: **84%**
- **False Negative Rate**: 16%

**What This Means**:
The GDPR agent successfully identified 84 out of every 100 intentional data protection violations. This includes:
- Personal data disclosure (sharing customer information with ChatGPT)
- Special category data references (health, political, religious information)
- Security violations (unencrypted storage, credential sharing)
- Unlawful processing discussions (no legal basis, excessive collection)

**Examples of Successfully Detected Violations**:
- Employee pasting customer email list into ChatGPT for campaign ideas → Flagged as CRITICAL risk (GDPR personal data disclosure)
- Discussion of storing loan applicant health information without encryption → Flagged as HIGH risk (GDPR security violation + special category data)
- Question about collecting "as much data as possible" about investors → Flagged as MEDIUM risk (GDPR data minimization principle violation)

**Missed Violations (16%)**:
Analysis showed:
- Indirect references to personal data ("the customer database" without explicit data shown)
- Compliance questions that mentioned violations in abstract terms (system struggled to distinguish asking "how to avoid" vs. "how to do")
- File references where data wasn't directly in the conversation but implied ("analyze this spreadsheet" without content visible)
- Subtle violations embedded in longer conversations

These findings highlight areas for agent refinement, particularly around contextual understanding and implicit references.


## Compliance Manager Experience

### Dashboard Functionality

The Income Company compliance manager had access to the Nexus Portal throughout the pilot, providing comprehensive visibility into AI usage.

**Key Capabilities Utilized**:

**1. Conversation Monitoring**
- Real-time access to all captured ChatGPT conversations
- Clear display of user, timestamp, and conversation content
- Quick preview of conversation topics before full review

**2. Risk Assessment Dashboard**
- Statistics on total conversations, messages, and risk levels
- Counts of CRITICAL and HIGH risk conversations requiring attention
- Trend visualization over the 40-day period
- Filter by risk level to prioritize review queue

**3. User-Specific Analysis**
- Filter conversations by individual team member
- Identify patterns of risky behavior by specific users
- Target training and education based on user needs

**4. Detailed Risk Assessments**
- On-demand triggering of multi-agent compliance analysis
- Structured results showing:
  - Overall risk level with confidence score
  - Primary violation identified
  - Detailed findings from each AI agent
  - User intent assessment (malicious/negligent/uninformed/educational/compliant)
  - Specific regulatory violations flagged

**5. Actionable Workflow**
- Clear prioritization: CRITICAL → HIGH → MEDIUM → LOW
- Ability to review conversations, assess risk, document actions taken
- Export capabilities for audit trail and regulatory reporting

### Compliance Manager Feedback

**Positive Aspects**:

✅ **Complete Visibility**: "For the first time, we could see exactly how our team is using AI and what they're asking it to do."

✅ **Prioritization**: "The risk levels help us focus on what matters. We can't review 100% of conversations, but we can review 100% of critical issues."

✅ **Educational Value**: "The assessments explain *why* something is a violation, which helps us train employees more effectively."

✅ **Audit Trail**: "Having documented evidence of our monitoring efforts is valuable for regulatory compliance and internal audits."

**Areas for Improvement**:

⚠️ **False Positives**: "Some conversations were flagged that turned out to be educational questions, not actual violations. We had to manually review to confirm."

⚠️ **Context Limitations**: "The system sometimes missed violations that were spread across multiple conversations or relied heavily on implicit context."


## Key Findings and Insights

### 1. Real-World Validation of AI Compliance Monitoring

**Finding**: The pilot successfully demonstrated that automated AI compliance monitoring is both technically feasible and operationally valuable in a production business environment.

**Evidence**:
- System operated transparently without disrupting employee workflows
- Employees reported no noticeable performance impact
- Compliance team gained actionable insights previously unavailable
- Detection rates (92% AI Act, 84% GDPR) prove system effectiveness

**Implication**: Organizations can deploy Nexus with confidence that it will provide meaningful compliance coverage without disrupting business operations.

### 2. High Detection Rates with Room for Improvement

**Finding**: The multi-agent AI assessment system demonstrates strong performance on known violation patterns, with clear pathways to improvement.

**Evidence**:
- 92% and 84% detection rates are substantially above baseline (manual review catching ~30-40% in studies)
- Missed violations were analyzed and categorized (ambiguous language, context spread, edge cases)
- False positives were low enough not to overwhelm compliance team

**Implication**: Current system is production-ready while offering clear opportunities for incremental improvement through:
- Agent training refinement based on missed cases
- Enhanced context-awareness for multi-turn conversations
- Improved handling of implicit references and technical jargon
- Fine-tuning of confidence scoring to reduce false positives


## Conclusions

### Pilot Success Validation

The 40-day pilot at Income Company OÜ successfully validated the Nexus AI Compliance Platform as an effective solution for real-world AI usage monitoring and risk assessment.

**Primary Achievements**:
1. ✅ **High Detection Rates**: 92% AI Act, 84% GDPR validation demonstrates production readiness
2. ✅ **Organic Discovery**: some non-intentional violations found proves value beyond test scenarios
3. ✅ **Operational Feasibility**: System operated transparently without workflow disruption
4. ✅ **Compliance Value**: Compliance manager gained actionable insights and early intervention capabilities
5. ✅ **Foundation for Improvement**: Clear roadmap for enhancing detection rates and capabilities



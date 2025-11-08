import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MessageCard from './MessageCard';
import './ConversationDetail.css';

function ConversationDetail({ conversationId, onBack }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messagesExpanded, setMessagesExpanded] = useState(true);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessmentSuccess, setAssessmentSuccess] = useState(false);
  const [conversationData, setConversationData] = useState(null);
  const [riskAssessmentExpanded, setRiskAssessmentExpanded] = useState(true);

  useEffect(() => {
    fetchConversationMessages();
    fetchConversationData();
  }, [conversationId]);

  const fetchConversationMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/messages/conversations/${conversationId}`);
      setMessages(response.data.messages);
    } catch (err) {
      console.error('Error fetching conversation messages:', err);
      setError('Failed to load conversation messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationData = async () => {
    try {
      const response = await axios.get(`/api/messages/conversations?size=1000`);
      const conversation = response.data.conversations.find(c => c.conversationId === conversationId);
      if (conversation) {
        setConversationData(conversation);
      }
    } catch (err) {
      console.error('Error fetching conversation data:', err);
    }
  };

  const handleRiskAssessment = async () => {
    setAssessmentLoading(true);
    setAssessmentSuccess(false);
    setError(null);

    try {
      console.log('=== Starting Risk Assessment ===');
      console.log('Conversation ID:', conversationId);
      console.log('Number of messages:', messages.length);

      // Build the conversation string with all messages
      const conversationText = messages.map((msg, index) => {
        const userPart = `User: ${msg.userQuestion || ''}`;
        const aiPart = `AI: ${msg.parsedResponse || ''}`;
        return `${userPart}\n${aiPart}`;
      }).join('\n\n');

      console.log('Conversation text length:', conversationText.length, 'characters');
      console.log('Sending to n8n webhook...');

      // Send to n8n webhook and get risk assessment response
      // Increase timeout to 3 minutes to handle long-running workflows
      const webhookResponse = await axios.post(
        'https://bonsay.app.n8n.cloud/webhook/f435d3c2-458e-44ea-84a7-94373998d6aa',
        {
          conversationId: conversationId,
          messages: conversationText
        },
        {
          timeout: 180000 // 3 minutes timeout
        }
      );

      console.log('=== n8n Webhook Response ===');
      console.log('Full response object:', webhookResponse);
      console.log('Status:', webhookResponse.status);
      console.log('Status text:', webhookResponse.statusText);
      console.log('Headers:', webhookResponse.headers);
      console.log('Response data type:', typeof webhookResponse.data);
      console.log('Response data is array?:', Array.isArray(webhookResponse.data));
      console.log('Response data is null?:', webhookResponse.data === null);
      console.log('Response data is undefined?:', webhookResponse.data === undefined);

      // Try to stringify and log the data
      try {
        console.log('Response data (stringified):', JSON.stringify(webhookResponse.data, null, 2));
      } catch (e) {
        console.log('Could not stringify response data:', e.message);
        console.log('Response data (raw):', webhookResponse.data);
      }

      if (webhookResponse.data) {
        console.log('Response data keys:', Object.keys(webhookResponse.data));
      }

      // Extract risk assessment data from response
      // n8n might return the data directly, or wrapped in an array, or nested
      let riskAssessmentData = webhookResponse.data;

      // If response is an array, take the first element
      if (Array.isArray(riskAssessmentData)) {
        console.log('Response is array with length:', riskAssessmentData.length);
        console.log('Array contents:', riskAssessmentData);
        if (riskAssessmentData.length > 0) {
          riskAssessmentData = riskAssessmentData[0];
          console.log('Taking first element:', riskAssessmentData);
        } else {
          console.warn('Array is empty!');
        }
      }

      // Check if data is nested in a property
      if (riskAssessmentData && typeof riskAssessmentData === 'object') {
        console.log('Checking for overall_risk_level in data...');
        console.log('Has overall_risk_level?:', 'overall_risk_level' in riskAssessmentData);

        if (!riskAssessmentData.overall_risk_level) {
          console.log('overall_risk_level not at root, checking nested properties...');
          console.log('Available properties:', Object.keys(riskAssessmentData));

          // Check common nesting patterns (n8n often wraps in "output")
          if (riskAssessmentData.output) {
            console.log('Found data.output, extracting...');
            riskAssessmentData = riskAssessmentData.output;
          } else if (riskAssessmentData.data) {
            console.log('Found data.data, extracting...');
            riskAssessmentData = riskAssessmentData.data;
          } else if (riskAssessmentData.result) {
            console.log('Found data.result, extracting...');
            riskAssessmentData = riskAssessmentData.result;
          } else if (riskAssessmentData.assessment) {
            console.log('Found data.assessment, extracting...');
            riskAssessmentData = riskAssessmentData.assessment;
          } else if (riskAssessmentData.body) {
            console.log('Found data.body, extracting...');
            riskAssessmentData = riskAssessmentData.body;
          } else if (riskAssessmentData.json) {
            console.log('Found data.json, extracting...');
            riskAssessmentData = riskAssessmentData.json;
          }
        }
      }

      console.log('Extracted risk assessment data:', riskAssessmentData);
      console.log('Extracted data type:', typeof riskAssessmentData);

      if (riskAssessmentData && typeof riskAssessmentData === 'object') {
        console.log('Extracted data keys:', Object.keys(riskAssessmentData));
      }

      // Validate response has required fields
      if (!riskAssessmentData || typeof riskAssessmentData !== 'object' || !riskAssessmentData.overall_risk_level) {
        console.error('=== Validation Failed ===');
        console.error('riskAssessmentData is null/undefined?:', !riskAssessmentData);
        console.error('riskAssessmentData type:', typeof riskAssessmentData);
        console.error('Has overall_risk_level?:', riskAssessmentData?.overall_risk_level);
        console.error('Available fields:', riskAssessmentData ? Object.keys(riskAssessmentData) : 'N/A');
        console.error('Full data structure:', riskAssessmentData);
        console.error('Original webhook response data:', webhookResponse.data);

        // Create a detailed error message
        const errorDetails = {
          responseStatus: webhookResponse.status,
          responseType: typeof webhookResponse.data,
          isArray: Array.isArray(webhookResponse.data),
          availableFields: riskAssessmentData ? Object.keys(riskAssessmentData) : [],
          data: webhookResponse.data
        };

        console.error('Error details for debugging:', JSON.stringify(errorDetails, null, 2));

        throw new Error(`Invalid response from risk assessment service. Check console for details. Response type: ${typeof webhookResponse.data}`);
      }

      console.log('Validation passed! Risk level:', riskAssessmentData.overall_risk_level);
      console.log('Storing risk assessment in backend...');

      // Store the risk assessment response in our backend
      const storeResponse = await axios.post(
        `/api/messages/conversations/${conversationId}/risk-assessment`,
        riskAssessmentData
      );

      console.log('Backend storage response:', storeResponse.data);
      console.log('Refreshing conversation data...');

      // Refresh conversation data to show the updated risk assessment
      await fetchConversationData();

      console.log('=== Risk Assessment Completed Successfully ===');

      setAssessmentSuccess(true);
      setTimeout(() => setAssessmentSuccess(false), 5000); // Hide success message after 5 seconds
    } catch (err) {
      console.error('=== Risk Assessment Error ===');
      console.error('Error type:', err.name);
      console.error('Error message:', err.message);

      if (err.code === 'ECONNABORTED') {
        console.error('Request timed out after 3 minutes');
        setError('Risk assessment timed out. The workflow may still be processing.');
      } else if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
        setError(`Risk assessment failed: ${err.response.data?.message || err.response.statusText}`);
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('No response from risk assessment service. Please check your connection.');
      } else {
        console.error('Full error:', err);
        setError(`Failed to trigger risk assessment: ${err.message}`);
      }
    } finally {
      setAssessmentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="conversation-detail">
        <button className="back-btn" onClick={onBack}>← Back to Conversations</button>
        <div className="loading">Loading conversation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="conversation-detail">
        <button className="back-btn" onClick={onBack}>← Back to Conversations</button>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="conversation-detail">
      {/* Loading Modal */}
      {assessmentLoading && (
        <div className="loading-modal-overlay">
          <div className="loading-modal">
            <div className="spinner-container">
              <div className="spinner"></div>
              <div className="spinner-glow"></div>
            </div>
            <h3>Analyzing Conversation</h3>
            <p>AI agents are evaluating this conversation for compliance risks...</p>
            <div className="loading-steps">
              <div className="loading-step">
                <div className="step-icon">🔍</div>
                <span>Analyzing AI Act compliance</span>
              </div>
              <div className="loading-step">
                <div className="step-icon">⚖️</div>
                <span>Checking GDPR violations</span>
              </div>
              <div className="loading-step">
                <div className="step-icon">🛡️</div>
                <span>Assessing risk levels</span>
              </div>
            </div>
            <small className="loading-note">This may take 1-2 minutes...</small>
          </div>
        </div>
      )}

      <div className="conversation-detail-header">
        <div className="header-top">
          <button className="back-btn" onClick={onBack}>← Back to Conversations</button>
          <button
            className="risk-assessment-btn"
            onClick={handleRiskAssessment}
            disabled={assessmentLoading || messages.length === 0}
          >
            {assessmentLoading ? 'Processing...' : 'AI Risk Assessment'}
          </button>
        </div>

        {assessmentSuccess && (
          <div className="success-message">
            ✓ Risk assessment completed successfully
          </div>
        )}

        <div className="conversation-info">
          <div className="conversation-header-with-badge">
            <h2>Conversation Messages</h2>
            {conversationData?.riskAssessment && (
              <span className={`risk-badge risk-badge-${conversationData.riskAssessment.overall_risk_level?.toLowerCase()}`}>
                {conversationData.riskAssessment.overall_risk_level} RISK
              </span>
            )}
          </div>
          <div className="conversation-meta-info">
            <span className="meta-item">
              <strong>Conversation ID:</strong> {conversationId}
            </span>
            <span className="meta-item">
              <strong>Messages:</strong> {messages.length}
            </span>
            {messages.length > 0 && (
              <span className="meta-item">
                <strong>User:</strong> {messages[0].username}
              </span>
            )}
          </div>
        </div>
      </div>

      {conversationData?.riskAssessment && (
        <div className="risk-assessment-section">
          <div className="risk-assessment-header" onClick={() => setRiskAssessmentExpanded(!riskAssessmentExpanded)}>
            <h3>Risk Assessment</h3>
            <button className="collapse-btn">
              {riskAssessmentExpanded ? '−' : '+'}
            </button>
          </div>

          {riskAssessmentExpanded && (
            <div className="risk-assessment-container">
              <div className="risk-overview">
                <div className={`risk-level risk-level-${conversationData.riskAssessment.overall_risk_level?.toLowerCase()}`}>
                  <strong>Risk Level:</strong> {conversationData.riskAssessment.overall_risk_level}
                </div>
                <div className="confidence-level">
                  <strong>Confidence:</strong> {conversationData.riskAssessment.confidence_level}
                </div>
              </div>

              {conversationData.riskAssessment.summary && (
                <div className="risk-section">
                  <h4>Summary</h4>
                  <p>{conversationData.riskAssessment.summary}</p>
                </div>
              )}

              {conversationData.riskAssessment.primary_violation && (
                <div className="risk-section">
                  <h4>Primary Violation</h4>
                  <p>{conversationData.riskAssessment.primary_violation}</p>
                </div>
              )}

              {conversationData.riskAssessment.violations_detected && (
                <div className="risk-section">
                  <h4>Violations Detected</h4>
                  <div className="violations-grid">
                    <div className="violation-item">
                      <strong>AI Act Prohibited:</strong> {conversationData.riskAssessment.violations_detected.ai_act_prohibited}
                    </div>
                    <div className="violation-item">
                      <strong>AI Act High Risk:</strong> {conversationData.riskAssessment.violations_detected.ai_act_high_risk}
                    </div>
                    <div className="violation-item">
                      <strong>GDPR:</strong> {conversationData.riskAssessment.violations_detected.gdpr}
                    </div>
                  </div>
                </div>
              )}

              {conversationData.riskAssessment.agent_findings && (
                <div className="risk-section">
                  <h4>Agent Findings</h4>
                  {conversationData.riskAssessment.agent_findings.critical_ai && (
                    <div className="finding-item">
                      <strong>Critical AI:</strong>
                      <p>{conversationData.riskAssessment.agent_findings.critical_ai}</p>
                    </div>
                  )}
                  {conversationData.riskAssessment.agent_findings.high_risk_ai && (
                    <div className="finding-item">
                      <strong>High Risk AI:</strong>
                      <p>{conversationData.riskAssessment.agent_findings.high_risk_ai}</p>
                    </div>
                  )}
                  {conversationData.riskAssessment.agent_findings.gdpr && (
                    <div className="finding-item">
                      <strong>GDPR:</strong>
                      <p>{conversationData.riskAssessment.agent_findings.gdpr}</p>
                    </div>
                  )}
                </div>
              )}

              {conversationData.riskAssessment.assessmentDate && (
                <div className="assessment-date">
                  <small>Assessed: {new Date(conversationData.riskAssessment.assessmentDate).toLocaleString()}</small>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="messages-section">
        <div className="messages-header" onClick={() => setMessagesExpanded(!messagesExpanded)}>
          <h3>Messages</h3>
          <button className="collapse-btn">
            {messagesExpanded ? '−' : '+'}
          </button>
        </div>

        {messagesExpanded && (
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="empty-state">No messages found in this conversation.</div>
            ) : (
              messages.map((message, index) => (
                <MessageCard key={message.id} message={message} messageNumber={index + 1} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ConversationDetail;

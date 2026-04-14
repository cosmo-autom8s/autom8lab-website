const { runHardAiIntegrations } = require('../lib/hard-ai-integrations');

const ALLOWED_AI_EXPERIENCE = ['Beginner', 'Intermediate', 'Advanced'];

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  var body = req.body || {};
  var firstName = (body.first_name || '').trim();
  var email = (body.email || '').trim();
  var aiExperience = (body.ai_experience || '').trim();
  var whyJoining = (body.why_joining || '').trim();
  var supportNeeded = (body.support_needed || '').trim();
  var consent = body.consent === true || body.consent === 'true' || body.consent === 'on';

  var errors = {};
  if (!firstName) errors.first_name = 'First name is required';
  else if (firstName.length > 80) errors.first_name = 'First name is too long';
  if (!email) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Please enter a valid email';
  if (!aiExperience) errors.ai_experience = 'Please select your AI experience';
  else if (!ALLOWED_AI_EXPERIENCE.includes(aiExperience)) errors.ai_experience = 'Please select a valid AI experience level';
  if (whyJoining.length > 2000) errors.why_joining = 'Please keep this under 2000 characters';
  if (supportNeeded.length > 2000) errors.support_needed = 'Please keep this under 2000 characters';
  if (!consent) errors.consent = 'Please agree before submitting';

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors: errors });
  }

  var submission = {
    firstName: firstName,
    name: firstName,
    email: email,
    aiExperience: aiExperience,
    whyJoining: whyJoining,
    supportNeeded: supportNeeded,
    consent: consent,
    source: 'Website',
    status: 'Not started',
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent'] || '',
    ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '',
  };

  console.log('New 75 Hard AI signup:', submission);

  var integrationStatus = await runHardAiIntegrations(submission);
  var failedIntegrations = integrationStatus.failed || [];
  var notionResult = integrationStatus.results.find(function (result) {
    return result.name === 'notion';
  });
  var mailerLiteResult = integrationStatus.results.find(function (result) {
    return result.name === 'mailerlite';
  });

  if (failedIntegrations.length > 0) {
    console.error('75 Hard AI integration failure:', failedIntegrations);
  }

  if (notionResult && notionResult.status === 'success') {
    return res.status(200).json({
      success: true,
      message: mailerLiteResult && mailerLiteResult.status === 'success'
        ? 'You are in and the email flow has been triggered.'
        : 'You are in. If the email flow is delayed, your signup is still saved.',
      redirect_url: '/75-hard-ai-challenge/thank-you',
      notion_page_url: notionResult.pageUrl,
      mailerlite_subscriber_id: mailerLiteResult && mailerLiteResult.status === 'success' ? mailerLiteResult.subscriberId : null,
    });
  }

  if (notionResult && notionResult.status === 'failed') {
    return res.status(502).json({
      error: 'Okay, what went wrong? The signup did not go through on our side. Please try again in a minute.',
    });
  }

  if (mailerLiteResult && mailerLiteResult.status === 'success') {
    return res.status(200).json({
      success: true,
      message: 'You are in and the email flow has been triggered.',
      redirect_url: '/75-hard-ai-challenge/thank-you',
      mailerlite_subscriber_id: mailerLiteResult.subscriberId,
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Signup captured in local preview mode. Add NOTION_API_KEY to enable live Notion writes from the app.',
    preview_mode: true,
  });
};

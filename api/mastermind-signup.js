const { runMastermindIntegrations } = require('../lib/mastermind-integrations');

const ALLOWED_ROLES = ['Builder', 'Business Owner', 'Operator', 'Both'];
const ALLOWED_AI_EXPERIENCE = ['Beginner', 'Intermediate', 'Advanced'];
const ALLOWED_GOALS = ['Learn', 'Share', 'Network', 'Get feedback', 'Explore tools', 'Other'];
const ALLOWED_TIMEZONES = new Set(
  typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : []
);

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidUrl(value) {
  try {
    var url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch (error) {
    return false;
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  var body = req.body || {};
  var firstName = (body.first_name || '').trim();
  var lastName = (body.last_name || '').trim();
  var email = (body.email || '').trim();
  var website = (body.website || '').trim();
  var role = (body.role || '').trim();
  var aiExperience = (body.ai_experience || '').trim();
  var goals = Array.isArray(body.goals) ? body.goals : Array.isArray(body.main_goal) ? body.main_goal : body.goals ? [body.goals] : body.main_goal ? [body.main_goal] : [];
  goals = goals.map(function (goal) {
    return String(goal || '').trim();
  }).filter(Boolean);
  goals = Array.from(new Set(goals));
  var timezone = (body.timezone || '').trim();
  var currentProject = (body.current_project || '').trim();
  var wantsToShare = body.wants_to_share === true || body.wants_to_share === 'true' || body.wants_to_share === 'on';
  var consent = body.consent === true || body.consent === 'true' || body.consent === 'on';

  var errors = {};
  if (!firstName) errors.first_name = 'First name is required';
  else if (firstName.length > 80) errors.first_name = 'First name is too long';
  if (!lastName) errors.last_name = 'Last name is required';
  else if (lastName.length > 80) errors.last_name = 'Last name is too long';
  if (!email) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Please enter a valid email';
  if (website && !isValidUrl(website)) errors.website = 'Please enter a valid website URL';
  if (!role) errors.role = 'Please select your role';
  else if (!ALLOWED_ROLES.includes(role)) errors.role = 'Please select a valid role';
  if (!aiExperience) errors.ai_experience = 'Please select your AI experience';
  else if (!ALLOWED_AI_EXPERIENCE.includes(aiExperience)) errors.ai_experience = 'Please select a valid AI experience level';
  if (!goals.length) errors.goals = 'Please choose at least one goal';
  else if (goals.some(function (goal) { return !ALLOWED_GOALS.includes(goal); })) errors.goals = 'Please choose valid goals';
  if (!timezone) errors.timezone = 'Please select your timezone';
  else if (ALLOWED_TIMEZONES.size && !ALLOWED_TIMEZONES.has(timezone)) errors.timezone = 'Please select a valid timezone';
  if (currentProject.length > 2000) errors.current_project = 'Please keep this under 2000 characters';
  if (!consent) errors.consent = 'Please agree before submitting';

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors: errors });
  }

  var submission = {
    firstName: firstName,
    lastName: lastName,
    name: firstName + ' ' + lastName,
    email: email,
    website: website,
    roles: [role],
    aiExperience: aiExperience,
    goals: goals,
    timezone: timezone,
    currentProject: currentProject,
    wantsToShare: wantsToShare,
    consent: consent,
    source: 'Website',
    status: 'Not started',
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent'] || '',
    ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '',
  };

  console.log('New mastermind signup:', submission);

  var integrationStatus = await runMastermindIntegrations(submission);
  var failedIntegrations = integrationStatus.failed || [];
  var notionResult = integrationStatus.results.find(function (result) {
    return result.name === 'notion';
  });
  var mailerLiteResult = integrationStatus.results.find(function (result) {
    return result.name === 'mailerlite';
  });

  if (failedIntegrations.length > 0) {
    console.error('Mastermind integration failure:', failedIntegrations);
    return res.status(502).json({
      error: 'Signup could not be delivered right now. Please try again shortly.',
    });
  }

  if (notionResult && notionResult.status === 'success') {
    return res.status(200).json({
      success: true,
      message: mailerLiteResult && mailerLiteResult.status === 'success'
        ? 'You are on the list and the email flow has been triggered.'
        : 'You are on the list. Next we will route this to the thank-you page and calendar flow.',
      notion_page_url: notionResult.pageUrl,
      mailerlite_subscriber_id: mailerLiteResult && mailerLiteResult.status === 'success' ? mailerLiteResult.subscriberId : null,
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Signup captured in local preview mode. Add NOTION_API_KEY to enable live Notion writes from the app.',
    preview_mode: true,
  });
};

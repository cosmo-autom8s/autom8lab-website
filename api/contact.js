const { runContactIntegrations } = require('../lib/contact-integrations');

const ALLOWED_PROJECT_TIMELINES = ['ASAP', '1-3 months', '3-6 months', 'Exploring'];
const ALLOWED_SERVICES = ['AI Agents', 'Workflow Automations', 'AI Trainings', 'AI Strategy'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+()\-\s.]{7,25}$/;

function normalizeServices(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { first_name, last_name, email, phone, industry, challenge, website, project_timeline, services_of_interest } = req.body || {};
  const errors = {};
  const normalizedServices = normalizeServices(services_of_interest)
    .map((service) => String(service || '').trim())
    .filter(Boolean);

  if (!first_name || !first_name.trim()) errors.first_name = 'First name is required';
  else if (first_name.trim().length > 80) errors.first_name = 'First name must be 80 characters or fewer';

  if (!last_name || !last_name.trim()) errors.last_name = 'Last name is required';
  else if (last_name.trim().length > 80) errors.last_name = 'Last name must be 80 characters or fewer';

  if (!email || !email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_REGEX.test(email.trim())) errors.email = 'Please enter a valid email';

  if (!phone || !phone.trim()) errors.phone = 'Phone number is required';
  else if (!PHONE_REGEX.test(phone.trim())) errors.phone = 'Please enter a valid phone number';

  if (!website || !website.trim()) errors.website = 'Website is required';
  else {
    try {
      const parsedWebsite = new URL(website.trim());
      if (!['http:', 'https:'].includes(parsedWebsite.protocol)) {
        errors.website = 'Please enter a valid website URL';
      }
    } catch (error) {
      errors.website = 'Please enter a valid website URL';
    }
  }

  if (!industry || !industry.trim()) errors.industry = 'Please enter your industry';
  else if (industry.trim().length > 120) errors.industry = 'Industry must be 120 characters or fewer';

  if (!challenge || !challenge.trim()) errors.challenge = 'Please describe your challenge';
  else if (challenge.trim().length > 2000) errors.challenge = 'Challenge must be 2000 characters or fewer';

  if (!project_timeline || !project_timeline.trim()) errors.project_timeline = 'Please select a project timeline';
  else if (!ALLOWED_PROJECT_TIMELINES.includes(project_timeline.trim())) errors.project_timeline = 'Please select a valid project timeline';

  if (normalizedServices.length === 0) errors.services_of_interest = 'Please select at least one service';
  else if (normalizedServices.some((service) => !ALLOWED_SERVICES.includes(service))) {
    errors.services_of_interest = 'Please select valid services';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const submission = {
    firstName: first_name.trim(),
    lastName: last_name.trim(),
    name: first_name.trim() + ' ' + last_name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    website: website.trim(),
    industry: industry.trim(),
    projectTimeline: project_timeline.trim(),
    servicesOfInterest: normalizedServices,
    challenge: challenge.trim(),
    timestamp: new Date().toISOString(),
    source: 'Website',
    userAgent: req.headers['user-agent'] || '',
    ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '',
  };

  console.log('New contact form submission:', submission);

  const integrationStatus = await runContactIntegrations(submission);

  if (integrationStatus.configuredCount > 0 && integrationStatus.successCount === 0) {
    console.error('All configured contact integrations failed:', integrationStatus.failed);
    return res.status(502).json({
      error: 'Submission could not be delivered right now. Please try again or email cosmo@autom8lab.com.',
    });
  }

  if (integrationStatus.failedCount > 0) {
    console.warn('Some contact integrations failed:', integrationStatus.failed);
  }

  return res.status(200).json({
    success: true,
    message: "Thank you! I'll get back to you within 24 hours.",
  });
};

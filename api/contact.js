const { runContactIntegrations } = require('../lib/contact-integrations');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { name, email, industry, challenge, website, budget } = req.body || {};
  const errors = {};
  if (!name || !name.trim()) errors.name = 'Name is required';
  if (!email || !email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Please enter a valid email';
  if (!industry) errors.industry = 'Please select an industry';
  if (!challenge || !challenge.trim()) errors.challenge = 'Please describe your challenge';
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  const submission = {
    name: name.trim(),
    email: email.trim(),
    website: website?.trim() || '',
    industry: industry.trim(),
    budget: budget?.trim() || 'Not specified',
    challenge: challenge.trim(),
    timestamp: new Date().toISOString(),
    source: 'website',
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

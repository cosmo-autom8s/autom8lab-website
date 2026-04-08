function getEnv(name, fallback) {
  return process.env[name] || fallback || '';
}

async function parseErrorResponse(response) {
  try {
    var body = await response.text();
    return body || response.statusText;
  } catch (error) {
    return response.statusText;
  }
}

async function sendWebhook(submission) {
  var url = getEnv('CONTACT_WEBHOOK_URL');
  if (!url) return { name: 'webhook', status: 'skipped' };

  var response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: 'autom8lab-contact-form',
      submission: submission,
    }),
  });

  if (!response.ok) {
    throw new Error('Webhook failed: ' + await parseErrorResponse(response));
  }

  return { name: 'webhook', status: 'success' };
}

async function sendMailerLite(submission) {
  var apiKey = getEnv('MAILERLITE_API_KEY');
  var groupId = getEnv('MAILERLITE_GROUP_ID');
  if (!apiKey || !groupId) return { name: 'mailerlite', status: 'skipped' };

  var response = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
    },
    body: JSON.stringify({
      email: submission.email,
      groups: [groupId],
      status: 'active',
      fields: {
        name: submission.name,
        website: submission.website,
        industry: submission.industry,
        budget: submission.budget,
        challenge: submission.challenge,
        source: submission.source,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('MailerLite failed: ' + await parseErrorResponse(response));
  }

  return { name: 'mailerlite', status: 'success' };
}

function notionTitleProperty(value) {
  return {
    title: [{ type: 'text', text: { content: value } }],
  };
}

function notionRichTextProperty(value) {
  return {
    rich_text: [{ type: 'text', text: { content: value } }],
  };
}

function notionEmailProperty(value) {
  return { email: value || null };
}

function notionUrlProperty(value) {
  return { url: value || null };
}

function notionDateProperty(value) {
  return { date: { start: value } };
}

async function sendNotion(submission) {
  var apiKey = getEnv('NOTION_API_KEY');
  var databaseId = getEnv('NOTION_DATABASE_ID');
  if (!apiKey || !databaseId) return { name: 'notion', status: 'skipped' };

  var properties = {};
  properties[getEnv('NOTION_NAME_PROPERTY', 'Name')] = notionTitleProperty(submission.name);
  properties[getEnv('NOTION_EMAIL_PROPERTY', 'Email')] = notionEmailProperty(submission.email);
  properties[getEnv('NOTION_INDUSTRY_PROPERTY', 'Industry')] = notionRichTextProperty(submission.industry);
  properties[getEnv('NOTION_BUDGET_PROPERTY', 'Budget')] = notionRichTextProperty(submission.budget);
  properties[getEnv('NOTION_CHALLENGE_PROPERTY', 'Challenge')] = notionRichTextProperty(submission.challenge);
  properties[getEnv('NOTION_SOURCE_PROPERTY', 'Source')] = notionRichTextProperty(submission.source);

  if (submission.website) {
    properties[getEnv('NOTION_WEBSITE_PROPERTY', 'Website')] = notionUrlProperty(submission.website);
  }
  properties[getEnv('NOTION_SUBMITTED_AT_PROPERTY', 'Submitted At')] = notionDateProperty(submission.timestamp);

  var response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: properties,
    }),
  });

  if (!response.ok) {
    throw new Error('Notion failed: ' + await parseErrorResponse(response));
  }

  return { name: 'notion', status: 'success' };
}

async function sendResendNotification(submission) {
  var apiKey = getEnv('RESEND_API_KEY');
  var to = getEnv('CONTACT_NOTIFICATION_EMAIL');
  if (!apiKey || !to) return { name: 'resend', status: 'skipped' };

  var from = getEnv('CONTACT_FROM_EMAIL', 'Autom8Lab <onboarding@resend.dev>');
  var subject = 'New Autom8Lab contact: ' + submission.name;
  var text = [
    'New Autom8Lab contact submission',
    '',
    'Name: ' + submission.name,
    'Email: ' + submission.email,
    'Website: ' + (submission.website || 'Not provided'),
    'Industry: ' + submission.industry,
    'Budget: ' + submission.budget,
    'Challenge: ' + submission.challenge,
    'Submitted at: ' + submission.timestamp,
    'Source: ' + submission.source,
  ].join('\n');

  var response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
    },
    body: JSON.stringify({
      from: from,
      to: [to],
      reply_to: submission.email,
      subject: subject,
      text: text,
    }),
  });

  if (!response.ok) {
    throw new Error('Resend failed: ' + await parseErrorResponse(response));
  }

  return { name: 'resend', status: 'success' };
}

async function runContactIntegrations(submission) {
  var steps = [
    sendWebhook,
    sendMailerLite,
    sendNotion,
    sendResendNotification,
  ];

  var results = await Promise.all(steps.map(async function (step) {
    try {
      return await step(submission);
    } catch (error) {
      return {
        name: step.name,
        status: 'failed',
        error: error.message,
      };
    }
  }));

  var configured = results.filter(function (result) {
    return result.status !== 'skipped';
  });
  var succeeded = configured.filter(function (result) {
    return result.status === 'success';
  });
  var failed = configured.filter(function (result) {
    return result.status === 'failed';
  });

  return {
    results: results,
    configuredCount: configured.length,
    successCount: succeeded.length,
    failedCount: failed.length,
    failed: failed,
  };
}

module.exports = {
  runContactIntegrations: runContactIntegrations,
};

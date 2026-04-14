require('./load-env');

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

function notionTitleProperty(value) {
  return {
    title: [{ type: 'text', text: { content: value } }],
  };
}

function notionRichTextProperty(value) {
  return {
    rich_text: [{ type: 'text', text: { content: value || '' } }],
  };
}

function notionEmailProperty(value) {
  return { email: value || null };
}

function notionCheckboxProperty(value) {
  return { checkbox: Boolean(value) };
}

function notionDateProperty(value) {
  return { date: { start: value } };
}

function notionSelectProperty(value) {
  return { select: value ? { name: value } : null };
}

function notionStatusProperty(value) {
  return { status: value ? { name: value } : null };
}

function buildNotionProperties(submission, mailerLiteResult) {
  var properties = {};
  properties[getEnv('HARD_AI_NOTION_NAME_PROPERTY', 'Name')] = notionTitleProperty(submission.name);
  properties[getEnv('HARD_AI_NOTION_FIRST_NAME_PROPERTY', 'First Name')] = notionRichTextProperty(submission.firstName);
  properties[getEnv('HARD_AI_NOTION_EMAIL_PROPERTY', 'Email')] = notionEmailProperty(submission.email);
  properties[getEnv('HARD_AI_NOTION_EXPERIENCE_PROPERTY', 'AI Experience')] = notionSelectProperty(submission.aiExperience);
  properties[getEnv('HARD_AI_NOTION_WHY_JOINING_PROPERTY', 'Why Joining')] = notionRichTextProperty(submission.whyJoining);
  properties[getEnv('HARD_AI_NOTION_SUPPORT_PROPERTY', 'Support Needed')] = notionRichTextProperty(submission.supportNeeded);
  properties[getEnv('HARD_AI_NOTION_CONSENT_PROPERTY', 'Consent')] = notionCheckboxProperty(submission.consent);
  properties[getEnv('HARD_AI_NOTION_SOURCE_PROPERTY', 'Source')] = notionSelectProperty(submission.source);
  properties[getEnv('HARD_AI_NOTION_STATUS_PROPERTY', 'Status')] = notionStatusProperty(submission.status);
  properties[getEnv('HARD_AI_NOTION_SUBMITTED_AT_PROPERTY', 'Submitted At')] = notionDateProperty(submission.timestamp);

  if (mailerLiteResult && mailerLiteResult.subscriberId) {
    properties[getEnv('HARD_AI_NOTION_MAILERLITE_ID_PROPERTY', 'MailerLite Subscriber ID')] = notionRichTextProperty(mailerLiteResult.subscriberId);
  }

  return properties;
}

function formatMailerLiteTimestamp(isoString) {
  var date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';

  var year = String(date.getUTCFullYear());
  var month = String(date.getUTCMonth() + 1).padStart(2, '0');
  var day = String(date.getUTCDate()).padStart(2, '0');
  var hours = String(date.getUTCHours()).padStart(2, '0');
  var minutes = String(date.getUTCMinutes()).padStart(2, '0');
  var seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}

async function sendHardAiToMailerLite(submission) {
  var apiKey = getEnv('MAILERLITE_API_KEY');
  var groupId = getEnv('HARD_AI_MAILERLITE_GROUP_ID');

  if (!apiKey || !groupId) {
    return {
      name: 'mailerlite',
      status: 'skipped',
      reason: 'missing_credentials',
    };
  }

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
      subscribed_at: formatMailerLiteTimestamp(submission.timestamp),
      ip_address: submission.ip || undefined,
      fields: {
        name: submission.firstName,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('MailerLite failed: ' + await parseErrorResponse(response));
  }

  var payload = await response.json();
  return {
    name: 'mailerlite',
    status: 'success',
    subscriberId: payload && payload.data ? payload.data.id : undefined,
  };
}

async function sendHardAiToNotion(submission, mailerLiteResult) {
  var apiKey = getEnv('NOTION_API_KEY');
  var databaseId = getEnv('HARD_AI_NOTION_DATABASE_ID', 'b37ec0578839497fbeb72d6882f7f704');

  if (!apiKey || !databaseId) {
    return {
      name: 'notion',
      status: 'skipped',
      reason: 'missing_credentials',
    };
  }

  var response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: buildNotionProperties(submission, mailerLiteResult),
    }),
  });

  if (!response.ok) {
    throw new Error('Notion failed: ' + await parseErrorResponse(response));
  }

  var payload = await response.json();
  return {
    name: 'notion',
    status: 'success',
    pageId: payload.id,
    pageUrl: payload.url,
  };
}

async function runHardAiIntegrations(submission) {
  var mailerLiteResult;
  try {
    mailerLiteResult = await sendHardAiToMailerLite(submission);
  } catch (error) {
    mailerLiteResult = {
      name: 'mailerlite',
      status: 'failed',
      error: error.message,
    };
  }

  var notionResult;
  try {
    notionResult = await sendHardAiToNotion(submission, mailerLiteResult);
  } catch (error) {
    notionResult = {
      name: 'notion',
      status: 'failed',
      error: error.message,
    };
  }

  var results = [mailerLiteResult, notionResult];
  var configured = results.filter(function (result) {
    return result.status !== 'skipped';
  });
  var failed = configured.filter(function (result) {
    return result.status === 'failed';
  });

  return {
    results: results,
    configuredCount: configured.length,
    failedCount: failed.length,
    failed: failed,
  };
}

module.exports = {
  runHardAiIntegrations: runHardAiIntegrations,
};

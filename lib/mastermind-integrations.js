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
    rich_text: [{ type: 'text', text: { content: value } }],
  };
}

function notionEmailProperty(value) {
  return { email: value || null };
}

function notionUrlProperty(value) {
  return { url: value || null };
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

function notionMultiSelectProperty(values) {
  return {
    multi_select: (values || []).map(function (value) {
      return { name: value };
    }),
  };
}

function buildNotionProperties(submission) {
  var properties = {};
  properties[getEnv('MASTERMIND_NOTION_NAME_PROPERTY', 'Name')] = notionTitleProperty(submission.name);
  properties[getEnv('MASTERMIND_NOTION_FIRST_NAME_PROPERTY', 'First Name')] = notionRichTextProperty(submission.firstName);
  properties[getEnv('MASTERMIND_NOTION_LAST_NAME_PROPERTY', 'Last Name')] = notionRichTextProperty(submission.lastName);
  properties[getEnv('MASTERMIND_NOTION_EMAIL_PROPERTY', 'Email')] = notionEmailProperty(submission.email);
  properties[getEnv('MASTERMIND_NOTION_ROLE_PROPERTY', 'Role')] = notionMultiSelectProperty(submission.roles);
  properties[getEnv('MASTERMIND_NOTION_EXPERIENCE_PROPERTY', 'AI Experience')] = notionSelectProperty(submission.aiExperience);
  properties[getEnv('MASTERMIND_NOTION_GOALS_PROPERTY', 'Main Goal')] = notionMultiSelectProperty(submission.goals);
  properties[getEnv('MASTERMIND_NOTION_WANTS_TO_SHARE_PROPERTY', 'Wants To Share')] = notionCheckboxProperty(submission.wantsToShare);
  properties[getEnv('MASTERMIND_NOTION_PROJECT_PROPERTY', 'Current Project / Notes')] = notionRichTextProperty(submission.currentProject);
  properties[getEnv('MASTERMIND_NOTION_TIMEZONE_PROPERTY', 'Timezone')] = notionRichTextProperty(submission.timezone);
  properties[getEnv('MASTERMIND_NOTION_SOURCE_PROPERTY', 'Source')] = notionSelectProperty(submission.source);
  properties[getEnv('MASTERMIND_NOTION_STATUS_PROPERTY', 'Status')] = notionStatusProperty(submission.status);
  properties[getEnv('MASTERMIND_NOTION_SUBMITTED_AT_PROPERTY', 'Submitted At')] = notionDateProperty(submission.timestamp);
  if (submission.website) {
    properties[getEnv('MASTERMIND_NOTION_WEBSITE_PROPERTY', 'Website')] = notionUrlProperty(submission.website);
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

async function sendMastermindToMailerLite(submission) {
  var apiKey = getEnv('MAILERLITE_API_KEY');
  var groupId = getEnv('MASTERMIND_MAILERLITE_GROUP_ID') || getEnv('MAILERLITE_GROUP_ID');

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
        last_name: submission.lastName,
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

async function sendMastermindToNotion(submission) {
  var apiKey = getEnv('NOTION_API_KEY');
  var databaseId = getEnv('MASTERMIND_NOTION_DATABASE_ID', '33ca44c6f32f80f5bc80e6598b01413f');

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
      properties: buildNotionProperties(submission),
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

async function runMastermindIntegrations(submission) {
  var steps = [
    sendMastermindToMailerLite,
    sendMastermindToNotion,
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
  runMastermindIntegrations: runMastermindIntegrations,
};

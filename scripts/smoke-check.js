const app = require('../server');
const caseStudies = require('../data/case-studies');
const contactHandler = require('../api/contact');

function renderView(view, locals) {
  return new Promise((resolve, reject) => {
    app.render(view, locals, (error, html) => {
      if (error) return reject(error);
      resolve(html);
    });
  });
}

async function run() {
  const pages = [
    ['index', {}],
    ['about', { title: 'About', description: 'x' }],
    ['free-resources', { title: 'Free Resources', description: 'x' }],
    ['ai-audit', { title: 'AI Audit', description: 'x' }],
    ['vision-map', { title: 'Vision Map', description: 'x' }],
    ['ai-mastermind', { title: 'AI Mastermind', description: 'x' }],
  ];

  for (const slug of Object.keys(caseStudies)) {
    pages.push(['case-study', { title: caseStudies[slug].metaTitle, description: caseStudies[slug].metaDescription, study: caseStudies[slug] }]);
  }

  for (const [view, locals] of pages) {
    const html = await renderView(view, locals);
    console.log('rendered', view, html.length);
  }

  await new Promise((resolve, reject) => {
    const req = {
      method: 'POST',
      body: {
        name: 'Smoke Test',
        email: 'smoke@example.com',
        industry: 'Healthcare',
        challenge: 'Need automation help',
        website: 'https://example.com',
        budget: '$5K-$10K',
      },
      headers: { 'user-agent': 'smoke-check' },
      socket: { remoteAddress: '127.0.0.1' },
    };

    const res = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        if (this.statusCode !== 200) {
          reject(new Error('Contact handler failed: ' + JSON.stringify(payload)));
          return;
        }
        console.log('contact', this.statusCode, payload.success);
        resolve(payload);
      },
    };

    Promise.resolve(contactHandler(req, res)).catch(reject);
  });

  console.log('smoke check passed');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

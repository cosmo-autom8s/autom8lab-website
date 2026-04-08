require('./lib/load-env');

const express = require('express');
const path = require('path');
const caseStudies = require('./data/case-studies');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    description: "I don't sell AI strategies. I build the system that fixes the actual problem.",
  });
});

app.get('/free-resources', (req, res) => {
  res.render('free-resources', {
    title: 'Free Resources',
    description: 'Practical AI resources. No fluff, no gating everything behind a sales call.',
  });
});

app.get('/ai-audit', (req, res) => {
  res.render('ai-audit', {
    title: 'AI Audit',
    description: "We'll show you exactly where your business is leaking time and money, and what's worth fixing first.",
  });
});

app.get('/vision-map', (req, res) => {
  res.render('vision-map', {
    title: 'Vision Map',
    description: `"We should be using AI" isn't a plan. The Vision Map makes it one.`,
  });
});

app.get('/ai-mastermind', (req, res) => {
  res.render('ai-mastermind', {
    title: 'AI Mastermind',
    description: 'Join the weekly Autom8Lab AI Mastermind for practical conversations about what is actually working with AI.',
  });
});

app.get('/ai-mastermind/thank-you', (req, res) => {
  res.render('ai-mastermind-thank-you', {
    title: 'AI Mastermind Thank You',
    description: 'You are on the list for the Autom8Lab AI Mastermind. Add the session to your calendar and watch your inbox for updates.',
  });
});

app.get('/case-studies/:slug', (req, res, next) => {
  const study = caseStudies[req.params.slug];
  if (!study) return next();

  res.render('case-study', {
    title: study.metaTitle,
    description: study.metaDescription,
    study,
  });
});

if (require.main === module && process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Autom8Lab dev server running at http://localhost:${PORT}`);
  });
}

// Local dev: proxy /api/contact to the serverless function
const contactHandler = require('./api/contact');
app.post('/api/contact', (req, res) => contactHandler(req, res));
const mastermindSignupHandler = require('./api/mastermind-signup');
app.post('/api/mastermind-signup', (req, res) => mastermindSignupHandler(req, res));

module.exports = app;

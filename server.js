const express = require('express');
const path = require('path');

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
    description: 'Meet Cosmo and learn how Autom8Lab approaches AI consulting, implementation, and long-term optimization.',
  });
});

app.get('/free-resources', (req, res) => {
  res.render('free-resources', {
    title: 'Free Resources',
    description: 'Free AI guides, templates, and practical resources for business owners exploring automation and AI systems.',
  });
});

app.get('/ai-audit', (req, res) => {
  res.render('ai-audit', {
    title: 'AI Audit',
    description: 'Book a free AI audit to map where time and revenue are leaking and see which systems will move the needle.',
  });
});

app.get('/vision-map', (req, res) => {
  res.render('vision-map', {
    title: 'Vision Map',
    description: 'A strategic blueprint that turns vague AI ambitions into a concrete, prioritized implementation roadmap.',
  });
});

app.get('/ai-mastermind', (req, res) => {
  res.render('ai-mastermind', {
    title: 'AI Mastermind',
    description: 'Join the weekly Autom8Lab AI Mastermind for practical conversations about what is actually working with AI.',
  });
});

// Keep V2 result-card links working while case studies remain static HTML pages.
app.get('/case-studies/specialty-clinic', (req, res) => {
  res.redirect('/case-studies/specialty-clinic.html');
});

app.get('/case-studies/general-contractor', (req, res) => {
  res.redirect('/case-studies/general-contractor.html');
});

app.get('/case-studies/property-management', (req, res) => {
  res.redirect('/case-studies/property-management.html');
});

app.get('/case-studies/diagnostics-lab', (req, res) => {
  res.redirect('/case-studies/diagnostics-lab.html');
});

if (require.main === module && process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Autom8Lab dev server running at http://localhost:${PORT}`);
  });
}

// Local dev: proxy /api/contact to the serverless function
const contactHandler = require('./api/contact');
app.post('/api/contact', (req, res) => contactHandler(req, res));

module.exports = app;

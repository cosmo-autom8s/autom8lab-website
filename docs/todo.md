# V2 TODO

Active backlog for the Autom8Lab V2 site.

## Integrations

- Share the `Website Leads` Notion database with the `Autom8Lab Website App` integration so homepage form writes work live.
- Add `CONTACT_WEBHOOK_URL` in local / production env and test the webhook payload end to end.
- Add `RESEND_API_KEY` and `CONTACT_NOTIFICATION_EMAIL`, then test immediate owner notifications from the homepage form.
- Add homepage `MAILERLITE_GROUP_ID` if homepage leads should also enter MailerLite automatically.
- Decide whether the homepage form should redirect to a thank-you page after successful submission.
- Verify Vercel has the 75 Hard AI env vars:
  - `HARD_AI_NOTION_DATABASE_ID=b37ec0578839497fbeb72d6882f7f704`
  - `HARD_AI_MAILERLITE_GROUP_ID=184741991046711115`
- Retest the live 75 Hard AI signup after Vercel redeploy to confirm Notion write, MailerLite group subscription, `first_name` field mapping, and thank-you redirect.

## Homepage

- Validate the final homepage lead form UX in browser after integrations are live.
- Confirm the final success-state copy and whether it should mention response time, booking, or next steps.
- Decide whether the homepage form should capture consent / privacy acknowledgment explicitly.
- Decide whether the homepage should include Results and FAQ again later, or whether those stay removed permanently.

## AI Mastermind

- Test the thank-you page and redirect flow end to end in the browser.
- Confirm the recurring event time/date details used in the Google Calendar link and `.ics` file.
- Decide whether confirmation / reminder emails should come from MailerLite, Resend, or both.
- Refine the copy on the page after the dedicated copy pass.

## Content

- Do a dedicated copy pass using `docs/site-copy-inventory.md` as the working reference.
- Continue rebuilding `free-resources`:
  - AI Executive Assistant and 75 Hard AI Challenge are now featured resources
  - decide the remaining final resource(s)
  - link each remaining resource to the right destination page or asset
  - tighten the page structure and CTA flow after the content pass
- Build out the Skool community resources for 75 Hard AI:
  - welcome post / orientation
  - Day 1 instructions
  - starter tutorials and project-picking guidance
- Refine `vision-map` copy and page structure.
- Review `ai-audit` copy and tighten the offer framing.
- Review `about` page copy for positioning, proof, and credentials.
- Review `ai-mastermind` page copy separately from the functional signup work.
- Review case study copy and decide whether any additional case studies should be added.

## QA

- Test all V2 routes on desktop, tablet, and mobile.
- Test homepage form validation and submission states across browsers.
- Test AI Mastermind signup flow again after any email / calendar changes.
- Verify navigation and footer links on every page.
- Do a final pass on animation timing and scroll behavior across pages.

## Deployment

- Decide when V2 should become the primary deployed experience.
- Prepare production env vars for Notion, MailerLite, webhook, and Resend.
- Run a final deployment checklist before shipping.

(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const allowedProjectTimelines = ['ASAP', '1-3 months', '3-6 months', 'Exploring'];
  const allowedServices = ['AI Agents', 'Workflow Automations', 'AI Trainings', 'AI Strategy'];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9+()\-\s.]{7,25}$/;

  document.querySelectorAll('[data-chip-group]').forEach((group) => {
    const groupName = group.dataset.chipGroup;
    const hiddenInput = document.getElementById(groupName + '-input');
    group.querySelectorAll('.chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const wasActive = chip.classList.contains('bg-accent/20');
        group.querySelectorAll('.chip').forEach((c) => {
          c.classList.remove('bg-accent/20', 'border-accent', 'text-accent');
          c.classList.add('border-border-subtle', 'text-text-secondary');
        });
        if (!wasActive) {
          chip.classList.add('bg-accent/20', 'border-accent', 'text-accent');
          chip.classList.remove('border-border-subtle', 'text-text-secondary');
          if (hiddenInput) hiddenInput.value = chip.dataset.value;
        } else {
          if (hiddenInput) hiddenInput.value = '';
        }
      });
    });
  });

  document.querySelectorAll('[data-chip-group-multi]').forEach((group) => {
    const groupName = group.dataset.chipGroupMulti;
    const hiddenInput = document.getElementById(groupName + '-input');

    function syncMultiValue() {
      const values = Array.from(group.querySelectorAll('.chip-multi.bg-accent\\/20')).map((chip) => chip.dataset.value);
      if (hiddenInput) hiddenInput.value = JSON.stringify(values);
    }

    group.querySelectorAll('.chip-multi').forEach((chip) => {
      chip.addEventListener('click', () => {
        const isActive = chip.classList.contains('bg-accent/20');
        chip.classList.toggle('bg-accent/20', !isActive);
        chip.classList.toggle('border-accent', !isActive);
        chip.classList.toggle('text-accent', !isActive);
        chip.classList.toggle('border-border-subtle', isActive);
        chip.classList.toggle('text-text-secondary', isActive);
        syncMultiValue();
      });
    });
  });

  function showError(fieldName, message) {
    const errorEl = form.querySelector(`[data-error="${fieldName}"]`);
    if (errorEl) { errorEl.textContent = message; errorEl.classList.remove('hidden'); }
    const input = form.querySelector(`[name="${fieldName}"]`);
    if (input) input.classList.add('border-red-400');
  }

  function clearErrors() {
    form.querySelectorAll('[data-error]').forEach((el) => { el.classList.add('hidden'); el.textContent = ''; });
    form.querySelectorAll('.border-red-400').forEach((el) => { el.classList.remove('border-red-400'); });
  }

  function validate() {
    clearErrors();
    let valid = true;
    const firstName = form.querySelector('[name="first_name"]').value.trim();
    const lastName = form.querySelector('[name="last_name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const website = form.querySelector('[name="website"]').value.trim();
    const industry = form.querySelector('[name="industry"]').value.trim();
    const challenge = form.querySelector('[name="challenge"]').value.trim();
    const projectTimeline = form.querySelector('[name="project_timeline"]').value;
    const servicesOfInterest = JSON.parse(form.querySelector('[name="services_of_interest"]').value || '[]');

    if (!firstName) { showError('first_name', 'First name is required'); valid = false; }
    else if (firstName.length > 80) { showError('first_name', 'First name must be 80 characters or fewer'); valid = false; }

    if (!lastName) { showError('last_name', 'Last name is required'); valid = false; }
    else if (lastName.length > 80) { showError('last_name', 'Last name must be 80 characters or fewer'); valid = false; }

    if (!email) { showError('email', 'Email is required'); valid = false; }
    else if (!emailRegex.test(email)) { showError('email', 'Please enter a valid email'); valid = false; }

    if (!phone) { showError('phone', 'Phone number is required'); valid = false; }
    else if (!phoneRegex.test(phone)) { showError('phone', 'Please enter a valid phone number'); valid = false; }

    if (!website) { showError('website', 'Website is required'); valid = false; }
    else {
      try {
        const parsedWebsite = new URL(website);
        if (!['http:', 'https:'].includes(parsedWebsite.protocol)) {
          showError('website', 'Please enter a valid website URL');
          valid = false;
        }
      } catch (error) {
        showError('website', 'Please enter a valid website URL');
        valid = false;
      }
    }

    if (!industry) { showError('industry', 'Please enter your industry'); valid = false; }
    else if (industry.length > 120) { showError('industry', 'Industry must be 120 characters or fewer'); valid = false; }

    if (!servicesOfInterest.length) { showError('services_of_interest', 'Please select at least one service'); valid = false; }
    else if (servicesOfInterest.some((service) => !allowedServices.includes(service))) {
      showError('services_of_interest', 'Please select valid services');
      valid = false;
    }

    if (!challenge) { showError('challenge', 'Please describe your challenge'); valid = false; }
    else if (challenge.length > 2000) { showError('challenge', 'Challenge must be 2000 characters or fewer'); valid = false; }

    if (!projectTimeline) { showError('project_timeline', 'Please select a project timeline'); valid = false; }
    else if (!allowedProjectTimelines.includes(projectTimeline)) {
      showError('project_timeline', 'Please select a valid project timeline');
      valid = false;
    }
    return valid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    const formData = {
      first_name: form.querySelector('[name="first_name"]').value.trim(),
      last_name: form.querySelector('[name="last_name"]').value.trim(),
      email: form.querySelector('[name="email"]').value.trim(),
      phone: form.querySelector('[name="phone"]').value.trim(),
      website: form.querySelector('[name="website"]').value.trim(),
      industry: form.querySelector('[name="industry"]').value.trim(),
      project_timeline: form.querySelector('[name="project_timeline"]').value,
      services_of_interest: JSON.parse(form.querySelector('[name="services_of_interest"]').value || '[]'),
      challenge: form.querySelector('[name="challenge"]').value.trim(),
    };
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await res.json().catch(function () { return {}; });
      if (res.ok) {
        if (data.redirect_url) {
          window.location.href = data.redirect_url;
          return;
        }
        form.querySelector('#form-success').classList.remove('hidden');
        if (data.message) {
          var successMessage = form.querySelector('#form-success p');
          if (successMessage) successMessage.textContent = data.message;
        }
        form.querySelectorAll('.space-y-6 > *:not(#form-success)').forEach((el) => { el.style.display = 'none'; });
      } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Book Your Free AI Consultation';
        if (data.errors) { Object.entries(data.errors).forEach(([field, msg]) => showError(field, msg)); }
        else if (data.error) { alert(data.error); }
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Book Your Free AI Consultation';
      alert('Something went wrong. Please try again or email cosmo@autom8lab.com');
    }
  });
})();

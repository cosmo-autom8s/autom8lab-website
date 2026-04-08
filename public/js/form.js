(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

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
    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const industry = form.querySelector('[name="industry"]').value;
    const challenge = form.querySelector('[name="challenge"]').value.trim();
    if (!name) { showError('name', 'Name is required'); valid = false; }
    if (!email) { showError('email', 'Email is required'); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('email', 'Please enter a valid email'); valid = false; }
    if (!industry) { showError('industry', 'Please select an industry'); valid = false; }
    if (!challenge) { showError('challenge', 'Please describe your challenge'); valid = false; }
    return valid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    const formData = {
      name: form.querySelector('[name="name"]').value.trim(),
      email: form.querySelector('[name="email"]').value.trim(),
      website: form.querySelector('[name="website"]').value.trim(),
      industry: form.querySelector('[name="industry"]').value,
      budget: form.querySelector('[name="budget"]').value,
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
        submitBtn.textContent = 'Book Your Free AI Audit';
        if (data.errors) { Object.entries(data.errors).forEach(([field, msg]) => showError(field, msg)); }
        else if (data.error) { alert(data.error); }
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Book Your Free AI Audit';
      alert('Something went wrong. Please try again or email cosmo@autom8lab.com');
    }
  });
})();

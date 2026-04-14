(function () {
  var form = document.getElementById('hard-ai-signup-form');
  var success = document.getElementById('hard-ai-signup-success');
  var generalError = document.getElementById('hard-ai-signup-error');
  if (!form || !success || !generalError) return;

  function clearErrors() {
    form.querySelectorAll('[data-error]').forEach(function (el) {
      el.textContent = '';
      el.classList.add('hidden');
    });
    form.querySelectorAll('.border-red-400').forEach(function (el) {
      el.classList.remove('border-red-400');
    });
    generalError.classList.add('hidden');
    generalError.textContent = '';
    success.classList.add('hidden');
  }

  function showFieldError(field, message) {
    var errorEl = form.querySelector('[data-error="' + field + '"]');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
    }

    var input = form.querySelector('[name="' + field + '"]');
    if (input) input.classList.add('border-red-400');
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    clearErrors();

    var submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Joining...';

    var payload = {
      first_name: form.first_name.value.trim(),
      email: form.email.value.trim(),
      ai_experience: form.ai_experience.value,
      why_joining: form.why_joining.value.trim(),
      support_needed: form.support_needed.value.trim(),
      consent: form.consent.checked,
    };

    try {
      var res = await fetch('/api/75-hard-ai-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      var data = await res.json().catch(function () { return {}; });

      if (!res.ok) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Join the Challenge';
        if (data.errors) {
          Object.entries(data.errors).forEach(function (entry) {
            showFieldError(entry[0], entry[1]);
          });
        } else {
          generalError.textContent = data.error || 'Okay, what went wrong? Please check the form and try again.';
          generalError.classList.remove('hidden');
        }
        return;
      }

      if (data.redirect_url) {
        window.location.href = data.redirect_url;
        return;
      }

      success.textContent = data.message || 'You are in.';
      success.classList.remove('hidden');
      form.reset();
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Join the Challenge';
      generalError.textContent = 'Okay, what went wrong? Please try again in a minute.';
      generalError.classList.remove('hidden');
      return;
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Join the Challenge';
  });
})();

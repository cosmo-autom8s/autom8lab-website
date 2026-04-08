(function () {
  var form = document.getElementById('mastermind-signup-form');
  var success = document.getElementById('mastermind-signup-success');
  var generalError = document.getElementById('mastermind-signup-error');
  if (!form || !success || !generalError) return;

  /*
  function triggerEvent(element, eventName) {
    element.dispatchEvent(new Event(eventName, { bubbles: true }));
  }

  function setFieldValue(input, value) {
    if (!input) return;
    input.focus();
    input.value = value;
    triggerEvent(input, 'input');
    triggerEvent(input, 'change');
    input.blur();
  }

  function findMailerLiteField(container, matchers) {
    var inputs = Array.from(container.querySelectorAll('input'));
    return inputs.find(function (input) {
      return matchers.some(function (matcher) {
        return matcher(input);
      });
    }) || null;
  }

  function findMailerLiteSubmit(container) {
    return container.querySelector('button[type="submit"], input[type="submit"], button[class*="button"]');
  }

  function submitMailerLiteFallback(firstName, email) {
    var container = document.getElementById('mailerlite-mastermind-form');
    if (!container) return Promise.resolve({ status: 'skipped', reason: 'missing_container' });

    return new Promise(function (resolve) {
      var startedAt = Date.now();

      function trySubmit() {
        var root = container;
        var emailInput = findMailerLiteField(root, [
          function (input) { return input.type === 'email'; },
          function (input) { return /email/i.test(input.name || ''); },
          function (input) { return /email/i.test(input.placeholder || ''); },
        ]);
        var firstNameInput = findMailerLiteField(root, [
          function (input) { return /first/i.test(input.name || ''); },
          function (input) { return /name/i.test(input.name || ''); },
          function (input) { return /first/i.test(input.placeholder || ''); },
          function (input) { return /name/i.test(input.placeholder || ''); },
        ]);
        var submitButton = findMailerLiteSubmit(root);

        if (emailInput && submitButton) {
          setFieldValue(emailInput, email);
          if (firstNameInput) setFieldValue(firstNameInput, firstName);
          submitButton.click();
          resolve({ status: 'submitted' });
          return;
        }

        if (Date.now() - startedAt > 10000) {
          resolve({ status: 'skipped', reason: 'form_not_ready' });
          return;
        }

        window.setTimeout(trySubmit, 300);
      }

      trySubmit();
    });
  }
  */

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
    submitBtn.textContent = 'Submitting...';

    var payload = {
      first_name: form.first_name.value.trim(),
      last_name: form.last_name.value.trim(),
      email: form.email.value.trim(),
      website: form.website.value.trim(),
      role: form.role.value,
      ai_experience: form.ai_experience.value,
      goals: Array.from(form.querySelectorAll('input[name="goals"]:checked')).map(function (el) { return el.value; }),
      timezone: form.timezone.value,
      current_project: form.current_project.value.trim(),
      wants_to_share: form.wants_to_share.checked,
      consent: form.consent.checked,
    };

    try {
      var res = await fetch('/api/mastermind-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      var data = await res.json().catch(function () { return {}; });

      if (!res.ok) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Join the AI Mastermind';
        if (data.errors) {
          Object.entries(data.errors).forEach(function (entry) {
            showFieldError(entry[0], entry[1]);
          });
        } else {
          generalError.textContent = data.error || 'Something went wrong. Please try again.';
          generalError.classList.remove('hidden');
        }
        return;
      }

      success.textContent = data.message || 'You are on the list.';
      success.classList.remove('hidden');
      form.reset();
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Join the AI Mastermind';
      generalError.textContent = 'Something went wrong. Please try again.';
      generalError.classList.remove('hidden');
      return;
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Join the AI Mastermind';
  });
})();

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

  function setSelectableCardState(card, isActive) {
    card.classList.toggle('bg-accent/20', isActive);
    card.classList.toggle('border-accent', isActive);
    card.classList.toggle('text-accent', isActive);
    card.classList.toggle('border-border-subtle', !isActive);
    card.classList.toggle('text-text-secondary', !isActive);
  }

  function syncSelectableCards() {
    form.querySelectorAll('[data-selectable-group-multi] .selectable-card').forEach(function (card) {
      var input = card.querySelector('input');
      setSelectableCardState(card, Boolean(input && input.checked));
    });

    form.querySelectorAll('[data-selectable-group] .selectable-card').forEach(function (card) {
      var input = card.querySelector('input');
      setSelectableCardState(card, Boolean(input && input.checked));
    });
  }

  form.querySelectorAll('[data-selectable-group-multi]').forEach(function (group) {
    group.querySelectorAll('.selectable-card').forEach(function (card) {
      var input = card.querySelector('input');
      if (!input) return;

      setSelectableCardState(card, input.checked);
      card.addEventListener('click', function () {
        window.setTimeout(function () {
          setSelectableCardState(card, input.checked);
        }, 0);
      });
    });
  });

  form.querySelectorAll('[data-selectable-group]').forEach(function (group) {
    var cards = Array.from(group.querySelectorAll('.selectable-card'));

    function syncGroupState() {
      cards.forEach(function (card) {
        var input = card.querySelector('input');
        setSelectableCardState(card, Boolean(input && input.checked));
      });
    }

    syncGroupState();
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        window.setTimeout(syncGroupState, 0);
      });
    });
  });

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
      wants_to_share: form.querySelector('input[name="wants_to_share"]:checked') ? form.querySelector('input[name="wants_to_share"]:checked').value : '',
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
          generalError.textContent = data.error || 'Okay, what went wrong? Please check the form and try again.';
          generalError.classList.remove('hidden');
        }
        return;
      }

      var successRedirect = form.dataset.successRedirect || data.redirect_url;
      if (successRedirect) {
        window.location.href = successRedirect;
        return;
      }

      success.textContent = data.message || 'You are on the list.';
      success.classList.remove('hidden');
      form.reset();
      syncSelectableCards();
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Join the AI Mastermind';
      generalError.textContent = 'Okay, what went wrong? Please try again in a minute.';
      generalError.classList.remove('hidden');
      return;
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Join the AI Mastermind';
  });
})();

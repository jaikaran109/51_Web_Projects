(function () {
    'use strict';

    var form = document.getElementById('application-form');
    var summary = document.getElementById('error-summary');
    var summaryTitle = document.getElementById('error-summary-title');
    var summaryList = document.getElementById('error-summary-list');
    var status = document.getElementById('form-status');

    // Native validation is switched off here (not in the HTML) so that, if this
    // script fails to load, the browser's built-in `required` checks still work.
    form.noValidate = true;

    var NAME_RE = /^[\p{L}][\p{L}\s'’.-]*$/u;
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var PIN_RE = /^[1-9][0-9]{5}$/;
    var CV_EXTENSIONS = ['pdf', 'doc', 'docx'];
    var CV_MAX_BYTES = 5 * 1024 * 1024;

    // A past start date makes no sense for a new application.
    function todayISO() {
        var d = new Date();
        var m = String(d.getMonth() + 1).padStart(2, '0');
        var day = String(d.getDate()).padStart(2, '0');
        return d.getFullYear() + '-' + m + '-' + day;
    }
    var dateInput = document.getElementById('date');
    dateInput.min = todayISO();

    // Each rule returns an error message, or '' when the value is fine.
    var rules = {
        first_name: function (el) {
            var v = el.value.trim();
            if (!v) return 'Enter your first name.';
            if (!NAME_RE.test(v)) return 'First name can only contain letters, spaces, hyphens and apostrophes.';
            return '';
        },
        last_name: function (el) {
            var v = el.value.trim();
            if (!v) return 'Enter your last name.';
            if (!NAME_RE.test(v)) return 'Last name can only contain letters, spaces, hyphens and apostrophes.';
            return '';
        },
        email: function (el) {
            var v = el.value.trim();
            if (!v) return 'Enter your email address.';
            if (!EMAIL_RE.test(v)) return 'Enter a valid email address, like name@example.com.';
            return '';
        },
        job_role: function (el) {
            return el.value ? '' : 'Select the job role you are applying for.';
        },
        address: function (el) {
            var v = el.value.trim();
            if (!v) return 'Enter your address.';
            if (v.length < 5) return 'Address is too short. Enter your full address.';
            return '';
        },
        city: function (el) {
            var v = el.value.trim();
            if (!v) return 'Enter your city.';
            if (!NAME_RE.test(v)) return 'City can only contain letters, spaces, hyphens and apostrophes.';
            return '';
        },
        pin_code: function (el) {
            var v = el.value.trim();
            if (!v) return 'Enter your pin code.';
            if (!PIN_RE.test(v)) return 'Pin code must be exactly 6 digits and cannot start with 0.';
            return '';
        },
        date: function (el) {
            if (!el.value) {
                return el.validity.badInput
                    ? 'Enter a valid start date.'
                    : 'Choose your start date.';
            }
            if (el.value < todayISO()) return 'Start date cannot be in the past.';
            return '';
        },
        cv: function (el) {
            var file = el.files && el.files[0];
            if (!file) return 'Upload your CV.';
            var ext = file.name.split('.').pop().toLowerCase();
            if (CV_EXTENSIONS.indexOf(ext) === -1) return 'CV must be a PDF, DOC or DOCX file.';
            if (file.size > CV_MAX_BYTES) return 'CV must be 5 MB or smaller.';
            return '';
        }
    };

    var fieldIds = Object.keys(rules);
    var errors = {};   // id -> current message
    var touched = {};  // id -> user has left the field at least once

    function setError(id, message) {
        var input = document.getElementById(id);
        var out = document.getElementById(id + '-error');
        if (message) {
            errors[id] = message;
            out.textContent = message;
            out.hidden = false;
            input.setAttribute('aria-invalid', 'true');
        } else {
            delete errors[id];
            out.textContent = '';
            out.hidden = true;
            input.removeAttribute('aria-invalid');
        }
    }

    function validateField(id) {
        var message = rules[id](document.getElementById(id));
        setError(id, message);
        return !message;
    }

    function renderSummary() {
        var failing = fieldIds.filter(function (id) { return errors[id]; });
        summaryList.innerHTML = '';
        if (!failing.length) {
            summary.hidden = true;
            return;
        }
        summaryTitle.textContent = failing.length === 1
            ? 'There is 1 problem with your application'
            : 'There are ' + failing.length + ' problems with your application';
        failing.forEach(function (id) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = '#' + id;
            a.textContent = errors[id];
            // Move focus to the field itself, not just scroll to it.
            a.addEventListener('click', function (e) {
                e.preventDefault();
                document.getElementById(id).focus();
            });
            li.appendChild(a);
            summaryList.appendChild(li);
        });
        summary.hidden = false;
    }

    // Validate when the user leaves a field, then keep it up to date as they fix it.
    fieldIds.forEach(function (id) {
        var input = document.getElementById(id);
        input.addEventListener('blur', function () {
            touched[id] = true;
            validateField(id);
            if (!summary.hidden) renderSummary();
        });
        ['input', 'change'].forEach(function (evt) {
            input.addEventListener(evt, function () {
                if (touched[id] || errors[id]) {
                    validateField(id);
                    if (!summary.hidden) renderSummary();
                }
            });
        });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        status.textContent = '';

        fieldIds.forEach(function (id) {
            touched[id] = true;
            validateField(id);
        });
        renderSummary();

        if (!summary.hidden) {
            summary.focus();
            return;
        }

        // There is no backend in this project, so confirm on the page instead of
        // reloading. Replace this with fetch()/form.submit() when one exists.
        var firstName = document.getElementById('first_name').value.trim();
        form.reset();
        touched = {};
        status.textContent = 'Thank you, ' + firstName + '! Your application has been submitted.';
    });
})();

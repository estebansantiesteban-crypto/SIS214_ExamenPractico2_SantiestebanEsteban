// js/modules/form.js

const getErrorMessage = (field) => {
  if (field.validity.valueMissing) return 'Este campo es obligatorio.';
  if (field.validity.typeMismatch) return 'Ingresa un correo electrónico válido.';
  if (field.validity.tooShort) return `Debe tener al menos ${field.minLength} caracteres.`;
  return '';
};

const validateField = (field) => {
  const error = document.getElementById(`error-${field.id}`);
  const valid = field.checkValidity();
  field.classList.toggle('invalido', !valid);
  field.classList.toggle('valido', valid);
  field.setAttribute('aria-invalid', String(!valid));
  if (error) error.textContent = valid ? '' : getErrorMessage(field);
  return valid;
};

export const initForm = () => {
  const form = document.getElementById('form-contacto');
  const status = document.getElementById('form-mensaje');
  if (!form || !status) return;

  // Inicialización de EmailJS con tu Public Key
  emailjs.init('ibU1TmjrsLHK4wCRc');

  const fields = [...form.querySelectorAll('input, select, textarea')];

  form.addEventListener('input', (event) => {
    if (fields.includes(event.target)) validateField(event.target);
    status.textContent = '';
    status.className = 'form-message';
  });

  form.addEventListener('change', (event) => {
    if (fields.includes(event.target)) validateField(event.target);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!fields.map(validateField).every(Boolean)) {
      status.textContent = 'Revisa los campos marcados antes de continuar.';
      status.className = 'form-message error';
      form.querySelector('.invalido')?.focus();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : 'Enviar';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
    }

    status.textContent = 'Enviando mensaje...';
    status.className = 'form-message';

    // Envío automatizado con EmailJS
    emailjs.sendForm('service_aecx97k', 'template_rio5aeb', form)
      .then(() => {
        status.textContent = '¡Mensaje enviado con éxito!';
        status.className = 'form-message success';
        form.reset();
      })
      .catch((error) => {
        console.error('Error al enviar con EmailJS:', error);
        status.textContent = 'Hubo un error al enviar el mensaje. Intenta de nuevo.';
        status.className = 'form-message error';
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      });
  });

  form.addEventListener('reset', () => {
    fields.forEach((field) => {
      field.classList.remove('valido', 'invalido');
      field.removeAttribute('aria-invalid');
      const error = document.getElementById(`error-${field.id}`);
      if (error) error.textContent = '';
    });
    status.textContent = '';
    status.className = 'form-message';
  });
};
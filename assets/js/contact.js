const contactForm = document.querySelector('.contact-form__form');
const contactStatus = contactForm.querySelector('.contact-form__status');
const contactButton = contactForm.querySelector('button[type="submit"]');

const showStatus = (text, isError) => {
  contactStatus.textContent = text;
  contactStatus.classList.toggle('is-error', isError);
  contactStatus.hidden = false;
};

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  formData.set('_subject', `Saman Games contact: ${formData.get('name').trim()}`);
  formData.set('_replyto', formData.get('email').trim());

  contactButton.disabled = true;
  contactButton.textContent = 'Sending...';
  contactStatus.hidden = true;

  try {
    const response = await fetch('https://formsubmit.co/ajax/samangamesofficial@gmail.com', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || String(result.success) !== 'true') throw new Error(result.message || 'Request failed');

    contactForm.reset();
    showStatus('Thanks! Your message has been sent.', false);
  } catch (error) {
    showStatus('Something went wrong. Please email us at samangamesofficial@gmail.com.', true);
  } finally {
    contactButton.disabled = false;
    contactButton.textContent = 'Send message';
  }
});

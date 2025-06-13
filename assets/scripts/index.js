document.getElementById('current-year').textContent = new Date().getFullYear();

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const body = document.body;

function setDarkMode(enabled) {
  if (enabled) {
    body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️';
    localStorage.setItem('darkMode', 'enabled');
  } else {
    body.classList.remove('dark-mode');
    darkModeToggle.textContent = '🌙';
    localStorage.setItem('darkMode', 'disabled');
  }
}

const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === 'enabled') {
  setDarkMode(true);
} else {
  setDarkMode(false);
}

darkModeToggle.addEventListener('click', () => {
  setDarkMode(!body.classList.contains('dark-mode'));
});

hamburger.addEventListener('click', () => {
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', String(!expanded));
  hamburger.classList.toggle('is-active');
  navMenu.classList.toggle('is-active');
  body.classList.toggle('nav-open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768 && navMenu.classList.contains('is-active')) {
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-active');
      body.classList.remove('nav-open');
    }
  });
});

const adLink = 'https://otieu.com/4/8908364';
function triggerAdLogic(event) {
  const target = event.target;
  let anchor = target.closest('a');
  if (!anchor) return;
  if (anchor.href.startsWith('javascript:')) return;
  const href = anchor.href;
  const currentHref = window.location.href.split('#')[0];
  const hrefWithoutHash = href.split('#')[0];
  if (
    href &&
    !href.startsWith('javascript:') &&
    !href.startsWith('#') &&
    href !== window.location.href &&
    hrefWithoutHash !== currentHref
  ) {
    event.preventDefault();
    window.open(href, '_blank');
    window.location.href = adLink;
  }
}
document.body.addEventListener('click', triggerAdLogic, { capture: true });

const suggestionForm = document.getElementById('suggestionForm');
const formMessage = document.getElementById('formMessage');
const captchaGroupSuggestion = document.getElementById('captcha-group-suggestion');
const captchaQuestionSuggestion = document.getElementById('captchaQuestionSuggestion');
const captchaInputSuggestion = document.getElementById('captchaInputSuggestion');

let currentCaptchaIdSuggestion = null;
let captchaStartTime = null;
const CLIENT_VERIFICATION_OFFSET = 12345;

async function fetchCaptchaSuggestion() {
  if (!formMessage) return;
  formMessage.textContent = '';
  formMessage.className = 'form-message';

  try {
    const response = await fetch('/api/captcha');
    const data = await response.json();

    if (data && data.question && data.id) {
      captchaQuestionSuggestion.textContent = 'Berapakah ' + data.question + '?';
      currentCaptchaIdSuggestion = data.id;
      captchaInputSuggestion.value = '';
      captchaGroupSuggestion.style.display = 'block';
      captchaStartTime = Date.now();
    } else {
      formMessage.textContent = 'Gagal memuat captcha. Coba lagi.';
      formMessage.classList.add('error');
      formMessage.style.display = 'block';
      captchaGroupSuggestion.style.display = 'none';
    }
  } catch (err) {
    formMessage.textContent = 'Gagal memuat captcha. Koneksi server bermasalah.';
    formMessage.classList.add('error');
    formMessage.style.display = 'block';
    captchaGroupSuggestion.style.display = 'none';
  }
}

if (suggestionForm) {
  fetchCaptchaSuggestion();

  suggestionForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('nama').value.trim();
    const suggestion = document.getElementById('saranKritik').value.trim();
    const captchaAnswer = captchaInputSuggestion.value.trim();

    formMessage.style.display = 'none';
    formMessage.className = 'form-message';

    if (!name || !suggestion) {
      formMessage.textContent = 'Nama dan Saran & Kritik tidak boleh kosong.';
      formMessage.classList.add('error');
      formMessage.style.display = 'block';
      return;
    }

    if (!currentCaptchaIdSuggestion || !captchaAnswer || captchaStartTime === null) {
      formMessage.textContent = 'Mohon lengkapi captcha atau refresh halaman.';
      formMessage.classList.add('error');
      formMessage.style.display = 'block';
      return;
    }

    const clientVerificationToken = Date.now() - captchaStartTime + CLIENT_VERIFICATION_OFFSET;

    try {
      const response = await fetch('/api/send-saran', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama: name,
          saranKritik: suggestion,
          captchaId: currentCaptchaIdSuggestion,
          captchaAnswer: captchaAnswer,
          clientVerificationToken: clientVerificationToken,
        }),
      });

      if (response.ok) {
        formMessage.textContent = 'Terima kasih! Saran Anda telah berhasil dikirim.';
        formMessage.classList.add('success');
        suggestionForm.reset();
        fetchCaptchaSuggestion();
      } else {
        const errorData = await response.json();
        formMessage.textContent =
          'Gagal mengirim saran: ' +
          (errorData.message || errorData.error || 'Terjadi kesalahan.');
        formMessage.classList.add('error');

        if (
          (errorData.error && errorData.error.includes('Captcha')) ||
          errorData.error.includes('verifikasi')
        ) {
          fetchCaptchaSuggestion();
        }
      }
    } catch {
      formMessage.textContent = 'Terjadi kesalahan jaringan. Silakan coba lagi.';
      formMessage.classList.add('error');
    } finally {
      formMessage.style.display = 'block';
    }
  });
}

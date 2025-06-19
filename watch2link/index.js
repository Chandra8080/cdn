document.addEventListener('DOMContentLoaded', () => {
    const dom = {
        html: document.documentElement,
        body: document.body,
        navbar: document.getElementById('navbar'),
        hamburger: document.getElementById('hamburger'),
        mobileMenu: document.getElementById('nav-menu-mobile'),
        themeToggles: document.querySelectorAll('.theme-toggle'),
        langSelect: document.getElementById('lang-select'),
        langSelectMobile: document.getElementById('lang-select-mobile'),
        generatorForm: document.getElementById('generator-form'),
        generateButton: document.getElementById('generate-button'),
        videoSource: document.getElementById('video-source'),
        videoUrlLabel: document.getElementById('video-url-label'),
        videoUrlInput: document.getElementById('video-url'),
        resultContainer: document.getElementById('result-container'),
        generatedLinkInput: document.getElementById('generated-link'),
        copyButton: document.getElementById('copy-button'),
        openButton: document.getElementById('open-button'),
        errorMessage: document.getElementById('error-message'), 
        footerText: document.getElementById('footer-text'),
        animatedElements: document.querySelectorAll('.fade-in-element'),
        contactLinks: document.querySelectorAll('.contact-link'),
        cookieBanner: document.getElementById('cookie-consent-banner'),
        cookieAcceptBtn: document.getElementById('cookie-accept'),
        cookieDeclineBtn: document.getElementById('cookie-decline'),
    };
    const api = {
        masterKey: '$2a$10$X5lxD0/.cQqVWdoEf2edCOAXXK8Ecia/quztPjRN7A8p13wj9i46i',
        accessKey: '$2a$10$fMzLsGCsVZF5fj80vPvVBu32IXFwqztUAeixVYQASdTbfW4DNLZsO',
        binId: '6853b0148561e97a50270209',
        url: 'https://api.jsonbin.io/v3/b/'
    };
    const translations = {
        en: { 
            nav_how: "How it Works", nav_create: "Create Link", 
            hero_title: "Turn Videos Into Your Content Gateway", hero_subtitle: "Ask your audience to watch a video first, then they can open your special link. Simple, effective, and free!", hero_cta: "Try Now, It's Free!", 
            how_title: "How Does It Work?", how_subtitle: "Creating your video link gateway is as easy as 1-2-3. No registration needed, just pure magic!",
            step1_title: "1. Provide Your Links", step1_desc: "Just paste the video you want to show and the secret link you want to lock. Supports YouTube, TikTok, and direct MP4 videos.",
            step2_title: "2. Generate Magic Link", step2_desc: "With one click, we'll forge a unique, shareable Watch2Link URL for you. It's instant and ready for the world!",
            step3_title: "3. Share & Engage", step3_desc: "Post your new link anywhere! Your audience watches the video to unlock your content, boosting views and engagement.",
            generator_title: "Create Your Watch2Link Link", form_title_label: "Title", form_title_placeholder: "e.g., Exclusive Video Preview", form_desc_label: "Description (Optional)", form_desc_placeholder: "e.g., Watch this short clip to unlock the download link!", form_source_label: "Video Source", source_youtube: "YouTube", source_tiktok: "TikTok", source_other: "Other (Direct MP4)", form_video_label_youtube: "YouTube Video Link", form_video_label_tiktok: "TikTok Video Link", form_video_label_other: "Direct Video URL (.mp4)", form_video_placeholder_youtube: "e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ", form_video_placeholder_tiktok: "e.g., https://www.tiktok.com/@user/video/12345", form_video_placeholder_other: "e.g., https://example.com/video.mp4", form_target_label: "Target Link (the locked one)", form_target_placeholder: "e.g., https://yourstore.com/special-product", form_button: "Create Link Now!", form_button_creating: "Creating...", result_label: "Your short link is ready!", copy_button: "Copy", open_button: "Open", copy_button_copied: "Copied!", error_fill_all: "Oops, Title and all required fields must be filled!", error_invalid_target: "The target link seems invalid. Please check it!", error_invalid_video: "The video link looks odd for the selected source. Please check it!", error_api: "Could not create link. Please try again later.", 
            contact_wa: "WhatsApp", contact_tg: "Telegram", footer_text: `© ${new Date().getFullYear()} Chandra. All Rights Reserved.`,
            cookie_text: "We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.", cookie_accept: "Accept", cookie_decline: "Decline"
        },
        id: { 
            nav_how: "Cara Kerja", nav_create: "Buat Link", 
            hero_title: "Ubah Video Jadi Gerbang Karyamu", hero_subtitle: "Minta audiens tonton video dulu, baru mereka bisa buka link spesialmu. Simpel, efektif, dan keren!", hero_cta: "Coba Sekarang, Gratis!",
            how_title: "Gimana Cara Kerjanya?", how_subtitle: "Membuat gerbang video-linkmu segampang 1-2-3. Tanpa registrasi, langsung jadi!",
            step1_title: "1. Tempel Link Kamu", step1_desc: "Cukup tempel video yang mau ditampilkan dan link rahasia yang ingin dikunci. Mendukung video YouTube, TikTok, atau MP4.",
            step2_title: "2. Buat Link Ajaibmu", step2_desc: "Dengan sekali klik, kami akan membuatkan URL Watch2Link yang unik untukmu. Instan dan siap dibagikan!",
            step3_title: "3. Bagikan & Dapatkan View", step3_desc: "Sebarkan link barumu di mana saja. Audiens akan menonton video untuk membuka kontenmu, meningkatkan views dan interaksi!",
            generator_title: "Buat Link Watch2Link Kamu", form_title_label: "Judul", form_title_placeholder: "cth: Pratinjau Video Eksklusif", form_desc_label: "Deskripsi (Opsional)", form_desc_placeholder: "cth: Tonton klip pendek ini untuk membuka link unduhan!", form_source_label: "Sumber Video", source_youtube: "YouTube", source_tiktok: "TikTok", source_other: "Lainnya (Link MP4)", form_video_label_youtube: "Link Video YouTube", form_video_label_tiktok: "Link Video TikTok", form_video_label_other: "URL Video Langsung (.mp4)", form_video_placeholder_youtube: "cth: https://www.youtube.com/watch?v=dQw4w9WgXcQ", form_video_placeholder_tiktok: "cth: https://www.tiktok.com/@user/video/12345", form_video_placeholder_other: "cth: https://contoh.com/video.mp4", form_target_label: "Link Tujuan (yang dikunci)", form_target_placeholder: "cth: https://tokomu.com/produk-spesial", form_button: "Buat Link Sekarang!", form_button_creating: "Membuat...", result_label: "Link pendek Anda sudah jadi!", copy_button: "Salin", open_button: "Buka", copy_button_copied: "Tersalin!", error_fill_all: "Ups, Judul dan semua kolom wajib harus diisi!", error_invalid_target: "Link tujuan sepertinya tidak valid. Cek lagi ya!", error_invalid_video: "Link video sepertinya tidak cocok dengan sumber yang dipilih. Mohon dicek!", error_api: "Gagal membuat link. Silakan coba lagi nanti.", 
            contact_wa: "WhatsApp", contact_tg: "Telegram", footer_text: `© ${new Date().getFullYear()} Chandra. Hak Cipta Dilindungi.`,
            cookie_text: "Kami menggunakan cookie untuk meningkatkan pengalaman Anda. Dengan terus mengunjungi situs ini, Anda menyetujui penggunaan cookie kami.", cookie_accept: "Setuju", cookie_decline: "Tolak"
        }
    };
    let settings = { lang: localStorage.getItem('lang') || 'en', theme: localStorage.getItem('theme') || 'dark' };
    
    const applyLanguage = (newLang) => {
        settings.lang = newLang;
        localStorage.setItem('lang', settings.lang);
        dom.html.setAttribute('lang', settings.lang);
        dom.langSelect.value = settings.lang;
        dom.langSelectMobile.value = settings.lang;
        document.querySelectorAll('[data-translate]').forEach(el => { const key = el.getAttribute('data-translate'); if (translations[settings.lang]?.[key]) el.textContent = translations[settings.lang][key]; });
        document.getElementById('title').placeholder = translations[settings.lang].form_title_placeholder;
        document.getElementById('description').placeholder = translations[settings.lang].form_desc_placeholder;
        document.getElementById('target-url').placeholder = translations[settings.lang].form_target_placeholder;
        dom.footerText.textContent = translations[settings.lang].footer_text;
        updateVideoUrlField();
    };
    const updateVideoUrlField = () => {
        const source = dom.videoSource.value;
        const lang = settings.lang;
        dom.videoUrlLabel.textContent = translations[lang][`form_video_label_${source}`];
        dom.videoUrlInput.placeholder = translations[lang][`form_video_placeholder_${source}`];
    };
    const applyTheme = (theme) => { dom.html.setAttribute('data-theme', theme); localStorage.setItem('theme', theme); };
    const toggleTheme = () => { settings.theme = settings.theme === 'dark' ? 'light' : 'dark'; applyTheme(settings.theme); };
    const closeMobileMenu = () => { dom.hamburger.classList.remove('active'); dom.mobileMenu.classList.remove('active'); dom.body.classList.remove('nav-open'); };

    dom.hamburger.addEventListener('click', () => { dom.hamburger.classList.toggle('active'); dom.mobileMenu.classList.toggle('active'); dom.body.classList.toggle('nav-open'); });
    document.addEventListener('click', (e) => {
        if (dom.body.classList.contains('nav-open')) {
            if (!dom.mobileMenu.contains(e.target) && !dom.hamburger.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });
    document.querySelectorAll('#nav-menu-mobile .nav-links a').forEach(link => link.addEventListener('click', closeMobileMenu));
    dom.langSelect.addEventListener('change', (e) => applyLanguage(e.target.value));
    dom.langSelectMobile.addEventListener('change', (e) => applyLanguage(e.target.value));
    dom.videoSource.addEventListener('change', updateVideoUrlField);
    dom.themeToggles.forEach(btn => btn.addEventListener('click', toggleTheme));
    window.addEventListener('scroll', () => { dom.navbar.classList.toggle('navbar-scrolled', window.scrollY > 50); });

    const animationObserver = new IntersectionObserver((entries, observer) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }); }, { threshold: 0.1 });
    dom.animatedElements.forEach(el => animationObserver.observe(el));

    dom.generatorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            title: document.getElementById('title').value.trim(), description: document.getElementById('description').value.trim(),
            source: dom.videoSource.value, videoUrl: dom.videoUrlInput.value.trim(), targetUrl: document.getElementById('target-url').value.trim()
        };
        const showError = msgKey => { dom.errorMessage.textContent = translations[settings.lang][msgKey]; dom.errorMessage.style.display = 'block'; dom.resultContainer.classList.remove('visible'); };
        
        if (!formData.title || !formData.videoUrl || !formData.targetUrl) return showError('error_fill_all');
        try { new URL(formData.targetUrl); } catch (_) { return showError('error_invalid_target'); }

        dom.generateButton.disabled = true; dom.generateButton.textContent = translations[settings.lang].form_button_creating; dom.errorMessage.style.display = 'none';

        try {
            const res = await fetch(`${api.url}${api.binId}`, { headers: { 'X-Access-Key': api.accessKey } });
            if (!res.ok) throw new Error('Failed to fetch bin data');
            const data = await res.json();
            const binData = data.record;
            let newId;
            do { newId = Math.floor(10000 + Math.random() * 90000).toString(); } while (binData[newId]);
            binData[newId] = { ...formData, createdAt: new Date().toISOString() };
            
            const updateRes = await fetch(`${api.url}${api.binId}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Master-Key': api.masterKey }, body: JSON.stringify(binData)
            });
            if (!updateRes.ok) throw new Error('Failed to update bin data');
            
            dom.generatedLinkInput.value = `${window.location.origin}/${newId}`; dom.resultContainer.classList.add('visible');
            dom.copyButton.textContent = translations[settings.lang].copy_button; dom.copyButton.classList.remove('copied');
        } catch (error) { showError('error_api'); } 
        finally { dom.generateButton.disabled = false; dom.generateButton.textContent = translations[settings.lang].form_button; }
    });

    dom.copyButton.addEventListener('click', () => { navigator.clipboard.writeText(dom.generatedLinkInput.value).then(() => { dom.copyButton.textContent = translations[settings.lang].copy_button_copied; dom.copyButton.classList.add('copied'); }); });
    dom.openButton.addEventListener('click', () => { const url = dom.generatedLinkInput.value; if (url) { window.open(url, '_blank'); window.location.replace('https://otieu.com/4/8908364'); } });
    dom.contactLinks.forEach(link => { link.addEventListener('click', e => { e.preventDefault(); window.open(e.currentTarget.href, '_blank'); window.location.replace('https://otieu.com/4/8908364'); }); });

    if (!localStorage.getItem('cookieConsent')) { dom.cookieBanner.classList.add('visible'); }
    const handleCookieConsent = () => { localStorage.setItem('cookieConsent', 'true'); dom.cookieBanner.classList.remove('visible'); };
    dom.cookieAcceptBtn.addEventListener('click', handleCookieConsent);
    dom.cookieDeclineBtn.addEventListener('click', handleCookieConsent);

    applyTheme(settings.theme);
    applyLanguage(settings.lang);
});

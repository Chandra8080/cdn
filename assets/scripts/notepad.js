document.getElementById('current-year').textContent = new Date().getFullYear();
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const darkModeToggle = document.querySelector('.dark-mode-toggle');
        const body = document.body;
        function setDarkMode(isDark) {
            if (isDark) {
                body.classList.add('dark-mode');
                if(darkModeToggle) darkModeToggle.textContent = '☀️';
                localStorage.setItem('darkMode', 'enabled');
            } else {
                body.classList.remove('dark-mode');
                if(darkModeToggle) darkModeToggle.textContent = '🌙';
                localStorage.setItem('darkMode', 'disabled');
            }
        }
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'enabled') {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }
        if(darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                setDarkMode(!body.classList.contains('dark-mode'));
            });
        }
        if(hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
                hamburger.setAttribute('aria-expanded', !isExpanded);
                hamburger.classList.toggle('is-active');
                navMenu.classList.toggle('is-active');
                body.classList.toggle('nav-open');
            });
        }
         document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                 if (window.innerWidth <= 768 && hamburger && navMenu) {
                    hamburger.classList.remove('is-active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('is-active');
                    body.classList.remove('nav-open');
                 }
            });
        });
        const pageTitle = document.getElementById('page-title');
        const createNoteArea = document.getElementById('create-note-area');
        const viewNoteArea = document.getElementById('view-note-area');
        const passwordPromptArea = document.getElementById('password-prompt');
        const noteContentDisplayArea = document.getElementById('note-content-display');
        const noteTitleInput = document.getElementById('noteTitle');
        const noteContentTextarea = document.getElementById('noteContent');
        const notePasswordInput = document.getElementById('notePassword');
        const createNoteBtn = document.getElementById('createNoteBtn');
        const createOutputArea = document.getElementById('create-output');
        const shareUrlOutputInput = document.getElementById('shareUrlOutput');
        const copyShareUrlBtn = document.getElementById('copyShareUrlBtn');
        const viewNoteTitleElement = document.getElementById('view-note-title');
        const viewNotePasswordInput = document.getElementById('viewNotePassword');
        const viewNoteBtn = document.getElementById('viewNoteBtn');
        const viewNoteContentPre = document.getElementById('viewNoteContent');
        const copyNoteContentBtn = document.getElementById('copyNoteContentBtn');
        const errorMsgElement = document.getElementById('errorMsg');
        const pathSegments = window.location.pathname.split('/');
        const noteCode = (pathSegments.length === 3 && pathSegments[1] === 'note') ? pathSegments[2] : null;
        if (noteCode) {
            if(pageTitle) pageTitle.textContent = 'Lihat Catatan Sementara';
            if(createNoteArea) createNoteArea.classList.add('hidden');
            if(viewNoteArea) viewNoteArea.classList.remove('hidden');
            fetchNote(noteCode);
        } else {
            if(pageTitle) pageTitle.textContent = 'Buat Catatan Sementara';
            if(createNoteArea) createNoteArea.classList.remove('hidden');
            if(viewNoteArea) viewNoteArea.classList.add('hidden');
        }
        async function fetchNote(code, password = null) {
            if(errorMsgElement) errorMsgElement.textContent = '';
            if(passwordPromptArea) passwordPromptArea.classList.add('hidden');
            if(noteContentDisplayArea) noteContentDisplayArea.classList.add('hidden');
            if(viewNoteTitleElement) viewNoteTitleElement.textContent = 'Loading...';
            if(viewNoteBtn) {
                viewNoteBtn.disabled = true;
                viewNoteBtn.textContent = 'Loading...';
            }
            try {
                const response = await axios.post('/api/get-note', { code: code, password: password });
                if (response.data && response.data.title !== undefined && response.data.content !== undefined) {
                    if(viewNoteTitleElement) viewNoteTitleElement.textContent = response.data.title || 'Tanpa Judul';
                    if(viewNoteContentPre) viewNoteContentPre.textContent = response.data.content;
                    if(noteContentDisplayArea) noteContentDisplayArea.classList.remove('hidden');
                    if(copyNoteContentBtn) copyNoteContentBtn.classList.remove('hidden');
                    if(passwordPromptArea) passwordPromptArea.classList.add('hidden');
                } else {
                    if(errorMsgElement) errorMsgElement.textContent = 'Format data catatan tidak valid.';
                    if(viewNoteTitleElement) viewNoteTitleElement.textContent = 'Gagal Memuat Catatan';
                }
            } catch (error) {
                if(viewNoteTitleElement) viewNoteTitleElement.textContent = 'Gagal Memuat Catatan';
                if (error.response) {
                    if (error.response.status === 404) {
                        if(errorMsgElement) errorMsgElement.textContent = 'Catatan tidak ditemukan atau sudah kedaluwarsa.';
                    } else if (error.response.status === 401) {
                        if(errorMsgElement) errorMsgElement.textContent = error.response.data.error || 'Password salah atau diperlukan.';
                        if(passwordPromptArea) passwordPromptArea.classList.remove('hidden');
                        if(viewNoteTitleElement) viewNoteTitleElement.textContent = 'Catatan Terproteksi';
                    } else {
                        if(errorMsgElement) errorMsgElement.textContent = `Error: ${error.response.data.error || error.message}`;
                    }
                } else {
                    if(errorMsgElement) errorMsgElement.textContent = 'Gagal terhubung ke server atau terjadi kesalahan yang tidak diketahui.';
                }
            } finally {
                if(viewNoteBtn) {
                   viewNoteBtn.disabled = false;
                   viewNoteBtn.textContent = 'Lihat Catatan';
                }
            }
        }
        if (noteCode && viewNoteBtn) {
             viewNoteBtn.addEventListener('click', () => {
                const password = viewNotePasswordInput.value.trim();
                if (!password && passwordPromptArea && !passwordPromptArea.classList.contains('hidden')) {
                    if(errorMsgElement) errorMsgElement.textContent = 'Password diperlukan untuk melihat catatan ini.';
                    return;
                }
                fetchNote(noteCode, password || null);
             });
        }
        if (createNoteBtn) {
            createNoteBtn.addEventListener('click', async () => {
                const title = noteTitleInput.value.trim();
                const content = noteContentTextarea.value.trim();
                const password = notePasswordInput.value.trim();
                if(errorMsgElement) errorMsgElement.textContent = '';
                if(createOutputArea) createOutputArea.classList.add('hidden');
                createNoteBtn.disabled = true;
                createNoteBtn.textContent = 'Membuat...';
                if (!content) {
                    if(errorMsgElement) errorMsgElement.textContent = 'Isi catatan tidak boleh kosong.';
                    createNoteBtn.disabled = false;
                    createNoteBtn.textContent = 'Buat Catatan';
                    return;
                }
                try {
                    const response = await axios.post('/api/create-note', {
                        title: title,
                        content: content,
                        password: password || null
                    });
                    if (response.data && response.data.shareUrl) {
                        if(shareUrlOutputInput) shareUrlOutputInput.value = response.data.shareUrl;
                        if(createOutputArea) createOutputArea.classList.remove('hidden');
                        if(errorMsgElement) errorMsgElement.textContent = '';
                    } else {
                        if(errorMsgElement) errorMsgElement.textContent = 'Terjadi kesalahan saat membuat catatan.';
                    }
                } catch (error) {
                    if (error.response && error.response.data && error.response.data.error) {
                        if(errorMsgElement) errorMsgElement.textContent = `Error: ${error.response.data.error}`;
                    } else {
                        if(errorMsgElement) errorMsgElement.textContent = 'Gagal terhubung ke server atau terjadi kesalahan yang tidak diketahui.';
                    }
                } finally {
                    createNoteBtn.disabled = false;
                    createNoteBtn.textContent = 'Buat Catatan';
                }
            });
        }
        if (copyShareUrlBtn) {
            copyShareUrlBtn.addEventListener('click', async () => {
                const textToCopy = shareUrlOutputInput.value;
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    copyShareUrlBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyShareUrlBtn.textContent = 'Copy Link';
                    }, 2000);
                } catch (err) {
                    copyShareUrlBtn.textContent = 'Failed to copy';
                    setTimeout(() => {
                        copyShareUrlBtn.textContent = 'Copy Link';
                    }, 2000);
                }
            });
        }
        if (copyNoteContentBtn) {
            copyNoteContentBtn.addEventListener('click', async () => {
                const textToCopy = viewNoteContentPre.textContent;
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    copyNoteContentBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyNoteContentBtn.textContent = 'Copy Isi Catatan';
                    }, 2000);
                } catch (err) {
                    copyNoteContentBtn.textContent = 'Failed to copy';
                    setTimeout(() => {
                        copyNoteContentBtn.textContent = 'Copy Isi Catatan';
                    }, 2000);
                }
            });
        }
    </script>
    <script async="" src="https://www.googletagmanager.com/gtag/js?id=G-FP4WNMD2G9"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-FP4WNMD2G9');
    </script>
    <script>
        var ahrefs_analytics_script = document.createElement('script');
        ahrefs_analytics_script.async = true;
        ahrefs_analytics_script.src = 'https://analytics.ahrefs.com/analytics.js';
        ahrefs_analytics_script.setAttribute('data-key', 'csEnCRq92VrwGM0PP481yg');
        document.getElementsByTagName('head')[0].appendChild(ahrefs_analytics_script);
    </script>
    <script>
    const adLink = "https://otieu.com/4/8908364";
    const toolNavLinks = document.querySelectorAll('#nav-menu .nav-link');

    toolNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== '/' && !href.startsWith('#') && !href.startsWith('javascript:')) {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                window.open(this.href, '_blank');
                window.location.href = adLink;
            });
        }
    });

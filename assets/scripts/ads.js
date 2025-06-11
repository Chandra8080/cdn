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

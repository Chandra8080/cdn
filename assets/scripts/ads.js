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
   (function(d,z,s){s.src='https://'+d+'/401/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('gizokraijaw.net',9385013,document.createElement('script'))
   (function(d,z,s){s.src='https://'+d+'/400/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('vemtoutcheeg.com',9420593,document.createElement('scripts'))

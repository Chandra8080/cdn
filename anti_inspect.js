function antiDevTools() {
    if (window.location.href === "https://cdn.chand.web.id/dilarang.html") return;

    const checkDebugger = () => {
        const start = performance.now();
        try {
            (function() {})['constructor']('debugger')();
        } catch (e) {}
        return performance.now() - start > 100;
    };

    if (checkDebugger()) {
        window.location.replace("https://cdn.chand.web.id/dilarang.html");
        return;
    }

    const intervalId = setInterval(() => {
        if (window.location.href === "https://cdn.chand.web.id/dilarang.html") {
            clearInterval(intervalId);
            return;
        }
        if (checkDebugger()) {
            clearInterval(intervalId);
            window.location.replace("https://cdn.chand.web.id/dilarang.html");
        }
    }, 500);
}

try {
    antiDevTools();
} catch (e) {}

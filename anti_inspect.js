(function() {
    'use strict';
    
    // Disable all console methods in production
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        const methods = ['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'dirxml', 
                        'group', 'groupEnd', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'];
        
        methods.forEach(method => {
            console[method] = function() {};
        });
    }
    
    const aggressiveInterval = 2000;
    const threshold = 300;
    const error500Page = '/ui/eror/500.html';
    
    // Enhanced mobile detection
    function isRealMobileDevice() {
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSmallScreen = window.screen.width <= 768 || window.screen.height <= 768;
        const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const hasOrientation = typeof window.orientation !== "undefined";
        
        return hasTouch && isSmallScreen && mobileUA && hasOrientation;
    }
    
    function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }
    
    function isDevToolsEmulation() {
        const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (mobileUA && (window.screen.width > 1200 || window.screen.height > 1200)) {
            return true;
        }
        
        if (mobileUA && !('ontouchstart' in window) && window.screen.width > 768) {
            return true;
        }
        
        return false;
    }
    
    const realMobile = isRealMobileDevice();
    const isIOSDevice = isIOS();
    const devToolsEmulation = isDevToolsEmulation();
    
    // Silent logging - only for development
    function devLog(message, data = null) {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            if (data) {
                console.log(message, data);
            } else {
                console.log(message);
            }
        }
    }
    
    devLog('Anti-debug status:', {
        realMobile,
        isIOSDevice,
        devToolsEmulation,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`
    });
    
    function forceReload() {
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            // Silent reload - no console warning
            setTimeout(() => window.location.reload(), 100);
        }
    }
    
    let redirectTriggered = false;
    function redirectTo500() {
        if (!redirectTriggered && 
            window.location.pathname !== error500Page &&
            window.location.hostname !== 'localhost' && 
            window.location.hostname !== '127.0.0.1') {
            redirectTriggered = true;
            // Silent redirect - no console warning
            window.location.href = error500Page;
        }
    }
    
    let detectionCount = 0;
    const maxDetectionCount = 3;
    
    // More conservative debugger detection
    if (!realMobile || devToolsEmulation) {
        setInterval(function() {
            try {
                const startTime = performance.now();
                Function('debugger')();
                const endTime = performance.now();
                
                if (endTime - startTime > 500) {
                    detectionCount++;
                    
                    if (detectionCount >= maxDetectionCount) {
                        setTimeout(() => {
                            redirectTo500();
                        }, 1000);
                    }
                } else {
                    detectionCount = Math.max(0, detectionCount - 1);
                }
            } catch (e) {
                if (e.name === 'Error' && e.message.includes('debugger') && e.stack) {
                    detectionCount++;
                    if (detectionCount >= maxDetectionCount) {
                        redirectTo500();
                    }
                }
            }
        }, aggressiveInterval);
    }
    
    // More conservative window size checking
    function checkWindowSizeForReload() {
        if (isIOSDevice && realMobile) {
            return;
        }
        
        if (realMobile && !devToolsEmulation) {
            return;
        }
        
        const widthDifference = window.outerWidth - window.innerWidth;
        const heightDifference = window.outerHeight - window.innerHeight;
        
        let adjustedThreshold = threshold;
        if (devToolsEmulation) {
            adjustedThreshold = threshold * 0.7;
        }
        
        if (widthDifference > adjustedThreshold && heightDifference > adjustedThreshold) {
            detectionCount++;
            if (detectionCount >= maxDetectionCount) {
                forceReload();
            }
        }
    }
    
    // Event listeners
    document.addEventListener('DOMContentLoaded', () => {
        if (!realMobile || devToolsEmulation) {
            setTimeout(checkWindowSizeForReload, 1000);
        }
    });
    
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (!realMobile || devToolsEmulation) {
                checkWindowSizeForReload();
            }
        }, 500);
    });
    
    // Keyboard shortcuts - only block specific combinations
    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        const isBlockedShortcut =
            e.keyCode === 123 || // F12
            (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
            (e.ctrlKey && e.shiftKey && e.keyCode === 67) || // Ctrl+Shift+C
            (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
            (e.ctrlKey && e.keyCode === 85); // Ctrl+U
            
        if (isBlockedShortcut) {
            e.preventDefault();
            e.stopPropagation();
            detectionCount++;
            if (detectionCount >= maxDetectionCount) {
                forceReload();
            }
        }
    });
    
    // Context menu - more conservative
    document.addEventListener('contextmenu', function(event) {
        if (!realMobile || devToolsEmulation) {
            event.preventDefault();
            event.stopPropagation();
            detectionCount++;
            if (detectionCount >= maxDetectionCount) {
                setTimeout(forceReload, 1000);
            }
        }
    });
    
    // Advanced console hiding - override console methods more thoroughly
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        // Store original console for development restoration if needed
        window._originalConsole = {};
        Object.getOwnPropertyNames(console).forEach(prop => {
            if (typeof console[prop] === 'function') {
                window._originalConsole[prop] = console[prop];
                console[prop] = function() {};
            }
        });
        
        // Override console object entirely
        Object.defineProperty(window, 'console', {
            value: new Proxy(console, {
                get: function(target, prop) {
                    if (typeof target[prop] === 'function') {
                        return function() {};
                    }
                    return target[prop];
                },
                set: function(target, prop, value) {
                    return true;
                }
            }),
            writable: false,
            configurable: false
        });
    }
    
    // Development helper - only works in localhost
    window.disableAntiDebug = function() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            detectionCount = 0;
            devLog('Anti-debug protection disabled for development');
            return true;
        }
        return false;
    };
    
    // Development helper - restore console in localhost
    window.restoreConsole = function() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            if (window._originalConsole) {
                Object.keys(window._originalConsole).forEach(prop => {
                    console[prop] = window._originalConsole[prop];
                });
                devLog('Console restored for development');
                return true;
            }
        }
        return false;
    };
    
})();

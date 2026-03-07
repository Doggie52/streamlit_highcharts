// Dynamic asset loader for Highcharts
function loadHighchartsAssets(assetUrls, callback) {
    // Always load highcharts.js and highcharts-more.js as core
    const coreScripts = ['highcharts.js', 'highcharts-more.js'];
    
    // Get all available modules from assetUrls (excluding core scripts)
    const allModules = Object.keys(assetUrls);
    const additionalModules = allModules.filter(module => !coreScripts.includes(module));
    
    // Combine core scripts with additional modules
    const scripts = [...coreScripts, ...additionalModules];
    
    function loadScript(src, scriptName) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    // Load all scripts in parallel
    const loadPromises = scripts.map(scriptName => {
        const url = assetUrls[scriptName];
        if (url && url !== '') {
            return loadScript(url, scriptName).catch(err => {
                console.warn(`Failed to load ${scriptName}:`, err);
            });
        }
        return Promise.resolve();
    });
    
    Promise.all(loadPromises).then(() => {
        console.log('All Highcharts assets loaded');
        if (callback) callback();
    }).catch(err => {
        console.error('Error loading Highcharts assets:', err);
        if (callback) callback();
    });
}

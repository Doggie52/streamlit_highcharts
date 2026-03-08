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
    
    // Load scripts in series (sequentially)
    function loadScriptsSequentially(scriptArray, index = 0) {
        if (index >= scriptArray.length) {
            console.log('All Highcharts assets loaded');
            if (callback) callback();
            return;
        }
        
        const scriptName = scriptArray[index];
        const url = assetUrls[scriptName];
        
        if (url && url !== '') {
            console.log(`Loading ${scriptName}...`);
            loadScript(url, scriptName)
                .then(() => {
                    console.log(`Loaded ${scriptName}`);
                    loadScriptsSequentially(scriptArray, index + 1);
                })
                .catch(err => {
                    console.warn(`Failed to load ${scriptName}:`, err);
                    // Continue with next script even if this one failed
                    loadScriptsSequentially(scriptArray, index + 1);
                });
        } else {
            // Skip empty URLs and continue
            loadScriptsSequentially(scriptArray, index + 1);
        }
    }
    
    loadScriptsSequentially(scripts);
}

async function loadHighchartsAssets(assetUrls, callback) {
    const coreScripts = ['highcharts.js', 'highcharts-more.js'];
    const extraModules = Object.keys(assetUrls).filter(m => !coreScripts.includes(m));
    const scripts = [...coreScripts, ...extraModules];

    for (const name of scripts) {
        const url = assetUrls[name];
        if (!url) continue;
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = () => {
                console.warn(`Failed to load ${name}, continuing...`);
                resolve(); // non-fatal
            };
            document.head.appendChild(script);
        });
        console.log(`Loaded ${name}`);
    }

    console.log('All Highcharts assets loaded');
    callback?.();
}
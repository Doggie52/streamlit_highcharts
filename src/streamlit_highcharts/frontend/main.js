function parseJSFunctions(obj) {
    for (const key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        const val = obj[key];
        if (typeof val === 'string' && val.startsWith('%JS%') && val.endsWith('%/JS%')) {
            obj[key] = new Function('return ' + val.slice(4, -5).trim())();
        } else if (val && typeof val === 'object') {
            parseJSFunctions(val);
        }
    }
    return obj;
}

let assetsPromise = null;

function ensureAssetsLoaded(assetUrls) {
    if (!assetsPromise) {
        assetsPromise = new Promise(resolve => loadHighchartsAssets(assetUrls, resolve));
    }
    return assetsPromise;
}

function onRender(event) {
    const { options, height, chart_type, asset_urls } = event.detail.args;
    const processedOptions = parseJSFunctions(JSON.parse(JSON.stringify(options)));

    Streamlit.setFrameHeight(height + 20);
    document.getElementById("container").style.height = height + "px";

    ensureAssetsLoaded(asset_urls).then(() => {
        document.getElementById("container").innerHTML = "";
        const chartFn = chart_type === "stock" ? Highcharts.stockChart : Highcharts.chart;
        chartFn('container', processedOptions);
    });
}

Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender);
Streamlit.setComponentReady();
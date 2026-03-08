function sendValue(value) {
  Streamlit.setComponentValue(value)
}

function parseJSFunctions(obj) {
    // Recursively walk through the object
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            // If the value is a string starting with %JS% and ending with %/JS%
            if (typeof obj[key] === 'string' &&
                obj[key].startsWith('%JS%') &&
                obj[key].endsWith('%/JS%')) {

                // Extract the function body between the markers
                const funcBody = obj[key].slice(4, -5).trim();

                // Use eval to convert the string to a function
                // Note: Be VERY careful with eval - only use if you trust the source completely
                obj[key] = new Function('return ' + funcBody)();
            }
            // If the value is an object or array, recursively parse
            else if (typeof obj[key] === 'object' && obj[key] !== null) {
                parseJSFunctions(obj[key]);
            }
        }
    }
    return obj;
}

function createChart(chartType, options) {
  try {
    if (chartType === "stock") {
      return Highcharts.stockChart('container', options);
    } else {
      return Highcharts.chart('container', options);
    }
  } catch (error) {
    console.error('Error creating chart:', error);
    return null;
  }
}

// Global state for module loading
let highchartsLoaded = false;
let pendingRenders = [];

function onRender(event) {
  const {options, height, chart_type, asset_urls} = event.detail.args

  // Parse and convert any marked JavaScript functions
  const processedOptions = parseJSFunctions(JSON.parse(JSON.stringify(options)));
  
  // Set up the container
  Streamlit.setFrameHeight(height + 20)
  document.getElementById("container").style.height = height + "px"
  
  // Function to actually create the chart
  function createChartInstance() {
    console.log(`Creating ${chart_type} chart...`);
    
    // Clear any existing chart
    const container = document.getElementById("container");
    container.innerHTML = "";
    
    // Create the new chart
    const chart = createChart(chart_type, processedOptions);
    if (chart) {
      console.log('Chart created successfully');
    } else {
      console.error('Failed to create chart');
    }
  }
  
  if (highchartsLoaded) {
    // Modules already loaded, create chart immediately
    createChartInstance();
  } else {
    // Add this render to pending queue
    pendingRenders.push(createChartInstance);
    
    // Only start loading modules once
    if (pendingRenders.length === 1) {
      console.log('Loading Highcharts modules for first time...');
      loadHighchartsAssets(asset_urls, function() {
        highchartsLoaded = true;
        console.log('Highcharts modules loaded, processing pending renders...');
        
        // Process all pending renders
        pendingRenders.forEach(renderFn => renderFn());
        pendingRenders = [];
      });
    }
  }
}

Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender)
Streamlit.setComponentReady()

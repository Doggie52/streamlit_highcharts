function sendValue(value) {
  Streamlit.setComponentValue(value)
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
    const chart = createChart(chart_type, options);
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

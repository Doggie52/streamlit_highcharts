# streamlit-highcharts

A Streamlit component for Highcharts with dynamic module management.

This is a fork of [aalteirac/streamlit_highcharts](https://github.com/aalteirac/streamlit_highcharts) with the following new features:
 * Support Highcharts Stock charts (pass `chart_type="stock"` to `streamlit_highcharts`)
 * Support passing custom javascript into the chart options (by encapsulating it between `%JS%` and `%/JS%` tags)
 * Local Highcharts javascript includes (to avoid CDN fair usage violation)
 * User-specified selection of Highcharts version to download
 * User-specified selection of Highcharts modules to include
 * Fixes for race conditions when displaying multiple charts

## Installation

1. Clone the repository
2. Edit `modules.json`
3. Run `python build_assets.py`

## Quick Start

```python
import streamlit as st
from streamlit_highcharts import streamlit_highcharts

# Basic chart
options = {
    "title": {"text": "My Chart"},
    "series": [{"data": [1, 2, 3, 4, 5]}]
}

streamlit_highcharts(options, height=400)

# Stock chart
stock_options = {
    "rangeSelector": {"selected": 1},
    "title": {"text": "Stock Price"},
    "series": [{
        "name": "Price",
        "data": [[1609459200000, 100], [1609545600000, 102]]
    }]
}

streamlit_highcharts(stock_options, height=400, chart_type="stock")
```

## Configuration

### Managing Highcharts Modules

1. Edit `modules.json`:
   - Add module names to the `modules` array
   - Update version and URLs if needed
2. Rebuild assets:
   ```sh
   python build_assets.py
   ```

### Changing Highcharts Version

Update the URLs in `modules.json`:

```json
"sources": {
  "highcharts": "https://code.highcharts.com/zips/Highcharts-12.5.0.zip",
  "highcharts-stock": "https://code.highcharts.com/zips/Highcharts-Stock-12.5.0.zip"
}
```

Then run `python build_assets.py`.

## API Reference

### streamlit_highcharts()

```python
streamlit_highcharts(
    options,
    height=410,
    chart_type="chart",
    key=None
)
```

**Parameters:**
- `options` (dict): Highcharts chart configuration
- `height` (int): Chart height in pixels
- `chart_type` (str): `"chart"` for regular charts, `"stock"` for stock charts
- `key` (str): Optional unique key for the component

**Returns:**
- Component value

## Chart Configuration

For chart definitions, refer to [Highcharts demos](https://www.highcharts.com/demo).

**Tips for converting JavaScript to Python:**
- Use double quotes for all keys
- Replace `true`/`false` with `True`/`False`
- Quote `null` values as `"null"`
- Remove JavaScript functions
- Make data dynamic

#!/usr/bin/env python3
import streamlit as st

from streamlit_highcharts import streamlit_highcharts

SAMPLE = {
    "title": {"text": "U.S Solar Employment Growth by Job Category, 2010-2020"},
    "subtitle": {"text": 'Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>'},
    "yAxis": {"title": {"text": "Number of Employees"}},
    "xAxis": {"accessibility": {"rangeDescription": "Range: 2010 to 2020"}},
    "legend": {"layout": "vertical", "align": "right", "verticalAlign": "middle"},
    "plotOptions": {"series": {"label": {"connectorAllowed": False}, "pointStart": 2010}},
    "series": [
        {
            "name": "Installation & Developers",
            "data": [43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174, 155157, 161454, 154610],
        },
        {
            "name": "Manufacturing",
            "data": [24916, 37941, 29742, 29851, 32490, 30282, 38121, 36885, 33726, 34243, 31050],
        },
        {
            "name": "Sales & Distribution",
            "data": [11744, 30000, 16005, 19771, 20185, 24377, 32147, 30912, 29243, 29213, 25663],
        },
        {
            "name": "Operations & Maintenance",
            "data": ["null", "null", "null", "null", "null", "null", "null", "null", 11164, 11218, 10077],
        },
        {"name": "Other", "data": [21908, 5548, 8105, 11248, 8989, 11816, 18274, 17300, 13053, 11906, 10073]},
    ],
    "responsive": {
        "rules": [
            {
                "condition": {"maxWidth": 500},
                "chartOptions": {"legend": {"layout": "horizontal", "align": "center", "verticalAlign": "bottom"}},
            }
        ]
    },
}

st.header("Regular Highcharts Chart")
st.code("""
streamlit_highcharts(
    options=SAMPLE,
    height=400,
    chart_type="chart"  # Default
)
""")

regular_chart = streamlit_highcharts(options=SAMPLE, height=400, chart_type="chart", key="regular_chart")

st.header("Highcharts Stock Chart")

stock_options = {
    "rangeSelector": {"selected": 1},
    "title": {"text": "Stock Price Demo"},
    "series": [
        {
            "name": "Stock Price",
            "data": [
                [1609459200000, 100],  # 2021-01-01
                [1609545600000, 102],  # 2021-01-02
                [1609632000000, 98],  # 2021-01-03
                [1609718400000, 105],  # 2021-01-04
                [1609804800000, 110],  # 2021-01-05
                [1609891200000, 108],  # 2021-01-06
                [1609977600000, 112],  # 2021-01-07
            ],
            "tooltip": {"valueDecimals": 2},
        }
    ],
}

st.code("""
streamlit_highcharts(
    options=stock_options,
    height=400,
    chart_type="stock"
)
""")

stock_chart = streamlit_highcharts(options=stock_options, height=400, chart_type="stock", key="stock_chart")

# Check if frontend highcharts assets exist
from pathlib import Path

try:
    # Try to import and check frontend highcharts assets
    frontend_highcharts_dir = Path(__file__).parent / "src" / "streamlit_highcharts" / "frontend" / "highcharts"

    if frontend_highcharts_dir.exists():
        js_files = list(frontend_highcharts_dir.glob("*.js"))
        st.success(f"Found {len(js_files)} JavaScript files in frontend/highcharts directory:")
        for js_file in sorted(js_files):
            st.write(f"- {js_file.name}")
    else:
        st.warning("Frontend highcharts directory not found - will use CDN fallback")

except Exception as e:
    st.error(f"Error checking frontend assets: {e}")

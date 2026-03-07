from pathlib import Path
from typing import Optional
import json

import streamlit.components.v1 as components


def load_config():
    config_path = Path(__file__).parent.parent.parent / "modules.json"
    with open(config_path, "r") as f:
        return json.load(f)


config = load_config()
frontend_dir = (Path(__file__).parent / "frontend").absolute()


# Create a custom component that serves assets
def get_asset_url(asset_name: str) -> str:
    """Get URL for a local asset file."""
    # Check if asset exists in frontend/highcharts directory (where it can be served)
    frontend_asset_path = frontend_dir / "highcharts" / asset_name

    if frontend_asset_path.exists():
        # Asset is available in frontend/highcharts directory
        return f"./highcharts/{asset_name}"

    raise ValueError(f"{asset_name} not found")


_component_func = components.declare_component("streamlit_highcharts", path=str(frontend_dir))


def streamlit_highcharts(
    options,
    height=500,
    chart_type="chart",
    key: Optional[str] = None,
):
    """
    Display a Highcharts chart in Streamlit.

    Parameters:
    -----------
    options : dict
        Highcharts chart configuration options
    height : int
        Height of the chart in pixels
    chart_type : str
        Type of chart: "chart" for regular Highcharts, "stock" for Highcharts Stock
    key : str or None
        Unique key for the component

    Returns:
    --------
    Component value
    """
    # Prepare asset URLs for the frontend dynamically
    # Always include core files
    core_modules = ["highcharts.js", "highcharts-more.js"]
    additional_modules = config["modules"]
    all_modules = core_modules + additional_modules

    asset_urls = {}
    for module in all_modules:
        asset_urls[module] = get_asset_url(module)

    component_value = _component_func(
        options=options,
        height=height,
        chart_type=chart_type,
        asset_urls=asset_urls,
        key=key,
    )

    return component_value

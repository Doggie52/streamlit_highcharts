import json
import urllib.request
import zipfile
from pathlib import Path


def load_config():
    with open("modules.json", "r") as f:
        return json.load(f)


config = load_config()
HIGHCHARTS_URL = config["sources"]["highcharts"]

FRONTEND_HIGHCHARTS_DIR = Path(__file__).parent / "src" / "streamlit_highcharts" / "frontend" / "highcharts"


def build_files_to_extract():
    files_to_extract = {}
    
    # Always extract core files from /code/
    core_files = ["highcharts.js", "highcharts-more.js"]
    
    # Extract modules from /code/modules/
    module_files = []
    for module in config["modules"]:
        module_files.append(f"code/modules/{module}")
    
    # All files from the highcharts zip
    all_files = [f"code/{file}" for file in core_files] + module_files
    files_to_extract[HIGHCHARTS_URL] = all_files
        
    return files_to_extract


FILES_TO_EXTRACT = build_files_to_extract()


def download_file(url: str, destination: Path):
    req = urllib.request.Request(url)
    req.add_header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
    req.add_header("Referer", "https://www.highcharts.com/download/")
    with urllib.request.urlopen(req) as response, open(destination, "wb") as out_file:
        out_file.write(response.read())


def main():
    print("Building Highcharts assets...")
    FRONTEND_HIGHCHARTS_DIR.mkdir(parents=True, exist_ok=True)

    for url, files_to_extract in FILES_TO_EXTRACT.items():
        zip_path = Path.cwd() / f"temp_{Path(url).stem}.zip"
        download_file(url, zip_path)

        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            for file_path in files_to_extract:
                try:
                    file_info = zip_ref.getinfo(file_path)
                    filename = Path(file_info.filename).name
                    frontend_path = FRONTEND_HIGHCHARTS_DIR / filename

                    with zip_ref.open(file_info) as source, open(frontend_path, "wb") as target:
                        target.write(source.read())
                    print(f"  Extracted: {filename}")
                except KeyError:
                    print(f"  Warning: {file_path} not found in zip")

        zip_path.unlink()

    print(f"Assets built successfully in: {FRONTEND_HIGHCHARTS_DIR}")
    extracted_files = list(FRONTEND_HIGHCHARTS_DIR.glob("*.js"))
    print(f"Extracted {len(extracted_files)} JavaScript files:")
    for file in sorted(extracted_files):
        print(f"  - {file.name}")


if __name__ == "__main__":
    main()

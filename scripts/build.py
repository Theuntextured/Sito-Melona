import shutil
import os
from glob import glob
import json

'''
* clear "built" folder
* create "temp folder"
* copy source files to "temp" folder
[WORK ON FILES IN TEMP]
* Replace "/Sito-Melona/source" with either "/" if in deployment mode, or to "/Sito-Melona/built/" if in built development mode

* Apply localization via JSON for each supported language
    - Only applies to HTML and js files
    - Replaces [[localization-key]] with its respective translation
    - move to their localized folder
'''

with open("localization/LocalizationTable.json", "r", encoding="utf-8") as json_file:
    LOCALIZATION_DATA = dict(json.load(json_file))

with open("scripts/BuildSettings.json", "r", encoding="utf-8") as json_file:
    BUILD_SETTINGS = dict(json.load(json_file))

def create_directory(full_dir : str):
    if not os.path.exists(full_dir):
        os.makedirs(full_dir)

def process_files_initial(files : list[str]):
    for path in files:
        with open(path, "r", encoding="utf-8") as f:
            file_content = f.read()

        file_content = file_content.replace("/Sito-Melona/source/", ("/" if IS_SHIPPING else "/Sito-Melona/built/"))

        with open(path, "w", encoding="utf-8") as f:
            f.write(file_content)

def get_localized_text(key : str, lang : str):
    if key not in LOCALIZATION_DATA:
        return "[" + key + "]"

    data = LOCALIZATION_DATA[key]

    if lang not in data:
        if lang == "en":
            return get_localized_text("it", lang)
        elif lang == "it":
            return "[" + key + "]"
        else:
            return get_localized_text("en", lang)

    return data[lang]

def process_language(language : str, files : list[str]):
    os.mkdir("built/" + language)
    for path in files:
        with open(path, "r", encoding="utf-8") as f:
            file_content = f.read()

        while True:
            start = file_content.find("[[")
            if start == -1:
                break
            end = file_content.find("]]", start)
            start += 2
            localization_key = file_content[start:end]
            to_replace = "[[" + localization_key + "]]"

            file_content = file_content.replace(to_replace, get_localized_text(localization_key, language))

        file_content = file_content.replace("/source/", "/" + language + "/")

        new_path = "built\\" + language + path[4:]
        new_path, file_name = new_path.rsplit("\\", 1)
        new_path += "\\"
        create_directory(new_path)
        with open(new_path + file_name, "x", encoding="utf-8") as f:
            f.write(file_content)

    print("Processed language '" + language + "'")

def move_assets():
    print("Moving assets...")
    #os.mkdir("built/assets")
    shutil.move("temp/assets/", "built/")
    #os.mkdir("built/styles")
    shutil.move("temp/styles/", "built/")
    print("Assets moved")
def process_localization(files : list[str]):
    with open("localization/SupportedLanguages.txt", "r", encoding="utf-8") as file:
        supported_languages = file.read().splitlines()
    print("Supported languages: ", end="")
    print(*supported_languages, sep=", ")

    for language in supported_languages:
        process_language(language, files)

def strip_files():
    for path in BUILD_SETTINGS["ignored-files"]:
        os.remove("temp" + path)

def clear_from_file(path, content_to_remove):
    with open(path, "r", encoding="utf-8") as f:
        file_content = f.read()
    for content in content_to_remove:
        file_content = file_content.replace(content, "")

    with open(path, "w", encoding="utf-8") as f:
        f.write(file_content)

def strip_file_content(html_files : list[str], js_files : list[str]):
    for path in html_files:
        clear_from_file(path, BUILD_SETTINGS["html-content-to-strip"])


def main():
    print("Preparing " + ("shipping" if IS_SHIPPING else "development") + " build...")

    if os.path.exists("built"):
        shutil.rmtree("built")
    os.mkdir("built")
    print("Cleared /built folder")

    # If temp folder already exists, remove it first (optional but often useful)
    if os.path.exists('temp'):
        shutil.rmtree('temp')

    # Now copy the entire source folder to temp
    shutil.copytree('source', 'temp')

    print(f"Copied 'source' to 'temp' successfully!")

    try:
        js_files = glob('temp/**/*.js', recursive=True)
        html_files = glob('temp/**/*.html', recursive=True)
        for file in BUILD_SETTINGS["ignored-files"]:
            file = "temp" + file.replace("/", "\\")
            if file in js_files:
                js_files.remove(file)
            if file in html_files:
                html_files.remove(file)
        files_to_process = js_files + html_files
        strip_files()
        strip_file_content(html_files, js_files)
        process_files_initial(files_to_process)
        process_localization(html_files)
        move_assets()
    finally:
        shutil.rmtree("temp")


if __name__ == "__main__":
    print("STARTING BUILD...")
    IS_SHIPPING = os.environ["SHIPPING_BUILD"] == 1;
    main()

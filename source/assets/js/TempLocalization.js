let localizationData = {};

async function loadLocalizationData() {
    const response = await fetch('../../localization/LocalizationTable.json');
    localizationData = await response.json();
}

function getLocalizedText(key, lang) {
    if (!(key in localizationData)) {
        return `[${key}]`;
    }

    const data = localizationData[key];

    if (!(lang in data)) {
        if (lang === 'en') {
            return getLocalizedText('it', lang);
        } else if (lang === 'it') {
            return `[${key}]`;
        } else {
            return getLocalizedText('en', lang);
        }
    }

    return data[lang];
}

function applyTranslation(fileContent) {
    const language = 'en';

    let start, end;
    while ((start = fileContent.indexOf('[[')) !== -1) {
        end = fileContent.indexOf(']]', start);
        const localizationKey = fileContent.slice(start + 2, end);
        const toReplace = `[[${localizationKey}]]`;

        fileContent = fileContent.replace(toReplace, getLocalizedText(localizationKey, language));
    }

    return fileContent;
}

translatePage();

async function translatePage(){
    await loadLocalizationData();
    translateNode(document.body);
}

function translateNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = applyTranslation(node.textContent);
    } else {
        for (let child of node.childNodes) {
            translateNode(child);
        }
    }
}

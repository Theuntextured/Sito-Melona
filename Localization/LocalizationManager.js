let Language = "it";
let LocalizationData;
function GetLanguage() {
    Language = document.cookie
        .split('; ')
        .find(row => row.startsWith('language='))
        ?.split('=')[1];
    if(!Language)
        Language = navigator.language;
    if(!Language){
        Language = "en";
    }
    Language = Language.split("-")[0];
    return Language;
}

function SetLanguage(LangCode) {
    if(Language === LangCode)
        return;
    document.cookie = `language=${LangCode}; path=/; max-age=31536000`; // 1 year
    Language = LangCode;
    location.reload();
}

function fetchJSONData() {
    fetch(new URL("./LocalizationTable.json", import.meta.url))
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => ApplyLocalization(data))
        .catch(error => console.error('Failed to fetch data:', error));
}
fetchJSONData();

function GetTextFromKey(key){
    let RelevantData = LocalizationData[key];
    if(!RelevantData){
        console.log("Warning: Invalid localization key provided: '" + key + "'");
        return "[" + key + "]";
    }
    let FoundText = RelevantData[Language];
    if(!FoundText){
        FoundText = RelevantData["en"];
    }
    if(!FoundText){
        FoundText = RelevantData["it"];
    }
    if(!FoundText){
        return "[" + key + "]";
    }
    return FoundText;
}

function ApplyLocalization(Data = null){
    GetLanguage();
    if(Data != null)
        LocalizationData = Data;
    const ToLocalize = document.getElementsByClassName("localized");
    document.querySelector("html").lang = Language;
    for( let i = 0; i < ToLocalize.length; i++){
        const Current = ToLocalize[i];
        const key = Current.getAttribute("localization-key");
        Current.innerHTML = GetTextFromKey(key);
    }

    const LanguageSelector = document.getElementById("LanguageSelector");
    LanguageSelector.value = Language;
    LanguageSelector.addEventListener("change", (e) => {SetLanguage(e.target.value);});
}
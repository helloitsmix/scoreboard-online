const i18n = {
    it: {
        "screen0": {
            "message": "Sei sicuro di voler ricominciare?",
            "alertno": "No",
            "alertyes": "Si"
        },
        "screen1": {
            "title": "Segnapunti Online",
            "continue": "CONTINUA",
            "newgame": "NUOVO GIOCO"
        },
        "screen2": {
            "players": "Giocatori"
        }
    },
    en: {
        "screen0": {
            "message": "Are you sure you want to restart?",
            "alertno": "No",
            "alertyes": "Yes"
        },
        "screen1": {
            "title": "Scoreboard Online",
            "continue": "CONTINUE",
            "newgame": "NEW GAME"
        },
        "screen2": {
            "players": "Players"
        }
    }
}

translator = {

    options: {
        languages: ["it", "en"],
        defaultLanguage: "en",
        detectLanguage: ""
    },

    elements: document.querySelectorAll("[data-i18n]"),

    load: function() {

        const lang = navigator.languages ? navigator.languages[0].substring(0, 2) : navigator.language.substring(0, 2);

        if (this.options.languages.includes(lang)) 
            this.options.detectLanguage = lang;
        else
            this.options.detectLanguage = this.options.defaultLanguage;

        this.translate(i18n[this.options.detectLanguage]);

        document.documentElement.lang = this.options.detectLanguage;
    },

    translate: function(translation) {

        var zip = (keys, values) => keys.map((key, i) => [key, values[i]]);
        var nullSafeSplit = (str, separator) => str ? str.split(separator) : null;
        
        var replace = element => {
            var keys = nullSafeSplit(element.getAttribute("data-i18n"), " ") || [];
            var properties = nullSafeSplit(element.getAttribute("data-i18n-attr"), " ") || ["innerHTML"];
            
            if (keys.length > 0 && keys.length !== properties.length) {
                console.error("data-i18n and data-i18n-attr must contain the same number of items");
            } else {
                var pairs = zip(keys, properties);
                pairs.forEach(pair => {
                    const [key, property] = pair;

                    var text = key.split(".").reduce((obj, i) => obj[i], translation);
                    
                    if (text) 
                        element[property] = text;
                    else
                        console.error(`Could not find text for attribute "${key}".`);
                });
            }
        };

        this.elements.forEach(replace);
    }

}

translator.load()
var provider = require('./provider');

module.exports = {
    autocompleteProvider: null,
    optionProvider: null,
    subscriptions: null,

    activate: function(state) {
        require('atom-package-deps').install('rakbot-lua-autocomplete');
        this.languageLuajitOnlyKeywords = this.atomConfigSet('language-luajit.onlyKeywords', true);
    },

    deactivate: function() {
        this.atomConfigSet('language-luajit.onlyKeywords', this.languageLuajitOnlyKeywords);
    },

    getAutocompletionProvider: function() {
        if (this.autocompleteProvider == null) {
            this.autocompleteProvider = new provider.SuggestionProvider();
        }

        return this.autocompleteProvider;
    },

    atomConfigSet: function(key, value) {
        var oldValue;
        oldValue = atom.config.get(key);
        atom.config.set(key, value);
        return oldValue;
    }
};

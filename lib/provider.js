var fs = require('fs');
var path = require('path');

var autocompletionData = null;

var loadAutocompletionData = function() {
    return new Promise(function(resolve) {
        if (autocompletionData != null) {
            return resolve(autocompletionData);
        }

        return fs.readFile(path.resolve(__dirname, '..', './data/autocompletion.json'), function(error, data) {
            if (error) {
                throw error;
            }
            autocompletionData = JSON.parse(data);
            return resolve(autocompletionData);
        });
    });
};

exports.SuggestionProvider = (function() {
    function SuggestionProvider() {}

    SuggestionProvider.prototype.selector = '.source.lua';
    SuggestionProvider.prototype.disableForSelector = '.source.lua .comment, .source.lua .string';
    SuggestionProvider.prototype.inclusionPriority = 10;
    SuggestionProvider.prototype.excludeLowerPriority = false;

    SuggestionProvider.prototype.getSuggestions = function(arg) {
        var editor = arg.editor;
        var bufferPosition = arg.bufferPosition;
        var scopeDescriptor = arg.scopeDescriptor;
        var prefix = arg.prefix;
        var activatedManually = arg.activatedManually;

        var prefixLength = prefix != null ? prefix.length : 0;
        if (prefixLength >= 2 || activatedManually) {
            return loadAutocompletionData().then((function(self) {
                return function(data) {
                    return self.findSuggestions(data, prefix);
                };
            })(this));
        }
    };

    SuggestionProvider.prototype.findSuggestions = function(completions, prefix) {
        var suggestions = [];
        for (var name in completions) {
            var item = completions[name];
            if (this.compareStrings(name, prefix)) {
                suggestions.push(this.buildSuggestion(name, item));
            }
        }
        return suggestions;
    };

    SuggestionProvider.prototype.buildSuggestion = function(name, item) {
        return {
            name: name,
            snippet: item.snippet,
            type: item.type,
            displayText: item.displayText,
            descriptionMarkdown: item.descriptionMarkdown
        };
    };

    SuggestionProvider.prototype.compareStrings = function(str, substr) {
        return str.toLowerCase().indexOf(substr.toLowerCase()) !== -1;
    };

    return SuggestionProvider;
})();

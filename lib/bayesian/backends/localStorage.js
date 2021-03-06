var _ = require("underscore")._,
    sys = require("sys");

var LocalStorageBackend = function(options) {
  var options = options || {};
  var name = options.name || Math.floor(Math.random() * 100000);

  this.prefix = 'brain.bayesian.' + name;
  
  if(options.testing)
    localStorage = {};
}

LocalStorageBackend.prototype = {
  async : false,

  getCats : function() {
    return JSON.parse(localStorage[this.prefix + '.cats'] || '{}');
  },
  
  setCats : function(cats) {
    localStorage[this.prefix + '.cats'] = JSON.stringify(cats); 
  },
  
  getWordCount : function(word) {
    return JSON.parse(localStorage[this.prefix + '.words.' + word] || '{}');    
  },
  
  setWordCount : function(word, counts) {
    localStorage[this.prefix + '.words.' + word] = JSON.stringify(counts);    
  },
  
  getWordCounts : function(words) {
    var counts = {};
    words.forEach(function(word) {
      counts[word] = this.getWordCount(word);
    }, this);
    return counts;
  },

  incCounts : function(catIncs, wordIncs) {
    var cats = this.getCats();
    _(catIncs).each(function(inc, cat) {
      cats[cat] = cats[cat] + inc || inc;
    }, this);
    this.setCats(cats);

    _(wordIncs).each(function(incs, word) {
      var wordCounts = this.getWordCount(word);
      _(incs).each(function(inc, cat) {
        wordCounts[cat] = wordCounts[cat] + inc || inc;
      }, this);
      this.setWordCount(word, wordCounts);
    }, this);
  }
}

exports.LocalStorageBackend = LocalStorageBackend;
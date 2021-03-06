'use strict';

var _ = _ || {};
var app = app || {};
var Backbone = Backbone || {};

app.MindNodeView = Backbone.View.extend({
  tagName: 'li',

  template: _.template(
    '<% if (typeof(node) !== "undefined") { %>' + 
      '<span class="icon down icon right">' +
    '<% } else { %>' + 
      '<span class="icon minimize">' +
    '<% } %>' +
    '<% if (typeof(icon) !== "undefined") { %>' +
      '<% if (Array.isArray(icon)) { %>' +
        '<% _.each(icon, function(i) { %>' +
          '<img src="images/icons/<%= _.escape(i.BUILTIN) %>.png">' +
        '<% }); %>' +
      '<% } else { %>' +
        '<img src="images/icons/<%= _.escape(icon.BUILTIN) %>.png">' +
      '<% } %>' +
    '<% } %>' +
    '<%= TEXT %></span>'
  ),

  events: {
    'click': 'toggleFolding'
  },
  
  initialize: function(option) {
    this.hasChild = this.model.childNodes.length;
    this.$childEl = null;
    this.$folderEl = null;
    this.isFolded = true;
    if (typeof(option) !== 'undefined' && 
        typeof(option.folding) !== 'undefined') {
      this.isFolded = option.folding;
    }
  },

  toggleFolding: function(event) {
    event.stopPropagation();
    if (!this.hasChild) {
      return;
    }

    this.setFolding(!this.isFolded);
  },

  setFolding: function(isFolded) {
    if (isFolded) {
      this.$folderEl.removeClass('icon down');
      this.$folderEl.addClass('icon right');
      this.$childEl.hide();
    }
    else {
      this.$folderEl.removeClass('icon right');
      this.$folderEl.addClass('icon down');
      this.$childEl.show();
    }
    this.isFolded = isFolded;
  },

  render: function() {
    this.$el.html( this.template(this.model.attributes) );
    this.$folderEl = this.$el.find('span');
    if (this.hasChild) {
      var childVw = new app.MindNodeCollectionView({ 
        collection: this.model.childNodes 
      });
      this.$el.append( childVw.render().el );
      this.$childEl = childVw.$el;
      this.setFolding(this.isFolded);
    }
    return this;
  }
});


define(['backbone'], function(Backbone){
  return Backbone.View.extend({
    className: 'sub-view',
    events: {
      click: function(){ this.$el.html('clicked'); }
    }
  });
});

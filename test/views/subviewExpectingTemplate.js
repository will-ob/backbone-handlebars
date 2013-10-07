define(['backbone'], function(Backbone){
  return Backbone.View.extend({
    className: 'sub-view',
    template: Handlebars.compile('text'),
    render: function(){
      this.$el.html(this.template(this.model));
    }
  });
});

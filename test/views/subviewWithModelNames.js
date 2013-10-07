define(['backbone'], function(Backbone){
  return Backbone.View.extend({
    className: 'sub-view',
    render: function(){
      this.$el.html(this.model.get('name'));
    }
  });
});

define(['backbone'], function(Backbone){
  return Backbone.View.extend({
    className: 'view',
    template: '{{view "./subview"}}'
  });
});

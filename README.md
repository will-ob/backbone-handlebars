{{ view(s) }}
===================
**Handlebars Helpers for Backbone** - _RequireJS style_

Extension for better integration between [Backbone.js](http://documentcloud.github.com/backbone/), [Handlebars.js](http://handlebarsjs.com/), and [Require.js](http://requirejs.org).

Adapted from: [backbone-handlebars](https://github.com/RStankov/backbone-handlebars)   
Inspired by: [Soundcloud Next](http://backstage.soundcloud.com/2012/06/building-the-next-soundcloud/) *see 'Views as Components'*

### Features


```
  {{ require "./some/module" }}
```

No-op helper used by [require-handlebars](). Includes target module in optimized builds. Otherwise, r.js will not detect modlue dependencies until runtime.


```
  {{ view "./some/view/module-x" }}
```

Creates a new view

```
require("./some/view", (SomeViewModule) ->
  subview = new SomeViewModule
)
```

`{{view}}` tag replaced with `subview.el`

- `events` bound whenever parent renders the template (no worry about re-binding events)
- `view` is destroyed when parent is destroyed


```
  {{#view "./buttons/igniton-control" modelId="#{@id}"}}
    <div class="firework #{@color}-firework">
      <img src="/#{@color}-firework.png"></img>
      <button class="js-ignite"></button>
    </div>
  {{/view}}
```

  -  Allow parent to define `ignition-control` 's `template`
  - `ignition-control` defines event handler for`"click .js-ignite"`
  - Accept `@options` that will be passed to module   
      in this example, `@options["modelId"] == #{@id}`

#### Backbone.View#renderTemplate

```javascript
var PostView = Backbone.View.extend({
  template: Handlebars.compile('<h1>{{title}}</h1><p>{{text}}</p>'),
  render: function() {
    return this.renderTemplate(model);
  }
});

view = new PostView({model: {title: 'Title', text: 'Text'}});
$('body').append(view.render().el);
```

This will just render:

```html
<div>
  <h1>Title</h1>
  <p>Text</p>
</div>
```

Or you can just use the new ```render``` method:

```javascript
var PostView = Backbone.View.extend({
  template: Handlebars.compile('<h1>{{title}}</h1><p>{{text}}</p>'),
  templateData: function() {
    return model;
  }
});

view = new PostView({model: {title: 'Title', text: 'Text'}});
$('body').append(view.render().el);
```

The method ```templateData``` provides data that will be passed to the template for rendering.

You can also pass templateData directly as an object:

```javascript
var PostView = Backbone.View.extend({
  template: Handlebars.compile('<h1>{{title}}</h1><p>{{text}}</p>'),
  templateData: {
    title: 'Title',
    text: 'Text'
  }
});

$('body').append(new PostView.render().el);
```

#### {{view}} helper

The real deal about using ```renderTemplate``` is that you can declare and render sub-views in your templates:

```javascript
var PurchaseButton = Backbone.View.extend({
  tagName: 'button',
  events: {
    'click': 'purchaseProduct'
  },
  purchaseProduct: function() {
    // some code here
  },
  render: function() {
    this.$el.html('Purchase');
  }
});

var ProductView = Backbone.View.extend({
  template: Handlebars.compile('<h1>{{title}}</h1><p>Price: {{price}}</p>{{view "PurchaseButton"}}'),
  render: function() {
    this.renderTemplate(this.model);
  }
});

var view = new ProductView({model: {title: "Product", price: "$0.99"}});
$('body').append(view.render().el);
```

This will just render:

```html
<div>
  <h1>Product</h1>
  <p>Price $0.99</p>
  <button>Purchase</button>
</div>
```

The cool thing is that, ```PurchaseButton```'s ```purchaseProduct``` method will be call when the ```button``` is clicked.
Because ```{{view}}``` keeps the event-bindings of the view it rendered.

#### {{view}} features:

Nested view names.
```javascript
// this will render the app.views.PostView
{{view "app.views.PostView"}}
```

Passing parameters to the view:
```javascript
{{view "PostView" model=post tagName="article"}}
// same as
view = new PostView({model: post, tagName: 'article'});
view.render()
```

Overwriting existing view template:
```javascript
// with given view
var ProductView = Backbone.View.extends({
  tempalte: Handlebars.template('...not...important...now...'),
  render: function() {
    this.renderTemplate();
  }
});
```
```
{{#view "ProductView"}}
  This will be rendered by the renderTemplate of ProductView
{{/view}}
```
This is equivalent of you writing:

```javascript
var view = new ProductView();
view.template = Handlebars.compile('This will be rendered by the renderTemplate of ProductView');
view.render();
```
_Notes_: you will have to use ```renderTemplate``` in your view for this to work.


#### {{views}} helper

In a lot of cases you need to render more than one view. In those cases you can use the ```{{views}}``` helper:

```javascript
var NumberView = Backbone.extend({
  render: function() {
    this.$el.html(this.model);
  }
});

var NumberListsView = Backbone.extend({
  template: Handlebars.compile("<ul>{{views NumberView models tagName}}</ul>"),
  render: function() {
    this.renderTemplate({models: [1,2,3,4,5]});
  }
});

var view = new NumberListsView();
view.render();
```

result in:

```html
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
  <li>5</li>
</ul>
```
The ```{{views}}``` helper have the same features as the ```{{view}}``` helper.

#### Backbone.View#renderedSubViews

If you need to access the rendered sub-views you can do it by calling ```renderedSubViews``` methods.

```javascript
var view = new Backbone.View.extend({
  template: Handlebars.compile('{{view SubView}}{{view SubView}}'),
  render: function() {
    this.renderTemplate();
  }
});

view.render();
view.renderedSubViews(); // returns two instances of SubView
```

#### Bonus feature: killing ghost views

If you have a view which had rendered several sub-views via ```{{view}}``` helpers. When you remove the parent view ```Backbone.Handlebars``` will also remove and clear all references to the sub-views.


```javascript
var view = new Backbone.View.extend({
  template: Handlebars.compile('{{view SubView}}'),
  render: function() {
    this.renderTemplate();
  }
});

view.render();
view.remove(); // this will also call the SubView#remove method
```


### Installing

Just copy ```lib/backone_handlebars.js``` into your project. Or if you are using [CoffeeScript](http://http://coffeescript.org/) you can use directly - ```src/backbone_handlebars.coffee```.

### Requirements

```
Backbone.js - 0.9.2+
Handlebars - 1.0.beta.6+
Requirejs - 2.1+
```

### Running the tests

Just open - ```test/runner.html```

### Contributing

Every fresh idea and contribution will be highly appreciated.

If you are making changes please do so in the ```coffee``` files. And then compile them with:

```
cake build
```

### License

MIT License.


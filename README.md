{{ view(s) }}
===================
**Handlebars Helpers for Backbone** - _RequireJS style_

Extension for better integration between [Backbone.js](http://documentcloud.github.com/backbone/), [Handlebars.js](http://handlebarsjs.com/), and [Require.js](http://requirejs.org).

Adapted from: [backbone-handlebars](https://github.com/RStankov/backbone-handlebars)   
Inspired by: [Soundcloud Next](http://backstage.soundcloud.com/2012/06/building-the-next-soundcloud/) *see 'Views as Components'*

### Differences from [backbone-handlebars](https://github.com/RStankov/backbone-handlebars)

### {{ view }}

```
  {{ view "./some/view/module-x" }}
```

Creates a new view. Allows you to declare and render subviews in your templates.

```coffeescript
require("./some/view", (SomeViewModule) ->
  subview = new SomeViewModule
)
```

`{{view}}` tag replaced with `subview.el`

- `events` bound whenever parent renders the template (no worry about re-binding events)
- `view` is destroyed when parent is destroyed - zombie pervention


###### Example

```
  {{#view "./buttons/igniton-control" modelId="#{@id}"}}
    <div class="firework #{@color}-firework">
      <img src="/#{@color}-firework.png"></img>
      <button class="js-ignite"></button>
    </div>
  {{/view}}
```

  - Allow parent to define `ignition-control` 's `template`
  - `ignition-control` defines event handler for`"click .js-ignite"`
  - Accept `@options` that will be passed to module   
      in this example, `@options["modelId"] == #{@id}`

#### Backbone.View#renderTemplate

Will make use of [required-handlebars]() with allows the template to define AMD dependencies in the template. 

```
  <section>
    <!-- include a module in optimized build -->
    {{require "./some/view"}}

    <!-- view can load module via relative path-->
    {{view "./some/view"}} 
  </section>

```

### Installing


`bower install --save backbone-handlebars-amd`

Then include `lib/backbone_handlebars.js` in your AMD build

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


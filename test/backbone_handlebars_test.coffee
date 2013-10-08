require.config
  paths:
    handlebarsBackbone: '../lib/backbone_handlebars'
    backbone: 'vendor/backbone/backbone'
    handlebars: 'vendor/handlebars/handlebars'
  shim:
    backbone:
      exports: 'Backbone'

    handlebars:
      exports: 'Handlebars'

    handlebarsBackbone:
      deps: ['handlebars', 'backbone']

require [
  "handlebars"
  "handlebarsBackbone"
], (Handlebars) ->

  describe "Backbone.Handlebars", ->
    _view = null

    afterEach ->
      _view.remove() if _view
      _view = null

    renderView = (template = '', context = {}) ->
      customViewClass = Backbone.View.extend
        template: if typeof template is 'function' then template else Handlebars.compile(template)
        initialize: -> @renderTemplate(context)

      _view = new customViewClass

    describe "View#render", ->
      it "doesn't render anything if there isn't a template", ->
        view = new Backbone.View
        view.render()
        view.$el.html().should.eql ''

      it "renders view template by default", ->
        viewClass = Backbone.View.extend
          template: Handlebars.compile 'template text'

        view = new viewClass
        view.render()
        view.$el.html().should.eql 'template text'

      it "takes the context from templateData method", ->
        viewClass = Backbone.View.extend
          template: Handlebars.compile 'Hi {{name}}'
          templateData: -> name: 'there'

        view = new viewClass
        view.render()
        view.$el.html().should.eql 'Hi there'

      it "can use templateData directly if is not a method", ->
        viewClass = Backbone.View.extend
          template: Handlebars.compile 'Hi {{name}}'
          templateData: {name: 'there'}

        view = new viewClass
        view.render()
        view.$el.html().should.eql 'Hi there'

      it "returns reference to the view", ->
        view = new Backbone.View
        view.render().should.eql view

    describe "View#renderTemplate", ->
      it "renders the template of the view", (done) ->
        view = renderView 'template text'

        setTimeout ->
          view.$el.html().should.eql 'template text'
          done()
        , 10

      it "accepts template context as argument", (done) ->
        view = renderView '{{a}} + {{b}} = {{c}}', a: 1, b: 2, c: 3

        setTimeout ->
          view.$el.html().should.eql '1 + 2 = 3'
          done()
        , 10


      it "returns the view", ->
        view = renderView()
        view.renderTemplate().should.eql view

    describe "View#renderTemplate with {{view}} helper", ->
      it "renders sub-view element", (done) ->
        view = renderView '{{view "views/subview"}}'
        setTimeout ->
          view.$('.sub-view').should.not.be.null
          done()
        , 10

      it "works with precompiled templates", (done) ->
        view = renderView Handlebars.compile '{{view  "views/subview"}}'
        setTimeout ->
          view.$('.sub-view').should.not.be.null
          done()
        , 10

      it "keeps the events of the sub-view", (done) ->
        view = renderView '{{view "views/subviewWithEvents"}}'
        setTimeout ->
          subViewEl = view.$('.sub-view')
          subViewEl.click()
          subViewEl.html().should.eql 'clicked'
          done()
        , 10


      it "can render several sub-views", (done) ->
        view = renderView '{{view "views/subview"}}{{view "views/subview"}}'
        setTimeout ->
          view.$('.sub-view').length.should.eql 2
          done()
        , 10

     #  it "throws an error if sub-view doesn't exists", ->
     #    (-> renderView '{{view "InvalidView"}}').should.throw 'Invalid view name - InvalidView'

      it "can pass options to the sub-view", (done) ->
        view = renderView '{{view "views/subviewWithModel" model=1 tagName="span" className="sview"}}'

        setTimeout ->
          subViewEl = view.$('.sview')
          subViewEl.html().should.eql '1'
          subViewEl.prop('tagName').toLowerCase().should.eql 'span'
          done()
        , 10

      it "can pass a new template for the view", (done) ->
        view = renderView '{{#view "views/subviewExpectingTemplate"}}custom template{{/view}} '

        setTimeout ->
          view.$('.sub-view').html().should.eql 'custom template'
          done()
        , 10

      it "removes sub-views via view.remove() on re-render", (done) ->
        view = renderView '{{view "views/subview"}}{{view "views/subview"}}'
        removeCounter = 0
        for subViewPromise in view.renderedSubViews()
          subViewPromise.done((id, view) ->
            view.remove = ->
              removeCounter += 1
          )

        setTimeout ->
          view.renderTemplate()
          setTimeout ->
            removeCounter.should.eql 2
            done()
          , 10
        , 10


      it "removes sub-views via view.remove() on view removal", (done) ->
        view = renderView '{{view "views/subview"}}{{view "views/subview"}}'
        removeCounter = 0
        for subViewPromise in view.renderedSubViews()
          subViewPromise.done((id, view) ->
            view.remove = ->
              removeCounter += 1
          )

        view.remove()

        setTimeout ->
          view.renderTemplate()
          setTimeout ->
            removeCounter.should.eql 2
            done()
          , 10
        , 10

    describe "View#renderTemplate with {{views}} helper", ->
      it "renders an array of views by given collection of models", (done) ->
        view = renderView '{{views "views/subview" collection}}', collection: [1..4]
        setTimeout ->
          view.$('.sub-view').length.should.eql 4
          done()
        , 10

      it "works with precompiled templates", (done) ->
        view = renderView Handlebars.compile('{{views "views/subview" collection}}'), collection: [1..4]
        setTimeout ->
          view.$('.sub-view').length.should.eql 4
          done()
        , 10

      it "can pass a new template for the view", (done) ->
        view = renderView '[{{#views "views/subviewExpectingTemplate" collection}}{{this}}{{/views}}]', collection: [1..4]
        setTimeout ->
          view.$el.text().should.eql '[1234]'
          done()
        , 10

      it "can pass options to the sub-view", (done) ->
        view = renderView '{{views "views/subviewWithModel" collection className="inner-view"}}', collection: [1..4]
        setTimeout ->
          view.$('.inner-view').length.should.eql 4
          done()
        , 10

      it "can render Backbone.Collection instances", (done) ->
        collection = new Backbone.Collection
        collection.add name: '1'
        collection.add name: '2'

        view = renderView '[{{views "views/subviewWithModelNames" collection}}]', {collection}
        setTimeout ->
          view.$el.text().should.eql '[12]'
          done()
        , 10

      it "can render any object which implements map", (done) ->
        object =
          values: [1,2]
          map: (callback) -> _.map @values, callback

        view = renderView '[{{views "views/subviewWithModel" collection}}]', collection: object
        setTimeout ->
          view.$el.text().should.eql '[12]'
          done()
        , 10

  # then run 'em
  chai.should()
  mocha.run()

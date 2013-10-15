// Generated by CoffeeScript 1.6.3
(function() {
  require.config({
    paths: {
      handlebarsBackbone: '../lib/backbone_handlebars',
      backbone: 'vendor/backbone/backbone',
      handlebars: 'vendor/handlebars/handlebars',
      squire: 'vendor/squire/src/Squire'
    },
    shim: {
      backbone: {
        exports: 'Backbone'
      },
      handlebars: {
        exports: 'Handlebars'
      },
      handlebarsBackbone: {
        deps: ['handlebars', 'backbone']
      }
    }
  });

  require(["squire", "handlebars", "handlebarsBackbone"], function(Squire, Handlebars) {
    describe("Backbone.Handlebars", function() {
      var renderView, _view;
      _view = null;
      afterEach(function() {
        if (_view) {
          _view.remove();
        }
        return _view = null;
      });
      renderView = function(template, context) {
        var customViewClass;
        if (template == null) {
          template = '';
        }
        if (context == null) {
          context = {};
        }
        customViewClass = Backbone.View.extend({
          template: typeof template === 'function' ? template : Handlebars.compile(template),
          initialize: function() {
            return this.renderTemplate(context);
          }
        });
        return _view = new customViewClass;
      };
      describe("View#render", function() {
        it("doesn't render anything if there isn't a template", function() {
          var view;
          view = new Backbone.View;
          view.render();
          return view.$el.html().should.eql('');
        });
        it("renders view template by default", function() {
          var view, viewClass;
          viewClass = Backbone.View.extend({
            template: Handlebars.compile('template text')
          });
          view = new viewClass;
          view.render();
          return view.$el.html().should.eql('template text');
        });
        it("takes the context from templateData method", function() {
          var view, viewClass;
          viewClass = Backbone.View.extend({
            template: Handlebars.compile('Hi {{name}}'),
            templateData: function() {
              return {
                name: 'there'
              };
            }
          });
          view = new viewClass;
          view.render();
          return view.$el.html().should.eql('Hi there');
        });
        it("can use templateData directly if is not a method", function() {
          var view, viewClass;
          viewClass = Backbone.View.extend({
            template: Handlebars.compile('Hi {{name}}'),
            templateData: {
              name: 'there'
            }
          });
          view = new viewClass;
          view.render();
          return view.$el.html().should.eql('Hi there');
        });
        return it("returns reference to the view", function() {
          var view;
          view = new Backbone.View;
          return view.render().should.eql(view);
        });
      });
      describe("View#renderTemplate", function() {
        it("renders the template of the view", function(done) {
          var view;
          view = renderView('template text');
          return setTimeout(function() {
            view.$el.html().should.eql('template text');
            return done();
          }, 10);
        });
        it("accepts template context as argument", function(done) {
          var view;
          view = renderView('{{a}} + {{b}} = {{c}}', {
            a: 1,
            b: 2,
            c: 3
          });
          return setTimeout(function() {
            view.$el.html().should.eql('1 + 2 = 3');
            return done();
          }, 10);
        });
        return it("returns the view", function() {
          var view;
          view = renderView();
          return view.renderTemplate().should.eql(view);
        });
      });
      describe("View#renderTemplate with {{view}} helper", function() {
        it("can require relative views", function(done) {
          var injector, view;
          injector = new Squire();
          injector.mock("./subview", Backbone.View.extend({
            className: "thing"
          }));
          view = renderView('{{view "views/subviewWithRelativeSubview"}}', {
            data: require
          });
          return setTimeout(function() {
            view.$('.thing').should.not.be["null"];
            return done();
          }, 10);
        });
        it("renders sub-view element", function(done) {
          var view;
          view = renderView('{{view "views/subview"}}');
          return setTimeout(function() {
            view.$('.sub-view').should.not.be["null"];
            return done();
          }, 10);
        });
        it("works with precompiled templates", function(done) {
          var view;
          view = renderView(Handlebars.compile('{{view  "views/subview"}}'));
          return setTimeout(function() {
            view.$('.sub-view').should.not.be["null"];
            return done();
          }, 10);
        });
        it("keeps the events of the sub-view", function(done) {
          var view;
          view = renderView('{{view "views/subviewWithEvents"}}');
          return setTimeout(function() {
            var subViewEl;
            subViewEl = view.$('.sub-view');
            subViewEl.click();
            subViewEl.html().should.eql('clicked');
            return done();
          }, 10);
        });
        it("can render several sub-views", function(done) {
          var view;
          view = renderView('{{view "views/subview"}}{{view "views/subview"}}');
          return setTimeout(function() {
            view.$('.sub-view').length.should.eql(2);
            return done();
          }, 10);
        });
        it("can pass options to the sub-view", function(done) {
          var view;
          view = renderView('{{view "views/subviewWithModel" model=1 tagName="span" className="sview"}}');
          return setTimeout(function() {
            var subViewEl;
            subViewEl = view.$('.sview');
            subViewEl.html().should.eql('1');
            subViewEl.prop('tagName').toLowerCase().should.eql('span');
            return done();
          }, 10);
        });
        it("can pass a new template for the view", function(done) {
          var view;
          view = renderView('{{#view "views/subviewExpectingTemplate"}}custom template{{/view}} ');
          return setTimeout(function() {
            view.$('.sub-view').html().should.eql('custom template');
            return done();
          }, 10);
        });
        it("removes sub-views via view.remove() on re-render", function(done) {
          var removeCounter, subViewPromise, view, _i, _len, _ref;
          view = renderView('{{view "views/subview"}}{{view "views/subview"}}');
          removeCounter = 0;
          _ref = view.renderedSubViews();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            subViewPromise = _ref[_i];
            subViewPromise.done(function(id, view) {
              return view.remove = function() {
                return removeCounter += 1;
              };
            });
          }
          return setTimeout(function() {
            view.renderTemplate();
            return setTimeout(function() {
              removeCounter.should.eql(2);
              return done();
            }, 10);
          }, 10);
        });
        return it("removes sub-views via view.remove() on view removal", function(done) {
          var removeCounter, subViewPromise, view, _i, _len, _ref;
          view = renderView('{{view "views/subview"}}{{view "views/subview"}}');
          removeCounter = 0;
          _ref = view.renderedSubViews();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            subViewPromise = _ref[_i];
            subViewPromise.done(function(id, view) {
              return view.remove = function() {
                return removeCounter += 1;
              };
            });
          }
          view.remove();
          return setTimeout(function() {
            view.renderTemplate();
            return setTimeout(function() {
              removeCounter.should.eql(2);
              return done();
            }, 10);
          }, 10);
        });
      });
      return describe("View#renderTemplate with {{views}} helper", function() {
        it("renders an array of views by given collection of models", function(done) {
          var view;
          view = renderView('{{views "views/subview" collection}}', {
            collection: [1, 2, 3, 4]
          });
          return setTimeout(function() {
            view.$('.sub-view').length.should.eql(4);
            return done();
          }, 10);
        });
        it("works with precompiled templates", function(done) {
          var view;
          view = renderView(Handlebars.compile('{{views "views/subview" collection}}'), {
            collection: [1, 2, 3, 4]
          });
          return setTimeout(function() {
            view.$('.sub-view').length.should.eql(4);
            return done();
          }, 10);
        });
        it("can pass a new template for the view", function(done) {
          var view;
          view = renderView('[{{#views "views/subviewExpectingTemplate" collection}}{{this}}{{/views}}]', {
            collection: [1, 2, 3, 4]
          });
          return setTimeout(function() {
            view.$el.text().should.eql('[1234]');
            return done();
          }, 10);
        });
        it("can pass options to the sub-view", function(done) {
          var view;
          view = renderView('{{views "views/subviewWithModel" collection className="inner-view"}}', {
            collection: [1, 2, 3, 4]
          });
          return setTimeout(function() {
            view.$('.inner-view').length.should.eql(4);
            return done();
          }, 10);
        });
        it("can render Backbone.Collection instances", function(done) {
          var collection, view;
          collection = new Backbone.Collection;
          collection.add({
            name: '1'
          });
          collection.add({
            name: '2'
          });
          view = renderView('[{{views "views/subviewWithModelNames" collection}}]', {
            collection: collection
          });
          return setTimeout(function() {
            view.$el.text().should.eql('[12]');
            return done();
          }, 10);
        });
        return it("can render any object which implements map", function(done) {
          var object, view;
          object = {
            values: [1, 2],
            map: function(callback) {
              return _.map(this.values, callback);
            }
          };
          view = renderView('[{{views "views/subviewWithModel" collection}}]', {
            collection: object
          });
          return setTimeout(function() {
            view.$el.text().should.eql('[12]');
            return done();
          }, 10);
        });
      });
    });
    chai.should();
    return mocha.run();
  });

}).call(this);

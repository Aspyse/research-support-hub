
import Handlebars from 'handlebars'
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['home'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div>\r\n  <a href=\"https://vitejs.dev\" target=\"_blank\">\r\n    <img src=\"/vite.svg\" class=\"logo\" alt=\"Vite logo\" />\r\n  </a>\r\n  <a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript\" target=\"_blank\">\r\n    <img src=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"logo") || (depth0 != null ? lookupProperty(depth0,"logo") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"logo","hash":{},"data":data,"loc":{"start":{"line":6,"column":14},"end":{"line":6,"column":22}}}) : helper)))
    + "\" class=\"logo vanilla\" alt=\"JavaScript logo\" />\r\n  </a>\r\n  <h1>Hello Vite!</h1>\r\n  <div class=\"card\">\r\n    <button id=\"counter\" type=\"button\"></button>\r\n  </div>\r\n  <p class=\"read-the-docs\">\r\n    Click on the Vite logo to learn less\r\n  </p>\r\n</div>";
},"useData":true});
templates['home2'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div>\r\n  <a href=\"https://vitejs.dev\" target=\"_blank\">\r\n    <img src=\"/vite.svg\" class=\"logo\" alt=\"Vite logo\" />\r\n  </a>\r\n  <a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript\" target=\"_blank\">\r\n    <img src=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"logo") || (depth0 != null ? lookupProperty(depth0,"logo") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"logo","hash":{},"data":data,"loc":{"start":{"line":6,"column":14},"end":{"line":6,"column":22}}}) : helper)))
    + "\" class=\"logo vanilla\" alt=\"JavaScript logo\" />\r\n  </a>\r\n  <h1>Hello Vite!</h1>\r\n  <div class=\"card\">\r\n    <button id=\"counter\" type=\"button\"></button>\r\n  </div>\r\n  <p class=\"read-the-docs\">\r\n    Click on the Vite logo to learn more\r\n  </p>\r\n</div>";
},"useData":true});
})();
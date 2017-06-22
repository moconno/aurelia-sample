define('app',['exports', 'aurelia-event-aggregator', 'aurelia-framework', 'aurelia-fetch-client'], function (exports, _aureliaEventAggregator, _aureliaFramework, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function App(http, ea, utility) {
      _classCallCheck(this, App);

      this.http = http;
      this.ea = ea;
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'Home';
      config.map([{ route: '', moduleId: 'game-list', title: 'Games' }, { route: 'game/:gameId/categories', moduleId: 'category-list', name: 'gameCategories', title: 'Categories', activate: true }]);

      this.router = router;
    };

    return App;
  }()) || _class);
});
define('category-list',['exports', './app', 'aurelia-framework', './services/CategoryService', './messages'], function (exports, _app, _aureliaFramework, _CategoryService, _messages) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.CategoryList = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var CategoryList = exports.CategoryList = (_dec = (0, _aureliaFramework.inject)(_app.App, _CategoryService.CategoryService), _dec(_class = function () {
    function CategoryList(app, categoryService) {
      _classCallCheck(this, CategoryList);

      this.app = app;
      this.categoryService = categoryService;
    }

    CategoryList.prototype.activate = function activate(params, routeConfig) {
      this.gameId = params.gameId;
      return this.getCategories();
    };

    CategoryList.prototype.getCategories = function getCategories() {
      return this.categoryService.getCategories(this.gameId);
    };

    CategoryList.prototype.select = function select(category) {
      this.app.ea.publish(new _messages.CategoryViewed(category));
      return true;
    };

    return CategoryList;
  }()) || _class);
});
define('checkout',['exports', './app', 'aurelia-framework', './messages'], function (exports, _app, _aureliaFramework, _messages) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Checkout = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Checkout = exports.Checkout = (_dec = (0, _aureliaFramework.inject)(_app.App), _dec(_class = function () {
    function Checkout(app) {
      var _this = this;

      _classCallCheck(this, Checkout);

      this.app = app;

      app.ea.subscribe(_messages.CategoryViewed, function (msg) {
        return _this.select(msg.category);
      });
    }

    Checkout.prototype.activate = function activate(params, routeConfig) {
      var self = this;
      this.routeConfig = routeConfig;
      var gameId = params.gameId;
      this.gameText = params.text;

      return this.app.http.fetch('v2/game/' + gameId + '/categories').then(function (response) {
        return response.json();
      }).then(function (data) {
        self.categories = data.categories;
      });
    };

    Checkout.prototype.getDate = function getDate() {
      return new Date();
    };

    Checkout.prototype.select = function select(category) {
      this.selectedCatId = category.id;
      return true;
    };

    Checkout.prototype.buy = function buy() {
      var _this2 = this;

      var selectedCat = this.categories.find(function (c) {
        return c.id == _this2.selectedCatId;
      });
      alert('Bought that ' + selectedCat.name);
    };

    return Checkout;
  }()) || _class);
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('game-list',['exports', 'aurelia-framework', './app', './services/GameService', './messages'], function (exports, _aureliaFramework, _app, _GameService, _messages) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.GameList = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var GameList = exports.GameList = (_dec = (0, _aureliaFramework.inject)(_app.App, _GameService.GameService), _dec(_class = function () {
    function GameList(app, gameService) {
      _classCallCheck(this, GameList);

      this.app = app;
      this.gameService = gameService;
    }

    GameList.prototype.created = function created() {
      return this.gameService.getGames();
    };

    GameList.prototype.select = function select(game) {
      this.app.ea.publish(new _messages.GameViewed(game));
      return true;
    };

    return GameList;
  }()) || _class);
});
define('main',['exports', './environment', 'aurelia-fetch-client'], function (exports, _environment, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    var container = aurelia.container;

    var http = new _aureliaFetchClient.HttpClient();
    http.configure(function (config) {
      config.useStandardConfiguration().withBaseUrl('https://qa-luigi.expapp.com/').withDefaults({
        headers: {
          'X-EXP-API-KEY': 'TEG3VtfVnfLX6CmoRpox'
        }
      }).withInterceptor({
        request: function request(_request) {
          console.log('Requesting ' + _request.method + ' ' + _request.url);
          return _request;
        },
        response: function response(_response) {
          console.log('Received ' + _response.status + ' ' + _response.url + ' ' + _response.data);
          return _response;
        }
      });
    });

    container.registerInstance(_aureliaFetchClient.HttpClient, http);

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('messages',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var GameViewed = exports.GameViewed = function GameViewed(game) {
    _classCallCheck(this, GameViewed);

    this.game = game;
  };

  var CategoryViewed = exports.CategoryViewed = function CategoryViewed(category) {
    _classCallCheck(this, CategoryViewed);

    this.category = category;
  };
});
define('models/game',['exports', '../resources/elements/utility'], function (exports, _utility) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Game = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Game = exports.Game = function Game(game) {
    _classCallCheck(this, Game);

    Object.assign(this, game);
    this.gameStartDate = (0, _utility.getDate)(this.gameStartTime);
  };
});
define('resources/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {
    config.globalResources(['./elements/loading-indicator']);
  }
});
define('services/CategoryService',['exports', 'aurelia-framework', '../app', '../models/game'], function (exports, _aureliaFramework, _app, _game) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.CategoryService = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var CategoryService = exports.CategoryService = (_dec = (0, _aureliaFramework.inject)(_app.App), _dec(_class = function () {
    function CategoryService(app) {
      _classCallCheck(this, CategoryService);

      this.app = app;
      this.categoriesByGame = {};
    }

    CategoryService.prototype.getCategories = function getCategories(gameId) {
      var _this = this;

      if (this.categoriesByGame[gameId]) {
        return this.categoriesByGame[gameId];
      }

      return this.app.http.fetch('v2/game/' + gameId + '/categories').then(function (response) {
        return response.json();
      }).then(function (data) {
        _this.categoriesByGame[gameId] = data.categories;
        return _this.categoriesByGame[gameId];
      });
    };

    return CategoryService;
  }()) || _class);
});
define('services/GameService',['exports', 'aurelia-framework', '../app', '../models/game'], function (exports, _aureliaFramework, _app, _game) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.GameService = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var GameService = exports.GameService = (_dec = (0, _aureliaFramework.inject)(_app.App), _dec(_class = function () {
    function GameService(app) {
      _classCallCheck(this, GameService);

      this.app = app;
      this.games = [];
    }

    GameService.prototype.getGames = function getGames() {
      var _this = this;

      if (this.games.length > 0) {
        return this.games;
      }

      this.app.http.isRequesting = true;
      return this.app.http.fetch('v2/game/activeGames').then(function (response) {
        return response.json();
      }).then(function (games) {
        for (var _iterator = games, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }

          var game = _ref;

          _this.games.push(new _game.Game(game));
        }
        _this.app.http.isRequesting = false;
      });
    };

    return GameService;
  }()) || _class);
});
define('resources/elements/loading-indicator',['exports', 'nprogress', 'aurelia-framework'], function (exports, _nprogress, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.LoadingIndicator = undefined;

  var nprogress = _interopRequireWildcard(_nprogress);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor;

  var LoadingIndicator = exports.LoadingIndicator = (_dec = (0, _aureliaFramework.noView)(['nprogress/nprogress.css']), _dec(_class = (_class2 = function () {
    function LoadingIndicator() {
      _classCallCheck(this, LoadingIndicator);

      _initDefineProp(this, 'loading', _descriptor, this);
    }

    LoadingIndicator.prototype.loadingChanged = function loadingChanged(newValue) {
      if (newValue) {
        nprogress.start();
      } else {
        nprogress.done();
      }
    };

    return LoadingIndicator;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'loading', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  })), _class2)) || _class);
});
define('resources/elements/utility',["exports", "moment"], function (exports, _moment) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.getDate = getDate;

	var moment = _interopRequireWildcard(_moment);

	function _interopRequireWildcard(obj) {
		if (obj && obj.__esModule) {
			return obj;
		} else {
			var newObj = {};

			if (obj != null) {
				for (var key in obj) {
					if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
				}
			}

			newObj.default = obj;
			return newObj;
		}
	}

	function getDate(time) {
		var date = new Date(time);
		return moment.default(time).format("dddd @ hh:mm a");
	};
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"bootstrap/css/bootstrap.css\"></require><require from=\"./styles.css\"></require><require from=\"./game-list\"></require><nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\"><div class=\"navbar-header\"><a class=\"navbar-brand\" href=\"#\"><i class=\"fa fa-user\"></i> <span>Home</span></a></div></nav><loading-indicator loading.bind=\"router.isNavigating || http.isRequesting\"></loading-indicator><section id=\"content\"><router-view></router-view></section></template>"; });
define('text!styles.css', ['module'], function(module) { module.exports = "body {\n  display: block;\n  width: auto;\n  height: auto;\n}\n\n#content {\n  position: relative;\n  top: 50px;\n}\n\n@-webkit-keyframes slideIn {\n    from { left: 100vw; }\n    to { left: 0vw; }\n}\n\n.category-container {\n  position: absolute;\n  width: 100vw;\n  left: 100vw;\n  -webkit-animation: slideIn 0.3s ease-in-out;\n  -webkit-animation-fill-mode: forwards;\n}\n\nimg {\n  width: 100vw;\n}\n\ndiv {\n  margin: auto;\n  display: block;\n}\n"; });
define('text!category-list.html', ['module'], function(module) { module.exports = "<template><div class=\"category-container\"><div><h3>${gameText}</h3></div><div repeat.for=\"category of getCategories()\"><div><a click.delegate=\"$parent.select(category)\"><div><img class=\"category-image\" src=\"${category.url}\"></div><h4 class>${category.name}</h4><p class>$${category.fixedPrice}</p></a></div></div></div></template>"; });
define('text!checkout.html', ['module'], function(module) { module.exports = "<template><div class=\"category-container\"><div><h3>${gameText}</h3></div><div repeat.for=\"category of categories\"><div><a click.delegate=\"$parent.select(category)\"><div><img class=\"category-image\" src=\"${category.url}\"></div><h4 class>${category.name}</h4><p class>$${category.fixedPrice}</p></a></div></div></div></template>"; });
define('text!game-list.html', ['module'], function(module) { module.exports = "<template><div><h3>Games</h3></div><div repeat.for=\"game of gameService.games\"><a route-href=\"route: gameCategories; params.bind: {gameId: game.id}\" click.delegate=\"$parent.select(game)\"><h4>${game.name}</h4><p>${game.gameStartDate}</p></a></div></template>"; });
//# sourceMappingURL=app-bundle.js.map
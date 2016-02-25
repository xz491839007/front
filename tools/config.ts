import {readFileSync} from 'fs';
import {argv} from 'yargs';
import {normalize, join} from 'path';

// --------------
// Configuration.

const ENVIRONMENTS = {
  DEVELOPMENT: 'dev',
  PRODUCTION: 'prod'
};

export const PROJECT_ROOT         = normalize(join(__dirname, '..'));
export const ENV                  = argv['env']         || 'prod';
export const DEBUG                = argv['debug']       || false;
export const PORT                 = argv['port']        || 5555;
export const LIVE_RELOAD_PORT     = argv['reload-port'] || 4002;
export const DOCS_PORT            = argv['docs-port']   || 4003;
export const APP_BASE             = argv['base']        || '/';

export const BOOTSTRAP_MODULE     = 'bootstrap';

export const APP_TITLE            = 'Minds App';

export const APP_SRC              = 'app';
export const APP_CDN              = argv['useCdn'] ? '//d3ae0shxev0cb7.cloudfront.net' : '';
export const ASSETS_SRC           = `${APP_SRC}/assets_`;

export const TOOLS_DIR            = 'tools';
export const PLUGINS_DIR          = '../plugins';
export const TMP_DIR              = '.tmp';
export const TEST_DEST            = 'test';
export const APP_DEST             = `public`;
export const CSS_DEST             = `${APP_DEST}/stylesheets`;
export const JS_DEST              = `${APP_DEST}/js`;
export const APP_ROOT             = `${APP_BASE}`;
export const VERSION              = argv['v'] ? argv['v'] : Date.now();

export const CSS_PROD_BUNDLE      = 'main.css';
export const JS_PROD_SHIMS_BUNDLE = 'shims.js';
export const JS_PROD_APP_BUNDLE   = 'app.js';

export const VERSION_NPM          = '2.14.7';
export const VERSION_NODE         = '4.0.0';

interface InjectableDependency {
  src: string;
  inject: string | boolean;
  dest?: string;
}

// Declare NPM dependencies (Note that globs should not be injected).
export const DEV_NPM_DEPENDENCIES: InjectableDependency[] = normalizeDependencies([
  { src: 'systemjs/dist/system-polyfills.js', inject: 'shims', dest: JS_DEST },

  { src: 'es6-shim/es6-shim.min.js', inject: 'shims', dest: JS_DEST },
  { src: 'reflect-metadata/Reflect.js', inject: 'shims', dest: JS_DEST },
  { src: 'systemjs/dist/system.src.js', inject: 'shims', dest: JS_DEST },
  { src: 'angular2/bundles/angular2-polyfills.min.js', inject: 'shims', dest: JS_DEST },
  { src: 'intl/dist/Intl.min.js', inject: 'shims', dest: JS_DEST },
  { src: 'intl/locale-data/jsonp/en.js', inject: 'shims', dest: JS_DEST },

  // Faster dev page load
  { src: 'rxjs/bundles/Rx.min.js', inject: 'libs', dest: JS_DEST },
  { src: 'angular2/bundles/angular2.min.js', inject: 'libs', dest: JS_DEST },
  { src: 'angular2/bundles/router.min.js', inject: 'libs', dest: JS_DEST }, // use router.min.js with alpha47
  { src: 'angular2/bundles/http.min.js', inject: 'libs', dest: JS_DEST },

  // async
  { src: 'tinymce/tinymce.min.js', inject: 'async', dest: JS_DEST },
  { src: 'braintree-web/dist/braintree.js', inject: 'async', dest: JS_DEST }

]);

export const PROD_NPM_DEPENDENCIES: InjectableDependency[] = normalizeDependencies([
  { src: 'systemjs/dist/system-polyfills.src.js', inject: 'shims' },
  { src: 'reflect-metadata/Reflect.js', inject: 'shims' },
  { src: 'es6-shim/es6-shim.min.js', inject: 'shims' },
  { src: 'systemjs/dist/system.js', inject: 'shims' },
  { src: 'angular2/bundles/angular2-polyfills.min.js', inject: 'libs' },
  { src: 'intl/dist/Intl.min.js', inject: 'shims' },
  { src: 'intl/locale-data/jsonp/en.js', inject: 'shims' },
]);

// Declare local files that needs to be injected
export const APP_ASSETS: InjectableDependency[] = [
  { src: `${CSS_DEST}/main.css`, inject: true, dest: CSS_DEST }
];

export const DEV_DEPENDENCIES = DEV_NPM_DEPENDENCIES.concat(APP_ASSETS);
export const PROD_DEPENDENCIES = PROD_NPM_DEPENDENCIES.concat(APP_ASSETS);

export const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// ----------------
// SystemsJS Configuration.
const SYSTEM_CONFIG_DEV = {
  defaultJSExtensions: true,
  paths: {
    [BOOTSTRAP_MODULE]: `${APP_BASE}${BOOTSTRAP_MODULE}`,
    'angular2/*': `${APP_BASE}angular2/*`,
    'rxjs/*': `${APP_BASE}rxjs/*`,
    '*': `${APP_BASE}node_modules/*`
  },
  packages: {
    angular2: { defaultExtension: false },
    rxjs: { defaultExtension: false }
  }
};

export const SYSTEM_CONFIG = SYSTEM_CONFIG_DEV;

export const SYSTEM_BUILDER_CONFIG = {
  defaultJSExtensions: true,
  paths: {
    [`${TMP_DIR}/*`]: `${TMP_DIR}/*`,
    '*': 'node_modules/*'
  }
};

// --------------
// Private.

function normalizeDependencies(deps: InjectableDependency[]) {
  deps
    .filter((d:InjectableDependency) => !/\*/.test(d.src)) // Skip globs
    .forEach((d:InjectableDependency) => d.src = require.resolve(d.src));
  return deps;
}

function appVersion(): number|string {
  var pkg = JSON.parse(readFileSync('package.json').toString());
  return pkg.version;
}

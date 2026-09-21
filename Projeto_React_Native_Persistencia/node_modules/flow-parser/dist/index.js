'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  parse: true,
  mutateESTreeASTForPrettier: true,
  Transforms: true,
  FlowVisitorKeys: true,
  astArrayMutationHelpers: true,
  astNodeMutationHelpers: true
};
exports.mutateESTreeASTForPrettier = exports.astNodeMutationHelpers = exports.astArrayMutationHelpers = exports.Transforms = void 0;
exports.parse = parse;
var FlowParser = _interopRequireWildcard(require("./FlowParser"));
var _ESTreeVisitorKeys = _interopRequireDefault(require("./generated/ESTreeVisitorKeys"));
exports.FlowVisitorKeys = _ESTreeVisitorKeys.default;
var TransformComponentSyntax = _interopRequireWildcard(require("./estree/TransformComponentSyntax"));
var TransformEnumSyntax = _interopRequireWildcard(require("./estree/TransformEnumSyntax"));
var TransformMatchSyntax = _interopRequireWildcard(require("./estree/TransformMatchSyntax"));
var TransformRecordSyntax = _interopRequireWildcard(require("./estree/TransformRecordSyntax"));
var StripFlowTypesForBabel = _interopRequireWildcard(require("./estree/StripFlowTypesForBabel"));
var StripFlowTypes = _interopRequireWildcard(require("./estree/StripFlowTypes"));
var _ParserOptions = require("./ParserOptions");
Object.keys(_ParserOptions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _ParserOptions[key]) return;
  exports[key] = _ParserOptions[key];
});
var _SimpleTraverser = require("./traverse/SimpleTraverser");
Object.keys(_SimpleTraverser).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _SimpleTraverser[key]) return;
  exports[key] = _SimpleTraverser[key];
});
var _SimpleTransform = require("./transform/SimpleTransform");
Object.keys(_SimpleTransform).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _SimpleTransform[key]) return;
  exports[key] = _SimpleTransform[key];
});
var _getVisitorKeys = require("./traverse/getVisitorKeys");
Object.keys(_getVisitorKeys).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _getVisitorKeys[key]) return;
  exports[key] = _getVisitorKeys[key];
});
var _astArrayMutationHelpers = _interopRequireWildcard(require("./transform/astArrayMutationHelpers"));
exports.astArrayMutationHelpers = _astArrayMutationHelpers;
var _astNodeMutationHelpers = _interopRequireWildcard(require("./transform/astNodeMutationHelpers"));
exports.astNodeMutationHelpers = _astNodeMutationHelpers;
var _mutateESTreeASTForPrettier = _interopRequireDefault(require("./utils/mutateESTreeASTForPrettier"));
exports.mutateESTreeASTForPrettier = _mutateESTreeASTForPrettier.default;
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : {
    default: e
  };
}
function _interopRequireWildcard(e, t) {
  if ("function" == typeof WeakMap) var r = new WeakMap(),
    n = new WeakMap();
  return (_interopRequireWildcard = function (e, t) {
    if (!t && e && e.__esModule) return e;
    var o,
      i,
      f = {
        __proto__: null,
        default: e
      };
    if (null === e || "object" != typeof e && "function" != typeof e) return f;
    if (o = t ? n : r) {
      if (o.has(e)) return o.get(e);
      o.set(e, f);
    }
    for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]);
    return f;
  })(e, t);
}
const DEFAULTS = {
  flow: 'detect'
};
function getOptions(opts) {
  const options = {
    ...DEFAULTS,
    ...(opts != null ? opts : {})
  };
  if (options.flow !== 'all' && options.flow !== 'detect') {
    throw new Error('flow option must be "all" or "detect"');
  }
  if (options.sourceType === 'unambiguous') {
    delete options.sourceType;
  } else if (options.sourceType != null && options.sourceType !== 'script' && options.sourceType !== 'module') {
    throw new Error('sourceType option must be "script", "module", or "unambiguous" if set');
  }
  if (options.enableExperimentalComponentSyntax == null) {
    options.enableExperimentalComponentSyntax = true;
  }
  if (options.enableExperimentalFlowMatchSyntax == null) {
    options.enableExperimentalFlowMatchSyntax = true;
  }
  if (options.enableExperimentalFlowRecordSyntax == null) {
    options.enableExperimentalFlowRecordSyntax = true;
  }
  options.enableRecords = options.enableExperimentalFlowRecordSyntax;
  if (options.enableEnums == null) {
    options.enableEnums = true;
  }
  if (options.enableExperimentalDecorators == null) {
    options.enableExperimentalDecorators = true;
  }
  options.tokens = options.tokens === true;
  options.allowReturnOutsideFunction = options.allowReturnOutsideFunction === true;
  return options;
}
function parse(code, opts) {
  const options = getOptions(opts);
  if (options.flow === 'all') {
    options.enableTypes = true;
  } else {
    options.enableTypesPragmaDetection = true;
  }
  return FlowParser.parse(code, options);
}
const Transforms = exports.Transforms = {
  transformEnumSyntax: TransformEnumSyntax.transformProgram,
  transformMatchSyntax: TransformMatchSyntax.transformProgram,
  transformComponentSyntax: TransformComponentSyntax.transformProgram,
  transformRecordSyntax: TransformRecordSyntax.transformProgram,
  stripFlowTypesForBabel: StripFlowTypesForBabel.transformProgram,
  stripFlowTypes: StripFlowTypes.transformProgram
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;
var _FlowParserDeserializer = _interopRequireDefault(require("./FlowParserDeserializer"));
var _FlowParserWASM = _interopRequireDefault(require("./FlowParserWASM"));
var _getModuleDocblock = require("./getModuleDocblock");
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : {
    default: e
  };
}
function asWireNode(value) {
  if (value == null || typeof value !== 'object') {
    return null;
  }
  return value;
}
let FlowParserWASM;
let flowParse;
let flowParseResult_free;
let flowParseResult_getError;
let flowParseResult_getErrorLine;
let flowParseResult_getErrorColumn;
let flowParseResult_getProgramBuffer;
let flowParseResult_getPositionBuffer;
let flowParseResult_getPositionBufferSize;
let flowParseResult_getStringBuffer;
const BABEL_LOWERING_ERROR_PREFIX = '$FlowBabelLoweringError$';
function initFlowParserWASM() {
  if (FlowParserWASM != null) {
    return;
  }
  FlowParserWASM = (0, _FlowParserWASM.default)({
    quit(_status, toThrow) {
      throw toThrow;
    }
  });
  flowParse = FlowParserWASM.cwrap('hermesParse', 'number', ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number']);
  flowParseResult_free = FlowParserWASM.cwrap('hermesParseResult_free', 'void', ['number']);
  flowParseResult_getError = FlowParserWASM.cwrap('hermesParseResult_getError', 'string', ['number']);
  flowParseResult_getErrorLine = FlowParserWASM.cwrap('hermesParseResult_getErrorLine', 'number', ['number']);
  flowParseResult_getErrorColumn = FlowParserWASM.cwrap('hermesParseResult_getErrorColumn', 'number', ['number']);
  flowParseResult_getProgramBuffer = FlowParserWASM.cwrap('hermesParseResult_getProgramBuffer', 'number', ['number']);
  flowParseResult_getPositionBuffer = FlowParserWASM.cwrap('hermesParseResult_getPositionBuffer', 'number', ['number']);
  flowParseResult_getPositionBufferSize = FlowParserWASM.cwrap('hermesParseResult_getPositionBufferSize', 'number', ['number']);
  flowParseResult_getStringBuffer = FlowParserWASM.cwrap('hermesParseResult_getStringBuffer', 'number', ['number']);
}
function copyToHeap(buffer, addr) {
  FlowParserWASM.HEAP8.set(buffer, addr);
  FlowParserWASM.HEAP8[addr + buffer.length] = 0;
}
function flag(v) {
  return v === true ? 1 : 0;
}
function parse(source, options) {
  initFlowParserWASM();
  const sourceBuffer = Buffer.from(source, 'utf8');
  const filename = typeof options.sourceFilename === 'string' ? options.sourceFilename : '';
  const filenameBuffer = filename.length > 0 ? Buffer.from(filename, 'utf8') : null;
  let sourceAddr = 0;
  let filenameAddr = 0;
  let filenameLen = 0;
  let parseResult = 0;
  try {
    var _options$transformOpt, _options$transformOpt2, _options$transformOpt3, _options$transformOpt4;
    sourceAddr = FlowParserWASM._malloc(sourceBuffer.length + 1);
    if (!sourceAddr) {
      throw new Error('Parser out of memory');
    }
    if (filenameBuffer != null) {
      filenameAddr = FlowParserWASM._malloc(filenameBuffer.length + 1);
      if (!filenameAddr) {
        throw new Error('Parser out of memory');
      }
      copyToHeap(filenameBuffer, filenameAddr);
      filenameLen = filenameBuffer.length + 1;
    }
    copyToHeap(sourceBuffer, sourceAddr);
    const enableTypes = options.enableTypes === false ? 0 : 1;
    const sourceTypeCode = options.sourceType === 'script' ? 1 : options.sourceType === 'module' ? 2 : 0;
    parseResult = flowParse(sourceAddr, sourceBuffer.length + 1, filenameAddr, filenameLen, flag(options.enableExperimentalComponentSyntax), flag(options.enableExperimentalFlowMatchSyntax), flag(options.enableExperimentalDecorators), flag(options.tokens), flag(options.allowReturnOutsideFunction), flag(options.assertOperator), flag(options.enableEnums), flag(options.enableRecords), enableTypes, sourceTypeCode, flag(options.enableTypesPragmaDetection), 0, flag(options.babel), flag((_options$transformOpt = options.transformOptions) == null ? void 0 : (_options$transformOpt2 = _options$transformOpt.TransformEnumSyntax) == null ? void 0 : _options$transformOpt2.enable), flag(((_options$transformOpt3 = options.transformOptions) == null ? void 0 : (_options$transformOpt4 = _options$transformOpt3.TransformEnumSyntax) == null ? void 0 : _options$transformOpt4.getRuntime) != null), options.reactRuntimeTarget === '19' ? 19 : 18, options.throwOnParseErrors === false ? 0 : 1);
    if (options.babel === true) {
      const error = flowParseResult_getError(parseResult);
      const line = flowParseResult_getErrorLine(parseResult);
      const column = flowParseResult_getErrorColumn(parseResult);
      if (error != null && error.startsWith(BABEL_LOWERING_ERROR_PREFIX)) {
        const syntaxError = new SyntaxError(error.slice(BABEL_LOWERING_ERROR_PREFIX.length));
        syntaxError.loc = {
          line,
          column
        };
        throw syntaxError;
      }
      if (error != null && error.length > 0 && options.throwOnParseErrors !== false) {
        const syntaxError = new SyntaxError(`${error} (${line}:${column})`);
        syntaxError.loc = {
          line,
          column
        };
        throw syntaxError;
      }
    }
    const programBuffer = flowParseResult_getProgramBuffer(parseResult);
    if (!programBuffer) {
      const err = flowParseResult_getError(parseResult);
      const syntaxError = new SyntaxError(err || 'unknown parse error');
      syntaxError.loc = {
        line: flowParseResult_getErrorLine(parseResult),
        column: flowParseResult_getErrorColumn(parseResult)
      };
      throw syntaxError;
    }
    const deserialized = new _FlowParserDeserializer.default(programBuffer, flowParseResult_getPositionBuffer(parseResult), flowParseResult_getPositionBufferSize(parseResult), flowParseResult_getStringBuffer(parseResult), FlowParserWASM, options).deserialize();
    if (options.babel === true) {
      if (deserialized.type !== 'File') {
        throw new Error(`Expected File, got ${deserialized.type}`);
      }
      return deserialized;
    }
    if (deserialized.type !== 'Program') {
      throw new Error(`Expected Program, got ${deserialized.type}`);
    }
    const ast = deserialized;
    const sourceFilename = typeof options.sourceFilename === 'string' ? options.sourceFilename : null;
    const visitedNodes = new WeakSet();
    const locRanges = new WeakMap();
    function fixLocs(node) {
      const wireNode = asWireNode(node);
      if (wireNode == null) {
        return;
      }
      if (visitedNodes.has(wireNode)) {
        return;
      }
      visitedNodes.add(wireNode);
      if (wireNode.loc != null) {
        const loc = wireNode.loc;
        let range = locRanges.get(loc);
        if (range == null) {
          const rangeStart = loc.rangeStart;
          const rangeEnd = loc.rangeEnd;
          if (rangeStart == null || rangeEnd == null) {
            throw new Error('Expected serialized source range');
          }
          loc.source = sourceFilename;
          range = [rangeStart, rangeEnd];
          locRanges.set(loc, range);
          delete loc.rangeStart;
          delete loc.rangeEnd;
        }
        wireNode.range = range;
      }
      for (const key of Object.keys(wireNode)) {
        const val = wireNode[key];
        if (Array.isArray(val)) {
          for (const child of val) {
            fixLocs(child);
          }
        } else {
          fixLocs(val);
        }
      }
    }
    fixLocs(ast);
    if (options.throwOnParseErrors !== false) {
      const errors = ast.errors;
      if (errors != null && errors.length > 0) {
        const first = errors[0];
        const start = first.loc.start;
        if (start == null) {
          throw new Error('Expected serialized parser error start location');
        }
        const line = start.line;
        const column = start.column;
        const syntaxError = new SyntaxError(`${first.message} (${line}:${column})`);
        syntaxError.loc = {
          line,
          column
        };
        throw syntaxError;
      }
    }
    if (options.sourceType === 'script' || options.sourceType === 'module') {
      ast.sourceType = options.sourceType;
    } else {
      ast.sourceType = detectSourceType(ast);
    }
    ast.docblock = (0, _getModuleDocblock.getModuleDocblock)(ast);
    return asProgram(ast);
  } finally {
    if (parseResult !== 0) {
      flowParseResult_free(parseResult);
    }
    if (sourceAddr !== 0) {
      FlowParserWASM._free(sourceAddr);
    }
    if (filenameAddr !== 0) {
      FlowParserWASM._free(filenameAddr);
    }
  }
}
function asProgram(ast) {
  return ast;
}
function detectSourceType(program) {
  if (!Array.isArray(program.body)) {
    return 'script';
  }
  for (const stmt of program.body) {
    if (stmt == null) {
      continue;
    }
    switch (stmt.type) {
      case 'ImportDeclaration':
        if (stmt.importKind === 'value' || stmt.importKind == null) {
          return 'module';
        }
        break;
      case 'ExportDefaultDeclaration':
        return 'module';
      case 'ExportNamedDeclaration':
      case 'ExportAllDeclaration':
        if (stmt.exportKind === 'value' || stmt.exportKind == null) {
          return 'module';
        }
        break;
    }
  }
  return 'script';
}
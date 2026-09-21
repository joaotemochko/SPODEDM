'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _HermesParserDecodeUTF8String = _interopRequireDefault(require("./HermesParserDecodeUTF8String"));
var _FlowParserNodeDeserializers = _interopRequireDefault(require("./FlowParserNodeDeserializers"));
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : {
    default: e
  };
}
const LOCATION_IDENTIFIER_NAME = 1 << 0;
class FlowParserDeserializer {
  constructor(programBuffer, positionBuffer, positionBufferSize, stringBufferBase, wasmParser, options) {
    this.programBufferIdx = void 0;
    this.positionBufferIdx = void 0;
    this.positionBufferSize = void 0;
    this.stringBufferBase = void 0;
    this.locMap = void 0;
    this.extendedPositions = void 0;
    this.extendedRanges = void 0;
    this.HEAPU8 = void 0;
    this.HEAPU32 = void 0;
    this.HEAPF64 = void 0;
    this.options = void 0;
    this.extendedLocationHeaders = void 0;
    this.commentTypes = ['Block', 'Line'];
    this.tokenTypes = ['Boolean', 'Identifier', 'Keyword', 'Null', 'Numeric', 'BigInt', 'Punctuator', 'String', 'RegularExpression', 'Template', 'JSXText'];
    this.programBufferIdx = programBuffer / 4;
    this.positionBufferIdx = positionBuffer / 4;
    this.positionBufferSize = positionBufferSize;
    this.stringBufferBase = stringBufferBase;
    this.locMap = {};
    this.extendedPositions = [];
    this.extendedRanges = new WeakMap();
    this.HEAPU8 = wasmParser.HEAPU8;
    this.HEAPU32 = wasmParser.HEAPU32;
    this.HEAPF64 = wasmParser.HEAPF64;
    this.options = options;
    this.extendedLocationHeaders = false;
  }
  next() {
    const num = this.HEAPU32[this.programBufferIdx++];
    return num;
  }
  deserialize() {
    if (this.HEAPU32[this.programBufferIdx] === 0) {
      return this.deserializeESTreeProgram();
    }
    this.extendedLocationHeaders = true;
    this.prepareExtendedPositions();
    const root = this.deserializeNode();
    if (root == null) {
      throw new Error('Expected serialized parser root');
    }
    return root;
  }
  deserializeESTreeProgram() {
    const program = {
      type: 'Program',
      loc: this.addEmptyLoc(),
      body: this.deserializeNodeList(),
      comments: this.deserializeESTreeComments()
    };
    program.interpreter = this.deserializeNode();
    if (this.options.tokens === true) {
      program.tokens = this.deserializeTokens();
    } else {
      this.deserializeTokens();
    }
    program.errors = this.deserializeErrors();
    this.fillLocs();
    return program;
  }
  deserializeErrors() {
    const size = this.next();
    const errors = [];
    for (let i = 0; i < size; i++) {
      const loc = this.addEmptyLoc();
      const message = this.deserializeString();
      if (message == null) {
        throw new Error('Expected serialized parser error message');
      }
      errors.push({
        loc,
        message
      });
    }
    return errors;
  }
  deserializeBoolean() {
    return Boolean(this.next());
  }
  deserializeNumber() {
    let floatIdx;
    if (this.programBufferIdx % 2 === 0) {
      floatIdx = this.programBufferIdx / 2;
      this.programBufferIdx += 2;
    } else {
      floatIdx = (this.programBufferIdx + 1) / 2;
      this.programBufferIdx += 3;
    }
    return this.HEAPF64[floatIdx];
  }
  deserializeString() {
    const offsetPlusOne = this.next();
    if (offsetPlusOne === 0) {
      return null;
    }
    const size = this.next();
    return (0, _HermesParserDecodeUTF8String.default)(this.stringBufferBase + offsetPlusOne - 1, size, this.HEAPU8);
  }
  deserializeNode() {
    const nodeType = this.next();
    if (nodeType === 0) {
      return null;
    }
    const deserializeNode = _FlowParserNodeDeserializers.default[nodeType - 1];
    if (deserializeNode == null) {
      throw new Error(`Unknown serialized node kind ${nodeType - 1} at program word ${this.programBufferIdx - 1}`);
    }
    const node = deserializeNode.call(this);
    if (this.extendedLocationHeaders) {
      this.addExtendedRange(node);
    }
    return node;
  }
  deserializeNodeList() {
    const size = this.next();
    const nodeList = [];
    for (let i = 0; i < size; i++) {
      nodeList.push(this.deserializeNode());
    }
    return nodeList;
  }
  deserializeEnumRuntime() {
    var _this$options$transfo, _this$options$transfo2;
    const getRuntime = (_this$options$transfo = this.options.transformOptions) == null ? void 0 : (_this$options$transfo2 = _this$options$transfo.TransformEnumSyntax) == null ? void 0 : _this$options$transfo2.getRuntime;
    if (typeof getRuntime !== 'function') {
      throw new Error('Expected TransformEnumSyntax.getRuntime callback');
    }
    return getRuntime();
  }
  deserializeComments() {
    const size = this.next();
    const comments = [];
    for (let i = 0; i < size; i++) {
      const commentType = this.deserializeString();
      if (commentType == null) {
        throw new Error('Expected serialized comment type');
      }
      const loc = this.addEmptyLoc();
      const comment = {
        type: commentType,
        loc,
        value: this.deserializeString()
      };
      this.addExtendedRange(comment);
      comments.push(comment);
    }
    return comments;
  }
  deserializeESTreeComments() {
    const size = this.next();
    const comments = [];
    for (let i = 0; i < size; i++) {
      const commentType = this.commentTypes[this.next()];
      const comment = {
        type: commentType,
        loc: this.addEmptyLoc(),
        value: this.deserializeString()
      };
      comments.push(comment);
    }
    return comments;
  }
  deserializeTokens() {
    const size = this.next();
    const tokens = [];
    for (let i = 0; i < size; i++) {
      const tokenType = this.tokenTypes[this.next()];
      const loc = this.addEmptyLoc();
      const value = this.deserializeString();
      const token = {
        type: tokenType,
        loc,
        value
      };
      tokens.push(token);
    }
    return tokens;
  }
  addEmptyLoc() {
    const locId = this.next();
    if (this.extendedLocationHeaders) {
      const flags = this.next();
      const position = this.extendedPositions[locId];
      if (position == null) {
        throw new Error(`Missing serialized extended location ${locId}`);
      }
      const loc = position.loc;
      if (flags & LOCATION_IDENTIFIER_NAME) {
        const identifierName = this.deserializeString();
        if (identifierName != null) {
          loc.identifierName = identifierName;
        }
      }
      this.extendedRanges.set(loc, position);
      return loc;
    }
    const loc = {};
    this.locMap[locId] = loc;
    return loc;
  }
  prepareExtendedPositions() {
    let index = this.positionBufferIdx;
    for (let i = 0; i < this.positionBufferSize; i++) {
      var _this$extendedPositio;
      const locId = this.HEAPU32[index++];
      const kind = this.HEAPU32[index++];
      const line = this.HEAPU32[index++];
      const column = this.HEAPU32[index++];
      const offset = this.HEAPU32[index++];
      const position = (_this$extendedPositio = this.extendedPositions[locId]) != null ? _this$extendedPositio : {
        loc: {},
        start: 0,
        end: 0
      };
      if (kind === 0) {
        position.loc.start = {
          line,
          column
        };
        position.start = offset;
      } else {
        position.loc.end = {
          line,
          column
        };
        position.end = offset;
      }
      this.extendedPositions[locId] = position;
    }
  }
  addExtendedRange(owner) {
    if (owner.loc == null) {
      return;
    }
    const position = this.extendedRanges.get(owner.loc);
    if (position == null) {
      return;
    }
    owner.start = position.start;
    owner.end = position.end;
  }
  fillLocs() {
    for (let i = 0; i < this.positionBufferSize; i++) {
      const locId = this.HEAPU32[this.positionBufferIdx++];
      const kind = this.HEAPU32[this.positionBufferIdx++];
      const line = this.HEAPU32[this.positionBufferIdx++];
      const column = this.HEAPU32[this.positionBufferIdx++];
      const offset = this.HEAPU32[this.positionBufferIdx++];
      const loc = this.locMap[locId];
      if (loc == null) {
        throw new Error(`Missing serialized location ${locId}`);
      }
      if (kind === 0) {
        loc.start = {
          line,
          column
        };
        loc.rangeStart = offset;
      } else {
        loc.end = {
          line,
          column
        };
        loc.rangeEnd = offset;
      }
    }
  }
}
exports.default = FlowParserDeserializer;
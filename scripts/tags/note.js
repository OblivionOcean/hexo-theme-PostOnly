/**
 * note.js - 提供note标签支持
 * 用于创建各种样式的提示信息框
 * https://github.com/volantis-x/hexo-theme-volantis
 * 
 * @file 提示信息框标签插件
 * @author [author]
 * @version 1.0.0
 * @since 1.0.0
 */

'use strict';

/**
 * 创建简单的note标签
 * 该函数用于生成简单的提示信息框，支持自定义样式
 * 
 * @param {Array} args - 标签参数，格式：[样式, 内容] 或 [内容]
 * @returns {string} HTML note标签
 * 
 * @example
 * // 带样式的提示框
 * {% note warning, 这是一个警告信息 %}
 * 
 * @example
 * // 普通提示框
 * {% note 这是一个普通提示信息 %}
 * 
 * @since 1.0.0
 */
function postNote(args) {
  // 支持两种分隔符：',' 或 '::'
  args = postNote._parseArgs(args);
  
  // 处理参数并生成HTML
  return postNote._generateNoteHtml(args);
}

/**
 * 解析参数分隔符
 * @param {Array} args - 原始参数
 * @returns {Array} 解析后的参数
 * @private
 */
postNote._parseArgs = function(args) {
  if(/::/g.test(args)){
    return args.join(' ').split('::');
  } else {
    return args.join(' ').split(',');
  }
};

/**
 * 生成note标签HTML
 * @param {Array} args - 解析后的参数
 * @returns {string} HTML note标签
 * @private
 */
postNote._generateNoteHtml = function(args) {
  // 如果有两个参数，则第一个是样式，第二个是内容
  if (args.length > 1) {
    const cls = args[0].trim();   // 样式类名
    const text = args[1].trim();  // 提示内容
    // 使用hexo渲染引擎将markdown内容转换为HTML
    return `<div class="note ${cls}">${postNote._renderMarkdown(text)}</div>`;
  } 
  // 如果只有一个参数，则只有内容
  else if (args.length > 0) {
    const text = args[0].trim();  // 提示内容
    // 使用hexo渲染引擎将markdown内容转换为HTML
    return `<div class="note">${postNote._renderMarkdown(text)}</div>`;
  }
  return '';
};

/**
 * 渲染Markdown内容
 * @param {string} text - Markdown文本
 * @returns {string} HTML内容
 * @private
 */
postNote._renderMarkdown = function(text) {
  return hexo.render.renderSync({text: text, engine: 'markdown'}).split('\n').join('');
};

/**
 * 创建带标题的note块标签
 * 该函数用于生成带标题的复杂提示信息框
 * 
 * @param {Array} args - 标签参数，格式：[样式, 标题]
 * @param {string} content - 标签内容
 * @returns {string} HTML note标签
 * 
 * @example
 * {% noteblock warning, 注意 %}
 * 这是警告信息的详细内容
 * {% endnoteblock %}
 * 
 * @since 1.0.0
 */
function postNoteBlock(args, content) {
  // 支持两种分隔符：',' 或 '::'
  args = postNoteBlock._parseArgs(args);
  
  // 验证参数
  if (!postNoteBlock._validateArgs(args)) {
    return '';
  }
  
  // 处理参数并生成HTML
  return postNoteBlock._generateNoteBlockHtml(args, content);
}

/**
 * 解析参数分隔符
 * @param {Array} args - 原始参数
 * @returns {Array} 解析后的参数
 * @private
 */
postNoteBlock._parseArgs = function(args) {
  if(/::/g.test(args)){
    return args.join(' ').split('::');
  } else {
    return args.join(' ').split(',');
  }
};

/**
 * 验证参数
 * @param {Array} args - 解析后的参数
 * @returns {boolean} 是否有效
 * @private
 */
postNoteBlock._validateArgs = function(args) {
  return args.length >= 1;
};

/**
 * 生成note块标签HTML
 * @param {Array} args - 解析后的参数
 * @param {string} content - 内容
 * @returns {string} HTML note标签
 * @private
 */
postNoteBlock._generateNoteBlockHtml = function(args, content) {
  const cls = args[0].trim();   // 样式类名
  let ret = '';
  // 创建note容器并应用样式类
  ret += `<div class="note ${cls}">`;
  
  // 如果提供了标题参数
  if (args.length > 1) {
    const title = args[1].trim();  // 标题内容
    // 添加标题元素
    ret += `<p><strong>${title}</strong></p>`;
  }
  
  // 渲染内容并添加到返回结果中
  // 使用hexo渲染引擎将markdown内容转换为HTML
  ret += postNoteBlock._renderMarkdown(content);
  ret += '</div>';
  return ret;
};

/**
 * 渲染Markdown内容
 * @param {string} text - Markdown文本
 * @returns {string} HTML内容
 * @private
 */
postNoteBlock._renderMarkdown = function(text) {
  return hexo.render.renderSync({text: text, engine: 'markdown'}).split('\n').join('');
};

// 注册note标签，用于简单的提示信息
hexo.extend.tag.register('note', postNote);

/**
 * 兼容性处理：blocknote标签
 * 用于替代旧的noteblock标签
 * 
 * @param {Array} args - 标签参数
 * @param {string} content - 标签内容
 * @returns {string} HTML标签
 * 
 * @example
 * {% blocknote warning, 注意 %}
 * 这是警告信息的详细内容
 * {% endblocknote %}
 * 
 * @since 1.0.0
 */
hexo.extend.tag.register('blocknote', postNoteBlock, {ends: true});

/**
 * 兼容旧的noteblock标签
 * 将noteblock转换为blocknote，确保向后兼容性
 * 
 * @param {Object} data - 文章数据
 * @returns {Object} 处理后的文章数据
 * 
 * @since 1.0.0
 */
hexo.extend.filter.register('before_post_render', function(data) {
  // 将noteblock标签替换为blocknote标签
  data.content = data.content.replace(/{%\s+noteblock(.*)%}/g, (p,q)=>{
    return `{% blocknote ${q} %}`
  });
  // 将endnoteblock标签替换为endblocknote标签
  data.content = data.content.replace(/{%\s+endnoteblock\s+%}/g, '{% endblocknote %}');
  return data;
});

/**
 * 废弃的noteblock标签处理
 * 当用户使用废弃的noteblock标签时抛出错误，提示使用blocknote
 * 
 * @throws {Error} 使用废弃标签时抛出错误
 * 
 * @since 1.0.0
 */
hexo.extend.tag.register('noteblock', postNoteBlockDeprecated, {ends: true});

/**
 * 抛出错误，提示用户使用新的blocknote标签
 * 
 * @throws {Error} 总是抛出错误
 */
function postNoteBlockDeprecated(args, content) {
    throw new Error(`
==================================================================================
        {% noteblock %} is deprecated. Use {% blocknote %} instead.
        see: https://github.com/volantis-x/hexo-theme-volantis/issues/712
==================================================================================
  `);
}
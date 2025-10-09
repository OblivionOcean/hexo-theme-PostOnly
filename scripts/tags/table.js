/**
 * table.js | https://github.com/volantis-x/hexo-theme-volantis
 * 提供自定义表格功能
 * 
 * @file 自定义表格标签插件
 * @author [author]
 * @version 1.0.0
 * @since 1.0.0
 */

(function() {
  'use strict';

  /**
   * 创建自定义表格容器
   * 该函数用于生成具有自定义样式的表格
   * 
   * @param {Array} args - 标签参数
   * @param {string} content - 表格内容（Markdown格式）
   * @returns {string} HTML表格标签
   * 
   * @example
   * {% table %}
   * |列1|列2|列3|
   * |-|-|-|
   * |内容1|内容2|内容3|
   * {% endtable %}
   * 
   * @since 1.0.0
   */
  function postTable(args, content) {
    var ret = '';
    // 添加表格包装器，使用table类进行样式控制
    ret += '<div class="table">';
    // 使用hexo渲染引擎将markdown表格内容转换为HTML
    ret += hexo.render.renderSync({text: content, engine: 'markdown'});
    ret += '</div>';
    return ret;
  }

  // 注册table标签，使其在markdown中可用
  hexo.extend.tag.register('table', postTable, {ends: true});
})();
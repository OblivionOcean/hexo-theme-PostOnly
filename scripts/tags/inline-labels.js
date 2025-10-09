/**
 * inline-labels.js - 提供多种内联标签的注册
 * 包括下划线、强调、删除线等文本标记
 * 
 * @file 内联标签插件
 * @author [author]
 * @version 1.0.0
 * @since 1.0.0
 */

(function() {
  'use strict';

  /**
   * 注册 <u> 标签，用于添加下划线
   * 
   * @param {Array} args - 标签参数，将被连接成字符串作为标签内容
   * @returns {string} HTML <u> 标签
   * 
   * @example
   * {% u 这是下划线文本 %}
   * 
   * @since 1.0.0
   */
  hexo.extend.tag.register('u', function(args) {
    // 将参数数组连接成字符串作为标签内容
    return '<u>' + args.join(' ') + '</u>';
  });

  /**
   * 注册 <emp> 标签，用于强调文本
   * 
   * @param {Array} args - 标签参数，将被连接成字符串作为标签内容
   * @returns {string} HTML <emp> 标签
   * 
   * @example
   * {% emp 这是强调文本 %}
   * 
   * @since 1.0.0
   */
  hexo.extend.tag.register('emp', function(args) {
    // 将参数数组连接成字符串作为标签内容
    return '<emp>' + args.join(' ') + '</emp>';
  });

  /**
   * 注册 <wavy> 标签，用于添加波浪下划线
   * 
   * @param {Array} args - 标签参数，将被连接成字符串作为标签内容
   * @returns {string} HTML <wavy> 标签
   * 
   * @example
   * {% wavy 这是波浪下划线文本 %}
   * 
   * @since 1.0.0
   */
  hexo.extend.tag.register('wavy', function(args) {
    // 将参数数组连接成字符串作为标签内容
    return '<wavy>' + args.join(' ') + '</wavy>';
  });

  /**
   * 注册 <del> 标签，用于删除线文本
   * 
   * @param {Array} args - 标签参数，将被连接成字符串作为标签内容
   * @returns {string} HTML <del> 标签
   * 
   * @example
   * {% del 这是删除线文本 %}
   * 
   * @since 1.0.0
   */
  hexo.extend.tag.register('del', function(args) {
    // 将参数数组连接成字符串作为标签内容
    return '<del>' + args.join(' ') + '</del>';
  });

  /**
   * 注册 <kbd> 标签，用于表示键盘按键
   * 
   * @param {Array} args - 标签参数，将被连接成字符串作为标签内容
   * @returns {string} HTML <kbd> 标签
   * 
   * @example
   * {% kbd Ctrl+C %}
   * 
   * @since 1.0.0
   */
  hexo.extend.tag.register('kbd', function(args) {
    // 将参数数组连接成字符串作为标签内容
    return '<kbd>' + args.join(' ') + '</kbd>';
  });

  /**
   * 注册 <psw> 标签，用于密码文本
   * 
   * @param {Array} args - 标签参数，将被连接成字符串作为标签内容
   * @returns {string} HTML <psw> 标签
   * 
   * @example
   * {% psw 这是密码文本 %}
   * 
   * @since 1.0.0
   */
  hexo.extend.tag.register('psw', function(args) {
    // 将参数数组连接成字符串作为标签内容
    return '<psw>' + args.join(' ') + '</psw>';
  });
})();
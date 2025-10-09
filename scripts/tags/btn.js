/**
 * btn.js - 提供自定义按钮标签
 * 支持多种参数配置，包括文本、链接、图标等
 * 
 * @file 自定义按钮标签插件
 * @author [author]
 * @version 1.0.0
 * @since 1.0.0
 */

(function() {
  'use strict';

  /**
   * 创建按钮标签
   * 该函数用于生成具有多种样式的按钮，支持图标、链接等配置
   * 
   * @param {Array} args - 标签参数，支持多种格式：
   *   1. [文本, 链接] 
   *   2. [文本, 链接, 图标]
   *   3. [类名, 文本, 链接]
   *   4. [类名, 文本, 链接, 图标]
   *   
   * @returns {string} HTML按钮标签
   * 
   * @example
   * // 基本按钮
   * {% btn 链接, 文本 %}
   * 
   * @example
   * // 带图标的按钮
   * {% btn 链接, 文本, fa fa-home %}
   * 
   * @example
   * // 带自定义类名的按钮
   * {% btn custom-class, 文本, 链接 %}
   * 
   * @since 1.0.0
   */
  function postBtn(args) {
    // 支持两种分隔符：',' 或 '::'
    args = postBtn._parseArgs(args);
    
    // 解析参数
    var params = postBtn._extractParams(args);
    
    // 准备HTML属性
    var urlAttr = postBtn._createUrlAttribute(params.url);
    var classAttr = postBtn._createClassAttribute(params.cls);
    
    // 生成按钮HTML
    return postBtn._generateButtonHtml(params, urlAttr, classAttr);
  }

  /**
   * 解析参数分隔符
   * @param {Array} args - 原始参数
   * @returns {Array} 解析后的参数
   * @private
   */
  postBtn._parseArgs = function(args) {
    if(/::/g.test(args)){
      return args.join(' ').split('::');
    } else {
      return args.join(' ').split(',');
    }
  };

  /**
   * 提取参数
   * @param {Array} args - 解析后的参数
   * @returns {Object} 参数对象
   * @private
   */
  postBtn._extractParams = function(args) {
    var cls = '';    // CSS类名
    var text = '';   // 按钮文本
    var url = '';    // 链接地址
    var icon = '';   // 图标类名

    // 根据参数数量和内容确定各参数值
    if (args.length > 3) {
      // 格式: [类名, 文本, 链接, 图标]
      cls = args[0];
      text = args[1];
      url = args[2];
      icon = args[3];
    } else if (args.length > 2) {
      // 判断是哪种三参数格式
      if (args[2].indexOf(' fa-') > -1) {
        // text, url, icon
        text = args[0];
        url = args[1];
        icon = args[2];
      } else {
        // cls, text, url
        cls = args[0];
        text = args[1];
        url = args[2];
      }
    } else if (args.length > 1) {
      // 格式: [文本, 链接]
      text = args[0];
      url = args[1];
    } else if (args.length > 0) {
      // 格式: [文本]
      text = args[0];
    }

    // 清理参数
    return {
      cls: cls.trim(),
      text: text.trim(),
      url: url.trim(),
      icon: icon.trim()
    };
  };

  /**
   * 创建URL属性
   * @param {string} url - URL地址
   * @returns {string} URL属性字符串
   * @private
   */
  postBtn._createUrlAttribute = function(url) {
    return url.length > 0 ? "href='" + url + "'" : '';
  };

  /**
   * 创建CSS类属性
   * @param {string} cls - CSS类名
   * @returns {string} CSS类属性字符串
   * @private
   */
  postBtn._createClassAttribute = function(cls) {
    return cls.length > 0 ? ' ' + cls : '';
  };

  /**
   * 生成按钮HTML
   * @param {Object} params - 参数对象
   * @param {string} urlAttr - URL属性
   * @param {string} classAttr - CSS类属性
   * @returns {string} 按钮HTML
   * @private
   */
  postBtn._generateButtonHtml = function(params, urlAttr, classAttr) {
    if (params.icon.length > 0) {
      // 带图标的按钮
      return "<span class='btn'><a class='button' " + urlAttr + " title='" + params.text + "'><i class='" + params.icon + "'></i>" + params.text + "</a></span>";
    } else {
      // 普通按钮
      return "<span class='btn'><a class='button' " + urlAttr + " title='" + params.text + "'>" + params.text + "</a></span>";
    }
  };

  // 注册btn标签，使其在markdown中可用
  hexo.extend.tag.register('btn', postBtn);
})();
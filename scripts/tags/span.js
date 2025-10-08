/**
 * span.js - 提供自定义段落和span标签
 * 支持通过参数指定CSS类名和内容
 * 
 * @file 自定义段落和span标签插件
 * @author [author]
 * @version 1.0.0
 * @since 1.0.0
 */

'use strict';

/**
 * 创建自定义段落标签
 * 该函数用于生成具有自定义CSS类的段落标签
 * 
 * @param {Array} args - 标签参数，支持两种分隔符：',' 或 '::'
 *   参数格式: [CSS类名, 内容]
 * @returns {string} HTML <p> 标签
 * 
 * @example
 * {% p custom-class, 这是段落内容 %}
 * 
 * @since 1.0.0
 */
function postP(args) {
  // 支持两种分隔符：',' 或 '::'
  if(/::/g.test(args)){
    args = args.join(' ').split('::');
  }
  else{
    args = args.join(' ').split(',');
  }
  
  const p0 = args[0].trim();  // CSS类名
  const p1 = args[1].trim();  // 内容
  
  // 返回带有自定义类名的段落标签
  return `<p class='p ${p0}'>${p1}</p>`;
}

/**
 * 创建自定义span标签
 * 该函数用于生成具有自定义CSS类的span标签
 * 
 * @param {Array} args - 标签参数，支持两种分隔符：',' 或 '::'
 *   参数格式: [CSS类名, 内容]
 * @returns {string} HTML <span> 标签
 * 
 * @example
 * {% span custom-class, 这是span内容 %}
 * 
 * @since 1.0.0
 */
function postSpan(args) {
  // 支持两种分隔符：',' 或 '::'
  if(/::/g.test(args)){
    args = args.join(' ').split('::');
  }
  else{
    args = args.join(' ').split(',');
  }
  
  const p0 = args[0].trim();  // CSS类名
  const p1 = args[1].trim();  // 内容
  
  // 返回带有自定义类名的span标签
  return `<span class='p ${p0}'>${p1}</span>`;
}

// 注册标签，使其在markdown中可用
hexo.extend.tag.register('p', postP);
hexo.extend.tag.register('span', postSpan);
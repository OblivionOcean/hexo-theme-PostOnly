/**
 * ghcard.js - GitHub信息卡片标签
 * 用于展示GitHub用户或仓库信息
 * 基于 https://github.com/anuraghazra/github-readme-stats 实现
 * 
 * @file GitHub信息卡片标签插件
 * @author [author]
 * @version 1.0.0
 * @since 1.0.0
 */

'use strict';

/**
 * 创建GitHub信息卡片
 * 该函数用于生成GitHub用户或仓库的信息卡片，显示相关统计信息
 * 
 * @param {Array} args - 标签参数
 *   用户卡片格式：[用户名]
 *   仓库卡片格式：[用户名/仓库名]
 * @returns {string} HTML ghcard标签
 * 
 * @example
 * // 用户信息卡片
 * {% ghcard torvalds %}
 * 
 * @example
 * // 仓库信息卡片
 * {% ghcard torvalds/linux %}
 * 
 * @since 1.0.0
 */
hexo.extend.tag.register('ghcard', function(args) {
  // 支持两种分隔符：',' 或 '::'
  if(/::/g.test(args)){
    args = args.join(' ').split('::');
  }
  else{
    args = args.join(' ').split(',');
  }
  
  const path = args[0].trim();  // 用户名或仓库路径
  let card = '';
  
  // 创建卡片链接，添加适当的rel属性以确保安全性
  card += '<a class="ghcard" rel="external nofollow noopener noreferrer" href="https://github.com/' + path + '">';
  
  let url = '';
  // 判断是仓库还是用户
  if (path.includes('/')) {
    // 是仓库，使用仓库统计API
    const ps = path.split('/');
    url += 'https://github-readme-stats.xaoxuu.com//api/pin/?username=' + ps[0] + '&repo=' + ps[1];
  } else {
    // 是用户，使用用户统计API
    url += 'https://github-readme-stats.xaoxuu.com/api/?username=' + path;
  }
  
  // 处理额外参数
  if (args.length > 1) {
    for (let i = 1; i < args.length; i++) {
      const tmp = args[i].trim();
      url += '&' + tmp;
    }
  }
  
  // 默认显示所有者信息，确保信息完整性
  if (!url.includes('&show_owner=')) {
    url += '&show_owner=true';
  }
  
  // 添加图片元素，显示GitHub统计信息
  card += '<img src="' + url + '"/>';
  card += '</a>';
  return card;
});

/**
 * 创建GitHub卡片组容器
 * 该函数用于将多个ghcard标签组合在一起显示
 * 
 * @param {Array} args - 标签参数
 * @param {string} content - 标签内容，应包含多个ghcard标签
 * @returns {string} HTML卡片组标签
 * 
 * @example
 * {% ghcardgroup %}
 * {% ghcard user/repo1 %}
 * {% ghcard user/repo2 %}
 * {% endghcardgroup %}
 * 
 * @since 1.0.0
 */
hexo.extend.tag.register('ghcardgroup', function(args, content) {
  let ret = '';
  // 包装容器，使用ghcard-group类进行样式控制
  ret += '<div class="ghcard-group">';
  ret += content;
  ret += '</div>';
  return ret;
}, {ends: true});
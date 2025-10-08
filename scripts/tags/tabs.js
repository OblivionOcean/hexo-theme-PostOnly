/**
 * tabs.js | https://theme-next.org/docs/tag-plugins/tabs
 * 提供标签页功能，支持嵌套标签页
 * 
 * 使用方法:
 * {% tabs 标签名, 1 %}
 * <!-- tab 标题1 -->
 * 内容1
 * <!-- endtab -->
 * <!-- tab 标题2 -->
 * 内容2
 * <!-- endtab -->
 * {% endtabs %}
 */

'use strict';

/**
 * 创建标签页容器
 * @param {Array} args - 标签参数 [标签页名称, 激活的标签页索引]
 * @param {string} content - 标签页内容
 * @returns {string} HTML标签页结构
 */
function postTabs(args, content) {
  // 匹配标签页内容的正则表达式
  // 格式: <!-- tab 标题@图标 -->\n内容<!-- endtab -->
  var tabBlock = /<!--\s*tab (.*?)\s*-->\n([\w\W\s\S]*?)<!--\s*endtab\s*-->/g;

  // 支持两种分隔符：',' 或 '::'
  if(/::/g.test(args)){
    args = args.join(' ').split('::');
  }
  else{
    args = args.join(' ').split(',');
  }
  
  var tabName = args[0];           // 标签页名称
  var tabActive = Number(args[1]) || 0;  // 激活的标签页索引，默认为第一个

  var matches = [];     // 匹配的内容数组
  var match;            // 单次匹配结果
  var tabId = 0;        // 标签页ID计数器
  var tabNav = '';      // 标签页导航HTML
  var tabContent = '';  // 标签页内容HTML

  // 如果没有指定标签页名称，则输出警告
  !tabName && hexo.log.warn('Tabs block must have unique name!');

  // 提取所有标签页内容
  while ((match = tabBlock.exec(content)) !== null) {
    matches.push(match[1]);  // 标签页参数 (标题@图标)
    matches.push(match[2]);  // 标签页内容
  }

  // 处理每个标签页
  for (var i = 0; i < matches.length; i += 2) {
    var tabParameters = matches[i].split('@');
    var postContent   = matches[i + 1];
    var tabCaption    = tabParameters[0] || '';  // 标签页标题
    var tabIcon       = tabParameters[1] || '';  // 标签页图标

    // 处理特殊标签内容
    var specialTags = postTabs._processSpecialTags(postContent);
    postContent = specialTags.content;
    
    // 渲染Markdown内容为HTML
    postContent = hexo.render.renderSync({text: postContent, engine: 'markdown'}).trim();

    // 恢复特殊标签内容
    postContent = postTabs._restoreSpecialTags(postContent, specialTags);

    tabId += 1;
    // 生成标签页唯一标识符，用于锚点定位
    var tabHref = postTabs._generateTabHref(tabName, tabId);

    // 如果没有指定标题和图标，则使用默认标题
    if ((tabCaption.length === 0) && (tabIcon.length === 0)) {
        tabCaption = tabName + ' ' + tabId;
    }

    // 处理图标显示样式，只有图标时居中显示
    var isOnlyicon = tabIcon.length > 0 && tabCaption.length === 0 ? ' style="text-align: center;"' : '';
    let icon = tabIcon.trim();
    // 标准化图标类名，确保以fa开头
    icon = icon.startsWith('fa') ? icon : 'fa fa-' + icon;
    if (tabIcon.length > 0) {
        tabIcon = `<i class="${icon}"${isOnlyicon}></i>`;
    } else {
        tabIcon = '';
    }

    // 判断是否为激活状态的标签页
    var isActive = (tabActive > 0 && tabActive === tabId) || (tabActive === 0 && tabId === 1) ? ' active' : '';
    
    // 构建标签页导航和内容
    tabNav += `<li class="tab${isActive}"><a class="#${tabHref}">${tabIcon + tabCaption.trim()}</a></li>`;
    tabContent += `<div class="tab-pane${isActive}" id="${tabHref}">${postContent}</div>`;
  }

  // 包装导航和内容
  tabNav = `<ul class="nav-tabs">${tabNav}</ul>`;
  tabContent = `<div class="tab-content">${tabContent}</div>`;
  
  // 生成最终的标签页结构，使用标签名作为ID前缀
  // https://github.com/volantis-x/hexo-theme-volantis/issues/703
  return `<div class="tabs" id="tab-${tabName.toLowerCase().split(' ').join('-')}">${tabNav + tabContent}</div>`;
}

/**
 * 处理特殊标签内容
 * @param {string} content - 原始内容
 * @returns {Object} 处理后的对象，包含内容和特殊标签
 * @private
 */
postTabs._processSpecialTags = function(content) {
    var result = {
        content: content,
        aplayerTag: null,
        fancyboxTag: null
    };
    
    // 兼容aplayer插件 https://github.com/volantis-x/hexo-theme-volantis/issues/575
    var aplayerTagReg = /\<div.*class=\"aplayer aplayer-tag-marker\"(.|\n)*\<\/script\>/g;
    if(/class="aplayer aplayer-tag-marker"/g.test(result.content)){
        result.aplayerTag = aplayerTagReg.exec(result.content)[0];
        result.content = result.content.replace(aplayerTagReg, "@aplayerTag@");
    }

    // 兼容 gallery 标签
    var fancyboxTagReg = /\<div.*galleryFlag(.|\n)*\<\/span\>\<\/div\>\<\/div\>/g;
    if(/galleryFlag/g.test(result.content)) {
        result.fancyboxTag = fancyboxTagReg.exec(result.content)[0];
        result.content = result.content.replace(fancyboxTagReg, "@fancyboxTag@");
    }
    
    return result;
};

/**
 * 恢复特殊标签内容
 * @param {string} content - 处理后的内容
 * @param {Object} tags - 特殊标签对象
 * @returns {string} 恢复后的内容
 * @private
 */
postTabs._restoreSpecialTags = function(content, tags) {
    // 恢复aplayer标签内容
    if(tags.aplayerTag){
        content = content.replace(/\<pre\>\<code\>.*@aplayerTag@.*\<\/code><\/pre>/, tags.aplayerTag);
    }

    // 恢复fancybox标签内容
    if(tags.fancyboxTag){
        content = content.replace(/.*@fancyboxTag@.*/, tags.fancyboxTag);
    }
    
    return content;
};

/**
 * 生成标签页Href
 * @param {string} tabName - 标签页名称
 * @param {number} tabId - 标签页ID
 * @returns {string} 标签页Href
 * @private
 */
postTabs._generateTabHref = function(tabName, tabId) {
    return (tabName + ' ' + tabId).toLowerCase().split(' ').join('-');
};

// 注册标签页相关标签，支持嵌套使用
hexo.extend.tag.register('tabs', postTabs, {ends: true});
hexo.extend.tag.register('subtabs', postTabs, {ends: true});
hexo.extend.tag.register('subsubtabs', postTabs, {ends: true});
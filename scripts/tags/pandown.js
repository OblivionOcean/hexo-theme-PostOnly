/**
 * pandown.js - 提供网盘下载标签支持
 * 用于创建网盘下载链接和相关信息展示
 * 
 * @file 网盘下载标签插件
 * @author [author]
 * @version 1.0.0
 * @since 1.0.0
 */

'use strict';

/**
 * 创建网盘下载标签
 * 该函数用于生成网盘下载链接，支持多种网盘类型
 * 
 * @param {Array} args - 标签参数，格式：[类型, 链接, 密码, 文件名]
 * @returns {string} HTML pandown标签
 * 
 * @example
 * {% pandown baidu, https://pan.baidu.com/s/xxxxx, yyyy, 文件名 %}
 * 
 * @since 1.0.0
 */
hexo.extend.tag.register('pandown', function(args) {
    // 支持两种分隔符：',' 或 '::'
    if(/::/g.test(args)){
        args = args.join(' ').split('::');
    }
    else{
        args = args.join(' ').split(',');
    }
    
    let type = '';    // 网盘类型 (如: baidu, ali)
    let url = '';     // 下载链接
    let pwd = '';     // 提取密码
    let fname = '';   // 文件名
    
    // 参数不足时返回空
    if (args.length < 4) {
        return;
    } 
    // 不支持自定义类型
    else if (args[0].trim() === 'yun') {
        // 返回错误提示信息
        return '<p>对不起，pandown-tags不支持自定义</p><br><p>Sorry, pandown-tags does not support customization</p>'
    } 
    // 正常处理参数
    else {
        type = args[0].trim();    // 网盘类型
        url = args[1].trim();     // 下载链接
        pwd = args[2].trim();     // 提取密码
        fname = args[3].trim();   // 文件名
    }
    
    let result = '';
    // 包装标签，使用pandown-tags类进行样式控制
    result += '<div class="tag pandown-tags">';
    // pandown组件，传递所有必要参数
    result += '<pandown type="'+type+'" url="'+url+'" pwd="'+pwd+'" fname="'+fname+'"></pandown>'
    // 加载外部pandown脚本并初始化
    result += '<script>Jian.load.js("https://unpkg.com/pandown", pandown)</script></div>'
    return result;
});
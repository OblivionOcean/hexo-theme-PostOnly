/**
 * HTML后处理过滤器
 * 用于替换HTML中的特定字符串以及CDN链接优化
 * 
 * @file HTML后处理过滤器
 * @author [author]
 * @version 1.0.0
 * @since 1.0.0
 */

/**
 * HTML后处理函数
 * 在HTML渲染完成后执行，用于字符串替换和CDN优化
 * 
 * @param {string} data - 渲染完成的HTML内容
 * @returns {string} 处理后的HTML内容
 * 
 * @example
 * // 在主题配置中添加replace规则
 * replace:
 *   - '旧字符串 => 新字符串'
 * 
 * @since 1.0.0
 */
hexo.extend.filter.register('after_render:html', function(data) {
    // 如果主题配置中包含替换规则，则执行替换
    if (hexo.theme.config.replace) {
        hexo.theme.config.replace.forEach(e => {
            let s = e.split(" => ")
            let a = s[0]
            let b = s[1]
            // 全局替换指定的字符串
            data = data.replace(new RegExp(a,"g"), b);
        });
    }
    
    // 将 unpkg.com 的链接替换为 elemecdn.com 提供的链接，提高加载速度
    // elemecdn.com 是国内的CDN服务，访问速度更快
    data = data.replace(new RegExp('https://unpkg.com',"g"), 'https://npm.elemecdn.com');
    
    return data;
}, 999999999999);
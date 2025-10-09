/**
 * FastJump - 实现页面快速跳转和缓存功能
 * 使用浏览器缓存API来存储和检索页面内容，提升浏览体验
 * 
 * @file 页面快速跳转和缓存功能
 * @author [author]
 * @version 1.0.0
 * @since 1.0.0
 */

/**
 * FastJump命名空间
 * 包含所有与快速跳转和缓存相关的功能
 * 
 * @namespace FastJump
 * @since 1.0.0
 */
FastJump.CACHE_NAME = 'FastJumpCache'; // 默认的存储名称

/**
 * 数据库操作对象，提供读取和写入缓存的方法
 * 使用浏览器的Cache API实现页面内容的缓存和检索
 * 
 * @memberof FastJump
 * @since 1.0.0
 */
FastJump.db = {
    /**
     * 从缓存中读取指定键的值
     * 
     * @param {string} key - 要读取的键名（通常是页面URL）
     * @returns {Promise<string|null>} 返回解析后的缓存数据或null
     * 
     * @example
     * FastJump.db.read('https://example.com/page').then(function(data) {
     *   if (data) {
     *     // 使用缓存的数据
     *   }
     * });
     * 
     * @since 1.0.0
     */
    read: function(key) {
        return new Promise(function(resolve, reject) {
            // 使用Cache API匹配缓存请求
            caches.match(new Request('https://LOCALCACHE/' + encodeURIComponent(key))).then(function (res) {
                // 将响应转换为文本
                res.text().then(function(text) { resolve(text); });
            }).catch(function() {
                // 发生错误时返回null
                resolve(null);
            });
        });
    },
    
    /**
     * 将指定键值对写入缓存
     * 
     * @param {string} key - 要写入的键名（通常是页面URL）
     * @param {string} value - 要写入的值（页面HTML内容）
     * @returns {Promise<void>}
     * 
     * @since 1.0.0
     */
    write: function(key, value) {
        return new Promise(function(resolve, reject) {
            // 打开指定名称的缓存
            caches.open(FastJump.CACHE_NAME).then(function (cache) {
                // 将请求和响应存入缓存
                cache.put(new Request('https://LOCALCACHE/' + encodeURIComponent(key)), new Response(value));
                resolve();
            }).catch(function() {
                // 发生错误时拒绝Promise
                reject();
            });
        });
    }
};

/**
 * DOM内容加载完成后执行
 * 尝试从缓存中读取当前页面，如果没有则获取并存储
 * 
 * @listens DOMContentLoaded
 * @since 1.0.0
 */
document.addEventListener('DOMContentLoaded', function () {
    // 尝试从缓存中读取当前页面
    FastJump.db.read(window.location.href).then(function (d) {
        // 如果缓存中没有数据，则从网络获取
        if (!d) {
            fetch(window.location.href).then(function (d) {
                // 确保响应内容类型为HTML
                if (d.headers.get('content-type') === 'text/html') {
                    d.text().then(function (b) {
                        // 将获取到的页面内容存入缓存
                        FastJump.db.write(window.location.href, b);
                    });
                }
            });
        }
    });
});

/**
 * DOM内容加载完成后执行
 * 设置定时器，处理页面内链接的点击事件，实现无刷新跳转
 * 
 * @listens DOMContentLoaded
 * @since 1.0.0
 */
document.addEventListener('DOMContentLoaded', function () {
    // 每500毫秒检查一次页面中的链接
    setInterval(function () {
        FastJump._processLinks();
    }, 500);
});

/**
 * 处理页面链接
 * @private
 */
FastJump._processLinks = function() {
    // 获取所有带href属性的a标签
    var doms = document.querySelectorAll('a[href]');
    Array.prototype.forEach.call(doms, function (dom) {
        // 只处理同域链接
        if (dom.href && dom.href.indexOf(window.location.origin) === 0) {
            // 重写链接点击事件
            dom.onclick = function () {
                return FastJump._handleLinkClick(dom);
            };
        }
    });
};

/**
 * 处理链接点击事件
 * @param {HTMLElement} dom - 被点击的链接元素
 * @returns {boolean} 是否阻止默认行为
 * @private
 */
FastJump._handleLinkClick = function(dom) {
    // 使用pushState更新浏览器历史记录
    history.pushState({}, '', dom.href);
    // 尝试从缓存中读取目标页面
    FastJump.db.read(dom.href).then(function (d) {
        if (d) {
            FastJump._handleCachedPage(dom, d);
        } else {
            FastJump._fetchPageFromNetwork(dom);
        }
    }).catch(function (e) {
        // 发生错误时跳转到目标页面
        window.location.href = dom.href;
    });
    // 阻止默认的链接跳转行为
    return false;
};

/**
 * 处理缓存页面
 * @param {HTMLElement} dom - 链接元素
 * @param {string} data - 缓存的页面数据
 * @private
 */
FastJump._handleCachedPage = function(dom, data) {
    console.clear();
    try {
        // 替换当前文档内容
        document.documentElement = data;
        // 等待页面内容加载完成并触发相关事件
        FastJump._waitForPageLoad();
        // 更新当前页面缓存
        FastJump._updatePageCache(dom.href);
    } catch (e) {
        // 发生错误时不做处理
    }
};

/**
 * 等待页面加载完成并触发事件
 * @private
 */
FastJump._waitForPageLoad = function() {
    var Event_timerun = window.setInterval(function () {
        if (document.body && document.body.innerHTML) {
            // 触发自定义事件
            var Event = new CustomEvent('onload');
            document.dispatchEvent(Event);
            window.dispatchEvent(Event);
            Event = new CustomEvent('DOMContentLoaded');
            document.dispatchEvent(Event);
            window.dispatchEvent(Event);
            // 清除定时器
            window.clearInterval(Event_timerun);
        }
    }, 500);
};

/**
 * 更新页面缓存
 * @param {string} url - 页面URL
 * @private
 */
FastJump._updatePageCache = function(url) {
    fetch(url).then(function (d) {
        if (d.headers.get('content-type') === 'text/html') {
            d.text().then(function (b) {
                FastJump.db.write(window.location.href, b);
            });
        }
    });
};

/**
 * 从网络获取页面
 * @param {HTMLElement} dom - 链接元素
 * @private
 */
FastJump._fetchPageFromNetwork = function(dom) {
    // 缓存中没有数据，从网络获取
    fetch(dom.href).then(function (d) {
        if (d.headers.get('content-type') === 'text/html') {
            d.text().then(function (b) {
                FastJump._handleNetworkPage(dom, b);
            }).catch(function (e) {
                // 发生错误时跳转到目标页面
                window.location.href = dom.href;
            });
        }
    }).catch(function (e) {
        // 发生错误时跳转到目标页面
        window.location.href = dom.href;
    });
};

/**
 * 处理网络获取的页面
 * @param {HTMLElement} dom - 链接元素
 * @param {string} content - 页面内容
 * @private
 */
FastJump._handleNetworkPage = function(dom, content) {
    console.clear();
    // 使用innerHTML更新页面内容而不是document.write
    try {
        document.open();
        document.write(content);
        document.close();
        // 等待页面内容加载完成并触发相关事件
        FastJump._waitForPageLoad();
    } catch (e) {
        // 发生错误时不做处理
    }
    // 将获取到的页面内容存入缓存
    FastJump.db.write(dom.href, content);
};
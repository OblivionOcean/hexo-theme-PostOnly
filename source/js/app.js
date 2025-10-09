/**
 * PostOnly 主题核心 JavaScript 文件
 * 提供主题所需的各种功能和工具方法
 */

PostOnly = {
    debug: true, // 调试开关
    var: {},     // 全局变量存储
    
    /**
     * 控制台输出工具，根据debug开关决定是否输出
     */
    console: {
        /**
         * 成功信息输出
         * @param {*} m - 输出信息
         */
        success: function(m) {
            if (PostOnly.debug) {
                console.log('%c' + m, 'border-left: 5px solid green;text-decoration: none;border-radius: 3px;color:#000 !important;background:write;padding: 3px');
            }
        },
        
        /**
         * 警告信息输出
         * @param {*} m - 输出信息
         */
        warning: function(m) {
            if (PostOnly.debug) {
                console.log('%c' + m, 'border-left: 5px solid yellow;text-decoration: none;border-radius: 3px;color:#000 !important;background:write;padding: 3px');
            }
        },
        
        /**
         * 普通信息输出
         * @param {*} m - 输出信息
         */
        info: function(m) {
            if (PostOnly.debug) {
                console.log('%c' + m, 'border-left: 5px solid dodgerblue;text-decoration: none;border-radius: 3px;color:#000 !important;background:write;padding: 3px');
            }
        },
        
        /**
         * 错误信息输出
         * @param {*} m - 输出信息
         */
        error: function(m) {
            if (PostOnly.debug) {
                console.log('%c' + m, 'border-left: 5px solid red;text-decoration: none;border-radius: 3px;color:#000 !important;background:write;padding: 3px');
            }
        },
        
        /**
         * 调试信息输出
         * @param {*} m - 输出信息
         */
        debug: function(m) {
            if (PostOnly.debug) {
                console.log('%c' + m, 'border-left: 5px solid gray;text-decoration: none;border-radius: 3px;color:#000 !important;background:write;padding: 3px');
            }
        },
        
        /**
         * 输出主题Logo
         */
        logo: function() {
            console.log('%c     _ _             \n    | (_) __ _ _ __  \n _  | | |/ _` | \'_ \\ \n| |_| | | (_| | | | |\n \\___/|_|\\__,_|_| |_|', "color:white;!important;background:dodgerblue;padding: 3px;text-align: center;");
        }
    },
    
    /**
     * 插件功能集合
     */
    plugins: {
        /**
         * 图片懒加载功能
         */
        lazyload: function () {
            var viewHeight = document.documentElement.clientHeight;
            var eles = document.querySelectorAll('img[lazyload]');
            Array.prototype.forEach.call(eles, function (item, index) {
                var rect;
                if (item.getAttribute('lazyload') === "") return;
                rect = item.getBoundingClientRect(); // 获取元素相对于视窗的位置
                
                // 如果元素在可视区域内，则加载图片
                if (rect.bottom >= 0 && rect.top < viewHeight) {
                    !function () {
                        var img = new Image();
                        img.src = item.getAttribute('lazyload');
                        
                        // 图片加载成功回调
                        img.onload = function () {
                            item.src = img.src;
                            PostOnly.console.success(img.src + ' 加载成功');
                            var Event = new CustomEvent('PostOnly:lazyload:load', { detail: { url: img.src, dom: item } });
                            document.dispatchEvent(Event);
                            window.dispatchEvent(Event);
                        };
                        
                        // 图片加载失败回调
                        img.onerror = function () {
                            item.setAttribute("lazyload", img.src);
                            PostOnly.console.error(img.src + ' 加载失败');
                            var Event = new CustomEvent('PostOnly:lazyload:error', {
                                detail: {
                                    url: img.src, dom: item
                                }
                            });
                            document.dispatchEvent(Event);
                            window.dispatchEvent(Event);
                        };
                        
                        item.removeAttribute("lazyload");
                    }();
                }
            });
        },
        
        /**
         * 阅读模式切换功能
         */
        read: function () {
            // 如果当前不是阅读模式，则切换到阅读模式
            if (document.body.classList.value.indexOf('read') !== 0) {
                document.body.classList.add('read');
                document.body.addEventListener('click', PostOnly.plugins.read);
                var readEvent = new CustomEvent('PostOnly:read', { detail: true });
                document.dispatchEvent(readEvent);
                window.dispatchEvent(readEvent);
            } else {
                // 如果当前是阅读模式，则退出阅读模式
                document.body.removeEventListener('click', PostOnly.plugins.read);
                document.body.classList.remove('read');
                var readEvent = new CustomEvent('PostOnly:read', { detail: false });
                document.dispatchEvent(readEvent);
                window.dispatchEvent(readEvent);
            }
        }
    },
    
    /**
     * 页面加载完成后执行的函数管理器
     */
    onload: {
        list: [],     // 加载函数列表
        state: false, // 加载状态
        
        /**
         * 创建Promise包装函数
         * @param {Function} fn - 要执行的函数
         * @param {...any} e - 函数参数
         * @returns {Promise}
         */
        Promise: function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            return new Promise(function (r) {
                r(fn.apply(null, args));
            });
        },
        
        /**
         * 添加加载函数到列表
         * @param {Function} fn - 要执行的函数
         * @param {...any} e - 函数参数
         */
        add: function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            if (typeof fn !== "function") {
                PostOnly.console.error("onload function must have name(string), f(functicon)");
            }
            
            // 如果已经加载完成，则直接执行；否则添加到列表中
            if (this.state) {
                try {
                    fn.apply(null, args);
                } catch (e) {
                    PostOnly.console.error(e);
                }
            } else {
                this.list.push({ fn: fn, e: args });
            }
            
            var Event = new CustomEvent('PostOnly:add_onload', { detail: { fn: fn, e: args } });
            document.dispatchEvent(Event);
            window.dispatchEvent(Event);
        },
        
        /**
         * 执行加载列表中的所有函数
         */
        run: function (onload) {
            if (onload === void 0) { onload = false; }
            if (this.state) {return 0;}
            this.state = true;
            
            // 依次执行加载列表中的函数
            for (var i = 0; i < this.list.length; i++) {
                try {
                    this.Promise(this.list[i].fn, this.list[i].e);
                } catch (e) {
                    PostOnly.console.error(e);
                }
            }
            
            var Event = new CustomEvent('PostOnly:onload', { detail: { list: this.list } });
            document.dispatchEvent(Event);
            window.dispatchEvent(Event);
        }
    },
    
    /**
     * 深色模式管理
     */
    dark: {
        /**
         * 设置深色模式
         * @param {boolean} n - true为深色模式，false为浅色模式
         */
        set: function (n) {
            PostOnly.console.info((n) ? '切换为暗色模式' : '切换为亮色模式');
            if (typeof n !== 'boolean') {
                PostOnly.console.error('set(n),n must be a boolean');
            }
            
            PostOnly.var.dark = n;
            var Event = new CustomEvent('PostOnly:dark_set', { detail: PostOnly.var.dark });
            document.dispatchEvent(Event);
            window.dispatchEvent(Event);
            
            // 存储设置到本地存储
            localStorage.setItem("dark", n);
            
            // 根据设置添加或移除dark类
            if (n) {
                document.body.classList.add('dark');
            } else {
                document.body.classList.remove('dark');
            }
        },
        
        /**
         * 切换深色模式
         */
        change: function () {
            if (PostOnly.var.dark) {
                this.set(false);
            } else {
                this.set(true);
            }
        }
    },
    
    /**
     * 资源加载工具
     */
    load: {
        /**
         * 动态加载JavaScript文件
         * @param {string} uri - JavaScript文件地址
         * @param {Function} f - 加载完成后的回调函数
         */
        js: function (uri, f) {
            if (f === void 0) { f = undefined; }
            PostOnly.onload.add(function (uri, fn) {
                var script = document.createElement('script'); fn = fn || function () {};
                window.dispatchEvent(new CustomEvent('PostOnly:onload_js', { detail: { url: uri, fn: fn } }));
                script.type = 'text/javascript';
                
                // 加载成功回调
                script.onload = function () {
                    PostOnly.console.success(uri + ' 加载成功');
                    fn();
                };
                
                // 加载失败回调
                script.onerror = function () {
                    PostOnly.console.error(uri + ' 加载失败');
                };
                
                script.src = uri;
                document.getElementsByTagName('head')[0].appendChild(script);
            }, uri, f);
        },
        
        /**
         * 动态加载CSS文件
         * @param {string} uri - CSS文件地址
         * @param {Function} f - 加载完成后的回调函数
         */
        css: function (uri, f) {
            if (f === void 0) { f = undefined; }
            PostOnly.onload.add(function (uri, fn) {
                if (fn === void 0) { fn = undefined; }
                var css = document.createElement('link'); fn = fn || function () {};
                window.dispatchEvent(new CustomEvent('PostOnly:onload_css', { detail: { url: uri, fn: fn } }));
                css.rel = "stylesheet";
                css.href = uri;
                
                // 加载成功回调
                css.onload = function () {
                    PostOnly.console.success(uri + ' 加载成功');
                    fn();
                };
                
                // 加载失败回调
                css.onerror = function () {
                    PostOnly.console.error(uri + ' 加载失败');
                };
                
                document.getElementsByTagName('head')[0].appendChild(css);
            }, uri, f);
        }
    },
    
    /**
     * 显示消息提示
     * @param {Object} obj - 消息配置对象
     */
    msg: function (obj) {
        // 创建消息元素
        this._createMsgElement(obj);
        
        // 设置消息的交互事件
        this._setupMsgEvents(obj);
        
        // 设置消息的自动移除
        this._setupAutoRemoval(obj);
    },

    /**
     * 创建消息元素
     * @param {Object} obj - 消息配置对象
     * @private
     */
    _createMsgElement: function(obj) {
        document.msg = document.getElementById('msg');
        var id = 'MsgCard-' + new Date().getTime();
        obj._id = id; // 保存ID供后续使用
        
        document.msg.innerHTML = '<div class="card w-full ' + ((obj.color) ? 'color-' + obj.color + '-full' : '') + '" id="' + id + '"><div><div class="title"><i class="' + (obj.icon || '') + '"></i> ' + (obj.title || '') + '</div><div class="text">' + (obj.msg || obj.text || '') + '</div></div></div>' + document.msg.innerHTML;
    },

    /**
     * 设置消息的交互事件
     * @param {Object} obj - 消息配置对象
     * @private
     */
    _setupMsgEvents: function(obj) {
        // 添加点击事件监听器
        if (typeof obj.click == 'function') {
            document.getElementById(obj._id).addEventListener('click', obj.click);
        }
        
        var Event = new CustomEvent('PostOnly:onmsg', { detail: obj });
        document.dispatchEvent(Event);
        window.dispatchEvent(Event);
    },

    /**
     * 设置消息的自动移除
     * @param {Object} obj - 消息配置对象
     * @private
     */
    _setupAutoRemoval: function(obj) {
        // 设置定时器，一段时间后移除消息
        setTimeout(function (myselfid) {
            var Event = new CustomEvent('PostOnly:add_onload', { detail: myselfid });
            document.dispatchEvent(Event);
            window.dispatchEvent(Event);
            document.getElementById(myselfid).remove();
        }, obj.timeout || 3000, obj._id);
    }

};

// 记录DOM加载开始时间
DOMLoadStartTime = new Date().getTime();

/**
 * DOM内容加载完成后执行初始化
 */
window.addEventListener('DOMContentLoaded', function () {
    PostOnly.console.info('DOM加载完毕, 用时' + (new Date().getTime() - DOMLoadStartTime).toString() + 'ms');
    
    // 初始化主题功能
    PostOnly._initTheme();
});

/**
 * 主题初始化
 * @private
 */
PostOnly._initTheme = function() {
    // 根据本地存储设置深色模式
    if (localStorage.getItem("dark") === 'true') {
        PostOnly.dark.set(true);
    }
    
    PostOnly.console.logo();
    PostOnly.onload.run();
    
    // 根据屏幕宽度决定菜单显示方式
    PostOnly._adjustMenuDisplay();
};

/**
 * 调整菜单显示方式
 * @private
 */
PostOnly._adjustMenuDisplay = function() {
    if (document.documentElement.offsetWidth > 672) {
        document.getElementsByClassName("menu")[0].style.display = "flex";
    } else {
        document.getElementsByClassName("menu")[0].style.display = "none";
    }
};

/**
 * 处理URL路径，确保以斜杠结尾
 */
PostOnly._handleURLPath = function() {
    if (window.location.pathname[window.location.pathname.length - 1] !== '/' && 
        window.location.pathname.split('/')[0].indexOf('.') === -1 && 
        window.location.pathname !== '/') {
        history.pushState({}, '', window.location.pathname + '/');
    }
};

// 在适当的地方调用
PostOnly._handleURLPath();

/**
 * 窗口大小改变时调整菜单显示
 */
window.addEventListener('resize', function () {
    PostOnly._adjustMenuDisplay();
});
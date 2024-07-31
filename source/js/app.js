PostOnly = {
    debug: true, // 调试开关
    var: {},
    console: { // 输出到控制台
        success: (m) => {
            /*
            success(m)
            @param  m all
            @return undefined
            */
            if (PostOnly.debug) { // 判断是否调试
                console.log(`%c${m}`, 'border-left: 5px solid green;text-decoration: none;border-radius: 3px;color:#000 !important;background:write;padding: 3px');
            }
        }, warning: (m) => {
            /*
            warning(m)
            @param  m all
            @return undefined
            */
            if (PostOnly.debug) {
                console.log(`%c${m}`, 'border-left: 5px solid yellow;text-decoration: none;border-radius: 3px;color:#000 !important;background:write;padding: 3px');
            }
        }, info: (m) => {
            if (PostOnly.debug) {
                console.log(`%c${m}`, 'border-left: 5px solid dodgerblue;text-decoration: none;border-radius: 3px;color:#000 !important;background:write;padding: 3px');
            }
        }, error: (m) => {
            if (PostOnly.debug) {
                console.log(`%c${m}`, 'border-left: 5px solid red;text-decoration: none;border-radius: 3px;color:#000 !important;background:write;padding: 3px');
            }
        }, debug: (m) => {
            if (PostOnly.debug) {
                console.log(`%c${m}`, 'border-left: 5px solid gray;text-decoration: none;border-radius: 3px;color:#000 !important;background:write;padding: 3px');
            }
        }, logo: () => {
            console.log(`%c     _ _             \n    | (_) __ _ _ __  \n _  | | |/ _\\\` | '_ \\\n| |_| | | (_| | | | |\n \\___/|_|\\__,_|_| |_|`, "color:white;!important;background:dodgerblue;padding: 3px;text-align: center;")
        }
    }, plugins: {
        lazyload: function () {
            var viewHeight = document.documentElement.clientHeight;
            var eles = document.querySelectorAll('img[lazyload]');
            Array.prototype.forEach.call(eles, function (item, index) {
                var rect;
                if (item.getAttribute('lazyload') === "") return;
                rect = item.getBoundingClientRect();// 用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置
                if (rect.bottom >= 0 && rect.top < viewHeight) {
                    !function () {
                        var img = new Image();
                        img.src = item.getAttribute('lazyload');
                        img.onload = function () {
                            item.src = img.src;
                            PostOnly.console.success(img.src + ' 加载成功');
                            let Event = new CustomEvent('PostOnly:lazyload:load', { detail: { url: img.src, dom: item } })
                            document.dispatchEvent(Event);
                            window.dispatchEvent(Event);
                        }
                        img.onerror = function () {
                            item.setAttribute("lazyload", img.src);
                            PostOnly.console.error(img.src + ' 加载失败');
                            let Event = new CustomEvent('PostOnly:lazyload:error', {
                                detail: {
                                    url: img.src, dom: item
                                }
                            })
                            document.dispatchEvent(Event);
                            window.dispatchEvent(Event);
                        }
                        item.removeAttribute("lazyload");
                    }()
                }
            })
        }, read: function () {
            if (document.body.classList.value.indexOf('read') !== 0) {
                document.body.classList.add('read');
                document.body.addEventListener('click', PostOnly.plugins.read);
                let Event = new CustomEvent('PostOnly:read', { detail: true })
                document.dispatchEvent(Event);
                window.dispatchEvent(Event);
            } else {
                document.body.removeEventListener('click', PostOnly.plugins.read);
                document.body.classList.remove('read');
                let Event = new CustomEvent('PostOnly:read', { detail: false })
                document.dispatchEvent(Event);
                window.dispatchEvent(Event);
            }
        }
    }, onload: {
        list: [], // 加载列表
        state: false,
        Promise: function (fn, ...e) {
            return new Promise(function (r) {
                r(fn(...e))
            })
        }, add: function (fn, ...e) {
            /*
            用于增加加载列表
            fn：运行的函数
            e：函数参数
             */
            if (!typeof fn === "function") {
                PostOnly.console.error("onload function must have name(string), f(functicon)");
            }
            if (this.state) {
                try {
                    fn(...e);
                } catch (e) {
                    PostOnly.console.error(e);
                }
            } else {
                this.list.push({ fn: fn, e: e })
            }
            let Event = new CustomEvent('PostOnly:add_onload', { detail: { fn: fn, e: e } })
            document.dispatchEvent(Event);
            window.dispatchEvent(Event);
        }, run: function (onload = false) {
            /*
            运行加载列表中的函数
            */
            if (this.state) {return 0;}
            this.state = true;
            for (let i = 0; i < this.list.length; i++) {
                try {
                    this.Promise(this.list[i].fn, ...this.list[i].e).then();
                } catch (e) {
                    PostOnly.console.error(e);
                }
            }
            let Event = new CustomEvent('PostOnly:onload', { detail: { list: this.list } })
            document.dispatchEvent(Event);
            window.dispatchEvent(Event);
        }
    }
    , dark: {
        set: function (n) {
            PostOnly.console.info((n) ? '切换为暗色模式' : '切换为亮色模式');
            if (typeof n !== 'boolean') {
                PostOnly.console.error('set(n),n must be a boolean');
            }
            PostOnly.var.dark = n;
            let Event = new CustomEvent('PostOnly:dark_set', { detail: PostOnly.var.dark })
            document.dispatchEvent(Event);
            window.dispatchEvent(Event);
            localStorage.setItem("dark", n)
            if (n) {
                document.body.classList.add('dark');
            } else {
                document.body.classList.remove('dark');
            }
        }, change: function () {
            if (PostOnly.var.dark) {
                this.set(false);
            } else {
                this.set(true);
            }
        }
    }, load: {
        js: function (uri, f = undefined) {
            PostOnly.onload.add(function (uri, fn) {
                var script = document.createElement('script'), fn = fn || function () {
                };
                window.dispatchEvent(new CustomEvent('PostOnly:onload_js', { detail: { url: uri, fn: fn } }));
                script.type = 'text/javascript';
                script.onload = function () {
                    PostOnly.console.success(uri + ' 加载成功')
                    fn();
                };
                script.onerror = function () {
                    PostOnly.console.error(uri + ' 加载失败')
                };
                script.src = uri;
                document.getElementsByTagName('head')[0].appendChild(script);
            }, uri, f)
        }, css: function (uri, f = undefined) {

            PostOnly.onload.add(function (uri, fn = undefined) {
                var css = document.createElement('link'), fn = fn || function () {
                };
                window.dispatchEvent(new CustomEvent('PostOnly:onload_css', { detail: { url: uri, fn: fn } }));
                css.rel = "stylesheet";
                css.href = uri;
                css.onload = function () {
                    PostOnly.console.success(uri + ' 加载成功')
                    fn();
                };
                css.onerror = function () {
                    PostOnly.console.error(uri + ' 加载失败')
                };
                document.getElementsByTagName('head')[0].appendChild(css);
            }, uri, f);
        }
    }, msg: function (obj) {
        document.msg = document.getElementById('msg');
        let id = `MsgCard-${new Date().getTime()}`
        document.msg.innerHTML = `<div class="card w-full ${(obj.color) ? 'color-' + obj.color + '-full' : ''}" id="${id}"><div><div class="title"><i class="${obj.icon || ''}"></i> ${obj.title || ''}</div><div class="text">${obj.msg || obj.text || ''}</div></div></div>` + document.msg.innerHTML;
        if (typeof obj.click == 'function') {
            document.getElementById(id).addEventListener('click', obj.click);
        }
        let Event = new CustomEvent('PostOnly:onmsg', { detail: obj });
        document.dispatchEvent(Event);
        window.dispatchEvent(Event);
        setTimeout(function (myselfid) {
            let Event = new CustomEvent('PostOnly:add_onload', { detail: myselfid })
            document.dispatchEvent(Event);
            window.dispatchEvent(Event);
            document.getElementById(myselfid).remove();
        }, obj.timeout || 3000, id);
    }
}


DOMLoadStartTime = new Date().getTime();
window.addEventListener('DOMContentLoaded', function () {
    PostOnly.console.info('DOM加载完毕, 用时' + (new Date().getTime() - DOMLoadStartTime).toString() + 'ms');
    if (localStorage.getItem("dark") === 'true') {
        PostOnly.dark.set(true);
    }
    PostOnly.console.logo();
    PostOnly.onload.run();
    if (document.documentElement.offsetWidth > 672) {
        document.getElementsByClassName("menu")[0].style.display = "flex"
    } else {
        document.getElementsByClassName("menu")[0].style.display = "none"
    }
})

if (window.location.pathname[window.location.pathname.length - 1] !== '/' && window.location.pathname.split('/')[0].indexOf('.') === -1 && window.location.pathname !== '/') {
    history.pushState({}, '', window.location.pathname + '/');
}

window.addEventListener('resize', function () {
    if (document.documentElement.offsetWidth > 672) {
        document.getElementsByClassName("menu")[0].style.display = "flex"
    } else {
        document.getElementsByClassName("menu")[0].style.display = "none"
    }
})

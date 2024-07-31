FastJump.CACHE_NAME = 'FastJumpCache'; // 默认的存储名称
FastJump.db = {
    read: (key) => {
        return new Promise((resolve, reject) => {
            caches.match(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`)).then(function (res) {
                res.text().then(text => resolve(text));
            }).catch(() => {
                resolve(null);
            });
        })
    }, write: (key, value) => {
        return new Promise((resolve, reject) => {
            caches.open(FastJump.CACHE_NAME).then(function (cache) {
                cache.put(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`), new Response(value));
                resolve();
            }).catch(() => {
                reject();
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    FastJump.db.read(window.location.href).then(function (d) {
        if (!d) {
            fetch(window.location.href).then(function (d) {
                if (d.headers.get('content-type') === 'text/html') {
                    d.text().then(function (b) {
                        FastJump.db.write(window.location.href, b)
                    })
                }
            })
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    setInterval(function () {
        var doms = document.querySelectorAll('a[href]');
        Array.prototype.forEach.call(doms, function (dom) {
            if (dom.href && dom.href.indexOf(window.location.origin) === 0) {
                dom.onclick = function () {
                    history.pushState({}, '', dom.href);
                    FastJump.db.read(dom.href).then(function (d) {
                        if (d) {
                            console.clear();
                            try {
                                document.documentElement = d;
                                let Event_timerun = window.setInterval(function () {
                                    if (document.body&&document.body.innerHTML) {
                                        let Event = new CustomEvent('onload')
                                        document.dispatchEvent(Event);
                                        window.dispatchEvent(Event);
                                        Event = new CustomEvent('DOMContentLoaded')
                                        document.dispatchEvent(Event);
                                        window.dispatchEvent(Event);
                                        window.clearInterval(Event_timerun)
                                    }
                                },500)
                                fetch(dom.href).then(function (d) {
                                    if (d.headers.get('content-type') === 'text/html') {
                                        d.text().then(function (b) {
                                            FastJump.db.write(window.location.href, b)
                                        })
                                    }
                                })
                            } catch (e) {

                            }
                        } else {
                            fetch(dom.href).then(function (d) {
                                if (d.headers.get('content-type') === 'text/html') {
                                    d.text().then(function (b) {
                                        console.clear();
                                        document.open();
                                        try {
                                            document.write(b)
                                            let Event_timerun = window.setInterval(function () {
                                                if (document.body&&document.body.innerHTML) {
                                                    let Event = new CustomEvent('onload')
                                                    document.dispatchEvent(Event);
                                                    window.dispatchEvent(Event);
                                                    Event = new CustomEvent('DOMContentLoaded')
                                                    document.dispatchEvent(Event);
                                                    window.dispatchEvent(Event);
                                                    window.clearInterval(Event_timerun)
                                                }
                                            },500)
                                        } catch (e) {
                                        }
                                        self.db.write(dom.href, b)
                                    }).catch(function (e) {
                                        window.location.href = dom.href
                                    })
                                }
                            }).catch(function (e) {
                                window.location.href = dom.href
                            })
                        }
                    }).catch(function (e) {
                        window.location.href = dom.href
                    })
                    return false;
                }
            }
        });
    }, 500)
});

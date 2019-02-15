layui.define(["laytpl", "layer"], function (exports) {
    var jquery = layui.jquery,
        laytpl = layui.laytpl,
        layer = layui.layer,
        setter = layui.setter,
        hint = (layui.device(), layui.hint()),
        view = function (id) {
            return new View(id)
        },
        lAYAppBodyStr = "LAY_app_body",
        View = function (id) {
            this.id = id, this.container = jquery("#" + (id || lAYAppBodyStr))
        };
    view.loading = function (ele) {
        ele.append(this.elemLoad = jquery('<i class="layui-anim layui-anim-rotate layui-anim-loop layui-icon layui-icon-loading layadmin-loading"></i>'))
    }, view.removeLoad = function () {
        this.elemLoad && this.elemLoad.remove()
    }, view.exit = function (callback) {
        layui.data(setter.tableName, {
            key: setter.request.tokenName,
            remove: !0
        }), callback && callback()
    }, view.req = function (options) {
        var success = options.success,
            setterRequest = (options.error, setter.request),
            setterResponse = setter.response,
            debugStr = function () {
                return setter.debug ? "<br><cite>URL：</cite>" + options.url : ""
            };
        if (options.data = options.data || {}, options.headers = options.headers || {}, setterRequest.tokenName) {
            var data = "string" == typeof options.data ? JSON.parse(options.data) : options.data;
            options.data[setterRequest.tokenName] = setterRequest.tokenName in data ?
                options.data[setterRequest.tokenName] : layui.data(setter.tableName)[setterRequest.tokenName] || ""
            options.headers[setterRequest.tokenName] = setterRequest.tokenName in options.headers ?
                options.headers[setterRequest.tokenName] : layui.data(setter.tableName)[setterRequest.tokenName] || ""
        }
        return delete options.success, delete options.error, jquery.ajax(jquery.extend({
            type: "get",
            dataType: "json",
            success: function (res) {
                var code = setterResponse.statusCode;
                if (res[setterResponse.statusName] == code.ok) "function" == typeof options.done && options.done(res);
                else if (res[setterResponse.statusName] == code.logout) view.exit();
                else {
                    var errorMsg = ["<cite>Error：</cite> " + (res[setterResponse.msgName] || "返回状态码异常"), debugStr()].join("");
                    view.error(errorMsg)
                }
                "function" == typeof success && success(res)
            },
            error: function (res, error) {
                var errorMsg = ["请求异常，请重试<br><cite>错误信息：</cite>" + error, debugStr()].join("");
                view.error(errorMsg), "function" == typeof errorMsg && errorMsg(res)
            }
        }, options))
    }, view.popup = function (options) {
        var success = options.success,
            skin = options.skin;
        return delete options.success, delete options.skin, layer.open(jquery.extend({
            type: 1,
            title: "提示",
            content: "",
            id: "LAY-system-view-popup",
            skin: "layui-layer-admin" + (skin ? " " + skin : ""),
            shadeClose: !0,
            closeBtn: !1,
            success: function (ele, index) {
                var iconEle = jquery('<i class="layui-icon" close>&#x1006;</i>');
                ele.append(iconEle), iconEle.on("click", function () {
                    layer.close(index)
                }), "function" == typeof success && success.apply(this, arguments)
            }
        }, options))
    }, view.error = function (content, options) {
        return view.popup(jquery.extend({
            content: content,
            maxWidth: 300,
            offset: "t",
            anim: 6,
            id: "LAY_adminError"
        }, options))
    }, View.prototype.render = function (path, a) {
        var vm = this;
        layui.router();
        return path = setter.views + path + setter.engine,
            jquery("#" + lAYAppBodyStr).children(".layadmin-loading").remove(),
            view.loading(vm.container),
            jquery.ajax({
                url: path,
                type: "get",
                dataType: "html",
                data: {
                    v: layui.cache.version
                },
                success: function (res) {
                    res = "<div>" + res + "</div>";
                    var titleEle = jquery(res).find("title"),
                        title = titleEle.text() || (res.match(/\<title\>([\s\S]*)\<\/title>/) || [])[1],
                        titleAndBody = {
                            title: title,
                            body: res
                        };
                    titleEle.remove(),
                        vm.params = a || {},
                        vm.then && (vm.then(titleAndBody),
                            delete vm.then),
                        vm.parse(res), view.removeLoad(),
                        vm.done && (vm.done(titleAndBody),
                            delete vm.done)
                },
                error: function (res) {
                    return view.removeLoad(), vm.render.isError ? view.error("请求视图文件异常，状态：" + res.status) : (404 === res.status ? vm.render("template/tips/404") : vm.render("template/tips/error"), void (vm.render.isError = !0))
                }
            }), vm
    }, View.prototype.parse = function (ele, type, callback) {
        var vm = this,
            isObjEle = "object" == typeof ele,
            ele = jquery(ele),
            templateEle = isObjEle ? ele : ele.find("*[template]"),
            runScript = function (options) {
                var result = laytpl(options.dataElem.html()),
                    o = jquery.extend({
                        params: routerHash.params
                    }, options.res);
                options.dataElem.after(result.render(o)), "function" == typeof callback && callback();
                try {
                    options.done && new Function("d", options.done)(o)
                } catch (i) {
                    console.error(options.dataElem[0], "\n存在错误回调脚本\n\n", i)
                }
            },
            routerHash = layui.router();
        ele.find("title").remove(), vm.container[type ? "after" : "html"](ele.children()), routerHash.params = vm.params || {};
        for (var y = templateEle.length; y > 0; y--) ! function () {
            var e = templateEle.eq(y - 1),
                t = e.attr("lay-done") || e.attr("lay-then"),
                n = laytpl(e.attr("lay-url") || "").render(routerHash),
                r = laytpl(e.attr("lay-data") || "").render(routerHash),
                s = laytpl(e.attr("lay-headers") || "").render(routerHash);
            try {
                r = new Function("return " + r + ";")()
            } catch (d) {
                hint.error("lay-data: " + d.message), r = {}
            }
            try {
                s = new Function("return " + s + ";")()
            } catch (d) {
                hint.error("lay-headers: " + d.message), s = s || {}
            }
            n ? view.req({
                type: e.attr("lay-type") || "get",
                url: n,
                data: r,
                dataType: "json",
                headers: s,
                success: function (a) {
                    runScript({
                        dataElem: e,
                        res: a,
                        done: t
                    })
                }
            }) : runScript({
                dataElem: e,
                done: t
            })
        }();
        return vm
    }, View.prototype.autoRender = function (select, a) {
        var vm = this;
        jquery(select || "body").find("*[template]").each(function (index, ele) {
            var target = jquery(this);
            vm.container = target, vm.parse(target, "refresh")
        })
    }, View.prototype.send = function (template, data) {
        var result = laytpl(template || this.container.html()).render(data || {});
        return this.container.html(result), this
    }, View.prototype.refresh = function (callback) {
        var vm = this,
            nextEle = vm.container.next(),
            templateid = nextEle.attr("lay-templateid");
        return vm.id != templateid ? vm : (vm.parse(vm.container, "refresh", function () {
            vm.container.siblings('[lay-templateid="' + vm.id + '"]:last').remove(), "function" == typeof callback && callback()
        }), vm)
    }, View.prototype.then = function (e) {
        return this.then = e, this
    }, View.prototype.done = function (e) {
        return this.done = e, this
    }, exports("view", view)
});
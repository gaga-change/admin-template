layui.define("view", function (exports) {
    var $ = layui.jquery,
        laytpl = layui.laytpl,
        element = layui.element,
        setter = layui.setter,
        view = layui.view,
        device = layui.device(),
        windowEle = $(window),
        bodyEle = $("body"),
        containerEle = $("#" + setter.container),
        LAYUI_SHOW = "layui-show",
        LAYUI_HIDE = "layui-hide",
        LAYUI_THIS = "layui-this",
        LAYUI_DISABLED = "layui-disabled",
        LAY_APP_BODY = "#LAY_app_body",
        LAY_APP_FLEXIBLE = "LAY_app_flexible",
        LAYADMIN_LAYOUT_TABS = "layadmin-layout-tabs",
        LAYADMIN_SIDE_SPREAD_SM = "layadmin-side-spread-sm",
        LAYADMIN_TABSBODY_ITEM = "layadmin-tabsbody-item",
        LAYUI_ICON_SHRINK_RIGHT = "layui-icon-shrink-right",
        LAYUI_ICON_SPREAD_LEFT = "layui-icon-spread-left",
        LAYADMIN_SIDE_SHRINK = "layadmin-side-shrink",
        LAY_SYSTEM_SIDE_MENU = "LAY-system-side-menu",
        admin = {
            VERSION: "1.2.1 std",
            req: view.req,
            exit: view.exit,
            // 转义字符串中的 html 片段。防止注入
            escape: function escape(text) {
                return String(text || "").replace(/&(?!#?[a-zA-Z0-9]+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;").replace(/"/g, "&quot;")
            },
            on: function (e, a) {
                return layui.onevent.call(this, setter.MOD_NAME, e, a)
            },
            sendAuthCode: function (options) {
                options = $.extend({
                    seconds: 60,
                    elemPhone: "#LAY_phone",
                    elemVercode: "#LAY_vercode"
                }, options);
                var i, seconds = options.seconds,
                    elem = $(options.elem),
                    fun = function (a) {
                        seconds--
                        if (seconds < 0) {
                            elem.removeClass(LAYUI_DISABLED).html("获取验证码"), seconds = options.seconds, clearInterval(i)
                        } else {
                            elem.addClass(LAYUI_DISABLED).html(seconds + "秒后重获")
                        }
                        a || (i = setInterval(function () {
                            fun(!0)
                        }, 1e3))
                    };
                options.elemPhone = $(options.elemPhone), options.elemVercode = $(options.elemVercode), elem.on("click", function () {
                    var elemPhone = options.elemPhone,
                        phone = elemPhone.val();
                    if (seconds === options.seconds && !$(this).hasClass(LAYUI_DISABLED)) {
                        if (!/^1\d{10}$/.test(phone)) return elemPhone.focus(), layer.msg("请输入正确的手机号");
                        if ("object" == typeof options.ajax) {
                            var s = options.ajax.success;
                            delete options.ajax.success
                        }
                        admin.req($.extend(!0, {
                            url: "/auth/code",
                            type: "get",
                            data: {
                                phone: phone
                            },
                            success: function (a) {
                                layer.msg("验证码已发送至你的手机，请注意查收", {
                                    icon: 1,
                                    shade: 0
                                }), options.elemVercode.focus(), fun(), s && s(a)
                            }
                        }, options.ajax))
                    }
                })
            },
            screen: function () {
                var e = windowEle.width();
                return e > 1200 ? 3 : e > 992 ? 2 : e > 768 ? 1 : 0
            },
            sideFlexible: function (e) {
                var i = containerEle,
                    t = $("#" + LAY_APP_FLEXIBLE),
                    l = admin.screen();
                "spread" === e ? (t.removeClass(LAYUI_ICON_SPREAD_LEFT).addClass(LAYUI_ICON_SHRINK_RIGHT), l < 2 ? i.addClass(LAYADMIN_SIDE_SPREAD_SM) : i.removeClass(LAYADMIN_SIDE_SPREAD_SM), i.removeClass(LAYADMIN_SIDE_SHRINK)) : (t.removeClass(LAYUI_ICON_SHRINK_RIGHT).addClass(LAYUI_ICON_SPREAD_LEFT), l < 2 ? i.removeClass(LAYADMIN_SIDE_SHRINK) : i.addClass(LAYADMIN_SIDE_SHRINK), i.removeClass(LAYADMIN_SIDE_SPREAD_SM)), layui.event.call(this, setter.MOD_NAME, "side({*})", {
                    status: e
                })
            },
            popup: view.popup,
            popupRight: function (e) {
                return admin.popup.index = layer.open($.extend({
                    type: 1,
                    id: "LAY_adminPopupR",
                    anim: -1,
                    title: !1,
                    closeBtn: !1,
                    offset: "r",
                    shade: .1,
                    shadeClose: !0,
                    skin: "layui-anim layui-anim-rl layui-layer-adminRight",
                    area: "300px"
                }, e))
            },
            theme: function (e) {
                var t = (setter.theme, layui.data(setter.tableName)),
                    l = "LAY_layadmin_theme",
                    s = document.createElement("style"),
                    r = laytpl([".layui-side-menu,", ".layadmin-pagetabs .layui-tab-title li:after,", ".layadmin-pagetabs .layui-tab-title li.layui-this:after,", ".layui-layer-admin .layui-layer-title,", ".layadmin-side-shrink .layui-side-menu .layui-nav>.layui-nav-item>.layui-nav-child", "{background-color:{{d.color.main}} !important;}", ".layui-nav-tree .layui-this,", ".layui-nav-tree .layui-this>a,", ".layui-nav-tree .layui-nav-child dd.layui-this,", ".layui-nav-tree .layui-nav-child dd.layui-this a", "{background-color:{{d.color.selected}} !important;}", ".layui-layout-admin .layui-logo{background-color:{{d.color.logo || d.color.main}} !important;}", "{{# if(d.color.header){ }}", ".layui-layout-admin .layui-header{background-color:{{ d.color.header }};}", ".layui-layout-admin .layui-header a,", ".layui-layout-admin .layui-header a cite{color: #f8f8f8;}", ".layui-layout-admin .layui-header a:hover{color: #fff;}", ".layui-layout-admin .layui-header .layui-nav .layui-nav-more{border-top-color: #fbfbfb;}", ".layui-layout-admin .layui-header .layui-nav .layui-nav-mored{border-color: transparent; border-bottom-color: #fbfbfb;}", ".layui-layout-admin .layui-header .layui-nav .layui-this:after, .layui-layout-admin .layui-header .layui-nav-bar{background-color: #fff; background-color: rgba(255,255,255,.5);}", ".layadmin-pagetabs .layui-tab-title li:after{display: none;}", "{{# } }}"].join("")).render(e = $.extend({}, t.theme, e)),
                    u = document.getElementById(l);
                "styleSheet" in s ? (s.setAttribute("type", "text/css"), s.styleSheet.cssText = r) : s.innerHTML = r, s.id = l, u && bodyEle[0].removeChild(u), bodyEle[0].appendChild(s), bodyEle.attr("layadmin-themealias", e.color.alias), t.theme = t.theme || {}, layui.each(e, function (e, a) {
                    t.theme[e] = a
                }), layui.data(setter.tableName, {
                    key: "theme",
                    value: t.theme
                })
            },
            initTheme: function (e) {
                var a = setter.theme;
                e = e || 0, a.color[e] && (a.color[e].index = e, admin.theme({
                    color: a.color[e]
                }))
            },
            tabsPage: {},
            tabsBody: function (e) {
                return $(LAY_APP_BODY).find("." + LAYADMIN_TABSBODY_ITEM).eq(e || 0)
            },
            tabsBodyChange: function (e, a) {
                a = a || {}, admin.tabsBody(e).addClass(LAYUI_SHOW).siblings().removeClass(LAYUI_SHOW), events.rollPage("auto", e), layui.event.call(this, setter.MOD_NAME, "tabsPage({*})", {
                    url: a.url,
                    text: a.text
                })
            },
            resize: function (e) {
                var a = layui.router(),
                    i = a.path.join("-");
                admin.resizeFn[i] && (windowEle.off("resize", admin.resizeFn[i]), delete admin.resizeFn[i]), "off" !== e && (e(), admin.resizeFn[i] = e, windowEle.on("resize", admin.resizeFn[i]))
            },
            resizeFn: {},
            runResize: function () {
                var e = layui.router(),
                    a = e.path.join("-");
                admin.resizeFn[a] && admin.resizeFn[a]()
            },
            delResize: function () {
                this.resize("off")
            },
            closeThisTabs: function () {
                admin.tabsPage.index && $(z).eq(admin.tabsPage.index).find(".layui-tab-close").trigger("click")
            },
            fullScreen: function () {
                var e = document.documentElement,
                    a = e.requestFullScreen || e.webkitRequestFullScreen || e.mozRequestFullScreen || e.msRequestFullscreen;
                "undefined" != typeof a && a && a.call(e)
            },
            exitScreen: function () {
                document.documentElement;
                document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen ? document.webkitCancelFullScreen() : document.msExitFullscreen && document.msExitFullscreen()
            }
        },
        events = admin.events = {
            flexible: function (e) {
                var a = e.find("#" + LAY_APP_FLEXIBLE),
                    i = a.hasClass(LAYUI_ICON_SPREAD_LEFT);
                admin.sideFlexible(i ? "spread" : null)
            },
            refresh: function () {
                var e = ".layadmin-iframe",
                    i = $("." + LAYADMIN_TABSBODY_ITEM).length;
                admin.tabsPage.index >= i && (admin.tabsPage.index = i - 1);
                var t = admin.tabsBody(admin.tabsPage.index).find(e);
                t[0].contentWindow.location.reload(!0)
            },
            serach: function (e) {
                e.off("keypress").on("keypress", function (a) {
                    if (this.value.replace(/\s/g, "") && 13 === a.keyCode) {
                        var i = e.attr("lay-action"),
                            t = e.attr("lay-text") || "搜索";
                        i += this.value, t = t + ' <span style="color: #FF5722;">' + admin.escape(this.value) + "</span>", layui.index.openTabsPage(i, t), events.serach.keys || (events.serach.keys = {}), events.serach.keys[admin.tabsPage.index] = this.value, this.value === events.serach.keys[admin.tabsPage.index] && events.refresh(e), this.value = ""
                    }
                })
            },
            message: function (e) {
                e.find(".layui-badge-dot").remove()
            },
            theme: function () {
                admin.popupRight({
                    id: "LAY_adminPopupTheme",
                    success: function () {
                        view(this.id).render("system/theme")
                    }
                })
            },
            note: function (e) {
                var a = admin.screen() < 2,
                    i = layui.data(setter.tableName).note;
                events.note.index = admin.popup({
                    title: "便签",
                    shade: 0,
                    offset: ["41px", a ? null : e.offset().left - 250 + "px"],
                    anim: -1,
                    id: "LAY_adminNote",
                    skin: "layadmin-note layui-anim layui-anim-upbit",
                    content: '<textarea placeholder="内容"></textarea>',
                    resize: !1,
                    success: function (e, a) {
                        var t = e.find("textarea"),
                            l = void 0 === i ? "便签中的内容会存储在本地，这样即便你关掉了浏览器，在下次打开时，依然会读取到上一次的记录。是个非常小巧实用的本地备忘录" : i;
                        t.val(l).focus().on("keyup", function () {
                            layui.data(setter.tableName, {
                                key: "note",
                                value: this.value
                            })
                        })
                    }
                })
            },
            fullscreen: function (e) {
                var a = "layui-icon-screen-full",
                    i = "layui-icon-screen-restore",
                    t = e.children("i");
                t.hasClass(a) ? (admin.fullScreen(), t.addClass(i).removeClass(a)) : (admin.exitScreen(), t.addClass(a).removeClass(i))
            },
            about: function () {
                admin.popupRight({
                    id: "LAY_adminPopupAbout",
                    success: function () {
                        view(this.id).render("system/about")
                    }
                })
            },
            more: function () {
                admin.popupRight({
                    id: "LAY_adminPopupMore",
                    success: function () {
                        view(this.id).render("system/more")
                    }
                })
            },
            back: function () {
                history.back()
            },
            setTheme: function (e) {
                var a = e.data("index");
                e.siblings(".layui-this").data("index");
                e.hasClass(LAYUI_THIS) || (e.addClass(LAYUI_THIS).siblings(".layui-this").removeClass(LAYUI_THIS), admin.initTheme(a))
            },
            rollPage: function (e, i) {
                var t = $("#LAY_app_tabsheader"),
                    n = t.children("li"),
                    l = (t.prop("scrollWidth"), t.outerWidth()),
                    s = parseFloat(t.css("left"));
                if ("left" === e) {
                    if (!s && s <= 0) return;
                    var r = -s - l;
                    n.each(function (e, i) {
                        var n = $(i),
                            l = n.position().left;
                        if (l >= r) return t.css("left", -l), !1
                    })
                } else "auto" === e ? ! function () {
                    var e, r = n.eq(i);
                    if (r[0]) {
                        if (e = r.position().left, e < -s) return t.css("left", -e);
                        if (e + r.outerWidth() >= l - s) {
                            var o = e + r.outerWidth() - (l - s);
                            n.each(function (e, i) {
                                var n = $(i),
                                    l = n.position().left;
                                if (l + s > 0 && l - s > o) return t.css("left", -l), !1
                            })
                        }
                    }
                }() : n.each(function (e, i) {
                    var n = $(i),
                        r = n.position().left;
                    if (r + n.outerWidth() >= l - s) return t.css("left", -r), !1
                })
            },
            leftPage: function () {
                events.rollPage("left")
            },
            rightPage: function () {
                events.rollPage()
            },
            closeThisTabs: function () {
                var e = parent === self ? admin : parent.layui.admin;
                e.closeThisTabs()
            },
            closeOtherTabs: function (e) {
                var i = "LAY-system-pagetabs-remove";
                "all" === e ? ($(z + ":gt(0)").remove(), $(LAY_APP_BODY).find("." + LAYADMIN_TABSBODY_ITEM + ":gt(0)").remove(), $(z).eq(0).trigger("click")) : ($(z).each(function (e, t) {
                    e && e != admin.tabsPage.index && ($(t).addClass(i), admin.tabsBody(e).addClass(i))
                }), $("." + i).remove())
            },
            closeAllTabs: function () {
                events.closeOtherTabs("all")
            },
            shade: function () {
                admin.sideFlexible()
            },
            im: function () {
                admin.popup({
                    id: "LAY-popup-layim-demo",
                    shade: 0,
                    area: ["800px", "300px"],
                    title: "面板外的操作示例",
                    offset: "lb",
                    success: function () {
                        layui.view(this.id).render("layim/demo").then(function () {
                            layui.use("im")
                        })
                    }
                })
            }
        };
    ! function () {
        var e = layui.data(setter.tableName);
        e.theme ? admin.theme(e.theme) : setter.theme && admin.initTheme(setter.theme.initColorIndex), "pageTabs" in layui.setter || (layui.setter.pageTabs = !0), setter.pageTabs || ($("#LAY_app_tabs").addClass(LAYUI_HIDE), containerEle.addClass("layadmin-tabspage-none")), device.ie && device.ie < 10 && view.error("IE" + device.ie + "下访问可能不佳，推荐使用：Chrome / Firefox / Edge 等高级浏览器", {
            offset: "auto",
            id: "LAY_errorIE"
        })
    }(), element.on("tab(" + LAYADMIN_LAYOUT_TABS + ")", function (e) {
        admin.tabsPage.index = e.index
    }), admin.on("tabsPage(setMenustatus)", function (e) {
        var i = e.url,
            t = function (e) {
                return {
                    list: e.children(".layui-nav-child"),
                    a: e.children("*[lay-href]")
                }
            },
            n = $("#" + LAY_SYSTEM_SIDE_MENU),
            l = "layui-nav-itemed",
            s = function (e) {
                e.each(function (e, n) {
                    var s = $(n),
                        r = t(s),
                        o = r.list.children("dd"),
                        u = i === r.a.attr("lay-href");
                    if (o.each(function (e, n) {
                            var s = $(n),
                                r = t(s),
                                o = r.list.children("dd"),
                                u = i === r.a.attr("lay-href");
                            if (o.each(function (e, n) {
                                    var s = $(n),
                                        r = t(s),
                                        o = i === r.a.attr("lay-href");
                                    if (o) {
                                        var u = r.list[0] ? l : LAYUI_THIS;
                                        return s.addClass(u).siblings().removeClass(u), !1
                                    }
                                }), u) {
                                var d = r.list[0] ? l : LAYUI_THIS;
                                return s.addClass(d).siblings().removeClass(d), !1
                            }
                        }), u) {
                        var d = r.list[0] ? l : LAYUI_THIS;
                        return s.addClass(d).siblings().removeClass(d), !1
                    }
                })
            };
        n.find("." + LAYUI_THIS).removeClass(LAYUI_THIS), admin.screen() < 2 && admin.sideFlexible(), s(n.children("li"))
    }), element.on("nav(layadmin-system-side-menu)", function (e) {
        e.siblings(".layui-nav-child")[0] && containerEle.hasClass(LAYADMIN_SIDE_SHRINK) && (admin.sideFlexible("spread"), layer.close(e.data("index"))), admin.tabsPage.type = "nav"
    }), element.on("nav(layadmin-pagetabs-nav)", function (e) {
        var a = e.parent();
        a.removeClass(LAYUI_THIS), a.parent().removeClass(LAYUI_SHOW)
    });
    var A = function (e) {
            var a = (e.attr("lay-id"), e.attr("lay-attr")),
                i = e.index();
            admin.tabsBodyChange(i, {
                url: a
            })
        },
        z = "#LAY_app_tabsheader>li";
    bodyEle.on("click", z, function () {
        var e = $(this),
            i = e.index();
        admin.tabsPage.type = "tab", admin.tabsPage.index = i, A(e)
    }), element.on("tabDelete(" + LAYADMIN_LAYOUT_TABS + ")", function (e) {
        var i = $(z + ".layui-this");
        e.index && admin.tabsBody(e.index).remove(), A(i), admin.delResize()
    }), bodyEle.on("click", "*[lay-href]", function () {
        var e = $(this),
            i = e.attr("lay-href"),
            t = e.attr("lay-text");
        layui.router();
        admin.tabsPage.elem = e;
        var n = parent === self ? layui : top.layui;
        n.index.openTabsPage(i, t || e.text())
    }), bodyEle.on("click", "*[layadmin-event]", function () {
        var e = $(this),
            i = e.attr("layadmin-event");
        events[i] && events[i].call(this, e)
    }), bodyEle.on("mouseenter", "*[lay-tips]", function () {
        var e = $(this);
        if (!e.parent().hasClass("layui-nav-item") || containerEle.hasClass(LAYADMIN_SIDE_SHRINK)) {
            var i = e.attr("lay-tips"),
                t = e.attr("lay-offset"),
                n = e.attr("lay-direction"),
                l = layer.tips(i, this, {
                    tips: n || 1,
                    time: -1,
                    success: function (e, a) {
                        t && e.css("margin-left", t + "px")
                    }
                });
            e.data("index", l)
        }
    }).on("mouseleave", "*[lay-tips]", function () {
        layer.close($(this).data("index"))
    });
    var _ = layui.data.resizeSystem = function () {
        layer.closeAll("tips"), _.lock || setTimeout(function () {
            admin.sideFlexible(admin.screen() < 2 ? "" : "spread"), delete _.lock
        }, 100), _.lock = !0
    };
    windowEle.on("resize", layui.data.resizeSystem), exports("admin", admin)
});
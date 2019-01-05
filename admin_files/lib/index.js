layui.extend({
    setter: "js/config",
    admin: "js/lib/admin",
    view: "js/lib/view"
}).define(["setter", "admin"], function (exports) {
    var setter = layui.setter,
        element = layui.element,
        admin = layui.admin,
        tabsPage = admin.tabsPage,
        view = layui.view,
        layAppBody = "#LAY_app_body",
        layadminLayoutTabs = "layadmin-layout-tabs",
        $ = layui.$;
    var openTabsPage = function (url, title) {
        var already, liEleS = $("#LAY_app_tabsheader>li"),
            simpleUrl = url.replace(/(^http(s*):)|(\?[\s\S]*$)/g, "");
        if (liEleS.each(function (index) {
                var li = $(this),
                    id = li.attr("lay-id");
                id === url && (already = !0, tabsPage.index = index)
            }), title = title || "新标签页", setter.pageTabs) {
            if (!already) {
                $(layAppBody).append(
                    ['<div class="layadmin-tabsbody-item layui-show">',
                        '<iframe src="' + url + '" frameborder="0" class="layadmin-iframe"></iframe>', "</div>"
                    ].join(""))
                tabsPage.index = liEleS.length
                element.tabAdd(layadminLayoutTabs, {
                    title: "<span>" + title + "</span>",
                    id: url,
                    attr: simpleUrl
                })
            }
        } else {
            var iframe = admin.tabsBody(admin.tabsPage.index).find(".layadmin-iframe");
            iframe[0].contentWindow.location.href = url
        }
        element.tabChange(layadminLayoutTabs, url), admin.tabsBodyChange(tabsPage.index, {
            url: url,
            text: title
        })
    }
    // $(window);
    admin.screen() < 2 && admin.sideFlexible(), layui.config({
        base: setter.base + "js/modules/"
    })
    layui.each(setter.extend, function (index, name) {
        var obj = {};
        obj[name] = "{/}" + setter.base + "lib/extend/" + name, layui.extend(obj)
    })
    view().autoRender()
    layui.use("common")
    exports("index", {
        openTabsPage: openTabsPage
    })
})
// 定义公共方法

layui.define(function (exports) {
    var admin = layui.admin
    // 在 admin.events 绑定 logout 方法。
    admin.events.logout = function () {
        admin.req({
            url: layui.setter.base + "json/user/logout.js",
            type: "get",
            data: {},
            done: function (e) {
                admin.exit(function () {
                    location.href = "user/login.html"
                })
            }
        })
    }, exports("common", {})
})
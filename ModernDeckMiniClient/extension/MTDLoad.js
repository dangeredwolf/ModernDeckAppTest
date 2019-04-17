var s = {},
    C = "Storage",
    u = (s = "script", "sources/"),
    P = "https://",
    S = ".css",
    d = document,
    H = d.head,
    x = "ModernDeck",
    X = "moderndeck",
    Y = "MTDinject",
    l = d.createElement("link"),
    a = d.createElement("div"),
    w = P + "rawgit.com/dangeredwolf/" + x + "/stable/" + x + "/",
    j = d.createElement(s),
    r = (browser || chrome).runtime,
    W = window,
    B = "set",
    G = "get",
    n = "send";
l.rel = "stylesheet", l.href = w + u + X + ".css",
H.appendChild(l), a.setAttribute("type", w),
a.id = "MTDURLExchange",
H.appendChild(a),
console.log("MTDLoad 1.2\nBootstrapping " + Y + " and " + X + S),
j.src = w + u + "MTDinject.js", j.type = "text/java" + s,
H.appendChild(j),
r.sendMessage(G + C),
r.onMessage.addListener(function(e) {
    e.name == n + C && (s = e.storage)
}), W.addEventListener("message", function(e) {
    var t = e.data;
    e.source == W && (t.type && t.type == B + C && (browser || chrome).runtime.sendMessage({
        name: B + C,
        content: t.message
    }), t.type && t.type == G + C && W.postMessage({
        type: n + C,
        message: s
    }, "*"))
});
var p = document.createElement("script");
p.src = P + "cdn.ravenjs.com/3.19.1/raven.min.js", H.appendChild(p);
/*
 A JavaScript implementation of the SHA family of hashes, as
 defined in FIPS PUB 180-4 and FIPS PUB 202, as well as the corresponding
 HMAC implementation as defined in FIPS PUB 198a

 Copyright Brian Turek 2008-2016
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information

 Several functions taken from Paul Johnston
*/
'use strict';
(function (I) {
    function w(c, a, d) {
        var g = 0,
            f = [],
            b = 0,
            e, h, n, k, m, t, y, p, l = !1,
            q = [],
            r = [],
            u, z = !1;
        d = d || {};
        e = d.encoding || "UTF8";
        u = d.numRounds || 1;
        n = A(a, e);
        if (u !== parseInt(u, 10) || 1 > u) throw Error("numRounds must a integer >= 1");
        if (0 === c.lastIndexOf("SHA-", 0))
            if (t = function (a, b) {
                    return B(a, b, c)
                }, y = function (a, b, g, d) {
                    var f, e;
                    if ("SHA-224" === c || "SHA-256" === c) f = (b + 65 >>> 9 << 4) + 15, e = 16;
                    else throw Error("Unexpected error in SHA-2 implementation");
                    for (; a.length <= f;) a.push(0);
                    a[b >>> 5] |= 128 << 24 - b % 32;
                    b = b + g;
                    a[f] = b &
                        4294967295;
                    a[f - 1] = b / 4294967296 | 0;
                    g = a.length;
                    for (b = 0; b < g; b += e) d = B(a.slice(b, b + e), d, c);
                    if ("SHA-224" === c) a = [d[0], d[1], d[2], d[3], d[4], d[5], d[6]];
                    else if ("SHA-256" === c) a = d;
                    else throw Error("Unexpected error in SHA-2 implementation");
                    return a
                }, p = function (a) {
                    return a.slice()
                }, "SHA-224" === c) m = 512, k = 224;
            else if ("SHA-256" === c) m = 512, k = 256;
        else throw Error("Chosen SHA variant is not supported");
        else throw Error("Chosen SHA variant is not supported");
        h = x(c);
        this.setHMACKey = function (a, b, d) {
            var f;
            if (!0 === l) throw Error("HMAC key already set");
            if (!0 === z) throw Error("Cannot set HMAC key after calling update");
            e = (d || {}).encoding || "UTF8";
            b = A(b, e)(a);
            a = b.binLen;
            b = b.value;
            f = m >>> 3;
            d = f / 4 - 1;
            if (f < a / 8) {
                for (b = y(b, a, 0, x(c)); b.length <= d;) b.push(0);
                b[d] &= 4294967040
            } else if (f > a / 8) {
                for (; b.length <= d;) b.push(0);
                b[d] &= 4294967040
            }
            for (a = 0; a <= d; a += 1) q[a] = b[a] ^ 909522486, r[a] = b[a] ^ 1549556828;
            h = t(q, h);
            g = m;
            l = !0
        };
        this.update = function (a) {
            var c, d, e, k = 0,
                p = m >>> 5;
            c = n(a, f, b);
            a = c.binLen;
            d = c.value;
            c = a >>> 5;
            for (e = 0; e < c; e += p) k + m <= a && (h = t(d.slice(e, e + p), h), k += m);
            g += k;
            f = d.slice(k >>>
                5);
            b = a % m;
            z = !0
        };
        this.getHash = function (a, d) {
            var e, m, n, t;
            if (!0 === l) throw Error("Cannot call getHash after setting HMAC key");
            n = C(d);
            switch (a) {
            case "HEX":
                e = function (a) {
                    return D(a, k, n)
                };
                break;
            case "B64":
                e = function (a) {
                    return E(a, k, n)
                };
                break;
            case "BYTES":
                e = function (a) {
                    return F(a, k)
                };
                break;
            case "ARRAYBUFFER":
                try {
                    m = new ArrayBuffer(0)
                } catch (v) {
                    throw Error("ARRAYBUFFER not supported by this environment");
                }
                e = function (a) {
                    return G(a, k)
                };
                break;
            default:
                throw Error("format must be HEX, B64, BYTES, or ARRAYBUFFER");
            }
            t = y(f.slice(), b, g, p(h));
            for (m = 1; m < u; m += 1) t = y(t, k, 0, x(c));
            return e(t)
        };
        this.getHMAC = function (a, d) {
            var e, n, q, u;
            if (!1 === l) throw Error("Cannot call getHMAC without first setting HMAC key");
            q = C(d);
            switch (a) {
            case "HEX":
                e = function (a) {
                    return D(a, k, q)
                };
                break;
            case "B64":
                e = function (a) {
                    return E(a, k, q)
                };
                break;
            case "BYTES":
                e = function (a) {
                    return F(a, k)
                };
                break;
            case "ARRAYBUFFER":
                try {
                    e = new ArrayBuffer(0)
                } catch (v) {
                    throw Error("ARRAYBUFFER not supported by this environment");
                }
                e = function (a) {
                    return G(a, k)
                };
                break;
            default:
                throw Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER");
            }
            n = y(f.slice(), b, g, p(h));
            u = t(r, x(c));
            u = y(n, k, m, u);
            return e(u)
        }
    }

    function l() {}

    function J(c, a, d) {
        var g = c.length,
            f, b, e, h, n;
        a = a || [0];
        d = d || 0;
        n = d >>> 3;
        if (0 !== g % 2) throw Error("String of HEX type must be in byte increments");
        for (f = 0; f < g; f += 2) {
            b = parseInt(c.substr(f, 2), 16);
            if (isNaN(b)) throw Error("String of HEX type contains invalid characters");
            h = (f >>> 1) + n;
            for (e = h >>> 2; a.length <= e;) a.push(0);
            a[e] |= b << 8 * (3 - h % 4)
        }
        return {
            value: a,
            binLen: 4 * g + d
        }
    }

    function K(c, a, d) {
        var g = [],
            f, b, e, h, g = a || [0];
        d = d || 0;
        b = d >>> 3;
        for (f = 0; f <
            c.length; f += 1) a = c.charCodeAt(f), h = f + b, e = h >>> 2, g.length <= e && g.push(0), g[e] |= a << 8 * (3 - h % 4);
        return {
            value: g,
            binLen: 8 * c.length + d
        }
    }

    function L(c, a, d) {
        var g = [],
            f = 0,
            b, e, h, n, k, m, g = a || [0];
        d = d || 0;
        a = d >>> 3;
        if (-1 === c.search(/^[a-zA-Z0-9=+\/]+$/)) throw Error("Invalid character in base-64 string");
        e = c.indexOf("=");
        c = c.replace(/\=/g, "");
        if (-1 !== e && e < c.length) throw Error("Invalid '=' found in base-64 string");
        for (e = 0; e < c.length; e += 4) {
            k = c.substr(e, 4);
            for (h = n = 0; h < k.length; h += 1) b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(k[h]),
                n |= b << 18 - 6 * h;
            for (h = 0; h < k.length - 1; h += 1) {
                m = f + a;
                for (b = m >>> 2; g.length <= b;) g.push(0);
                g[b] |= (n >>> 16 - 8 * h & 255) << 8 * (3 - m % 4);
                f += 1
            }
        }
        return {
            value: g,
            binLen: 8 * f + d
        }
    }

    function M(c, a, d) {
        var g = [],
            f, b, e, g = a || [0];
        d = d || 0;
        f = d >>> 3;
        for (a = 0; a < c.byteLength; a += 1) e = a + f, b = e >>> 2, g.length <= b && g.push(0), g[b] |= c[a] << 8 * (3 - e % 4);
        return {
            value: g,
            binLen: 8 * c.byteLength + d
        }
    }

    function D(c, a, d) {
        var g = "";
        a /= 8;
        var f, b;
        for (f = 0; f < a; f += 1) b = c[f >>> 2] >>> 8 * (3 - f % 4), g += "0123456789abcdef".charAt(b >>> 4 & 15) + "0123456789abcdef".charAt(b & 15);
        return d.outputUpper ?
            g.toUpperCase() : g
    }

    function E(c, a, d) {
        var g = "",
            f = a / 8,
            b, e, h;
        for (b = 0; b < f; b += 3)
            for (e = b + 1 < f ? c[b + 1 >>> 2] : 0, h = b + 2 < f ? c[b + 2 >>> 2] : 0, h = (c[b >>> 2] >>> 8 * (3 - b % 4) & 255) << 16 | (e >>> 8 * (3 - (b + 1) % 4) & 255) << 8 | h >>> 8 * (3 - (b + 2) % 4) & 255, e = 0; 4 > e; e += 1) 8 * b + 6 * e <= a ? g += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h >>> 6 * (3 - e) & 63) : g += d.b64Pad;
        return g
    }

    function F(c, a) {
        var d = "",
            g = a / 8,
            f, b;
        for (f = 0; f < g; f += 1) b = c[f >>> 2] >>> 8 * (3 - f % 4) & 255, d += String.fromCharCode(b);
        return d
    }

    function G(c, a) {
        var d = a / 8,
            g, f = new ArrayBuffer(d);
        for (g = 0; g < d; g += 1) f[g] = c[g >>> 2] >>> 8 * (3 - g % 4) & 255;
        return f
    }

    function C(c) {
        var a = {
            outputUpper: !1,
            b64Pad: "=",
            shakeLen: -1
        };
        c = c || {};
        a.outputUpper = c.outputUpper || !1;
        !0 === c.hasOwnProperty("b64Pad") && (a.b64Pad = c.b64Pad);
        if ("boolean" !== typeof a.outputUpper) throw Error("Invalid outputUpper formatting option");
        if ("string" !== typeof a.b64Pad) throw Error("Invalid b64Pad formatting option");
        return a
    }

    function A(c, a) {
        var d;
        switch (a) {
        case "UTF8":
        case "UTF16BE":
        case "UTF16LE":
            break;
        default:
            throw Error("encoding must be UTF8, UTF16BE, or UTF16LE");
        }
        switch (c) {
        case "HEX":
            d = J;
            break;
        case "TEXT":
            d = function (c, d, b) {
                var e = [],
                    h = [],
                    n = 0,
                    k, m, t, l, p, e = d || [0];
                d = b || 0;
                t = d >>> 3;
                if ("UTF8" === a)
                    for (k = 0; k < c.length; k += 1)
                        for (b = c.charCodeAt(k), h = [], 128 > b ? h.push(b) : 2048 > b ? (h.push(192 | b >>> 6), h.push(128 | b & 63)) : 55296 > b || 57344 <= b ? h.push(224 | b >>> 12, 128 | b >>> 6 & 63, 128 | b & 63) : (k += 1, b = 65536 + ((b & 1023) << 10 | c.charCodeAt(k) & 1023), h.push(240 | b >>> 18, 128 | b >>> 12 & 63, 128 | b >>> 6 & 63, 128 | b & 63)), m = 0; m < h.length; m += 1) {
                            p = n + t;
                            for (l = p >>> 2; e.length <= l;) e.push(0);
                            e[l] |= h[m] << 8 * (3 - p % 4);
                            n += 1
                        } else if ("UTF16BE" ===
                            a || "UTF16LE" === a)
                            for (k = 0; k < c.length; k += 1) {
                                b = c.charCodeAt(k);
                                "UTF16LE" === a && (m = b & 255, b = m << 8 | b >>> 8);
                                p = n + t;
                                for (l = p >>> 2; e.length <= l;) e.push(0);
                                e[l] |= b << 8 * (2 - p % 4);
                                n += 2
                            }
                        return {
                            value: e,
                            binLen: 8 * n + d
                        }
            };
            break;
        case "B64":
            d = L;
            break;
        case "BYTES":
            d = K;
            break;
        case "ARRAYBUFFER":
            try {
                d = new ArrayBuffer(0)
            } catch (g) {
                throw Error("ARRAYBUFFER not supported by this environment");
            }
            d = M;
            break;
        default:
            throw Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER");
        }
        return d
    }

    function r(c, a) {
        return c >>> a | c << 32 - a
    }

    function N(c,
        a, d) {
        return c & a ^ ~c & d
    }

    function O(c, a, d) {
        return c & a ^ c & d ^ a & d
    }

    function P(c) {
        return r(c, 2) ^ r(c, 13) ^ r(c, 22)
    }

    function Q(c) {
        return r(c, 6) ^ r(c, 11) ^ r(c, 25)
    }

    function R(c) {
        return r(c, 7) ^ r(c, 18) ^ c >>> 3
    }

    function S(c) {
        return r(c, 17) ^ r(c, 19) ^ c >>> 10
    }

    function T(c, a) {
        var d = (c & 65535) + (a & 65535);
        return ((c >>> 16) + (a >>> 16) + (d >>> 16) & 65535) << 16 | d & 65535
    }

    function U(c, a, d, g) {
        var f = (c & 65535) + (a & 65535) + (d & 65535) + (g & 65535);
        return ((c >>> 16) + (a >>> 16) + (d >>> 16) + (g >>> 16) + (f >>> 16) & 65535) << 16 | f & 65535
    }

    function V(c, a, d, g, f) {
        var b = (c & 65535) +
            (a & 65535) + (d & 65535) + (g & 65535) + (f & 65535);
        return ((c >>> 16) + (a >>> 16) + (d >>> 16) + (g >>> 16) + (f >>> 16) + (b >>> 16) & 65535) << 16 | b & 65535
    }

    function x(c) {
        var a = [],
            d;
        if (0 === c.lastIndexOf("SHA-", 0)) switch (a = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428], d = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], c) {
        case "SHA-224":
            break;
        case "SHA-256":
            a = d;
            break;
        case "SHA-384":
            a = [new l, new l, new l, new l, new l, new l, new l, new l];
            break;
        case "SHA-512":
            a = [new l, new l, new l, new l, new l, new l, new l, new l];
            break;
        default:
            throw Error("Unknown SHA variant");
        } else throw Error("No SHA variants supported");
        return a
    }

    function B(c, a, d) {
        var g, f, b, e, h, n, k, m, l, r, p, w, q, x, u, z, A, B, C, D, E, F, v = [],
            G;
        if ("SHA-224" === d || "SHA-256" === d) r = 64, w = 1, F = Number, q = T, x = U, u = V, z = R, A = S, B = P, C = Q, E = O, D = N, G = H;
        else throw Error("Unexpected error in SHA-2 implementation");
        d = a[0];
        g = a[1];
        f = a[2];
        b = a[3];
        e = a[4];
        h = a[5];
        n = a[6];
        k = a[7];
        for (p = 0; p < r; p += 1) 16 > p ? (l = p * w, m = c.length <= l ? 0 : c[l], l = c.length <= l + 1 ?
            0 : c[l + 1], v[p] = new F(m, l)) : v[p] = x(A(v[p - 2]), v[p - 7], z(v[p - 15]), v[p - 16]), m = u(k, C(e), D(e, h, n), G[p], v[p]), l = q(B(d), E(d, g, f)), k = n, n = h, h = e, e = q(b, m), b = f, f = g, g = d, d = q(m, l);
        a[0] = q(d, a[0]);
        a[1] = q(g, a[1]);
        a[2] = q(f, a[2]);
        a[3] = q(b, a[3]);
        a[4] = q(e, a[4]);
        a[5] = q(h, a[5]);
        a[6] = q(n, a[6]);
        a[7] = q(k, a[7]);
        return a
    }
    var H;
    H = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078,
604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
    "function" === typeof define &&
        define.amd ? define(function () {
            return w
        }) : "undefined" !== typeof exports ? ("undefined" !== typeof module && module.exports && (module.exports = w), exports = w) : I.jsSHA = w
})(this);
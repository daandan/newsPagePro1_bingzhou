var statIdName = "m2oCloudStatId";
var m2o_pageInfo = {}

m2o_content = typeof m2o_content === 'string' ? JSON.parse(m2o_content) : m2o_content;

function getM2OpageInfo() {
    m2o_pageInfo['site_id'] = parseInt(m2o_site['domain_id']);
    //m2o_pageInfo['site_name'] = m2o_site['name'];
    // if (document.querySelector('meta[name="keywords"]')) {
    //     m2o_pageInfo['keywords'] = document.querySelector('meta[name="keywords"]').getAttribute('content');
    // }
    // if (document.querySelector('meta[name="description"]')) {
    //     m2o_pageInfo['description'] = document.querySelector('meta[name="description"]').getAttribute('content');
    // }
    m2o_pageInfo['user_site_id'] = parseInt(m2o_site['id']);
    m2o_pageInfo['domain'] = m2o_site['domain'];
    m2o_pageInfo['column_id'] = parseInt(m2o_column['id']);
    m2o_pageInfo['column_name'] = m2o_column['title'];
    m2o_pageInfo['content_id'] = parseInt(m2o_content['id']);
    m2o_pageInfo['content_fromid'] = parseInt(m2o_content['content_fromid']);
    m2o_pageInfo['content_title'] = m2o_content['title'];
    m2o_pageInfo['keywords'] = m2o_content['keywords'];
    m2o_pageInfo['bundle_id'] = m2o_content['bundle_id'];
    m2o_pageInfo['module_id'] = m2o_content['module_id'];
//debug log
//    console.log(m2o_pageInfo);
}

getM2OpageInfo();
/**
 * 设置cookieId
 */
function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/;domain=" + m2o_pageInfo['domain'];
}
/**
 * 获取cookieId
 */
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}
/**
 * 获取当前时间戳
 */
function getTimestamp() {
    var timestamp = Date.parse(new Date());
    return timestamp;
}
/**
 * 生成statId
 */
function bin2hex(s) {
    var i, l, o = '',
        n;

    s += '';

    for (i = 0, l = s.length; i < l; i++) {
        n = s.charCodeAt(i)
            .toString(16);
        o += n.length < 2 ? '0' + n : n;
    }

    return o;
  }
/**
 * 获取StatId
 */
function getStatId(domain) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var txt = domain;
    ctx.textBaseline = top;
    ctx.font = '14px Arial';
    ctx.textBaseline = 'hogesoft';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125,1,62,20);
    ctx.fillStyle = '#069';
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText(txt, 4, 17);

    var b64 = canvas.toDataURL().replace("data:image/png;base64,","");
    var bin = atob(b64);
    var crc = bin2hex(bin.slice(-20,-12));
    return crc;
}
/**
 * 获取UA
 */
function getUA() {
    var ua = navigator.userAgent;
    if (ua.length > 250) {
        ua = ua.substring(0, 250);
    }
    return ua;
}
/**
 * 获取浏览器类型
 */
function getBrower() {
    var ua = getUA();
    if (ua.indexOf("Maxthon") != -1) {
        return "Maxthon";
    } else if (ua.indexOf("MSIE") != -1) {
        return "MSIE";
    } else if (ua.indexOf("Firefox") != -1) {
        return "Firefox";
    } else if (ua.indexOf("Chrome") != -1) {
        return "Chrome";
    } else if (ua.indexOf("Opera") != -1) {
        return "Opera";
    } else if (ua.indexOf("Safari") != -1) {
        return "Safari";
    } else {
        return "ot";
    }
}
/**
 * 获取浏览器语言
 */
function getBrowerLanguage() {
    var lang = navigator.browserLanguage;
    return lang != null && lang.length > 0 ? lang : "";
}
/**
 * 获取操作系统
 */
function getPlatform() {
    return navigator.platform;
}
/**
 * 获取页面title
 */
function getPageTitle() {
    return document.title;
}
/**
 * 创建一个form
 *
 * @return
 */
function createSubmitForm() {
    var frm = document.createElement("form");
    document.body.appendChild(frm);
    frm.method = "POST";
    return frm;
}
/**
 * 为form创建一个元素
 *
 * @param inputForm
 * @param elementName
 * @param elementValue
 * @return
 */
function createFormElement(frmInput, elementName, elementValue) {
    var element = document.createElement("input");
    element.setAttribute("id", elementName);
    element.setAttribute("name", elementName);
    element.setAttribute("type", "hidden");
    element.setAttribute("value", elementValue);
    frmInput.appendChild(element);
    return element;
}
/**
 * 构造XMLHttpRequest对象
 *
 * @return
 */
function createXMLHttpRequest() {
    var xmlHttp;
    if (window.ActiveXObject) {
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    else if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
    return xmlHttp;
}
/**
 * url指定跳转页,data是要post的数据。func类似于函数指针
 *
 * @param url
 * @param data
 * @param func
 * @return
 */
function AjaxPost(url, postData, func) {
    postData = (function (obj) { // 转成post需要的字符串.
        var str = "";

        for (var prop in obj) {
            str += prop + "=" + obj[prop] + "&"
        }
        return str;
    })(postData);

    var httpRequest = createXMLHttpRequest();
    if (httpRequest) {
        httpRequest.open("POST", url, true);
//    httpRequest.setRequestHeader("content-length", postData.length);
        httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        httpRequest.send(postData);
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4) {
                try {
                    if (httpRequest.status == 200) {
                        if (func) {
                            // 这里可以调用想要的函数
                            func(httpRequest.responseText);
                        }
                    }
                } catch (e) {
                    // alert("Error XMLHttpRequest!");
                }
            }
        }
    } else {
        //alert("Error initializing XMLHttpRequest!");
    }
}

/**
 *
 */
function m2oStatInitLE() {
    var m2oStatCookieId = getStatId('http://www.hoge.cn/');
    var m2oStatUA = encodeURIComponent(getUA());
    // var m2oStatIPAddress = document.localName;
    var m2oStatREFURL = encodeURIComponent(document.referrer);
    var m2oStatURL = encodeURIComponent(document.URL);
    var m2oStatScreenX = screen.width;
    var m2oStatScreenY = screen.height;
    // var m2oStatOS = getPlatform();
    // var m2oStatBrower = getBrower();
    // var m2oStatBrowerLanguage = getBrowerLanguage();
    // var m2oStatPageTitle = encodeURIComponent(getPageTitle());
    var m2oStatAction = "https://statcollect.cloud.hoge.cn/log/v1/webpv/";
    // var timestamp = Date.parse(new Date()) / 1000;
    var data = {
//      'create_time' : timestamp,
//      'ip' : m2oStatIPAddress,
        'customer_id': m2o_pageInfo['site_id'],
        'site_id': m2o_pageInfo['user_site_id'],
        'bundle_id': m2o_pageInfo['bundle_id'],
        'module_id': m2o_pageInfo['module_id'],
//      'site_name' : m2o_pageInfo['site_name'],
        'content_fromid': m2o_pageInfo['content_fromid'],
        'column_id': m2o_pageInfo['column_id'],
        'column_name': m2o_pageInfo['column_name'],
//      'member_id' : 0,
        'device_token': m2oStatCookieId,
        'url': m2oStatURL,
//      'title': m2oStatPageTitle,
        'title': m2o_pageInfo['content_title'],
        'keywords': m2o_pageInfo['keywords'],
//      'system_os': m2oStatOS,
        'user_agent': m2oStatUA,
        'resolution': m2oStatScreenX + 'x' + m2oStatScreenY,
        'referer': m2oStatREFURL
    }
    AjaxPost(m2oStatAction, data);
}
m2oStatInitLE();


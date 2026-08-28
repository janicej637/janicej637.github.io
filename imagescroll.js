//Create URL base and append
var baseUrl = 'https://www.worldometers.info/images/flags/original/';
var appendUrl = '.webp';

//Create array of flag images
var mqAry1=[baseUrl + 'jm' + appendUrl,baseUrl + 'af' + appendUrl,baseUrl + 'it' + appendUrl,baseUrl + 'tz' + appendUrl,baseUrl + 'bm' + appendUrl,baseUrl + 'tn' + appendUrl,baseUrl + 'in' + appendUrl,baseUrl + 'us' + appendUrl,baseUrl + 'at' + appendUrl,baseUrl + 'gh' + appendUrl,baseUrl + 'at' + appendUrl,baseUrl + 'ar' + appendUrl,baseUrl + 'bb' + appendUrl,baseUrl + 'bo' + appendUrl,baseUrl + 'mx' + appendUrl,baseUrl + 'us' + appendUrl,baseUrl + 'is' + appendUrl
,baseUrl + 'jm' + appendUrl,baseUrl + 'al' + appendUrl, baseUrl + 'as' + appendUrl, baseUrl + 'jm' + appendUrl,baseUrl + 'fi' + appendUrl,baseUrl + 'gl' + appendUrl,baseUrl + 'jm' + appendUrl,baseUrl + 'gr' + appendUrl,baseUrl + 'fj' + appendUrl,baseUrl + 'bb' + appendUrl,baseUrl + 'it' + appendUrl,baseUrl + 'hk' + appendUrl,baseUrl + 'ke' + appendUrl, baseUrl + 'br' + appendUrl, baseUrl + 'jm' + appendUrl, baseUrl + 'br' + appendUrl ];

function start() {
   new mq('img',mqAry1,60);
  // new mq('m2',mqAry2,60);// repeat for as many fields as required
   mqRotate(mqr); // must come last
   
}
window.onload = start;

// Continuous Image Marquee
// copyright 24th July 2008 by Stephen Chapman
// http://javascript.about.com
// permission to use this Javascript on your web page is granted
// provided that all of the code below in this script (including these
// comments) is used without any alteration
var mqr = []; function mq(id,ary,wid){this.mqo=document.getElementById(id); var heit = this.mqo.style.height; this.mqo.onmouseout=function() {mqRotate(mqr);}; this.mqo.onmouseover=function() {clearTimeout(mqr[0].TO);}; this.mqo.ary=[]; var maxw = ary.length; for (var i=0;i<maxw;i++){this.mqo.ary[i]=document.createElement('img'); this.mqo.ary[i].src=ary[i]; this.mqo.ary[i].style.position = 'absolute'; this.mqo.ary[i].style.left = (wid*i)+'px'; this.mqo.ary[i].style.width = wid+'px'; this.mqo.ary[i].style.height = heit; this.mqo.appendChild(this.mqo.ary[i]);} mqr.push(this.mqo);} function mqRotate(mqr){if (!mqr) return; for (var j=mqr.length - 1; j > -1; j--) {maxa = mqr[j].ary.length; for (var i=0;i<maxa;i++){var x = mqr[j].ary[i].style;  x.left=(parseInt(x.left,10)-1)+'px';} var y = mqr[j].ary[0].style; if (parseInt(y.left,10)+parseInt(y.width,10)<0) {var z = mqr[j].ary.shift(); z.style.left = (parseInt(z.style.left) + parseInt(z.style.width)*maxa) + 'px'; mqr[j].ary.push(z);}} mqr[0].TO=setTimeout('mqRotate(mqr)',15);}


// ==UserScript==
// @name        LORPonyBlocker
// @namespace   lorponyblocker
// @description Скрипт, скрывающий аватарки поклонников My Little Pony на linux.org.ru
// @include     *linux.org.ru*
// @version     0.2.1
// ==/UserScript==

(function(document, fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "text/javascript");
    script.textContent = '(' + fn + ')(window, window.document);';
    document.head.appendChild(script); // run the script
    document.head.removeChild(script); // clean up
})(document, function(window, document) {

(function($){

 var ponyfaglist=[
 ];
 var koteStopList=[0,6,14,26,27,28,29,31,32,51,53,57,87,92,93,101,144];
 var noKoteHere=154;

 function readSetting(name) {
  return localStorage.getItem(name) == 'true';
 }

 function toggleSetting(name) {
  var result = readSetting(name);
  result = !result;
  localStorage.setItem(name, result ? 'true' : 'false');
  return result;
 }

 function displaySetting(name, defaultChecked) {
  var result = readSetting(name);
  result = (result && !defaultChecked) || (!result && defaultChecked);
  return result;
 }

 var settingsTab={
  'fill_ponies': 'Заменять аватарки не-понифагов котами',
  'hide_ponies': 'Скрывать аватарки понифагов'
 };

 String.prototype.hashCode = function(){
     var hash = 0, i, char;
     if (this.length == 0) return hash;
     for (i = 0, l = this.length; i < l; i++) {
         char  = this.charCodeAt(i);
         hash  = ((hash<<5)-hash)+char;
         hash |= 0; // Convert to 32bit integer
     }
     return hash;
 };

 function getKoteUrl(nick){
  var n = Math.abs(nick.hashCode()) % noKoteHere;
  while (koteStopList.indexOf(n) != -1) {
    n = (n+1) % noKoteHere;
  }

  var s=''+n;
  if (n<10) s='0'+s;
  var name='http://www.upyachka.ru/img/kot/'+s+'.gif';
  return name;
 }

 if (/settings/.test(window.location.href)){
  var baseHr=(($('#profileForm hr:eq(0)').parent()).parent())
  baseHr.after(
   $('<tr><td colspan=2><hr/></td></tr>')
  );
  for (settings in settingsTab){
   (function(s,st){
    baseHr.after(
     $('<tr/>')
      .append(
       $('<td/>').text(st[s])
      )
      .append(
       $('<td/>').append(
        $('<input/>')
        .attr('type','checkbox')
        .click(function(){
         toggleSetting(s)
        })
        .prop('checked',displaySetting(s))
       )
      )
    )
   })(settings,settingsTab);
  }
 };

 var kotecache=localStorage.getItem('kotecache');
 kotecache=kotecache?JSON.parse(kotecache):{};

 var checkNick=function(){
  var nick=$(this).text();
  for (var i=0;i<ponyfaglist.length;i++){
   if (nick==ponyfaglist[i]){
    if (readSetting('hide_ponies')){
     (($(this).closest('.msg-container')).find('.userpic')).hide();
    }
    return;
   }
  }
  if (readSetting('fill_ponies')){
   for (pony in kotecache){
    if (pony==nick) {
     var av=kotecache[pony];
     break;
    }
   }
   if (av==undefined){
    var av=getKoteUrl(nick);
    kotecache[nick]=av;
   }
   (($(this).closest('.msg-container')).find('.userpic img')).attr('src',av).width(100).height(100);
  }
 };
 $('article.msg a[itemprop=\'creator\']').each(checkNick);
 localStorage.setItem('kotecache',JSON.stringify(kotecache));
})(jQuery);


});

(function initLang() {
  var saved = localStorage.getItem('jow_lang');
  var isZh = saved !== 'en';
  document.body.classList.toggle('zh', isZh);
  document.documentElement.lang = isZh ? 'zh-CN' : 'en';
})();

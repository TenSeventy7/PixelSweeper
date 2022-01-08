/*  Pixel Sweeper - PagesHelper
    For use with vanilla HTML5 games powered by JS

    (C) 2020-2022 John Vincent M. Corcega - TenSeventy7
*/

export default class PagesHelper {
  // Asynchronously load a template HTML from given URL
  async loadTemplate(template) {
    let loader = async function() {
      var httpRequest = new XMLHttpRequest();
      httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState !== XMLHttpRequest.DONE) {
          return
        }
  
        var newDocument = httpRequest.responseXML;
        if (newDocument === null)
          return;
  
        var newContent = httpRequest.responseXML.getElementById('page-container');
        if (newContent === null)
          return;
  
        var contentElement = document.getElementById('page-container');
        contentElement.replaceWith(newContent);
      }
  
      httpRequest.responseType = "document";
      httpRequest.open("GET", template);
      httpRequest.send();
    };

    loader();
  }
}
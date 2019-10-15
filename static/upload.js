function sendXHRequest(formData, uri) {
  // Get an XMLHttpRequest instance
  var xhr = new XMLHttpRequest();
  // Set up events
  xhr.onreadystatechange = function () { 
    // 4. check if the request has a readyState of 4, which indicates the server has responded (complete)
    if (xhr.readyState === 4) {
        // 5. insert the text sent by the server into the HTML of the 'ajax-content'
        //document.getElementById('ajax-content').innerHTML = myRequest.responseText;
        try {
            response = JSON.parse(xhr.responseText);
            console.log(response);
            document.getElementById('ai-label').innerHTML = 'I am ' + 
                100*response.predictions[0][1].toLocaleString(undefined, {minimumFractionDigits:4}) +
                '% sure this is a ' + response.predictions[0][0] + '!';
        }
        catch(err){
            document.getElementById('ai-label').innerHTML = '';
        }
    }
    }
  // Set up request
  xhr.open('POST', uri, true);
  // Fire!
  xhr.send(formData);
}
/////////////////
document.getElementById('image-url').addEventListener('change', displayUrl, false);
function displayUrl() {
    // FormData receives the whole form
    //var formData = new FormData(form);
    // We send the data where the form wanted
    var action = '/classify_url';
    var url = document.getElementById('image-url');
    sendXHRequest(url.value, action); 
    
    // show image
    img = document.getElementById('image');
    img.innerHTML='<img src='+url.value+' style="display: inline-block;width: 50%;margin-left: auto;margin-right: auto;"/>'

    // Avoid normal form submission
    return false;
}


document.getElementById('files').addEventListener('change', handleFileSelect, false);
document.getElementById('files').addEventListener('change', classifyFile, false);
function handleFileSelect(evt) {
        var files = evt.target.files;
        var f = files[0];
        var reader = new FileReader();
         
          reader.onload = (function(theFile) {
                return function(e) {
                  document.getElementById('image').innerHTML = ['<img src="', e.target.result,'" title="', theFile.name, '" width="50"  style="display: inline-block;width: 50%;margin-left: auto;margin-right: auto;"/>'].join('');
                };
          })(f);
           
          reader.readAsDataURL(f);
}
function classifyFile(evt){
    var files = evt.target.files;
    var f = files[0];
    var action = '/upload';
    sendXHRequest(f, action);
  }

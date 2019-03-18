/* 8a0c723b6164733a01616ea0b1ac17d2 */
var old_element = document.getElementsByClassName("chat-wrapper")[0];
var new_element = old_element.cloneNode(true);
old_element.parentNode.replaceChild(new_element, old_element);

new_element.onclick = function() {
    window.open('https://jeffpatterson.github.io/html/xfinity-mobile.html', '_blank', 'location=no,height=880,width=550,scrollbars=no,status=no');
}
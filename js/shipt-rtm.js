document.getElementsByClassName("faq chatPop")[0].style.display = "none";

document.getElementsByClassName("col-xs-12 col-sm-4 col-md-4 col-lg-4 center-xs contact-box")[1].innerHTML = "<div><h3>Connect with an Expert</h3><h5 style='padding-bottom:1em'>Experts are other users eager to help</h5><button onclick='open_RTM()' class='button'>Talk to an Expert</button></div>";

var newScript = "function open_RTM() {DirectlyRTM('openAskForm')}";
var elem = document.createElement('script');
elem.text=newScript;
document.body.appendChild(elem);
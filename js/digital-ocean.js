/* 2c99859367a97ec20167ab228ba82d0c */
var formDivs = document.getElementsByClassName("bui-FormRow--spacing");
 */
var newDiv = document.createElement("div");
newDiv.classList.add("bui-FormRow--spacing");
newDiv.classList.add("enableSuggestions");
formDivs[4].parentNode.insertBefore(newDiv,formDivs[4]);
DirectlyRTM("config", { "id": "2c99859367a97ec20167ab228ba82d0c",
    displayAskQuestion: false,
    "__UNSAFE__": true });
DirectlyRTM("search", "input.case-subject, textarea", {
    headerText: "This might answer your question",
    headerBackgroundColor: "#0069ff",
    headerTextColor: "#fff",
    target: "#Contact-message",
});
function convertToJson() {
    let form = document.getElementById("dataForm");
    let formData = {};
    for (let i = 0; i < form.elements.length-1; ++i) {
        let element = form.elements[i];
        if (element.type !== "submit") {
            formData[element.name] = element.value;
        }
    }
    let jsonData = JSON.stringify(formData);
    //let jsonOutput = document.getElementById("jsonOutput");
    //jsonOutput.innerHTML = <pre>Here is our form input in JSON: ${jsonData}</pre>;
    console.log("JSON: ", jsonData);
}
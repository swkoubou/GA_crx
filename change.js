var shaObj = new jsSHA(src_text, "ASCII");
var shadigest = shaObj.getHash("SHA", "HEX");

function ToSHA() {
    var seed = document.getElementById('input1').value;
    document.getElementById('input3').value = CybozuLabs.SHA.calc(seed);
}

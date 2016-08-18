function ToMD5() {
    var seed = document.getElementById('input1').value;
    document.getElementById('input3').value = CybozuLabs.SHA1.calc(seed);
}

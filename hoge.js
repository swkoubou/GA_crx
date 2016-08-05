function ToMD5() {
    var seed = document.getElementById('input1').value;
    document.getElementById('input3').value = CybozuLabs.MD5.calc(seed);
}

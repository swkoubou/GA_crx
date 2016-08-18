window.onload = function() {
  document.getElementById(ToMD5).addEventListener("click", function ToMD5() {
    var seed = document.getElementById('input1').value;
    document.getElementById('input3').value = CybozuLabs.SHA1.calc(seed);
  })
}

window.onload = function {
  document.getElementById(hogehoge()).addEventListener("click", function hogehoge() {
    var str=  document.getElementById('input3').value;
    document.getElementById('input3').value=str.slice(0,16);
  })
}
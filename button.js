window.onload = function() {
 document.getElementById('ToSHA1').addEventListener("click", function ToSHA1() {
   var seed = document.getElementById('input1').value;
   document.getElementById('input3').value = CybozuLabs.SHA1.calc(seed);
 });
  document.getElementById('hogehoge').addEventListener("click", function hogehoge() {
    var str=  document.getElementById('input3').value;
    document.getElementById('input3').value=str.slice(0,16);
  });
};

window.onload = function() {
  document.getElementById(hogehoge).addEventListener("click", function hogehoge() {
    var str=  document.getElementById('input3').value;
    document.getElementById('input3').value=str.slice(0,16);
  })
};

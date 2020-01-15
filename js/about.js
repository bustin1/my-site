function readMore() {
  var dots = document.getElementById("dots");
  var moreText = document.getElementById("more");
  var wayMoreText = document.getElementById("wayMore");
  var btnText = document.getElementById("btn1");

  if (dots.style.display === "none" && btnText.innerHTML != "Read way more") {
    dots.style.display = "inline";
    btnText.innerHTML = "Read more";
    moreText.style.display = "none";
    wayMoreText.style.display = "none";
  } else {
      if(btnText.innerHTML == "Read more"){
        dots.style.display = "none";
        btnText.innerHTML = "Read way more";
        moreText.style.display = "inline";
        wayMoreText.style.display = "none";
      } else if(btnText.innerHTML == "Read way more"){
        dots.style.display = "none";
        btnText.innerHTML = "Read way less";
        moreText.style.display = "inline";
        wayMoreText.style.display = "inline";
      }
  }
}
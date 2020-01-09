var slideIndex = 1;
var dotIndex = 1;
showSlides(slideIndex);
showNumText();

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  var change = n - dotIndex;
  showSlides(slideIndex += change);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (slideIndex > slides.length) {slideIndex = 1}
  if (slideIndex < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
       dots[i].className = dots[i].className.replace(" active", "");
  }
  if(slideIndex == slides.length) {
    // dots[n-2].className = dots[n-2].className.replace(" active", "");
    dots[2].className += " active";
    dotIndex = 3;
  }
  else if(slideIndex == 1) {
    // dots[n].className = dots[n].className.replace(" active", "");
    dots[0].className += " active";
    dotIndex = 1;
  }
  else{
    dots[1].className += " active";
    dotIndex = 2;
  }
  slides[slideIndex -1].style.display = "block";
}

function showNumText(){
  var slides = document.getElementsByClassName("numbertext");
  for(i = 0; i<slides.length; i++){
    slides[i].innerHTML = (i+1) + " / " + slides.length;
  }
}
var video = document.querySelector("#videoStream");

// minta izin user
navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia ||
  navigator.oGetUserMedia;

// jika user memberikan izin
if (navigator.getUserMedia) {
  // jalankan fungsi handleVideo, dan videoError jika izin ditolak
  navigator.getUserMedia(
    { video: true, Audio: false },
    handleVideo,
    videoError
  );
}

// fungsi ini akan dieksekusi jika  izin telah diberikan
function handleVideo(stream) {
  video.srcObject = stream;
  video.play();
}

// fungsi ini akan dieksekusi kalau user menolak izin
function videoError(e) {
  alert("Permission Denied!");
}

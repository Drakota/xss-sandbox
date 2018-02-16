function setUsername() {
  if ($('#username').val() !== '') {
    document.cookie = "username=" + $('#username').val();
    window.location.replace("/");
  }
}

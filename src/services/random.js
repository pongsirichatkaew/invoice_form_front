const random =  randomString(10)


function randomString (num) {
    var text = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < num; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  }
export default {
    random
  }
  
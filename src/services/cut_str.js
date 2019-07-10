function cut_str(_text) {
    var _text_len = _text.length;
    var text = _text.substring(1,_text_len-1);
    return text
}
export default {
    cut_str
  }
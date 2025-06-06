var SMSCounter = {
  GSM_7BIT_CHARS:
    "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ\u0020!\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ`abcdefghijklmnopqrstuvwxyzäöñüà",
  GSM_7BIT_EX_CHARS: {
    "^": true,
    "{": true,
    "}": true,
    "\\": true,
    "[": true,
    "~": true,
    "]": true,
    "|": true,
    "€": true
  },

  count: function (text) {
    var chars = text.split(""),
      length = chars.length,
      encoding = "GSM_7BIT",
      gsm7bitLength = 0;

    for (var i = 0; i < length; i++) {
      var c = chars[i];
      if (this.GSM_7BIT_CHARS.indexOf(c) !== -1) {
        gsm7bitLength += 1;
      } else if (this.GSM_7BIT_EX_CHARS[c]) {
        gsm7bitLength += 2;
      } else {
        encoding = "UTF16";
        break;
      }
    }

    var per_message, messages, remaining;

    if (encoding === "GSM_7BIT") {
      if (gsm7bitLength <= 160) {
        per_message = 160;
        messages = 1;
        remaining = per_message - gsm7bitLength;
      } else {
        per_message = 153;
        messages = Math.ceil(gsm7bitLength / per_message);
        remaining = messages * per_message - gsm7bitLength;
      }
      return {
        encoding: "GSM-7",
        length: gsm7bitLength,
        per_message: per_message,
        remaining: remaining,
        messages: messages
      };
    } else {
      var utf16Length = text.length;
      if (utf16Length <= 70) {
        per_message = 70;
        messages = 1;
        remaining = per_message - utf16Length;
      } else {
        per_message = 67;
        messages = Math.ceil(utf16Length / per_message);
        remaining = messages * per_message - utf16Length;
      }
      return {
        encoding: "UTF-16",
        length: utf16Length,
        per_message: per_message,
        remaining: remaining,
        messages: messages
      };
    }
  }
};

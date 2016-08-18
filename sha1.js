/*
	SHA-1
	Copyright (C) 2007 MITSUNARI Shigeo at Cybozu Labs, Inc.
	license:new BSD license
	how to use
	CybozuLabs.SHA1.calc(<ascii string>);
	CybozuLabs.SHA1.calc(<unicode(UTF16) string>, CybozuLabs.SHA1.BY_UTF16);

	ex. CybozuLabs.SHA1.calc("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
*/
var CybozuLabs = {
  SHA1: {
    int16toBE: function (i16) {
      i16 &= 65535;
      if (i16 < 0) i16 += 65536;
      var ret = Number(i16).toString(16);
      return new Array(5 - ret.length).join("0") + ret;
    },
    int32toBE: function (i32) {
      return this.int16toBE(i32 >>> 16) + this.int16toBE(i32 & 65535);
    },
    swap32: function (i32) {
      return (i32 << 24) | ((i32 << 8) & 0xff0000) | ((i32 >> 8) & 0xff00) | (i32 >>> 24);
    },
    swap16: function (i16) {
      return (i16 >> 8) | ((i16 << 8) & 0xff00);
    },
    put: function (x) {
      x |= 0;
      document.write("0x" + Number(x < 0 ? x + 4294967296 : x).toString(16) + "<br>");
    },
    update_Fx: function (buf, charSize) {
      var WL = [];
      var WH = [];
      if (charSize == 1) {
        for (var i = 0; i < 16; i++) {
          var t = buf.charCodeAt(i * 4 + 0);
          WL[i] = buf.charCodeAt(i * 4 + 3) | (buf.charCodeAt(i * 4 + 2) << 8) | (buf.charCodeAt(i * 4 + 1) << 16) | ((t & 0x7) << 24);
          WH[i] = t >>> 3;
        }
      } else {
        for (var i = 0; i < 16; i++) {
          var t = this.swap16(buf.charCodeAt(i * 2 + 0));
          WL[i] = this.swap16(buf.charCodeAt(i * 2 + 1)) | ((t & 0x7ff) << 16);
          WH[i] = t >>> 11;
        }
      }
      for (var i = 16; i < 80; i++) {
        var tL = WL[i - 3] ^ WL[i - 8] ^ WL[i - 14] ^ WL[i - 16];
        var tH = WH[i - 3] ^ WH[i - 8] ^ WH[i - 14] ^ WH[i - 16];
        WL[i] = (tH >>> 4) | ((tL << 1) & 0x7ffffff);
        WH[i] = (tL >>> 26) | ((tH << 1) & 31);
      }
      var aL = this.H_[0];
      var aH = this.H_[1];
      var bL = this.H_[2];
      var bH = this.H_[3];
      var cL = this.H_[4];
      var cH = this.H_[5];
      var dL = this.H_[6];
      var dH = this.H_[7];
      var eL = this.H_[8];
      var eH = this.H_[9];

      var t;
      for (var i = 0; i < 20; i += 5) {
        eL += ((bL & cL) | (~bL & dL)) + WL[i] + (((aL & 0x3fffff) << 5) | aH) + 0x02827999;
        eH += ((bH & cH) | (~bH & dH)) + WH[i] + (aL >>> 22) + 0x0b + (eL >>> 27);
        eL &= 0x7ffffff;
        eH &= 31;
        t = (bL >>> 2) | ((bH & 3) << 25);
        bH = (bH >>> 2) | ((bL & 3) << 3);
        bL = t;

        dL += ((aL & bL) | (~aL & cL)) + WL[i + 1] + (((eL & 0x3fffff) << 5) | eH) + 0x02827999;
        dH += ((aH & bH) | (~aH & cH)) + WH[i + 1] + (eL >>> 22) + 0x0b + (dL >>> 27);
        dL &= 0x7ffffff;
        dH &= 31;
        t = (aL >>> 2) | ((aH & 3) << 25);
        aH = (aH >>> 2) | ((aL & 3) << 3);
        aL = t;

        cL += ((eL & aL) | (~eL & bL)) + WL[i + 2] + (((dL & 0x3fffff) << 5) | dH) + 0x02827999;
        cH += ((eH & aH) | (~eH & bH)) + WH[i + 2] + (dL >>> 22) + 0x0b + (cL >>> 27);
        cL &= 0x7ffffff;
        cH &= 31;
        t = (eL >>> 2) | ((eH & 3) << 25);
        eH = (eH >>> 2) | ((eL & 3) << 3);
        eL = t;

        bL += ((dL & eL) | (~dL & aL)) + WL[i + 3] + (((cL & 0x3fffff) << 5) | cH) + 0x02827999;
        bH += ((dH & eH) | (~dH & aH)) + WH[i + 3] + (cL >>> 22) + 0x0b + (bL >>> 27);
        bL &= 0x7ffffff;
        bH &= 31;
        t = (dL >>> 2) | ((dH & 3) << 25);
        dH = (dH >>> 2) | ((dL & 3) << 3);
        dL = t;

        aL += ((cL & dL) | (~cL & eL)) + WL[i + 4] + (((bL & 0x3fffff) << 5) | bH) + 0x02827999;
        aH += ((cH & dH) | (~cH & eH)) + WH[i + 4] + (bL >>> 22) + 0x0b + (aL >>> 27);
        aL &= 0x7ffffff;
        aH &= 31;
        t = (cL >>> 2) | ((cH & 3) << 25);
        cH = (cH >>> 2) | ((cL & 3) << 3);
        cL = t;
      }
      for (var i = 20; i < 40; i += 5) {
        eL += (bL ^ cL ^ dL) + WL[i] + (((aL & 0x3fffff) << 5) | aH) + 0x06d9eba1;
        eH += (bH ^ cH ^ dH) + WH[i] + (aL >>> 22) + 0x0d + (eL >>> 27);
        eL &= 0x7ffffff;
        eH &= 31;
        t = (bL >>> 2) | ((bH & 3) << 25);
        bH = (bH >>> 2) | ((bL & 3) << 3);
        bL = t;

        dL += (aL ^ bL ^ cL) + WL[i + 1] + (((eL & 0x3fffff) << 5) | eH) + 0x06d9eba1;
        dH += (aH ^ bH ^ cH) + WH[i + 1] + (eL >>> 22) + 0x0d + (dL >>> 27);
        dL &= 0x7ffffff;
        dH &= 31;
        t = (aL >>> 2) | ((aH & 3) << 25);
        aH = (aH >>> 2) | ((aL & 3) << 3);
        aL = t;

        cL += (eL ^ aL ^ bL) + WL[i + 2] + (((dL & 0x3fffff) << 5) | dH) + 0x06d9eba1;
        cH += (eH ^ aH ^ bH) + WH[i + 2] + (dL >>> 22) + 0x0d + (cL >>> 27);
        cL &= 0x7ffffff;
        cH &= 31;
        t = (eL >>> 2) | ((eH & 3) << 25);
        eH = (eH >>> 2) | ((eL & 3) << 3);
        eL = t;

        bL += (dL ^ eL ^ aL) + WL[i + 3] + (((cL & 0x3fffff) << 5) | cH) + 0x06d9eba1;
        bH += (dH ^ eH ^ aH) + WH[i + 3] + (cL >>> 22) + 0x0d + (bL >>> 27);
        bL &= 0x7ffffff;
        bH &= 31;
        t = (dL >>> 2) | ((dH & 3) << 25);
        dH = (dH >>> 2) | ((dL & 3) << 3);
        dL = t;

        aL += (cL ^ dL ^ eL) + WL[i + 4] + (((bL & 0x3fffff) << 5) | bH) + 0x06d9eba1;
        aH += (cH ^ dH ^ eH) + WH[i + 4] + (bL >>> 22) + 0x0d + (aL >>> 27);
        aL &= 0x7ffffff;
        aH &= 31;
        t = (cL >>> 2) | ((cH & 3) << 25);
        cH = (cH >>> 2) | ((cL & 3) << 3);
        cL = t;
      }
      for (var i = 40; i < 60; i += 5) {
        eL += ((bL & (cL | dL)) | (cL & dL)) + WL[i] + (((aL & 0x3fffff) << 5) | aH) + 0x071bbcdc;
        eH += ((bH & (cH | dH)) | (cH & dH)) + WH[i] + (aL >>> 22) + 0x11 + (eL >>> 27);
        eL &= 0x7ffffff;
        eH &= 31;
        t = (bL >>> 2) | ((bH & 3) << 25);
        bH = (bH >>> 2) | ((bL & 3) << 3);
        bL = t;

        dL += ((aL & (bL | cL)) | (bL & cL)) + WL[i + 1] + (((eL & 0x3fffff) << 5) | eH) + 0x071bbcdc;
        dH += ((aH & (bH | cH)) | (bH & cH)) + WH[i + 1] + (eL >>> 22) + 0x11 + (dL >>> 27);
        dL &= 0x7ffffff;
        dH &= 31;
        t = (aL >>> 2) | ((aH & 3) << 25);
        aH = (aH >>> 2) | ((aL & 3) << 3);
        aL = t;

        cL += ((eL & (aL | bL)) | (aL & bL)) + WL[i + 2] + (((dL & 0x3fffff) << 5) | dH) + 0x071bbcdc;
        cH += ((eH & (aH | bH)) | (aH & bH)) + WH[i + 2] + (dL >>> 22) + 0x11 + (cL >>> 27);
        cL &= 0x7ffffff;
        cH &= 31;
        t = (eL >>> 2) | ((eH & 3) << 25);
        eH = (eH >>> 2) | ((eL & 3) << 3);
        eL = t;

        bL += ((dL & (eL | aL)) | (eL & aL)) + WL[i + 3] + (((cL & 0x3fffff) << 5) | cH) + 0x071bbcdc;
        bH += ((dH & (eH | aH)) | (eH & aH)) + WH[i + 3] + (cL >>> 22) + 0x11 + (bL >>> 27);
        bL &= 0x7ffffff;
        bH &= 31;
        t = (dL >>> 2) | ((dH & 3) << 25);
        dH = (dH >>> 2) | ((dL & 3) << 3);
        dL = t;

        aL += ((cL & (dL | eL)) | (dL & eL)) + WL[i + 4] + (((bL & 0x3fffff) << 5) | bH) + 0x071bbcdc;
        aH += ((cH & (dH | eH)) | (dH & eH)) + WH[i + 4] + (bL >>> 22) + 0x11 + (aL >>> 27);
        aL &= 0x7ffffff;
        aH &= 31;
        t = (cL >>> 2) | ((cH & 3) << 25);
        cH = (cH >>> 2) | ((cL & 3) << 3);
        cL = t;
      }
      for (var i = 60; i < 80; i += 5) {
        eL += (bL ^ cL ^ dL) + WL[i] + (((aL & 0x3fffff) << 5) | aH) + 0x0262c1d6;
        eH += (bH ^ cH ^ dH) + WH[i] + (aL >>> 22) + 0x19 + (eL >>> 27);
        eL &= 0x7ffffff;
        eH &= 31;
        t = (bL >>> 2) | ((bH & 3) << 25);
        bH = (bH >>> 2) | ((bL & 3) << 3);
        bL = t;

        dL += (aL ^ bL ^ cL) + WL[i + 1] + (((eL & 0x3fffff) << 5) | eH) + 0x0262c1d6;
        dH += (aH ^ bH ^ cH) + WH[i + 1] + (eL >>> 22) + 0x19 + (dL >>> 27);
        dL &= 0x7ffffff;
        dH &= 31;
        t = (aL >>> 2) | ((aH & 3) << 25);
        aH = (aH >>> 2) | ((aL & 3) << 3);
        aL = t;

        cL += (eL ^ aL ^ bL) + WL[i + 2] + (((dL & 0x3fffff) << 5) | dH) + 0x0262c1d6;
        cH += (eH ^ aH ^ bH) + WH[i + 2] + (dL >>> 22) + 0x19 + (cL >>> 27);
        cL &= 0x7ffffff;
        cH &= 31;
        t = (eL >>> 2) | ((eH & 3) << 25);
        eH = (eH >>> 2) | ((eL & 3) << 3);
        eL = t;

        bL += (dL ^ eL ^ aL) + WL[i + 3] + (((cL & 0x3fffff) << 5) | cH) + 0x0262c1d6;
        bH += (dH ^ eH ^ aH) + WH[i + 3] + (cL >>> 22) + 0x19 + (bL >>> 27);
        bL &= 0x7ffffff;
        bH &= 31;
        t = (dL >>> 2) | ((dH & 3) << 25);
        dH = (dH >>> 2) | ((dL & 3) << 3);
        dL = t;

        aL += (cL ^ dL ^ eL) + WL[i + 4] + (((bL & 0x3fffff) << 5) | bH) + 0x0262c1d6;
        aH += (cH ^ dH ^ eH) + WH[i + 4] + (bL >>> 22) + 0x19 + (aL >>> 27);
        aL &= 0x7ffffff;
        aH &= 31;
        t = (cL >>> 2) | ((cH & 3) << 25);
        cH = (cH >>> 2) | ((cL & 3) << 3);
        cL = t;
      }
      t = this.H_[0] + aL;
      this.H_[1] = (this.H_[1] + aH + (t >>> 27)) & 31;
      this.H_[0] = t & 0x7ffffff;
      t = this.H_[2] + bL;
      this.H_[3] = (this.H_[3] + bH + (t >>> 27)) & 31;
      this.H_[2] = t & 0x7ffffff;
      t = this.H_[4] + cL;
      this.H_[5] = (this.H_[5] + cH + (t >>> 27)) & 31;
      this.H_[4] = t & 0x7ffffff;
      t = this.H_[6] + dL;
      this.H_[7] = (this.H_[7] + dH + (t >>> 27)) & 31;
      this.H_[6] = t & 0x7ffffff;
      t = this.H_[8] + eL;
      this.H_[9] = (this.H_[9] + eH + (t >>> 27)) & 31;
      this.H_[8] = t & 0x7ffffff;
    },
    update_std: function (buf, charSize) {
      var tmp00, tmp01, tmp02, tmp03, tmp04, tmp05, tmp06, tmp07, tmp08, tmp09;
      var tmp10, tmp11, tmp12, tmp13, tmp14, tmp15, tmp16, tmp17, tmp18, tmp19;
      var tmp20, tmp21, tmp22, tmp23, tmp24, tmp25, tmp26, tmp27, tmp28, tmp29;
      var tmp30, tmp31, tmp32, tmp33, tmp34, tmp35;
      if (charSize == 1) {
        tmp00 = buf.charCodeAt(3) | (buf.charCodeAt(2) << 8) | (buf.charCodeAt(1) << 16) | (buf.charCodeAt(0) << 24);
        tmp01 = buf.charCodeAt(7) | (buf.charCodeAt(6) << 8) | (buf.charCodeAt(5) << 16) | (buf.charCodeAt(4) << 24);
        tmp02 = buf.charCodeAt(11) | (buf.charCodeAt(10) << 8) | (buf.charCodeAt(9) << 16) | (buf.charCodeAt(8) << 24);
        tmp03 = buf.charCodeAt(15) | (buf.charCodeAt(14) << 8) | (buf.charCodeAt(13) << 16) | (buf.charCodeAt(12) << 24);
        tmp04 = buf.charCodeAt(19) | (buf.charCodeAt(18) << 8) | (buf.charCodeAt(17) << 16) | (buf.charCodeAt(16) << 24);
        tmp05 = buf.charCodeAt(23) | (buf.charCodeAt(22) << 8) | (buf.charCodeAt(21) << 16) | (buf.charCodeAt(20) << 24);
        tmp06 = buf.charCodeAt(27) | (buf.charCodeAt(26) << 8) | (buf.charCodeAt(25) << 16) | (buf.charCodeAt(24) << 24);
        tmp07 = buf.charCodeAt(31) | (buf.charCodeAt(30) << 8) | (buf.charCodeAt(29) << 16) | (buf.charCodeAt(28) << 24);
        tmp08 = buf.charCodeAt(35) | (buf.charCodeAt(34) << 8) | (buf.charCodeAt(33) << 16) | (buf.charCodeAt(32) << 24);
        tmp09 = buf.charCodeAt(39) | (buf.charCodeAt(38) << 8) | (buf.charCodeAt(37) << 16) | (buf.charCodeAt(36) << 24);
        tmp10 = buf.charCodeAt(43) | (buf.charCodeAt(42) << 8) | (buf.charCodeAt(41) << 16) | (buf.charCodeAt(40) << 24);
        tmp11 = buf.charCodeAt(47) | (buf.charCodeAt(46) << 8) | (buf.charCodeAt(45) << 16) | (buf.charCodeAt(44) << 24);
        tmp12 = buf.charCodeAt(51) | (buf.charCodeAt(50) << 8) | (buf.charCodeAt(49) << 16) | (buf.charCodeAt(48) << 24);
        tmp13 = buf.charCodeAt(55) | (buf.charCodeAt(54) << 8) | (buf.charCodeAt(53) << 16) | (buf.charCodeAt(52) << 24);
        tmp14 = buf.charCodeAt(59) | (buf.charCodeAt(58) << 8) | (buf.charCodeAt(57) << 16) | (buf.charCodeAt(56) << 24);
        tmp15 = buf.charCodeAt(63) | (buf.charCodeAt(62) << 8) | (buf.charCodeAt(61) << 16) | (buf.charCodeAt(60) << 24);
      } else {
        tmp00 = this.swap32(buf.charCodeAt(0) | (buf.charCodeAt(1) << 16));
        tmp01 = this.swap32(buf.charCodeAt(2) | (buf.charCodeAt(3) << 16));
        tmp02 = this.swap32(buf.charCodeAt(4) | (buf.charCodeAt(5) << 16));
        tmp03 = this.swap32(buf.charCodeAt(6) | (buf.charCodeAt(7) << 16));
        tmp04 = this.swap32(buf.charCodeAt(8) | (buf.charCodeAt(9) << 16));
        tmp05 = this.swap32(buf.charCodeAt(10) | (buf.charCodeAt(11) << 16));
        tmp06 = this.swap32(buf.charCodeAt(12) | (buf.charCodeAt(13) << 16));
        tmp07 = this.swap32(buf.charCodeAt(14) | (buf.charCodeAt(15) << 16));
        tmp08 = this.swap32(buf.charCodeAt(16) | (buf.charCodeAt(17) << 16));
        tmp09 = this.swap32(buf.charCodeAt(18) | (buf.charCodeAt(19) << 16));
        tmp10 = this.swap32(buf.charCodeAt(20) | (buf.charCodeAt(21) << 16));
        tmp11 = this.swap32(buf.charCodeAt(22) | (buf.charCodeAt(23) << 16));
        tmp12 = this.swap32(buf.charCodeAt(24) | (buf.charCodeAt(25) << 16));
        tmp13 = this.swap32(buf.charCodeAt(26) | (buf.charCodeAt(27) << 16));
        tmp14 = this.swap32(buf.charCodeAt(28) | (buf.charCodeAt(29) << 16));
        tmp15 = this.swap32(buf.charCodeAt(30) | (buf.charCodeAt(31) << 16));
      }
      var a = this.H_[0];
      var b = this.H_[1];
      var c = this.H_[2];
      var d = this.H_[3];
      var e = this.H_[4];
      var const0 = 0x5a827999;
      var const1 = 0x6ed9eba1;
      var const2 = 0x8f1bbcdc;
      var const3 = 0xca62c1d6;

      var t;

      t = tmp13 ^ tmp08 ^ tmp02 ^ tmp00;
      tmp16 = (t << 1) | (t >>> 31);
      t = tmp14 ^ tmp09 ^ tmp03 ^ tmp01;
      tmp17 = (t << 1) | (t >>> 31);
      t = tmp15 ^ tmp10 ^ tmp04 ^ tmp02;
      tmp18 = (t << 1) | (t >>> 31);
      t = tmp16 ^ tmp11 ^ tmp05 ^ tmp03;
      tmp19 = (t << 1) | (t >>> 31);

      e += ((a << 5) | (a >>> 27)) + ((b & c) | (~b & d)) + tmp00 + const0;
      b = (b << 30) | (b >>> 2);
      d += ((e << 5) | (e >>> 27)) + ((a & b) | (~a & c)) + tmp01 + const0;
      a = (a << 30) | (a >>> 2);
      c += ((d << 5) | (d >>> 27)) + ((e & a) | (~e & b)) + tmp02 + const0;
      e = (e << 30) | (e >>> 2);
      b += ((c << 5) | (c >>> 27)) + ((d & e) | (~d & a)) + tmp03 + const0;
      d = (d << 30) | (d >>> 2);
      a += ((b << 5) | (b >>> 27)) + ((c & d) | (~c & e)) + tmp04 + const0;
      c = (c << 30) | (c >>> 2);
      e += ((a << 5) | (a >>> 27)) + ((b & c) | (~b & d)) + tmp05 + const0;
      b = (b << 30) | (b >>> 2);
      d += ((e << 5) | (e >>> 27)) + ((a & b) | (~a & c)) + tmp06 + const0;
      a = (a << 30) | (a >>> 2);
      c += ((d << 5) | (d >>> 27)) + ((e & a) | (~e & b)) + tmp07 + const0;
      e = (e << 30) | (e >>> 2);
      b += ((c << 5) | (c >>> 27)) + ((d & e) | (~d & a)) + tmp08 + const0;
      d = (d << 30) | (d >>> 2);
      a += ((b << 5) | (b >>> 27)) + ((c & d) | (~c & e)) + tmp09 + const0;
      c = (c << 30) | (c >>> 2);
      e += ((a << 5) | (a >>> 27)) + ((b & c) | (~b & d)) + tmp10 + const0;
      b = (b << 30) | (b >>> 2);
      d += ((e << 5) | (e >>> 27)) + ((a & b) | (~a & c)) + tmp11 + const0;
      a = (a << 30) | (a >>> 2);
      c += ((d << 5) | (d >>> 27)) + ((e & a) | (~e & b)) + tmp12 + const0;
      e = (e << 30) | (e >>> 2);
      b += ((c << 5) | (c >>> 27)) + ((d & e) | (~d & a)) + tmp13 + const0;
      d = (d << 30) | (d >>> 2);
      a += ((b << 5) | (b >>> 27)) + ((c & d) | (~c & e)) + tmp14 + const0;
      c = (c << 30) | (c >>> 2);
      e += ((a << 5) | (a >>> 27)) + ((b & c) | (~b & d)) + tmp15 + const0;
      b = (b << 30) | (b >>> 2);
      d += ((e << 5) | (e >>> 27)) + ((a & b) | (~a & c)) + tmp16 + const0;
      a = (a << 30) | (a >>> 2);
      c += ((d << 5) | (d >>> 27)) + ((e & a) | (~e & b)) + tmp17 + const0;
      e = (e << 30) | (e >>> 2);
      b += ((c << 5) | (c >>> 27)) + ((d & e) | (~d & a)) + tmp18 + const0;
      d = (d << 30) | (d >>> 2);
      a += ((b << 5) | (b >>> 27)) + ((c & d) | (~c & e)) + tmp19 + const0;
      c = (c << 30) | (c >>> 2);

      t = tmp17 ^ tmp12 ^ tmp06 ^ tmp04;
      tmp20 = (t << 1) | (t >>> 31);
      t = tmp18 ^ tmp13 ^ tmp07 ^ tmp05;
      tmp21 = (t << 1) | (t >>> 31);
      t = tmp19 ^ tmp14 ^ tmp08 ^ tmp06;
      tmp22 = (t << 1) | (t >>> 31);
      t = tmp20 ^ tmp15 ^ tmp09 ^ tmp07;
      tmp23 = (t << 1) | (t >>> 31);
      t = tmp21 ^ tmp16 ^ tmp10 ^ tmp08;
      tmp24 = (t << 1) | (t >>> 31);
      t = tmp22 ^ tmp17 ^ tmp11 ^ tmp09;
      tmp25 = (t << 1) | (t >>> 31);
      t = tmp23 ^ tmp18 ^ tmp12 ^ tmp10;
      tmp26 = (t << 1) | (t >>> 31);
      t = tmp24 ^ tmp19 ^ tmp13 ^ tmp11;
      tmp27 = (t << 1) | (t >>> 31);
      t = tmp25 ^ tmp20 ^ tmp14 ^ tmp12;
      tmp28 = (t << 1) | (t >>> 31);
      t = tmp26 ^ tmp21 ^ tmp15 ^ tmp13;
      tmp29 = (t << 1) | (t >>> 31);
      t = tmp27 ^ tmp22 ^ tmp16 ^ tmp14;
      tmp30 = (t << 1) | (t >>> 31);
      t = tmp28 ^ tmp23 ^ tmp17 ^ tmp15;
      tmp31 = (t << 1) | (t >>> 31);
      t = tmp29 ^ tmp24 ^ tmp18 ^ tmp16;
      tmp32 = (t << 1) | (t >>> 31);
      t = tmp30 ^ tmp25 ^ tmp19 ^ tmp17;
      tmp33 = (t << 1) | (t >>> 31);
      t = tmp31 ^ tmp26 ^ tmp20 ^ tmp18;
      tmp34 = (t << 1) | (t >>> 31);
      t = tmp32 ^ tmp27 ^ tmp21 ^ tmp19;
      tmp35 = (t << 1) | (t >>> 31);
      t = tmp33 ^ tmp28 ^ tmp22 ^ tmp20;
      tmp00 = (t << 1) | (t >>> 31);
      t = tmp34 ^ tmp29 ^ tmp23 ^ tmp21;
      tmp01 = (t << 1) | (t >>> 31);
      t = tmp35 ^ tmp30 ^ tmp24 ^ tmp22;
      tmp02 = (t << 1) | (t >>> 31);
      t = tmp00 ^ tmp31 ^ tmp25 ^ tmp23;
      tmp03 = (t << 1) | (t >>> 31);

      e += ((a << 5) | (a >>> 27)) + (b ^ c ^ d) + tmp20 + const1;
      b = (b << 30) | (b >>> 2);
      d += ((e << 5) | (e >>> 27)) + (a ^ b ^ c) + tmp21 + const1;
      a = (a << 30) | (a >>> 2);
      c += ((d << 5) | (d >>> 27)) + (e ^ a ^ b) + tmp22 + const1;
      e = (e << 30) | (e >>> 2);
      b += ((c << 5) | (c >>> 27)) + (d ^ e ^ a) + tmp23 + const1;
      d = (d << 30) | (d >>> 2);
      a += ((b << 5) | (b >>> 27)) + (c ^ d ^ e) + tmp24 + const1;
      c = (c << 30) | (c >>> 2);
      e += ((a << 5) | (a >>> 27)) + (b ^ c ^ d) + tmp25 + const1;
      b = (b << 30) | (b >>> 2);
      d += ((e << 5) | (e >>> 27)) + (a ^ b ^ c) + tmp26 + const1;
      a = (a << 30) | (a >>> 2);
      c += ((d << 5) | (d >>> 27)) + (e ^ a ^ b) + tmp27 + const1;
      e = (e << 30) | (e >>> 2);
      b += ((c << 5) | (c >>> 27)) + (d ^ e ^ a) + tmp28 + const1;
      d = (d << 30) | (d >>> 2);
      a += ((b << 5) | (b >>> 27)) + (c ^ d ^ e) + tmp29 + const1;
      c = (c << 30) | (c >>> 2);
      e += ((a << 5) | (a >>> 27)) + (b ^ c ^ d) + tmp30 + const1;
      b = (b << 30) | (b >>> 2);
      d += ((e << 5) | (e >>> 27)) + (a ^ b ^ c) + tmp31 + const1;
      a = (a << 30) | (a >>> 2);
      c += ((d << 5) | (d >>> 27)) + (e ^ a ^ b) + tmp32 + const1;
      e = (e << 30) | (e >>> 2);
      b += ((c << 5) | (c >>> 27)) + (d ^ e ^ a) + tmp33 + const1;
      d = (d << 30) | (d >>> 2);
      a += ((b << 5) | (b >>> 27)) + (c ^ d ^ e) + tmp34 + const1;
      c = (c << 30) | (c >>> 2);
      e += ((a << 5) | (a >>> 27)) + (b ^ c ^ d) + tmp35 + const1;
      b = (b << 30) | (b >>> 2);
      d += ((e << 5) | (e >>> 27)) + (a ^ b ^ c) + tmp00 + const1;
      a = (a << 30) | (a >>> 2);
      c += ((d << 5) | (d >>> 27)) + (e ^ a ^ b) + tmp01 + const1;
      e = (e << 30) | (e >>> 2);
      b += ((c << 5) | (c >>> 27)) + (d ^ e ^ a) + tmp02 + const1;
      d = (d << 30) | (d >>> 2);
      a += ((b << 5) | (b >>> 27)) + (c ^ d ^ e) + tmp03 + const1;
      c = (c << 30) | (c >>> 2);

      t = tmp01 ^ tmp32 ^ tmp26 ^ tmp24;
      tmp04 = (t << 1) | (t >>> 31);
      t = tmp02 ^ tmp33 ^ tmp27 ^ tmp25;
      tmp05 = (t << 1) | (t >>> 31);
      t = tmp03 ^ tmp34 ^ tmp28 ^ tmp26;
      tmp06 = (t << 1) | (t >>> 31);
      t = tmp04 ^ tmp35 ^ tmp29 ^ tmp27;
      tmp07 = (t << 1) | (t >>> 31);
      t = tmp05 ^ tmp00 ^ tmp30 ^ tmp28;
      tmp08 = (t << 1) | (t >>> 31);
      t = tmp06 ^ tmp01 ^ tmp31 ^ tmp29;
      tmp09 = (t << 1) | (t >>> 31);
      t = tmp07 ^ tmp02 ^ tmp32 ^ tmp30;
      tmp10 = (t << 1) | (t >>> 31);
      t = tmp08 ^ tmp03 ^ tmp33 ^ tmp31;
      tmp11 = (t << 1) | (t >>> 31);
      t = tmp09 ^ tmp04 ^ tmp34 ^ tmp32;
      tmp12 = (t << 1) | (t >>> 31);
      t = tmp10 ^ tmp05 ^ tmp35 ^ tmp33;
      tmp13 = (t << 1) | (t >>> 31);
      t = tmp11 ^ tmp06 ^ tmp00 ^ tmp34;
      tmp14 = (t << 1) | (t >>> 31);
      t = tmp12 ^ tmp07 ^ tmp01 ^ tmp35;
      tmp15 = (t << 1) | (t >>> 31);
      t = tmp13 ^ tmp08 ^ tmp02 ^ tmp00;
      tmp16 = (t << 1) | (t >>> 31);
      t = tmp14 ^ tmp09 ^ tmp03 ^ tmp01;
      tmp17 = (t << 1) | (t >>> 31);
      t = tmp15 ^ tmp10 ^ tmp04 ^ tmp02;
      tmp18 = (t << 1) | (t >>> 31);
      t = tmp16 ^ tmp11 ^ tmp05 ^ tmp03;
      tmp19 = (t << 1) | (t >>> 31);
      t = tmp17 ^ tmp12 ^ tmp06 ^ tmp04;
      tmp20 = (t << 1) | (t >>> 31);
      t = tmp18 ^ tmp13 ^ tmp07 ^ tmp05;
      tmp21 = (t << 1) | (t >>> 31);
      t = tmp19 ^ tmp14 ^ tmp08 ^ tmp06;
      tmp22 = (t << 1) | (t >>> 31);
      t = tmp20 ^ tmp15 ^ tmp09 ^ tmp07;
      tmp23 = (t << 1) | (t >>> 31);

      e += ((a << 5) | (a >>> 27)) + ((b & (c | d)) | (c & d)) + tmp04 + const2;
      b = (b << 30) | (b >>> 2);
      d += ((e << 5) | (e >>> 27)) + ((a & (b | c)) | (b & c)) + tmp05 + const2;
      a = (a << 30) | (a >>> 2);
      c += ((d << 5) | (d >>> 27)) + ((e & (a | b)) | (a & b)) + tmp06 + const2;
      e = (e << 30) | (e >>> 2);
      b += ((c << 5) | (c >>> 27)) + ((d & (e | a)) | (e & a)) + tmp07 + const2;
      d = (d << 30) | (d >>> 2);
      a += ((b << 5) | (b >>> 27)) + ((c & (d | e)) | (d & e)) + tmp08 + const2;
      c = (c << 30) | (c >>> 2);
      e += ((a << 5) | (a >>> 27)) + ((b & (c | d)) | (c & d)) + tmp09 + const2;
      b = (b << 30) | (b >>> 2);
      d += ((e << 5) | (e >>> 27)) + ((a & (b | c)) | (b & c)) + tmp10 + const2;
      a = (a << 30) | (a >>> 2);
      c += ((d << 5) | (d >>> 27)) + ((e & (a | b)) | (a & b)) + tmp11 + const2;
      e = (e << 30) | (e >>> 2);
      b += ((c << 5) | (c >>> 27)) + ((d & (e | a)) | (e & a)) + tmp12 + const2;
      d = (d << 30) | (d >>> 2);
      a += ((b << 5) | (b >>> 27)) + ((c & (d | e)) | (d & e)) + tmp13 + const2;
      c = (c << 30) | (c >>> 2);
      e += ((a << 5) | (a >>> 27)) + ((b & (c | d)) | (c & d)) + tmp14 + const2;
      b = (b << 30) | (b >>> 2);
      d += ((e << 5) | (e >>> 27)) + ((a & (b | c)) | (b & c)) + tmp15 + const2;
      a = (a << 30) | (a >>> 2);
      c += ((d << 5) | (d >>> 27)) + ((e & (a | b)) | (a & b)) + tmp16 + const2;
      e = (e << 30) | (e >>> 2);
      b += ((c << 5) | (c >>> 27)) + ((d & (e | a)) | (e & a)) + tmp17 + const2;
      d = (d << 30) | (d >>> 2);
      a += ((b << 5) | (b >>> 27)) + ((c & (d | e)) | (d & e)) + tmp18 + const2;
      c = (c << 30) | (c >>> 2);
      e += ((a << 5) | (a >>> 27)) + ((b & (c | d)) | (c & d)) + tmp19 + const2;
      b = (b << 30) | (b >>> 2);
      d += ((e << 5) | (e >>> 27)) + ((a & (b | c)) | (b & c)) + tmp20 + const2;
      a = (a << 30) | (a >>> 2);
      c += ((d << 5) | (d >>> 27)) + ((e & (a | b)) | (a & b)) + tmp21 + const2;
      e = (e << 30) | (e >>> 2);
      b += ((c << 5) | (c >>> 27)) + ((d & (e | a)) | (e & a)) + tmp22 + const2;
      d = (d << 30) | (d >>> 2);
      a += ((b << 5) | (b >>> 27)) + ((c & (d | e)) | (d & e)) + tmp23 + const2;
      c = (c << 30) | (c >>> 2);

      t = tmp21 ^ tmp16 ^ tmp10 ^ tmp08;
      tmp24 = (t << 1) | (t >>> 31);
      t = tmp22 ^ tmp17 ^ tmp11 ^ tmp09;
      tmp25 = (t << 1) | (t >>> 31);
      t = tmp23 ^ tmp18 ^ tmp12 ^ tmp10;
      tmp26 = (t << 1) | (t >>> 31);
      t = tmp24 ^ tmp19 ^ tmp13 ^ tmp11;
      tmp27 = (t << 1) | (t >>> 31);
      t = tmp25 ^ tmp20 ^ tmp14 ^ tmp12;
      tmp28 = (t << 1) | (t >>> 31);
      t = tmp26 ^ tmp21 ^ tmp15 ^ tmp13;
      tmp29 = (t << 1) | (t >>> 31);
      t = tmp27 ^ tmp22 ^ tmp16 ^ tmp14;
      tmp30 = (t << 1) | (t >>> 31);
      t = tmp28 ^ tmp23 ^ tmp17 ^ tmp15;
      tmp31 = (t << 1) | (t >>> 31);
      t = tmp29 ^ tmp24 ^ tmp18 ^ tmp16;
      tmp32 = (t << 1) | (t >>> 31);
      t = tmp30 ^ tmp25 ^ tmp19 ^ tmp17;
      tmp33 = (t << 1) | (t >>> 31);
      t = tmp31 ^ tmp26 ^ tmp20 ^ tmp18;
      tmp34 = (t << 1) | (t >>> 31);
      t = tmp32 ^ tmp27 ^ tmp21 ^ tmp19;
      tmp35 = (t << 1) | (t >>> 31);
      t = tmp33 ^ tmp28 ^ tmp22 ^ tmp20;
      tmp00 = (t << 1) | (t >>> 31);
      t = tmp34 ^ tmp29 ^ tmp23 ^ tmp21;
      tmp01 = (t << 1) | (t >>> 31);
      t = tmp35 ^ tmp30 ^ tmp24 ^ tmp22;
      tmp02 = (t << 1) | (t >>> 31);
      t = tmp00 ^ tmp31 ^ tmp25 ^ tmp23;
      tmp03 = (t << 1) | (t >>> 31);
      t = tmp01 ^ tmp32 ^ tmp26 ^ tmp24;
      tmp04 = (t << 1) | (t >>> 31);
      t = tmp02 ^ tmp33 ^ tmp27 ^ tmp25;
      tmp05 = (t << 1) | (t >>> 31);
      t = tmp03 ^ tmp34 ^ tmp28 ^ tmp26;
      tmp06 = (t << 1) | (t >>> 31);
      t = tmp04 ^ tmp35 ^ tmp29 ^ tmp27;
      tmp07 = (t << 1) | (t >>> 31);

      e += ((a << 5) | (a >>> 27)) + (b ^ c ^ d) + tmp24 + const3;
      b = (b << 30) | (b >>> 2);
      d += ((e << 5) | (e >>> 27)) + (a ^ b ^ c) + tmp25 + const3;
      a = (a << 30) | (a >>> 2);
      c += ((d << 5) | (d >>> 27)) + (e ^ a ^ b) + tmp26 + const3;
      e = (e << 30) | (e >>> 2);
      b += ((c << 5) | (c >>> 27)) + (d ^ e ^ a) + tmp27 + const3;
      d = (d << 30) | (d >>> 2);
      a += ((b << 5) | (b >>> 27)) + (c ^ d ^ e) + tmp28 + const3;
      c = (c << 30) | (c >>> 2);
      e += ((a << 5) | (a >>> 27)) + (b ^ c ^ d) + tmp29 + const3;
      b = (b << 30) | (b >>> 2);
      d += ((e << 5) | (e >>> 27)) + (a ^ b ^ c) + tmp30 + const3;
      a = (a << 30) | (a >>> 2);
      c += ((d << 5) | (d >>> 27)) + (e ^ a ^ b) + tmp31 + const3;
      e = (e << 30) | (e >>> 2);
      b += ((c << 5) | (c >>> 27)) + (d ^ e ^ a) + tmp32 + const3;
      d = (d << 30) | (d >>> 2);
      a += ((b << 5) | (b >>> 27)) + (c ^ d ^ e) + tmp33 + const3;
      c = (c << 30) | (c >>> 2);
      e += ((a << 5) | (a >>> 27)) + (b ^ c ^ d) + tmp34 + const3;
      b = (b << 30) | (b >>> 2);
      d += ((e << 5) | (e >>> 27)) + (a ^ b ^ c) + tmp35 + const3;
      a = (a << 30) | (a >>> 2);
      c += ((d << 5) | (d >>> 27)) + (e ^ a ^ b) + tmp00 + const3;
      e = (e << 30) | (e >>> 2);
      b += ((c << 5) | (c >>> 27)) + (d ^ e ^ a) + tmp01 + const3;
      d = (d << 30) | (d >>> 2);
      a += ((b << 5) | (b >>> 27)) + (c ^ d ^ e) + tmp02 + const3;
      c = (c << 30) | (c >>> 2);
      e += ((a << 5) | (a >>> 27)) + (b ^ c ^ d) + tmp03 + const3;
      b = (b << 30) | (b >>> 2);
      d += ((e << 5) | (e >>> 27)) + (a ^ b ^ c) + tmp04 + const3;
      a = (a << 30) | (a >>> 2);
      c += ((d << 5) | (d >>> 27)) + (e ^ a ^ b) + tmp05 + const3;
      e = (e << 30) | (e >>> 2);
      b += ((c << 5) | (c >>> 27)) + (d ^ e ^ a) + tmp06 + const3;
      d = (d << 30) | (d >>> 2);
      a += ((b << 5) | (b >>> 27)) + (c ^ d ^ e) + tmp07 + const3;
      c = (c << 30) | (c >>> 2);

      this.H_[0] = (this.H_[0] + a) & 0xffffffff;
      this.H_[1] = (this.H_[1] + b) & 0xffffffff;
      this.H_[2] = (this.H_[2] + c) & 0xffffffff;
      this.H_[3] = (this.H_[3] + d) & 0xffffffff;
      this.H_[4] = (this.H_[4] + e) & 0xffffffff;
    },

    fillzero: function (size) {
      var buf = "";
      for (var i = 0; i < size; i++) {
        buf += "\x00";
      }
      return buf;
    },

    main: function (buf, bufSize, update, self, charSize) {
      if (charSize == 1) {
        var totalBitSize = bufSize * 8;
        while (bufSize >= 64) {
          self[update](buf, charSize);
          buf = buf.substr(64);
          bufSize -= 64;
        }
        buf += "\x80";
        if (bufSize >= 56) {
          buf += this.fillzero(63 - bufSize);
          self[update](buf, charSize);
          buf = this.fillzero(56);
        } else {
          buf += this.fillzero(55 - bufSize);
        }
        buf += "\x00\x00\x00\x00"; // in stead of (totalBitSize) >> 32
        buf += String.fromCharCode(totalBitSize >>> 24, (totalBitSize >>> 16) & 0xff, (totalBitSize >>> 8) & 0xff, totalBitSize & 0xff);
        self[update](buf, charSize);
      } else {
        /* charSize == 2 */
        var totalBitSize = bufSize * 16;
        while (bufSize >= 32) {
          self[update](buf, charSize);
          buf = buf.substr(32);
          bufSize -= 32;
        }
        buf += "\x80";
        if (bufSize >= 28) {
          buf += this.fillzero(31 - bufSize);
          self[update](buf, charSize);
          buf = this.fillzero(28);
        } else {
          buf += this.fillzero(27 - bufSize);
        }
        buf += "\x00\x00"; // in stead of (totalBitSize) >> 32
        totalBitSize = this.swap32(totalBitSize);
        buf += String.fromCharCode(totalBitSize & 65535, totalBitSize >>> 16);
        self[update](buf, charSize);
      }
    },

    VERSION: "1.0",
    BY_ASCII: 0,
    BY_UTF16: 1,

    calc_Fx: function (msg, mode) {
      var charSize = (arguments.length == 2 && mode == this.BY_UTF16) ? 2 : 1;
      this.H_ = [0x07452301, 0x0c, 0x07cdab89, 0x1d, 0x00badcfe, 0x13, 0x00325476, 0x02, 0x03d2e1f0, 0x18];
      this.main(msg, msg.length, "update_Fx", this, charSize);
      var ret = "";
      for (var i = 0; i < 5; i++) {
        ret += this.int32toBE((this.H_[2 * i + 1] << 27) + this.H_[2 * i]);
      }
      return ret;
    },
    calc_std: function (msg, mode) {
      var charSize = (arguments.length == 2 && mode == this.BY_UTF16) ? 2 : 1;
      this.H_ = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
      this.main(msg, msg.length, "update_std", this, charSize);
      var ret = "";
      for (var i = 0; i < 5; i++) {
        ret += this.int32toBE(this.H_[i]);
      }
      return ret;
    }
  } // end of SHA1
}; // end of CybozuLabs

new function () {
  CybozuLabs.SHA1.calc = navigator.userAgent.match(/Firefox/) ? CybozuLabs.SHA1.calc_Fx : CybozuLabs.SHA1.calc_std;
};
/*
 A JavaScript implementation of the SHA family of hashes, as
 defined in FIPS PUB 180-4 and FIPS PUB 202, as well as the corresponding
 HMAC implementation as defined in FIPS PUB 198a

 Copyright Brian Turek 2008-2016
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information

 Several functions taken from Paul Johnston
*/
'use strict';
(function (G) {
  function t(e, a, d) {
    var g = 0,
      c = [],
      b = 0,
      f, k, l, h, m, w, n, y, p = !1,
      q = [],
      t = [],
      v, u = !1;
    d = d || {};
    f = d.encoding || "UTF8";
    v = d.numRounds || 1;
    l = z(a, f);
    if (v !== parseInt(v, 10) || 1 > v) throw Error("numRounds must a integer >= 1");
    if ("SHA-1" === e) m = 512, w = A, n = H, h = 160, y = function (a) {
      return a.slice()
    };
    else throw Error("Chosen SHA variant is not supported");
    k = x(e);
    this.setHMACKey = function (a, b, c) {
      var d;
      if (!0 === p) throw Error("HMAC key already set");
      if (!0 === u) throw Error("Cannot set HMAC key after calling update");
      f = (c || {}).encoding || "UTF8";
      b = z(b, f)(a);
      a = b.binLen;
      b = b.value;
      d = m >>> 3;
      c = d / 4 - 1;
      if (d < a / 8) {
        for (b = n(b, a, 0, x(e), h); b.length <= c;) b.push(0);
        b[c] &= 4294967040
      } else if (d > a / 8) {
        for (; b.length <= c;) b.push(0);
        b[c] &= 4294967040
      }
      for (a = 0; a <= c; a += 1) q[a] = b[a] ^ 909522486, t[a] = b[a] ^ 1549556828;
      k = w(q, k);
      g = m;
      p = !0
    };
    this.update = function (a) {
      var d, e, f, h = 0,
        n = m >>> 5;
      d = l(a, c, b);
      a = d.binLen;
      e = d.value;
      d = a >>> 5;
      for (f = 0; f < d; f += n) h + m <= a && (k = w(e.slice(f, f + n), k), h += m);
      g += h;
      c = e.slice(h >>> 5);
      b = a % m;
      u = !0
    };
    this.getHash = function (a, d) {
      var f, l, m, r;
      if (!0 ===
        p) throw Error("Cannot call getHash after setting HMAC key");
      m = B(d);
      switch (a) {
      case "HEX":
        f = function (a) {
          return C(a, h, m)
        };
        break;
      case "B64":
        f = function (a) {
          return D(a, h, m)
        };
        break;
      case "BYTES":
        f = function (a) {
          return E(a, h)
        };
        break;
      case "ARRAYBUFFER":
        try {
          l = new ArrayBuffer(0)
        } catch (I) {
          throw Error("ARRAYBUFFER not supported by this environment");
        }
        f = function (a) {
          return F(a, h)
        };
        break;
      default:
        throw Error("format must be HEX, B64, BYTES, or ARRAYBUFFER");
      }
      r = n(c.slice(), b, g, y(k), h);
      for (l = 1; l < v; l += 1) r = n(r, h, 0, x(e), h);
      return f(r)
    };
    this.getHMAC = function (a, d) {
      var f, l, q, r;
      if (!1 === p) throw Error("Cannot call getHMAC without first setting HMAC key");
      q = B(d);
      switch (a) {
      case "HEX":
        f = function (a) {
          return C(a, h, q)
        };
        break;
      case "B64":
        f = function (a) {
          return D(a, h, q)
        };
        break;
      case "BYTES":
        f = function (a) {
          return E(a, h)
        };
        break;
      case "ARRAYBUFFER":
        try {
          f = new ArrayBuffer(0)
        } catch (I) {
          throw Error("ARRAYBUFFER not supported by this environment");
        }
        f = function (a) {
          return F(a, h)
        };
        break;
      default:
        throw Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER");
      }
      l = n(c.slice(), b, g, y(k), h);
      r = w(t, x(e));
      r = n(l, h, m, r, h);
      return f(r)
    }
  }

  function J(e, a, d) {
    var g = e.length,
      c, b, f, k, l;
    a = a || [0];
    d = d || 0;
    l = d >>> 3;
    if (0 !== g % 2) throw Error("String of HEX type must be in byte increments");
    for (c = 0; c < g; c += 2) {
      b = parseInt(e.substr(c, 2), 16);
      if (isNaN(b)) throw Error("String of HEX type contains invalid characters");
      k = (c >>> 1) + l;
      for (f = k >>> 2; a.length <= f;) a.push(0);
      a[f] |= b << 8 * (3 - k % 4)
    }
    return {
      value: a,
      binLen: 4 * g + d
    }
  }

  function K(e, a, d) {
    var g = [],
      c, b, f, k, g = a || [0];
    d = d || 0;
    b = d >>> 3;
    for (c = 0; c < e.length; c +=
      1) a = e.charCodeAt(c), k = c + b, f = k >>> 2, g.length <= f && g.push(0), g[f] |= a << 8 * (3 - k % 4);
    return {
      value: g,
      binLen: 8 * e.length + d
    }
  }

  function L(e, a, d) {
    var g = [],
      c = 0,
      b, f, k, l, h, m, g = a || [0];
    d = d || 0;
    a = d >>> 3;
    if (-1 === e.search(/^[a-zA-Z0-9=+\/]+$/)) throw Error("Invalid character in base-64 string");
    f = e.indexOf("=");
    e = e.replace(/\=/g, "");
    if (-1 !== f && f < e.length) throw Error("Invalid '=' found in base-64 string");
    for (f = 0; f < e.length; f += 4) {
      h = e.substr(f, 4);
      for (k = l = 0; k < h.length; k += 1) b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(h[k]),
        l |= b << 18 - 6 * k;
      for (k = 0; k < h.length - 1; k += 1) {
        m = c + a;
        for (b = m >>> 2; g.length <= b;) g.push(0);
        g[b] |= (l >>> 16 - 8 * k & 255) << 8 * (3 - m % 4);
        c += 1
      }
    }
    return {
      value: g,
      binLen: 8 * c + d
    }
  }

  function M(e, a, d) {
    var g = [],
      c, b, f, g = a || [0];
    d = d || 0;
    c = d >>> 3;
    for (a = 0; a < e.byteLength; a += 1) f = a + c, b = f >>> 2, g.length <= b && g.push(0), g[b] |= e[a] << 8 * (3 - f % 4);
    return {
      value: g,
      binLen: 8 * e.byteLength + d
    }
  }

  function C(e, a, d) {
    var g = "";
    a /= 8;
    var c, b;
    for (c = 0; c < a; c += 1) b = e[c >>> 2] >>> 8 * (3 - c % 4), g += "0123456789abcdef".charAt(b >>> 4 & 15) + "0123456789abcdef".charAt(b & 15);
    return d.outputUpper ?
      g.toUpperCase() : g
  }

  function D(e, a, d) {
    var g = "",
      c = a / 8,
      b, f, k;
    for (b = 0; b < c; b += 3)
      for (f = b + 1 < c ? e[b + 1 >>> 2] : 0, k = b + 2 < c ? e[b + 2 >>> 2] : 0, k = (e[b >>> 2] >>> 8 * (3 - b % 4) & 255) << 16 | (f >>> 8 * (3 - (b + 1) % 4) & 255) << 8 | k >>> 8 * (3 - (b + 2) % 4) & 255, f = 0; 4 > f; f += 1) 8 * b + 6 * f <= a ? g += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(k >>> 6 * (3 - f) & 63) : g += d.b64Pad;
    return g
  }

  function E(e, a) {
    var d = "",
      g = a / 8,
      c, b;
    for (c = 0; c < g; c += 1) b = e[c >>> 2] >>> 8 * (3 - c % 4) & 255, d += String.fromCharCode(b);
    return d
  }

  function F(e, a) {
    var d = a / 8,
      g, c = new ArrayBuffer(d);
    for (g = 0; g < d; g += 1) c[g] = e[g >>> 2] >>> 8 * (3 - g % 4) & 255;
    return c
  }

  function B(e) {
    var a = {
      outputUpper: !1,
      b64Pad: "=",
      shakeLen: -1
    };
    e = e || {};
    a.outputUpper = e.outputUpper || !1;
    !0 === e.hasOwnProperty("b64Pad") && (a.b64Pad = e.b64Pad);
    if ("boolean" !== typeof a.outputUpper) throw Error("Invalid outputUpper formatting option");
    if ("string" !== typeof a.b64Pad) throw Error("Invalid b64Pad formatting option");
    return a
  }

  function z(e, a) {
    var d;
    switch (a) {
    case "UTF8":
    case "UTF16BE":
    case "UTF16LE":
      break;
    default:
      throw Error("encoding must be UTF8, UTF16BE, or UTF16LE");
    }
    switch (e) {
    case "HEX":
      d = J;
      break;
    case "TEXT":
      d = function (d, c, b) {
        var f = [],
          e = [],
          l = 0,
          h, m, q, n, p, f = c || [0];
        c = b || 0;
        q = c >>> 3;
        if ("UTF8" === a)
          for (h = 0; h < d.length; h += 1)
            for (b = d.charCodeAt(h), e = [], 128 > b ? e.push(b) : 2048 > b ? (e.push(192 | b >>> 6), e.push(128 | b & 63)) : 55296 > b || 57344 <= b ? e.push(224 | b >>> 12, 128 | b >>> 6 & 63, 128 | b & 63) : (h += 1, b = 65536 + ((b & 1023) << 10 | d.charCodeAt(h) & 1023), e.push(240 | b >>> 18, 128 | b >>> 12 & 63, 128 | b >>> 6 & 63, 128 | b & 63)), m = 0; m < e.length; m += 1) {
              p = l + q;
              for (n = p >>> 2; f.length <= n;) f.push(0);
              f[n] |= e[m] << 8 * (3 - p % 4);
              l += 1
            } else if ("UTF16BE" ===
              a || "UTF16LE" === a)
              for (h = 0; h < d.length; h += 1) {
                b = d.charCodeAt(h);
                "UTF16LE" === a && (m = b & 255, b = m << 8 | b >>> 8);
                p = l + q;
                for (n = p >>> 2; f.length <= n;) f.push(0);
                f[n] |= b << 8 * (2 - p % 4);
                l += 2
              }
            return {
              value: f,
              binLen: 8 * l + c
            }
      };
      break;
    case "B64":
      d = L;
      break;
    case "BYTES":
      d = K;
      break;
    case "ARRAYBUFFER":
      try {
        d = new ArrayBuffer(0)
      } catch (g) {
        throw Error("ARRAYBUFFER not supported by this environment");
      }
      d = M;
      break;
    default:
      throw Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER");
    }
    return d
  }

  function p(e, a) {
    return e << a | e >>> 32 - a
  }

  function q(e,
    a) {
    var d = (e & 65535) + (a & 65535);
    return ((e >>> 16) + (a >>> 16) + (d >>> 16) & 65535) << 16 | d & 65535
  }

  function u(e, a, d, g, c) {
    var b = (e & 65535) + (a & 65535) + (d & 65535) + (g & 65535) + (c & 65535);
    return ((e >>> 16) + (a >>> 16) + (d >>> 16) + (g >>> 16) + (c >>> 16) + (b >>> 16) & 65535) << 16 | b & 65535
  }

  function x(e) {
    var a = [];
    if ("SHA-1" === e) a = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
    else throw Error("No SHA variants supported");
    return a
  }

  function A(e, a) {
    var d = [],
      g, c, b, f, k, l, h;
    g = a[0];
    c = a[1];
    b = a[2];
    f = a[3];
    k = a[4];
    for (h = 0; 80 > h; h += 1) d[h] = 16 > h ? e[h] : p(d[h -
      3] ^ d[h - 8] ^ d[h - 14] ^ d[h - 16], 1), l = 20 > h ? u(p(g, 5), c & b ^ ~c & f, k, 1518500249, d[h]) : 40 > h ? u(p(g, 5), c ^ b ^ f, k, 1859775393, d[h]) : 60 > h ? u(p(g, 5), c & b ^ c & f ^ b & f, k, 2400959708, d[h]) : u(p(g, 5), c ^ b ^ f, k, 3395469782, d[h]), k = f, f = b, b = p(c, 30), c = g, g = l;
    a[0] = q(g, a[0]);
    a[1] = q(c, a[1]);
    a[2] = q(b, a[2]);
    a[3] = q(f, a[3]);
    a[4] = q(k, a[4]);
    return a
  }

  function H(e, a, d, g) {
    var c;
    for (c = (a + 65 >>> 9 << 4) + 15; e.length <= c;) e.push(0);
    e[a >>> 5] |= 128 << 24 - a % 32;
    a += d;
    e[c] = a & 4294967295;
    e[c - 1] = a / 4294967296 | 0;
    a = e.length;
    for (c = 0; c < a; c += 16) g = A(e.slice(c, c + 16), g);
    return g
  }
  "function" === typeof define && define.amd ? define(function () {
    return t
  }) : "undefined" !== typeof exports ? ("undefined" !== typeof module && module.exports && (module.exports = t), exports = t) : G.jsSHA = t
})(this);

const path = require("path");

const videos = [
  "WEBM",
  "OGG",
  "MPG",
  "MP2",
  "MPEG",
  "MPE",
  "MPV",
  "MP4",
  "M4P",
  "M4V",
];

const pictures = [
  "ASE",
  "ART",
  "BMP",
  "BLP",
  "CD5",
  "CIT",
  "CPT",
  "CR2",
  "CUT",
  "DDS",
  "DIB",
  "DJVU",
  "EGT",
  "EXIF",
  "GPL",
  "GRF",
  "ICNS",
  "ICO",
  "IFF",
  "JNG",
  "JPEG",
  "JPG",
  "JFIF",
  "JP2",
  "JPS",
  "LBM",
  "MAX",
  "MIFF",
  "MNG",
  "MSP",
  "NITF",
  "OTA",
  "PBM",
  "PC1",
  "PC2",
  "PC3",
  "PCF",
  "PCX",
  "PDN",
  "PGM",
  "PI1",
  "PI2",
  "PI3",
  "PICT",
  "PCT",
  "PNM",
  "PNS",
  "PPM",
  "PSB",
  "PSD",
  "PDD",
  "PSP",
  "PX",
  "PXM",
  "PXR",
  "QFX",
  "RAW",
  "RLE",
  "SCT",
  "SGI",
  "RGB",
  "INT",
  "BW",
  "TGA",
  "TIFF",
  "TIF",
  "VTF",
  "XBM",
  "XCF",
  "XPM",
  "3DV",
  "AMF",
  "AI",
  "AWG",
  "CGM",
  "CDR",
  "CMX",
  "DXF",
  "E2D",
  "EGT",
  "EPS",
  "FS",
  "GBR",
  "ODG",
  "SVG",
  "STL",
  "VRML",
  "X3D",
  "SXD",
  "V2D",
  "VND",
  "WMF",
  "EMF",
  "ART",
  "XAR",
  "PNG",
  "WEBP",
  "JXR",
  "HDP",
  "WDP",
  "CUR",
  "ECW",
  "IFF",
  "LBM",
  "LIFF",
  "NRRD",
  "PAM",
  "PCX",
  "PGF",
  "SGI",
  "RGB",
  "RGBA",
  "BW",
  "INT",
  "INTA",
  "SID",
  "RAS",
  "SUN",
  "TGA",
];

const gifs = ["GIF"];

function getExtension(file) {
  return (
    path
      .extname(file)
      // remove the .
      .slice(1)
      .toLocaleUpperCase()
  );
}

function isPicture(extension) {
  return pictures.includes(extension);
}

function isVideo(extension) {
  return videos.includes(extension);
}

function isGif(extension) {
  return gifs.includes(extension);
}

const MEDIA_TYPE = {
  UNKNOWN: 0,
  PICTURE: 1,
  GIF: 2,
  VIDEO: 3,
};

function getMediaType(file) {
  const extension = getExtension(file);

  if (isPicture(extension)) {
    return MEDIA_TYPE.PICTURE;
  }
  if (isVideo(extension)) {
    return MEDIA_TYPE.VIDEO;
  }
  if (isGif(extension)) {
    return MEDIA_TYPE.GIF;
  }

  throw new Error(`Unsupported media type: ${file}`);
}

module.exports = {
  MEDIA_TYPE,
  getMediaType,
};

import { getConfiguration } from "../lib/configuration.js";

export interface PhotoExif {
  camera?: string;
  lens?: string;
  aperture?: string;
  shutter?: string;
  iso?: string;
  focal?: string;
}

let photosExif: { [id: string]: PhotoExif };

export async function loadPhotosExif(): Promise<{ [id: string]: PhotoExif }> {
  if (photosExif) return photosExif;
  const base = getConfiguration("path")["data"];
  photosExif = await fetch(`${base}/photos-exif.json`)
    .then((res) => res.json())
    .catch(() => ({}));
  return photosExif;
}

let photosIndex: any;

export function loadPhotosIndex() {
  photosIndex = {
    Default: {
      DSC06584: "DSC06584.JPG",
      DSC06667: "DSC06667.JPG",
      DSC06691: "DSC06691.JPG",
      DSC06748: "DSC06748.JPG",
      DSC06801: "DSC06801.JPG",
      DSC06840: "DSC06840.JPG",
      DSC06895: "DSC06895.JPG",
      DSC06937: "DSC06937.JPG",
      DSC07029: "DSC07029.JPG",
      DSC07214: "DSC07214.JPG",
      DSC07235: "DSC07235.JPG",
      DSC07252: "DSC07252.JPG",
      DSC07387: "DSC07387.JPG",
      DSC07427: "DSC07427.JPG",
      DSC07454: "DSC07454.JPG",
      DSC07473: "DSC07473.JPG",
      DSC07620: "DSC07620.JPG",
      DSC07651: "DSC07651.JPG",
      DSC07680: "DSC07680.JPG",
      DSC07752: "DSC07752.JPG",
      DSC07826: "DSC07826.JPG",
      DSC07827: "DSC07827.JPG",
      DSC07921: "DSC07921.JPG",
      DSC07966: "DSC07966.JPG",
      DSC07985: "DSC07985.JPG",
      DSC08283: "DSC08283.JPG",
      DSC08311: "DSC08311.JPG",
      DSC08323: "DSC08323.JPG",
      DSC08392: "DSC08392.JPG",
      DSC08668: "DSC08668.JPG",
      DSC08768: "DSC08768.JPG",
      DSC08808: "DSC08808.JPG",
      DSC08858: "DSC08858.JPG",
      DSC08889: "DSC08889.JPG",
      DSC08954: "DSC08954.JPG",
      DSC08987: "DSC08987.JPG"
    }
  };

  return photosIndex;
}

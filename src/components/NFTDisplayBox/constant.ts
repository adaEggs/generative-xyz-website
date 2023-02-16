// ("application/json", Media::Text, &["json"]),
// ("application/pdf", Media::Pdf, &["pdf"]),
// ("application/pgp-signature", Media::Text, &["asc"]),
// ("application/yaml", Media::Text, &["yaml", "yml"]),
// ("audio/flac", Media::Audio, &["flac"]),
// ("audio/mpeg", Media::Audio, &["mp3"]),
// ("audio/wav", Media::Audio, &["wav"]),
// ("image/apng", Media::Image, &["apng"]),
// ("image/avif", Media::Image, &[]),
// ("image/gif", Media::Image, &["gif"]),
// ("image/jpeg", Media::Image, &["jpg", "jpeg"]),
// ("image/png", Media::Image, &["png"]),
// ("image/svg+xml", Media::Iframe, &["svg"]),
// ("image/webp", Media::Image, &["webp"]),
// ("model/gltf-binary", Media::Unknown, &["glb"]),
// ("model/stl", Media::Unknown, &["stl"]),
// ("text/html;charset=utf-8", Media::Iframe, &["html"]),
// ("text/plain;charset=utf-8", Media::Text, &["txt"]),
// ("video/mp4", Media::Video, &["mp4"]),
// ("video/webm", Media::Video, &["webm"]),

type IMAGE_TYPE =
  | 'application/json' // iframe
  | 'application/pdf' // iframe
  | 'application/pgp-signature' // iframe
  | 'application/yaml' // iframe
  | 'audio/flac' // iframe
  | 'model/gltf-binary' // iframe
  | 'model/stl' // iframe
  | 'text/html;charset=utf-8' // iframe
  | 'text/plain;charset=utf-8' // iframe
  | 'audio/mpeg' // https://www.w3schools.com/html/html5_audio.asp
  | 'audio/wav' // https://www.w3schools.com/html/html5_audio.asp
  | 'image/apng' // Image
  | 'image/avif' // Image
  | 'image/gif' // Image
  | 'image/jpeg' // Image
  | 'image/png' // Image
  | 'image/svg+xml' // Image
  | 'image/webp' // Image
  | 'video/mp4' // https://www.w3schools.com/html/html5_video.asp
  | 'video/webm'; // https://www.w3schools.com/html/html5_video.asp

export type { IMAGE_TYPE };

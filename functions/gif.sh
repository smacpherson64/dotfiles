function gif() {
  mov="$1"
  gif="${2-${1%%.*}}.gif"
  size="${3-700}"

  palette="/tmp/palette.png"
  filters="fps=15,scale=$size:-1:flags=lanczos"

  ffmpeg -v warning -i "$mov" -vf "$filters,palettegen" -y $palette
  ffmpeg -v warning -i "$mov" -i $palette -lavfi "$filters [x]; [x][1:v] paletteuse" -y "$gif"
}


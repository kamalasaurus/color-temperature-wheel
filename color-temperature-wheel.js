void function() {

  /**
   * from https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
   * Converts an HSL color value to RGB. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes h, s, and l are contained in the set [0, 1] and
   * returns r, g, and b in the set [0, 255].
   *
   * @param   {number}  h       The hue
   * @param   {number}  s       The saturation
   * @param   {number}  l       The lightness
   * @return  {Array}           The RGB representation
   */
  function hslToRgb(h, s, l){
    var r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      var hue2rgb = function hue2rgb(p, q, t){
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  function create(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
  }

  function toHex(color) {
    return '#' + color
      .map(c => {
        const col = c.toString(16);
        return col.length === 1 ?
          '0' + col :
          col;
      })
      .join('');
  }

  const length = 4096;
  const getFraction = (e, i) => i / length;

  const colorArray = Array
    .from({length}, getFraction)
    .map((hue) => {
      return hslToRgb(hue, 1, 0.5);
    });

  const renderCircle = () => {
    const size = 700;

    const rOuter = size / 2;
    const rInner = size / 3;

    const svg = create('svg');
      svg.setAttribute('width', size);
      svg.setAttribute('height', size);
      svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
      svg.style.display = 'inline-block';
      svg.style.margin = '20px';

    const g = create('g');
      g.setAttribute('transform', `translate(${size/2}, ${size/2})`);

    with (Math) {
      colorArray.forEach((color, i) => {
        const startAngle = getFraction('', i) * 2 * PI;
        const endAngle = getFraction('', i + 1) * 2 * PI;

        const path = create('path');
          path.setAttribute('d', `
            M${rInner * cos(startAngle)},${rInner * sin(startAngle)}
            L${rOuter * cos(startAngle)},${rOuter * sin(startAngle)}
            A${rOuter},${rOuter} 0 0,1 ${rOuter * cos(endAngle)},${rOuter * sin(endAngle)}
            L${rInner * cos(endAngle)}, ${rInner * sin(endAngle)}
            A${rInner},${rInner} 0 0,1 ${rInner * cos(startAngle)},${rInner * sin(startAngle)}
            Z
          `);

        path.setAttribute('fill', toHex(color));

        g.appendChild(path);
      });
    }

    svg.appendChild(g);
    document.body.appendChild(svg);
  };

  const renderSquare = () => {

    const container = document.createElement('div');
      container.style.width = '704px';
      container.style.margin = '20px';

    with (Math) {
      colorArray.forEach((color) => {
        const swatch = document.createElement('div');
          swatch.style.display = 'inline-block';
          swatch.style.width = '10px';
          swatch.style.height = '10px';
          swatch.style.margin = '1px';
          swatch.style.backgroundColor = toHex(color);

        container.appendChild(swatch);
      });
    }

    document.body.appendChild(container);
  }

  renderCircle();
  renderSquare();

  window.getColorArray = () => {
    return JSON.stringify(colorArray);
  };

}();


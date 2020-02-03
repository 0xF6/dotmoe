var glVertexShaderText = document.getElementById("webgl-vshader").textContent;
var fragmentShaderText = document.getElementById("fshader").textContent;

/** webGL */
(function() {
  var canvas, gl;
  var shaderProgram;
  var positionLocation;
  var buffer;
  var vertices;
  var ut, st;
  var uTime;

  var start = function() {
    canvas = document.createElement("canvas");
    canvas.style.display = "block";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";

    var wrapper = document.getElementById("web-gl-wrapper");
    wrapper.appendChild(canvas);

    initGL(canvas);
    initShader();
    initBuffers();

    requestAnimationFrame(drawScene);
  };

  function initGL(canvas) {
    try {
      gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;
    } catch (e) {}
  }

  function initShader() {
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderText);
    gl.compileShader(fragmentShader);

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, glVertexShaderText);
    gl.compileShader(vertexShader);

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.log("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    positionLocation = gl.getAttribLocation(shaderProgram, "a_position");

    ut = gl.getUniformLocation(shaderProgram, "uTime");
    st = Date.now();

    var resolution = new Float32Array([canvas.width, canvas.height]);
    gl.uniform2fv(
      gl.getUniformLocation(shaderProgram, "uResolution"),
      resolution
    );
  }

  function initBuffers() {
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    vertices = [
      -1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    buffer.itemSize = 2;
    buffer.numItem = 6;
  }

  function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(
      positionLocation,
      buffer.itemSize,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.uniform1f(ut, (Date.now() - st) / 1000);

    // draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(drawScene);
  }

  start();
})();

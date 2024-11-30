const frag = `

// WebGL 1.0 / GLSL ES 1.00 compatible shader

precision mediump float; // Default precision for float variables

#define SEGMENTS 32.0 // Number of segments for the kaleidoscope
#define PI 3.141592653589 // Pi constant

uniform float u_time;       // When changing variable names, remember to also change the names on the right sidebar on KodeLife
uniform vec2 u_resolution; // Screen resolution
uniform vec2 u_mouse;      // Mouse position
uniform sampler2D image;   // Input texture

// varying is used for interpolated data passed from the vertex shader to the fragment shader
varying vec2 v_texcoord; 

// It's actually the following void main function that runs for each pixel.
// The uniforms and everything else are just pieces of code passed on to GLSL by external resources
// such as KodeLife (in this case) or JavaScript.
void main() {
    vec2 uv = v_texcoord; // Get the interpolated texture coordinates
    uv *= 2.0; // Scale UV coordinates to [-1.0, 1.0]
    uv -= 1.0; // Center the UV coordinates around the origin

    // make mouse
    vec2 mouse = u_mouse / u_resolution;

    // Get angle and radius
    float radius = length(uv) * mix(1.0, 2.0, mouse.x); // Distance from the center (magnitude of UV vector)
    float angle = atan(uv.y, uv.x); 
    // atan is the opposite of tan and calculates the angle of the vector from the origin

    // After we get the angle and radius from the atan function, we basically mess around 
    // with the angle to create the kaleidoscope effect.

    // Get a segment
    angle /= PI * 2.0; // Normalize the angle to [0, 1]
    angle *= SEGMENTS; // Increase this number to increase the repetitions of the "shapes", or segments

    // Repeat segment
    if (mod(angle, 2.0) >= 1.0) {
        angle = fract(angle); // Keep the fractional part of the angle
    } else {
        angle = 1.0 - fract(angle); // Flip the fractional part to achieve symmetry
    }
    angle += u_time * 0.1; // Rotate the segments over time for animation
    angle += mouse.y;

    // Unsquash segment
    angle /= SEGMENTS; // Normalize the angle to [0, 1] for the segments
    angle *= PI * 2.0; // Convert the normalized angle back to radians

    // Convert back to Cartesian coordinates
    vec2 point = vec2(radius * cos(angle), radius * sin(angle)); 
    // Point is in circular repetition space
    point *= vec2(1.0, 1000.0 / 1500.0);
    point = fract(point); // Cause repetition by keeping the fractional part

    // Sample the texture at the calculated point
    vec4 color = texture2D(image, point); 
    // The second parameter determines where to sample in the texture image

    // Output the final color for this pixel
    gl_FragColor = color; 
}


`;

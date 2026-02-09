### Specification for AI agent: Scene setup

#### Scene setup
In the main entry point `main.js` implement the following:
- Create a new `THREE.Scene()`.

#### Lighting
In the main entry point `main.js` implement the following:
- Add an `AmbientLight` to the scene to provide base illumination with `1.5` intensity.
- Add a `DirectionalLight` to the scene to create shadows and depth with `1.5` intensity and positioned at `(-100, -100, 200)`.

#### Player
In the `components` directory, add the `Player.js` file with the following implementation:
- The player should be represented by a `THREE.Group`.
- Load a 3D model for the player: `tode.glb` from `public/models/`.
- Add the model as a child of the `THREE.Group`.
- Positioning:
  - Place the group in the center of the scene.
  - Calculate Z offset to position the model above the ground based on the height of the model.
  - Add model rotation: `model.rotation.x = Math.PI / 2;`
- Scale model with scalar `20`

Add player to the main entry point `main.js`.

#### Camera
In the `components` directory, add the `Camera.js` file with the following implementation:
- Perspective camera with field of view `30` degrees and camera's far plane set to `9000`.
- Set initial camera position to `(300, -300, 300)` and set `camera.up` to `(0, 0, 1)`.
- Make the camera look at the origin `(0, 0, 0)`.

In the main entry point `main.js`:
- Add the camera as a child of the player group: `player.add(camera)`.

#### Renderer
In the `components` directory, add the `Renderer.js` file with the following implementation:
- Initialize `THREE.WebGLRenderer`.
- Use `canvas.game` in `index.html` as the rendering canvas.
- Use `alpha: true` and `antialias: true`
- Set the renderer size to match the window dimensions.

Add renderer to the main entry point `main.js`. 

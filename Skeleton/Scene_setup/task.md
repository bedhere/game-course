> TODO: Experiment with prompts, figure out what works best and suggest to the user. Below are the main things which are worth the user's attention and can be explained in more detail in extra materials.

* Scene (`THREE.Scene()`) — everything will be placed on a scene
* Player model in the center — to verify that everything below works
* AmbientLight — fills the scene
* DirectionalLight — shows shadows, makes objects truly three-dimensional
* Camera -- `OrthographicCamera` vs `PerspectiveCamera`
* Renderer — takes the scene + camera and converts all 3D data into pixels that appear in the browser window

- Models may load rotated (for example, lying on their side), so you might need to fix it manually after loading, 
 e.g. frog.rotation.x = Math.PI / 2 (or another angle/axis). This base rotation also affects jumping and “face movement” 
 rotation, so you may need to tweak the rotation axis (where to put 1 vs 0) and angle offsets for your specific model until it looks correct.

You should get something like this:

> Image of the result visible in the browser
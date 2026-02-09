An empty map looks a little boring, don't you think? Let's add some objects to it to make the environment more interesting and running away from enemies a little more difficult.

We’ve prepared the agent prompt with technical details on how to generate the map, place obstacles, and handle collisions.

Here is what we’ll be focusing on:

### Map background
Start by creating a simple but readable ground. Add a checkerboard floor made from a grid of tiles, where the colors alternate between Dark Green `#228B22` and Light Green `#90EE90`. This gives you instant "game space" and makes movement easier to read.

### Obstacles
Next, let’s make the environment more interesting by placing obstacles. Add a `House.js` file and use the `small_house.glb` model, then place three houses into random positions on the map.

To make them sit correctly in our coordinate system, rotate each house by `Math.PI / 2` around X, and give each one a random rotation around Y that is always a multiple of `Math.PI / 2`. Houses should stand exactly on the ground level (Z = 0). Use the model’s bounding box to calculate the correct offset so the house isn’t floating or sinking.

Finally, these houses should behave like real obstacles. Implement collision detection so the player and enemies can’t walk through them.

### Integration
Once your map and houses are ready, connect everything in `main.js`. Initialize the map and add it to the scene, then load the houses and add them into the map group so the whole world stays neatly organized.

### Customize it your way
Once the basic world is working, feel free to make it more "yours". You can add different obstacles besides houses, like trees or extra buildings. You can also switch up the map background with grass, green tiles, or a blue-sky style look.

You can download other free models from places like [poly.pizza](https://poly.pizza/) or [Sketchfab](https://sketchfab.com/), generate your own with AI tools like Nano Banana, or even build them yourself in Blender. Most models you download will come in very different sizes, so don’t worry if something looks huge or tiny at first. Use the model’s `scale` when you load it and tweak it manually until it fits your scene and feels right next to your player and other objects.

Any new model can be added the same way as the houses: load it, set its scale and rotation, place it on the ground using its bounding box, and make sure it blocks movement with the same collision rules.

### Putting it all together
Use the specification from the `spec.md` file to build the game world. It will add a tiled map background, generate three house obstacles with the correct rotations and ground placement, and integrate everything in `main.js` so the map and houses appear in the scene and behave like solid obstacles.

Try changing the code manually or ask Junie to better understand what customization options you have. You should get something like this:
![](images/game_world.gif)
> `small_house.glb` — Small House by Jarlan Perez [CC-BY](https://creativecommons.org/licenses/by/3.0/) via [Poly Pizza](https://poly.pizza/m/053kskrV4U_).


### Specification for AI agent: Adding enemies

Implement basic enemy spawning and behavior.

#### Enemy model
In the `components` directory, add the `Enemy.js` file with the following implementation:
- Load the enemy model `enemy.glb` from `public/models/`.
- Positioning:
    - Calculate Z offset to position the model above the ground based on the height of the model.
    - Add model rotation: `model.rotation.x = Math.PI / 2;`
- Scale model with scalar `5`

#### Spawning logic
- Define spawn points at the four corners of the scene/map.
- Automatically spawn enemies periodically or at the start. Save spawning delay in constant.
- Add spawned enemies to the `THREE.Scene`.

#### Enemy behavior
- In the animation loop, update each enemy's position to move toward the player's current position.
- Rotate enemies to face the player while moving (update enemy rotation each frame based on the direction vector in the XY plane)
- Save enemy's moving speed in constant.
- Enemies can overlap each other and the player at this stage.

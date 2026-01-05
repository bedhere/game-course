### Specification for AI agent: Adding enemies

Implement basic enemy spawning and behavior.

#### Enemy Model
In the `components` directory, add the `Enemy.js` file with the following implementation:
- Load the enemy model `enemy.glb` from `public/models/`.
- Positioning:
    - Calculate Z offset to position the model above the ground based on the height of the model.
    - Add model rotation: `model.rotation.x = Math.PI / 2;`
- Scale model with scalar `5`

#### 2. Spawning Logic
- Define spawn points at the four corners of the scene/map.
- Automatically spawn enemies periodically or at the start. Save spawning delay in constant.
- Add spawned enemies to the `THREE.Scene`.

#### 3. Enemy Behavior
- In the animation loop, update each enemy's position to move toward the player's current position.
- Enemies can overlap each other and the player at this stage.

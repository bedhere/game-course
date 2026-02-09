### Specification for AI agent: Attack system

Implement a player attack mechanism.

#### Attack trigger
- Add a listener for the Space key to trigger an attack.
- Implement a cooldown between attacks, set in in a constant, initialize with 1 second default value.

#### Visual feedback
- Visualize the attack using a small yellow circle (`THREE.CircleGeometry` with `MeshBasicMaterial`) around the player.
- The circle should appear briefly and then disappear or fade out.

#### Combat logic
- Detect collisions between the attack area and enemies.
- If an enemy is within the attack radius, remove it from the scene and the tracking array.
- Set the attack radius to a constant.

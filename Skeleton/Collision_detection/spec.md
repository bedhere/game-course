### Specification for AI agent: Collision detection

Implement collision detection to prevent overlapping.

#### Object shapes
- Use a 3D model's shape to determine boundaries of the object.
- Do not use raw bounding boxes since they are not accurate and bigger than the actual shape.

#### Collision rules
- Enemy vs. Enemy: Enemies should not overlap. The enemy can only move in such a way that it does not collide with other enemies. 
- Enemy vs. Player: Enemy should not overlap with player. Player should move only if there is no collision.
- Provide a separate constant that allows control of the distance that determines the occurrence of a collision.

#### Integration
- Perform collision checks during the position update phase in the animation loop.
- Update positions only if the new position will not cause collisions.

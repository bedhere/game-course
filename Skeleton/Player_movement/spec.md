### Specification for AI agent: Player movement

Implement player movement with a jump animation controlled by keyboard input.

#### Input Collection
- Use `addEventListener` to listen for keyboard events: arrows keys.
- Maintain a queue to store pending inputs.

#### Movement State & Logic
- Track the current movement state: direction, progress (0 to 1), and completion status.
- Implement jump logic using `Math.sin(progress * Math.PI)` to adjust the player's height (Z axis).
- Update player position and rotation based on the current move.
- Store movement speed, jump height and jump distance in a constant.

#### Animation Loop Integration
- Inside `setAnimationLoop`:
    - Process input queue.
    - Update movement progress and object transformation.
    - Handle re-rendering.

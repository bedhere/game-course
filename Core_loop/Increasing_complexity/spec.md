### Specification for AI agent: Increasing complexity

Implement dynamic difficulty scaling based on the player's current score.

#### Difficulty scaling parameters
As the score increases, adjust the following parameters:
- Enemy spawn delay: Decrease the delay between enemy spawns (enemies appear more often).
- Enemy movement speed: Increase enemy speed.
- Player movement speed: Slightly increase the player's speed.
- Player attack delay: Decrease the time between player attacks.
- Player attack distance: Slightly increase the attack range.

#### Scaling logic
- Calculate a difficulty factor based on the complexity growth speed factor stored in a constant.
- Change the complexity parameters linearly proportional to a growth difficulty factor
- Ensure enemy parameters scale slightly faster than player parameters to maintain a challenge.

#### Animation loop integration
- Recalculate these parameters in each frame of the animation loop using the current score.
- Apply the updated speeds and delays to the respective game systems.

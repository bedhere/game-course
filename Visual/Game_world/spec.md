### Specification for AI agent: Game world

#### Map background
In the `components` directory, add the `Map.js` file with the following implementation:
- Create a checkerboard floor background using a grid of tiles:
- Colors: Alternate between Dark Green (`#228B22`) and Light Green (`#90EE90`).

#### Obstacles
- In the `components` directory, add the `House.js` file
- Use `small_house.glb` model from `/models/` with scale `65`.
- Add 3 houses to the map into random positions.
- All houses should be rotated `Math.PI / 2` around X to align with the Z-up coordinate system.
- Houses should have random rotation around Y  at an angle that is a multiple of `Math.PI / 2`
- Implement logic to ensure houses are placed exactly on the ground level (Z = 0) by calculating their bounding box.
- Implement collision detection between:
  - houses and entities
  - houses and player
- Enemies or player should not be able to walk through the houses.

#### Integration
In the main entry point `main.js`:
- Initialize the map and add it to the scene.
- Load the houses and add them to the map group.

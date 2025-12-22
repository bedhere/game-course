// Base scoring values
export const SCORE_PER_SECOND = 1;
export const SCORE_PER_KILL = 10;

// Difficulty is normalized so that around this score
// the game reaches its peak intensity
export const DIFFICULTY_SCORE_PEAK = 200;

// Player movement speed (map units per second)
export const BASE_PLAYER_MOVEMENT_SPEED = 10;
export const MAX_PLAYER_MOVEMENT_SPEED = 20;

// Enemy movement speed (map units per second)
export const BASE_ENEMY_MOVEMENT_SPEED = 10;
export const MAX_ENEMY_MOVEMENT_SPEED = 30;

// Enemy spawn delay (seconds between spawns)
export const BASE_ENEMY_SPAWN_DELAY = 7;   // initial delay at the start
export const MIN_ENEMY_SPAWN_DELAY = 1.5;  // minimum delay at high score

// Player attack parameters
export const BASE_ATTACK_DISTANCE = 50;
export const MAX_ATTACK_DISTANCE = 90;

// Player attack cooldown (seconds between attacks)
export const BASE_ATTACK_DELAY = 0.9;   // initial delay at the start
export const MIN_ATTACK_DELAY = 0.3;    // minimum delay at high score

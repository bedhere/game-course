Finally, to keep the game interesting, we need to support increasing difficulty. The following are responsible for the game's difficulty:

* `EnemySpawnDelay` -- Enemies should appear more often
* `EnemyMovementSpeed` -- Enemies should move faster
* `PlayerMovementSpeed` -- The hero should also move a little faster.
* `PlayerAttackDelay` -- The hero's attack speed should increase slightly.
* `PlayerAttackDistance` -- The hero's attack range should also be slightly increased.
* Add automatic update of these parameters when the number of points increases

Please note that the complexity and interest of the game largely depend on the ratio of these parameters. The hero should not just be able to cope with enemies. Therefore, the speed and number of enemies should increase slightly faster than the speed and attack parameters of the hero.

Try changing this dependency and select the ideal ratio. You should get something like this:

![](images/speed.gif)

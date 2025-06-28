## Movement Detection
### Mark as not moving
execute as @a at @s positioned ~~10000~ if entity @e[type=leash_knot,r=0.1252] run scoreboard players set @s is_moving 0
### Mark as moving
execute as @a at @s positioned ~~10000~ unless entity @e[type=leash_knot, r=0.1252] run scoreboard players add @s is_moving 1

## Update Point
### Delete previous point
execute as @e[type=leash_knot] at @s unless entity @s[y=-80, dy=9974] run kill @s
### Mark current point
execute at @a positioned ~~10000~ run summon leash_knot ~~~
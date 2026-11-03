extends CharacterBody3D

@export var speed := 4.5
@export var acceleration := 18.0

func _physics_process(delta: float) -> void:
    var input_vector := Input.get_vector("move_left", "move_right", "move_forward", "move_back")
    var direction := Vector3(input_vector.x, 0.0, input_vector.y)

    if direction.length() > 1.0:
        direction = direction.normalized()

    var target := direction * speed
    velocity.x = move_toward(velocity.x, target.x, acceleration * delta)
    velocity.z = move_toward(velocity.z, target.z, acceleration * delta)
    velocity.y = 0.0
    move_and_slide()

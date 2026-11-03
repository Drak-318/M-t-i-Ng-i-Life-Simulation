extends CharacterBody3D

## Nguyễn Minh — nhân vật người chơi.
## Vertical slice: đi bộ, trọng lực, quay hướng và camera theo sau.

@export var speed := 4.5
@export var acceleration := 18.0
@export var gravity := 18.0

var _visual: MeshInstance3D
var _collision: CollisionShape3D

func _ready() -> void:
    _ensure_body()
    _ensure_camera()

func _physics_process(delta: float) -> void:
    var input_vector := Input.get_vector("move_left", "move_right", "move_forward", "move_back")
    var direction := Vector3(input_vector.x, 0.0, input_vector.y)
    if direction.length_squared() > 1.0:
        direction = direction.normalized()
    var target := direction * speed
    velocity.x = move_toward(velocity.x, target.x, acceleration * delta)
    velocity.z = move_toward(velocity.z, target.z, acceleration * delta)
    if not is_on_floor():
        velocity.y -= gravity * delta
    else:
        velocity.y = 0.0
    if direction.length_squared() > 0.01:
        var target_angle := atan2(direction.x, direction.z)
        rotation.y = lerp_angle(rotation.y, target_angle, min(10.0 * delta, 1.0))
    move_and_slide()
    global_position.x = clamp(global_position.x, -18.5, 18.5)
    global_position.z = clamp(global_position.z, -18.5, 18.5)

func _ensure_body() -> void:
    _collision = CollisionShape3D.new()
    _collision.name = "Collision"
    var capsule_shape := CapsuleShape3D.new()
    capsule_shape.radius = 0.38
    capsule_shape.height = 1.8
    _collision.shape = capsule_shape
    _collision.position.y = 0.9
    add_child(_collision)
    _visual = MeshInstance3D.new()
    _visual.name = "NguyenMinh"
    var capsule := CapsuleMesh.new()
    capsule.radius = 0.38
    capsule.height = 1.8
    _visual.mesh = capsule
    _visual.position.y = 0.9
    add_child(_visual)

func _ensure_camera() -> void:
    var camera := Camera3D.new()
    camera.name = "ThirdPersonCamera"
    camera.position = Vector3(0.0, 5.0, 7.5)
    camera.rotation_degrees = Vector3(-24.0, 0.0, 0.0)
    camera.current = true
    add_child(camera)

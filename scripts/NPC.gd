extends CharacterBody3D

## NPC nền: nhân vật không đứng yên chờ người chơi.
## Mỗi NPC có nhịp di chuyển đơn giản để tạo cảm giác khu phố đang sống.

@export var wander_radius := 6.0
@export var speed := 1.2
var _origin := Vector3.ZERO
var _target := Vector3.ZERO
var _wait := 0.0

func setup(start_position: Vector3, npc_name: String) -> void:
    global_position = start_position
    name = npc_name
    _origin = start_position
    _pick_target()

func _ready() -> void:
    add_to_group("npc")
    _build_body()
    _pick_target()

func _physics_process(delta: float) -> void:
    _wait -= delta
    if _wait > 0.0:
        velocity.x = move_toward(velocity.x, 0.0, 4.0 * delta)
        velocity.z = move_toward(velocity.z, 0.0, 4.0 * delta)
        move_and_slide()
        return
    var flat_target := Vector3(_target.x, global_position.y, _target.z)
    var direction := global_position.direction_to(flat_target)
    direction.y = 0.0
    if direction.length_squared() < 0.25:
        _pick_target()
        return
    velocity.x = direction.x * speed
    velocity.z = direction.z * speed
    velocity.y = -2.0 if not is_on_floor() else 0.0
    rotation.y = lerp_angle(rotation.y, atan2(direction.x, direction.z), min(5.0 * delta, 1.0))
    move_and_slide()

func _pick_target() -> void:
    _target = _origin + Vector3(randf_range(-wander_radius, wander_radius), 0.0, randf_range(-wander_radius, wander_radius))
    _wait = randf_range(0.5, 2.0)

func _build_body() -> void:
    var collision := CollisionShape3D.new()
    var shape := CapsuleShape3D.new()
    shape.radius = 0.28
    shape.height = 1.5
    collision.shape = shape
    collision.position.y = 0.75
    add_child(collision)
    var visual := MeshInstance3D.new()
    var mesh := CapsuleMesh.new()
    mesh.radius = 0.28
    mesh.height = 1.5
    visual.mesh = mesh
    visual.position.y = 0.75
    add_child(visual)

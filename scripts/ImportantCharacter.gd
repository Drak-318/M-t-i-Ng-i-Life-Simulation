extends CharacterBody3D

const ProfileScript = preload("res://scripts/CharacterProfile.gd")

var profile: RefCounted
var locations: Dictionary = {}
var _destination := Vector3.ZERO
var _has_destination := false

func setup() -> void:
    name = "Linh"
    profile = ProfileScript.new()
    profile.setup({
        "id":"LINH",
        "display_name":"Linh",
        "age":24,
        "occupation":"Nhân viên thiết kế nội dung",
        "home_location":"HOME",
        "personality":{"introversion":0.55,"directness":0.45,"independence":0.75,"patience":0.7,"emotionality":0.65},
        "needs":{"respect":0.9,"space":0.75,"attention":0.55,"stability":0.7},
        "boundaries":["không thích bị thúc ép trả lời","không thích bị kiểm soát lịch trình"],
        "communication_style":{"likes_text":true,"likes_direct_talk":true,"needs_time_to_think":true},
        "goals":["ổn định công việc","dành thời gian cho gia đình","xây dựng một cuộc sống cân bằng"],
        "schedule":{
            "1":[{"from":8,"to":17,"location":"OFFICE"},{"from":18,"to":21,"location":"CAFE"}],
            "2":[{"from":8,"to":17,"location":"OFFICE"},{"from":18,"to":21,"location":"HOME"}],
            "3":[{"from":8,"to":17,"location":"OFFICE"},{"from":18,"to":21,"location":"CAFE"}],
            "4":[{"from":8,"to":17,"location":"OFFICE"},{"from":18,"to":21,"location":"HOME"}],
            "5":[{"from":8,"to":17,"location":"OFFICE"},{"from":18,"to":22,"location":"CAFE"}],
            "6":[{"from":9,"to":12,"location":"STORE"},{"from":15,"to":20,"location":"PARK"}],
            "7":[{"from":9,"to":12,"location":"CAFE"},{"from":15,"to":18,"location":"PARK"}]
        },
        "mood":"calm",
        "emotional_availability":0.65,
        "energy":82.0,
        "workload":25.0,
        "family_pressure":15.0,
        "social_energy":58.0
    })
    add_to_group("important_npc")
    _build_body()

func set_location_points(points: Dictionary) -> void:
    locations = points

func update_schedule(day: int, hour: int) -> void:
    if profile == null:
        return
    var location_id := profile.schedule_location(day, hour)
    if not locations.has(location_id):
        return
    var destination: Vector3 = locations[location_id]
    if _destination.distance_to(destination) < 0.5 and _has_destination:
        return
    _destination = destination
    _has_destination = true

func _physics_process(delta: float) -> void:
    if not _has_destination:
        return
    var flat_target := Vector3(_destination.x, global_position.y, _destination.z)
    var direction := global_position.direction_to(flat_target)
    direction.y = 0.0
    if direction.length_squared() < 0.5:
        velocity = Vector3.ZERO
        return
    velocity.x = direction.x * 1.6
    velocity.z = direction.z * 1.6
    velocity.y = -2.0 if not is_on_floor() else 0.0
    rotation.y = lerp_angle(rotation.y, atan2(direction.x, direction.z), min(5.0 * delta, 1.0))
    move_and_slide()

func _build_body() -> void:
    var collision := CollisionShape3D.new()
    var shape := CapsuleShape3D.new()
    shape.radius = 0.32
    shape.height = 1.65
    collision.shape = shape
    collision.position.y = 0.82
    add_child(collision)
    var body := MeshInstance3D.new()
    var capsule := CapsuleMesh.new()
    capsule.radius = 0.32
    capsule.height = 1.65
    body.mesh = capsule
    body.position.y = 0.82
    add_child(body)
    var head := MeshInstance3D.new()
    var head_mesh := SphereMesh.new()
    head_mesh.radius = 0.31
    head_mesh.height = 0.62
    head.mesh = head_mesh
    head.position.y = 1.72
    add_child(head)
    var hair := MeshInstance3D.new()
    var hair_mesh := SphereMesh.new()
    hair_mesh.radius = 0.34
    hair_mesh.height = 0.68
    hair.mesh = hair_mesh
    hair.position = Vector3(0.0, 1.78, 0.03)
    hair.scale = Vector3(1.0, 1.05, 0.92)
    add_child(hair)

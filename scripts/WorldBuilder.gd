extends Node3D

## Tạo khu phố MVP bằng primitive của Godot.
## Đây là placeholder có chủ ý: chưa cần asset 3D thật ở giai đoạn này.

func _ready() -> void:
    _build_ground()
    _build_road(Vector3(0, 0.02, 0), Vector3(40, 0.1, 6))
    _build_road(Vector3(0, 0.03, -14), Vector3(40, 0.1, 4))
    _build_building("Home", Vector3(-12, 2.0, 8), Vector3(7, 4, 6))
    _build_building("Office", Vector3(12, 3.0, -8), Vector3(9, 6, 8))
    _build_building("Cafe", Vector3(-8, 1.5, -8), Vector3(5, 3, 5))
    _build_building("Store", Vector3(3, 1.5, -8), Vector3(4, 3, 4))
    _build_building("Restaurant", Vector3(9, 1.5, 8), Vector3(6, 3, 5))
    _build_park(Vector3(0, 0, 9))

func _build_ground() -> void:
    var body := StaticBody3D.new()
    body.name = "Ground"
    add_child(body)

    var mesh_instance := MeshInstance3D.new()
    var mesh := BoxMesh.new()
    mesh.size = Vector3(40, 0.2, 40)
    mesh_instance.mesh = mesh
    body.add_child(mesh_instance)

    var collision := CollisionShape3D.new()
    var shape := BoxShape3D.new()
    shape.size = Vector3(40, 0.2, 40)
    collision.shape = shape
    body.add_child(collision)

func _build_road(pos: Vector3, size: Vector3) -> void:
    var mesh_instance := MeshInstance3D.new()
    mesh_instance.name = "Road"
    mesh_instance.position = pos
    var mesh := BoxMesh.new()
    mesh.size = size
    mesh_instance.mesh = mesh
    add_child(mesh_instance)

func _build_building(label: String, pos: Vector3, size: Vector3) -> void:
    var mesh_instance := MeshInstance3D.new()
    mesh_instance.name = label
    mesh_instance.position = pos
    var mesh := BoxMesh.new()
    mesh.size = size
    mesh_instance.mesh = mesh
    add_child(mesh_instance)

func _build_park(pos: Vector3) -> void:
    var marker := MeshInstance3D.new()
    marker.name = "Park"
    marker.position = pos
    var mesh := BoxMesh.new()
    mesh.size = Vector3(12, 0.08, 6)
    marker.mesh = mesh
    add_child(marker)

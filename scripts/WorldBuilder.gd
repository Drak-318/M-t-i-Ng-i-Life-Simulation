extends Node3D

const LocationScript = preload("res://scripts/Location.gd")
const NPCScript = preload("res://scripts/NPC.gd")

signal location_ready(location_id: String, display_name: String, interaction_text: String)
var locations: Dictionary = {}

func _ready() -> void:
    randomize()
    _build_ground()
    _build_roads()
    _build_locations()
    _build_background_npcs()

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

func _build_roads() -> void:
    _add_box("Road_Main", Vector3(0, 0.01, 0), Vector3(40, 0.08, 6))
    _add_box("Road_North", Vector3(0, 0.02, -14), Vector3(40, 0.08, 4))
    _add_box("Road_Vertical", Vector3(0, 0.025, 0), Vector3(4, 0.09, 40))

func _build_locations() -> void:
    _add_location("HOME", "Nhà của Minh", Vector3(-12, 2.0, 8), Vector3(7, 4, 6), "Ở nhà. Một buổi sáng Chủ nhật bình thường.", true)
    _add_location("OFFICE", "Văn phòng", Vector3(12, 3.0, -8), Vector3(9, 6, 8), "Văn phòng của Minh. Hôm nay là Chủ nhật nên không có ca làm.", true)
    _add_location("CAFE", "Quán cà phê", Vector3(-8, 1.5, -8), Vector3(5, 3, 5), "Một quán cà phê quen trong khu phố.", true)
    _add_location("STORE", "Cửa hàng tiện lợi", Vector3(3, 1.5, -8), Vector3(4, 3, 4), "Cửa hàng tiện lợi mở cả ngày.", true)
    _add_location("RESTAURANT", "Quán ăn", Vector3(9, 1.5, 8), Vector3(6, 3, 5), "Một quán ăn bình dân trong khu phố.", true)
    _add_location("PARK", "Công viên", Vector3(0, 0.08, 9), Vector3(12, 0.12, 6), "Công viên nhỏ. Có người đi bộ và ngồi nghỉ.", false)
    _add_location("PARKING", "Bãi xe", Vector3(-2, 0.08, 4), Vector3(6, 0.12, 4), "Một bãi xe nhỏ cạnh khu dân cư.", false)

func _add_location(location_id: String, display_name: String, pos: Vector3, size: Vector3, interaction_text: String, blocking: bool) -> void:
    if blocking:
        var body := StaticBody3D.new()
        body.name = display_name
        body.position = pos
        add_child(body)
        var visual := MeshInstance3D.new()
        var mesh := BoxMesh.new()
        mesh.size = size
        visual.mesh = mesh
        body.add_child(visual)
        var collision := CollisionShape3D.new()
        var building_shape := BoxShape3D.new()
        building_shape.size = size
        collision.shape = building_shape
        body.add_child(collision)
    else:
        _add_box(display_name, pos, size)

    var area := Area3D.new()
    area.name = "Location_%s" % location_id
    area.set_script(LocationScript)
    area.location_id = location_id
    area.display_name = display_name
    area.interaction_text = interaction_text
    area.position = Vector3(pos.x, 1.0, pos.z)
    var shape := CollisionShape3D.new()
    var area_shape := BoxShape3D.new()
    area_shape.size = Vector3(max(size.x + 1.5, 3.0), 2.0, max(size.z + 1.5, 3.0))
    shape.shape = area_shape
    area.add_child(shape)
    add_child(area)
    locations[location_id] = area
    area.player_entered.connect(_on_player_entered)
    area.player_exited.connect(_on_player_exited)

func _on_player_entered(location_id: String, display_name: String) -> void:
    var area: Area3D = locations[location_id]
    location_ready.emit(location_id, display_name, area.interaction_text)

func _on_player_exited(_location_id: String) -> void:
    pass

func _add_box(node_name: String, pos: Vector3, size: Vector3) -> void:
    var mesh_instance := MeshInstance3D.new()
    mesh_instance.name = node_name
    mesh_instance.position = pos
    var mesh := BoxMesh.new()
    mesh.size = size
    mesh_instance.mesh = mesh
    add_child(mesh_instance)

func _build_background_npcs() -> void:
    var starts := [Vector3(-4, 0.2, 8), Vector3(5, 0.2, 7), Vector3(-5, 0.2, -4), Vector3(7, 0.2, -2)]
    for index in starts.size():
        var npc: CharacterBody3D = NPCScript.new()
        add_child(npc)
        npc.setup(starts[index], "NPC_%02d" % (index + 1))

extends Area3D

signal player_entered(location_id: String, display_name: String)
signal player_exited(location_id: String)

@export var location_id := ""
@export var display_name := ""
@export_multiline var interaction_text := ""

func _ready() -> void:
    body_entered.connect(_on_body_entered)
    body_exited.connect(_on_body_exited)

func _on_body_entered(body: Node3D) -> void:
    if body.is_in_group("player"):
        player_entered.emit(location_id, display_name)

func _on_body_exited(body: Node3D) -> void:
    if body.is_in_group("player"):
        player_exited.emit(location_id)

extends Node3D

# Vertical slice đầu tiên: một không gian 3D nhỏ có thể di chuyển.
# Đây chưa phải hệ thống gameplay hoàn chỉnh; mục tiêu là kiểm tra nền Godot.

@onready var player: CharacterBody3D = $Player
@onready var clock_label: Label = $UI/Clock

var minutes := 7 * 60 + 42
var elapsed := 0.0

func _ready() -> void:
    _update_clock()

func _process(delta: float) -> void:
    elapsed += delta
    if elapsed >= 1.0:
        elapsed = 0.0
        minutes += 1
        _update_clock()

func _update_clock() -> void:
    var hour := int(minutes / 60) % 24
    var minute := minutes % 60
    clock_label.text = "%02d:%02d" % [hour, minute]
